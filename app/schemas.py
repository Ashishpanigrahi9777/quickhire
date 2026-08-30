from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator, EmailStr
from typing import Optional, List

ALLOWED_STATUSES = {"Applied", "Assessment", "Interview", "Selected", "Rejected"}
ALLOWED_PRIORITIES = {"High", "Medium", "Low"}

# User Schemas
class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserResponse(UserBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Application Schemas
class ApplicationBase(BaseModel):
    company: str = Field(..., max_length=100, min_length=1)
    position: str = Field(..., max_length=100, min_length=1)
    location: str = Field(..., max_length=100, min_length=1)
    applied_date: date
    status: str = Field(default="Applied")
    priority: str = Field(default="Medium")
    notes: Optional[str] = None

    @field_validator('status')
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in ALLOWED_STATUSES:
            raise ValueError(f"Status must be one of {', '.join(ALLOWED_STATUSES)}")
        return v

    @field_validator('priority')
    @classmethod
    def validate_priority(cls, v: str) -> str:
        if v not in ALLOWED_PRIORITIES:
            raise ValueError(f"Priority must be one of {', '.join(ALLOWED_PRIORITIES)}")
        return v

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    company: Optional[str] = Field(None, max_length=100, min_length=1)
    position: Optional[str] = Field(None, max_length=100, min_length=1)
    location: Optional[str] = Field(None, max_length=100, min_length=1)
    applied_date: Optional[date] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    notes: Optional[str] = None

    @field_validator('status')
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v is not None and v not in ALLOWED_STATUSES:
            raise ValueError(f"Status must be one of {', '.join(ALLOWED_STATUSES)}")
        return v

    @field_validator('priority')
    @classmethod
    def validate_priority(cls, v: str) -> str:
        if v is not None and v not in ALLOWED_PRIORITIES:
            raise ValueError(f"Priority must be one of {', '.join(ALLOWED_PRIORITIES)}")
        return v

class ApplicationResponse(ApplicationBase):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)

class ApplicationPageResponse(BaseModel):
    applications: List[ApplicationResponse]
    total: int
    page: int
    limit: int
    total_pages: int

class ApplicationHistoryResponse(BaseModel):
    id: int
    application_id: int
    old_status: Optional[str]
    new_status: str
    changed_at: datetime
    model_config = ConfigDict(from_attributes=True)

class DashboardStatsResponse(BaseModel):
    total_applications: int
    applied: int
    assessment: int
    interview: int
    selected: int
    rejected: int
    high_priority: int
    selection_rate: float
