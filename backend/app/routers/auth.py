"""Auth router — simplified for hackathon demo.

Uses mock authentication with JWT tokens. In production, this would
validate against Firebase Auth or Firestore user collection.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.security import (
    verify_password,
    hash_password,
    create_access_token,
    get_current_active_user,
)
from app.models.user import User
from app.schemas.user import UserBase, UserCreate, UserRead

router = APIRouter()


@router.post("/register", response_model=UserRead, status_code=201)
async def register(user_data: UserCreate):
    """Register a new user."""
    hashed = hash_password(user_data.hashed_password)

    return UserRead(
        id="usr_" + user_data.email.split("@")[0],
        email=user_data.email,
        full_name=user_data.full_name,
        role="user",
        hashed_password=hashed,
        is_active=True,
        created_at="2024-01-01T00:00:00Z",
        updated_at="2024-01-01T00:00:00Z",
    )


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Authenticate user and return access token."""
    # Demo: accept any credentials for hackathon
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserRead)
async def read_current_user(current_user: User = Depends(get_current_active_user)):
    """Get current user information."""
    return UserRead(
        id=current_user.id or "",
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        hashed_password=current_user.hashed_password,
        is_active=current_user.is_active,
        created_at=current_user.created_at.isoformat() if current_user.created_at else "",
        updated_at=current_user.updated_at.isoformat() if current_user.updated_at else "",
    )