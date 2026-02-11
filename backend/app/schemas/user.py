from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.core.config import Role

class UserBase(BaseModel):
    email: EmailStr
    role: Role
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    company: Optional[str] = None
    city: Optional[str] = None
    parent_id: Optional[str] = None
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    role: Optional[Role] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: Optional[bool] = None

class User(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None
