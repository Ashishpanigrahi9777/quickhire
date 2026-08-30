import csv
import io
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc, or_

from app.database import get_db
from app.models import Application, User, ApplicationHistory
from app.schemas import (
    ApplicationCreate, 
    ApplicationUpdate, 
    ApplicationResponse,
    ApplicationPageResponse,
    ApplicationHistoryResponse,
    DashboardStatsResponse
)
from app.auth import get_current_user

router = APIRouter(
    prefix="/applications",
    tags=["applications"]
)

@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(
    application: ApplicationCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_app = Application(**application.model_dump(), user_id=current_user.id)
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    
    # Record history
    history = ApplicationHistory(
        application_id=db_app.id,
        old_status=None,
        new_status=db_app.status
    )
    db.add(history)
    db.commit()
    
    return db_app

@router.get("/export")
def export_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    apps = db.query(Application).filter(Application.user_id == current_user.id).order_by(desc(Application.applied_date)).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Company", "Position", "Location", "Applied Date", "Status", "Priority", "Notes"])
    
    for app in apps:
        writer.writerow([
            app.company,
            app.position,
            app.location,
            app.applied_date.strftime("%Y-%m-%d"),
            app.status,
            app.priority,
            app.notes or ""
        ])
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=applications_export.csv"}
    )

@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    apps = db.query(Application).filter(Application.user_id == current_user.id).all()
    
    total = len(apps)
    applied = sum(1 for app in apps if app.status == "Applied")
    assessment = sum(1 for app in apps if app.status == "Assessment")
    interview = sum(1 for app in apps if app.status == "Interview")
    selected = sum(1 for app in apps if app.status == "Selected")
    rejected = sum(1 for app in apps if app.status == "Rejected")
    high_priority = sum(1 for app in apps if app.priority == "High")
    
    selection_rate = (selected / total * 100) if total > 0 else 0.0
    
    return DashboardStatsResponse(
        total_applications=total,
        applied=applied,
        assessment=assessment,
        interview=interview,
        selected=selected,
        rejected=rejected,
        high_priority=high_priority,
        selection_rate=selection_rate
    )

@router.get("", response_model=ApplicationPageResponse)
def get_applications(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    sort: Optional[str] = Query("newest"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Application).filter(Application.user_id == current_user.id)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Application.company.ilike(search_term),
                Application.position.ilike(search_term),
                Application.location.ilike(search_term)
            )
        )
        
    if status:
        query = query.filter(Application.status == status)
        
    if priority:
        query = query.filter(Application.priority == priority)
        
    if sort == "oldest":
        query = query.order_by(asc(Application.id))
    elif sort == "company":
        query = query.order_by(asc(Application.company))
    elif sort == "priority":
        # simple alphabetical works since High < Low < Medium. Wait, High, Medium, Low - alphabetical order is High, Low, Medium.
        # let's just do something basic, or stick to id
        query = query.order_by(asc(Application.priority), desc(Application.id))
    else: # newest
        query = query.order_by(desc(Application.id))
        
    total = query.count()
    total_pages = (total + limit - 1) // limit
    
    apps = query.offset((page - 1) * limit).limit(limit).all()
    
    return ApplicationPageResponse(
        applications=apps,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages
    )

@router.get("/status/{status_val}", response_model=List[ApplicationResponse])
def get_applications_by_status(
    status_val: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Kept for backward compatibility if needed, though replaced mostly by query params
    return db.query(Application).filter(
        Application.user_id == current_user.id,
        Application.status == status_val
    ).order_by(desc(Application.id)).all()

@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application(
    application_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_app = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()
    if not db_app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return db_app

@router.put("/{application_id}", response_model=ApplicationResponse)
def update_application(
    application_id: int, 
    application_update: ApplicationUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_app = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()
    if not db_app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    
    old_status = db_app.status
    
    update_data = application_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_app, key, value)
        
    db.commit()
    db.refresh(db_app)
    
    # Record history if status changed
    if 'status' in update_data and old_status != update_data['status']:
        history = ApplicationHistory(
            application_id=db_app.id,
            old_status=old_status,
            new_status=update_data['status']
        )
        db.add(history)
        db.commit()
        
    return db_app

@router.delete("/{application_id}")
def delete_application(
    application_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_app = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()
    if not db_app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    
    db.delete(db_app)
    db.commit()
    return {"message": "Application deleted successfully"}

@router.get("/{application_id}/history", response_model=List[ApplicationHistoryResponse])
def get_application_history(
    application_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify ownership
    db_app = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()
    if not db_app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
        
    history = db.query(ApplicationHistory).filter(
        ApplicationHistory.application_id == application_id
    ).order_by(desc(ApplicationHistory.changed_at)).all()
    
    return history
