"""Issues API router — full CRUD + AI analysis pipeline + statistics."""

from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException, Query, status, File, UploadFile
import os
import json
import tempfile

from app.core.db import store
from app.core.ai_engine import analyze_issue
from app.schemas.issues import IssueCreate, IssueResponse

router = APIRouter()

COLLECTION = "issues"

@router.post("/voice", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_issue_from_voice(
    file: UploadFile = File(...),
    latitude: Optional[float] = Query(0.0),
    longitude: Optional[float] = Query(0.0)
):
    """Transcribe voice and create a new civic issue."""
    import google.generativeai as genai
    from app.core.ai_engine import _configure_gemini, _get_department, _calculate_priority, VALID_CATEGORIES
    
    gemini_ready = _configure_gemini()
    if not gemini_ready:
        raise HTTPException(status_code=500, detail="Gemini API not configured")
        
    try:
        ext = file.filename.split(".")[-1] if "." in file.filename else "webm"
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
            
        audio_file = genai.upload_file(path=tmp_path)
        
        prompt = f"""You are a municipal issue classifier. Listen to this audio report and return a JSON object with exactly these fields:
- "transcription": The exact transcription of what the citizen said.
- "title": A concise 3-5 word title for the issue.
- "category": One of: {json.dumps(VALID_CATEGORIES)}
- "severity": Integer 1-5 (1=cosmetic, 5=critical)
- "confidence": Float 0.0-1.0 representing your confidence
- "keywords": Array of 3-6 relevant keywords

Respond ONLY with valid JSON, no markdown formatting."""

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content([prompt, audio_file])
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()
            
        result = json.loads(text)
        
        os.unlink(tmp_path)
        genai.delete_file(audio_file.name)
        
        category = result.get("category", "General")
        severity = max(1, min(5, int(result.get("severity", 3))))
        description = result.get("transcription", "")
        
        priority_score, priority_reasons = _calculate_priority(severity, category, description)
        
        now = datetime.now(timezone.utc)
        issue_data = {
            "title": result.get("title", category + " Report"),
            "description": description,
            "imageUrl": None,
            "location": {
                "latitude": latitude,
                "longitude": longitude,
                "address": None,
            },
            "aiAnalysis": {
                "category": category,
                "visionConfidence": float(result.get("confidence", 0.85)),
                "extractedKeywords": result.get("keywords", []),
                "voiceTranscribed": True
            },
            "severity": severity,
            "priorityScore": priority_score,
            "priorityReasons": priority_reasons,
            "department": _get_department(category),
            "status": "Submitted",
            "timeline": [
                {
                    "status": "Submitted",
                    "timestamp": now.isoformat(),
                    "note": "Issue reported via Voice AI",
                }
            ],
            "reporterId": "usr_citizen_77",
            "reporterName": "Jane Doe",
            "duplicateId": None,
            "verificationCount": 1,
            "upvotes": 0,
            "createdTime": now.isoformat(),
            "updatedTime": now.isoformat(),
        }
        
        saved = store.create(COLLECTION, issue_data)
        return saved
        
    except Exception as e:
        print(f"Voice AI Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_issue(payload: IssueCreate):
    """Create a new civic issue with AI-powered analysis."""
    now = datetime.now(timezone.utc)

    # Run AI analysis
    analysis = await analyze_issue(
        description=payload.description or "",
        title=payload.title,
        image_url=payload.imageUrl,
    )

    issue_data = {
        "title": payload.title or analysis.get("keywords", ["Civic Issue"])[0].title() + " Report",
        "description": payload.description or "",
        "imageUrl": payload.imageUrl,
        "location": {
            "latitude": payload.latitude,
            "longitude": payload.longitude,
            "address": None,
        },
        "aiAnalysis": {
            "category": analysis["category"],
            "visionConfidence": analysis["confidence"],
            "extractedKeywords": analysis["keywords"],
        },
        "severity": analysis["severity"],
        "priorityScore": analysis["priorityScore"],
        "priorityReasons": analysis["priorityReasons"],
        "department": analysis["department"],
        "status": "Submitted",
        "timeline": [
            {
                "status": "Submitted",
                "timestamp": now.isoformat(),
                "note": "Issue reported by citizen",
            },
            {
                "status": "Verified",
                "timestamp": now.isoformat(),
                "note": f"AI verified with {int(analysis['confidence'] * 100)}% confidence ({analysis['aiProvider']})",
            },
        ],
        "reporterId": "usr_citizen_77",  # Would come from auth in production
        "reporterName": "Jane Doe",
        "duplicateId": None,
        "verificationCount": 1,
        "upvotes": 0,
        "createdTime": now.isoformat(),
        "updatedTime": now.isoformat(),
    }

    saved = store.create(COLLECTION, issue_data)
    return saved


@router.get("/", response_model=list[dict])
async def list_issues(
    status_filter: Optional[str] = Query(None, alias="status"),
    category: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    reporter_id: Optional[str] = Query(None, alias="reporterId"),
    sort_by: str = Query("priorityScore", alias="sortBy"),
    limit: int = Query(50, le=200),
):
    """List issues with optional filters and sorting."""
    filters = {}
    if status_filter:
        filters["status"] = status_filter
    if department:
        filters["department"] = department
    if reporter_id:
        filters["reporterId"] = reporter_id

    issues = store.query(COLLECTION, filters if filters else None)

    # Category filter (needs substring match)
    if category:
        issues = [
            i for i in issues
            if category.lower() in (i.get("aiAnalysis", {}).get("category", "")).lower()
        ]

    # Sort
    reverse = True
    if sort_by == "createdTime":
        issues.sort(key=lambda x: x.get("createdTime", ""), reverse=reverse)
    elif sort_by == "severity":
        issues.sort(key=lambda x: x.get("severity", 0), reverse=reverse)
    else:
        issues.sort(key=lambda x: x.get("priorityScore", 0), reverse=reverse)

    return issues[:limit]


@router.get("/stats", response_model=dict)
async def get_stats():
    """Get aggregate statistics for the dashboard."""
    issues = store.get_all(COLLECTION)

    total = len(issues)
    status_counts = {}
    category_counts = {}
    department_counts = {}
    severity_sum = 0
    priority_sum = 0

    for issue in issues:
        # Status counts
        s = issue.get("status", "Submitted")
        status_counts[s] = status_counts.get(s, 0) + 1

        # Category counts
        cat = issue.get("aiAnalysis", {}).get("category", "Other")
        category_counts[cat] = category_counts.get(cat, 0) + 1

        # Department counts
        dept = issue.get("department", "Unassigned")
        department_counts[dept] = department_counts.get(dept, 0) + 1

        severity_sum += issue.get("severity", 0)
        priority_sum += issue.get("priorityScore", 0)

    return {
        "totalIssues": total,
        "statusBreakdown": status_counts,
        "categoryBreakdown": category_counts,
        "departmentBreakdown": department_counts,
        "avgSeverity": round(severity_sum / max(total, 1), 1),
        "avgPriority": round(priority_sum / max(total, 1), 1),
        "resolvedRate": round(
            (status_counts.get("Resolved", 0) / max(total, 1)) * 100, 1
        ),
    }


@router.get("/{issue_id}", response_model=dict)
async def get_issue(issue_id: str):
    """Get a single issue by ID."""
    issue = store.get_by_id(COLLECTION, issue_id)
    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found",
        )
    return issue


@router.patch("/{issue_id}/status", response_model=dict)
async def update_issue_status(issue_id: str, status_update: dict):
    """Update an issue's status (authority action)."""
    issue = store.get_by_id(COLLECTION, issue_id)
    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found",
        )

    new_status = status_update.get("status")
    note = status_update.get("note", "")
    valid_statuses = ["Submitted", "Verified", "In Progress", "Resolved", "Rejected"]

    if new_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {valid_statuses}",
        )

    now = datetime.now(timezone.utc)
    timeline = issue.get("timeline", [])
    timeline.append({
        "status": new_status,
        "timestamp": now.isoformat(),
        "note": note or f"Status updated to {new_status}",
    })

    update_data = {
        "status": new_status,
        "timeline": timeline,
        "updatedTime": now.isoformat(),
    }

    updated = store.update(COLLECTION, issue_id, update_data)
    return updated


@router.post("/{issue_id}/upvote", response_model=dict)
async def upvote_issue(issue_id: str):
    """Upvote an issue (citizen verification)."""
    issue = store.get_by_id(COLLECTION, issue_id)
    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Issue {issue_id} not found",
        )

    updated = store.update(COLLECTION, issue_id, {
        "upvotes": issue.get("upvotes", 0) + 1,
        "verificationCount": issue.get("verificationCount", 0) + 1,
    })
    return updated


@router.get("/leaderboard/top", response_model=list[dict])
async def get_leaderboard():
    """Get citizen leaderboard sorted by XP."""
    users = store.get_all("users")
    users.sort(key=lambda x: x.get("xp", 0), reverse=True)
    return users[:10]
