from fastapi import FastAPI
from app.database import engine, Base
from app.routes import applications, auth

# Create database tables automatically on startup
Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="QuickHire API",
    description="Job Application Tracker API",
    version="1.0.0",
    docs_url="/docs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(applications.router)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "message": "QuickHire API is running"
    }
