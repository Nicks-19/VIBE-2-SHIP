from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from ..models.user import User

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    role: str = "user"

class UserCreate(UserBase):
    hashed_password: str

class UserRead(UserBase):
    id: str
    hashed_password: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True