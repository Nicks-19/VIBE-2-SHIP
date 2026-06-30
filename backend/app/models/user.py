"""User model for the CivicPulse AI application."""

from typing import Optional
from datetime import datetime

# Since we're using Firestore, we'll define a simple class
# In a real SQL implementation, this would be a SQLAlchemy model

class User:
    def __init__(
        self,
        id: Optional[str] = None,
        email: str = "",
        hashed_password: str = "",
        full_name: Optional[str] = None,
        role: str = "user",
        is_active: bool = True,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
    ):
        self.id = id
        self.email = email
        self.hashed_password = hashed_password
        self.full_name = full_name
        self.role = role  # user, admin, moderator
        self.is_active = is_active
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def dict(self) -> dict:
        """Convert to dictionary for serialization."""
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "role": self.role,
            "is_active": self.is_active,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "User":
        """Create User instance from dictionary."""
        return cls(
            id=data.get("id"),
            email=data.get("email", ""),
            hashed_password=data.get("hashed_password", ""),
            full_name=data.get("full_name"),
            role=data.get("role", "user"),
            is_active=data.get("is_active", True),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at"),
        )