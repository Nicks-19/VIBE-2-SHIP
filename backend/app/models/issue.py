"""Issue model for civic reports."""

from typing import Optional, List
from datetime import datetime

class Issue:
    def __init__(
        self,
        id: Optional[str] = None,
        title: str = "",
        description: str = "",
        category: str = "",
        status: str = "open",
        priority: str = "medium",
        location: Optional[dict] = None,
        reporter_id: Optional[str] = None,
        assignee_id: Optional[str] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
        closed_at: Optional[datetime] = None,
        tags: Optional[List[str]] = None,
        media_urls: Optional[List[str]] = None,
    ):
        self.id = id
        self.title = title
        self.description = description
        self.category = category
        self.status = status  # open, in_progress, resolved, closed, rejected
        self.priority = priority  # low, medium, high, urgent
        self.location = location or {}
        self.reporter_id = reporter_id
        self.assignee_id = assignee_id
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
        self.closed_at = closed_at
        self.tags = tags or []
        self.media_urls = media_urls or []

    def dict(self) -> dict:
        """Convert to dictionary for serialization."""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "status": self.status,
            "priority": self.priority,
            "location": self.location,
            "reporter_id": self.reporter_id,
            "assignee_id": self.assignee_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "closed_at": self.closed_at,
            "tags": self.tags,
            "media_urls": self.media_urls,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Issue":
        """Create Issue instance from dictionary."""
        return cls(
            id=data.get("id"),
            title=data.get("title", ""),
            description=data.get("description", ""),
            category=data.get("category", ""),
            status=data.get("status", "open"),
            priority=data.get("priority", "medium"),
            location=data.get("location"),
            reporter_id=data.get("reporter_id"),
            assignee_id=data.get("assignee_id"),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at"),
            closed_at=data.get("closed_at"),
            tags=data.get("tags", []),
            media_urls=data.get("media_urls", []),
        )