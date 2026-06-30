from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class LocationSchema(BaseModel):
    latitude: float
    longitude: float
    address: Optional[str] = None

class AIAnalysisSchema(BaseModel):
    category: str
    visionConfidence: float
    extractedKeywords: List[str]

class TimelineEvent(BaseModel):
    status: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    note: str

class IssueCreate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    imageUrl: str
    latitude: float
    longitude: float
    voiceUrl: Optional[str] = None

class IssueResponse(BaseModel):
    id: str
    title: str
    description: str
    imageUrl: str
    location: LocationSchema
    aiAnalysis: Optional[AIAnalysisSchema] = None
    severity: int = 1
    priorityScore: int = 0
    priorityReasons: List[str] = []
    department: Optional[str] = None
    status: str = "Submitted"
    timeline: List[TimelineEvent] = []
    reporterId: str
    duplicateId: Optional[str] = None
    verificationCount: int = 0
    createdTime: datetime
    updatedTime: datetime