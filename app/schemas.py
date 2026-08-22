from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator, EmailStr
from typing import Optional, List

ALLOWED_STATUSES = {"Applied", "Assessment", "Interview", "Selected", "Rejected"}

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
    notes: Optional[str] = None

    @field_validator('status')
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in ALLOWED_STATUSES:
            raise ValueError(f"Status must be one of {', '.join(ALLOWED_STATUSES)}")
        return v

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    company: Optional[str] = Field(None, max_length=100, min_length=1)
    position: Optional[str] = Field(None, max_length=100, min_length=1)
    location: Optional[str] = Field(None, max_length=100, min_length=1)
    applied_date: Optional[date] = None
    status: Optional[str] = None
    notes: Optional[str] = None

    @field_validator('status')
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v is not None and v not in ALLOWED_STATUSES:
            raise ValueError(f"Status must be one of {', '.join(ALLOWED_STATUSES)}")
        return v

class ApplicationResponse(ApplicationBase):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)
