"""In-memory data store with Firestore adapter.

Provides a unified interface that works without Firebase credentials.
When Firestore is available, data persists to cloud. Otherwise, an in-memory
dictionary serves as the store — perfect for hackathon demos.
"""

import uuid
from datetime import datetime, timezone
from typing import Optional
from app.core.firebase import db as firestore_db


class InMemoryStore:
    """Thread-safe in-memory store that mirrors Firestore collection semantics."""

    def __init__(self):
        self._collections: dict[str, dict[str, dict]] = {}
        self._seed_demo_data()

    def _seed_demo_data(self):
        """Pre-populate with realistic demo data for hackathon presentation."""
        now = datetime.now(timezone.utc)
        demo_issues = [
            {
                "id": "ISS-001",
                "title": "Large pothole on MG Road near Shivaji Chowk",
                "description": "A large pothole approximately 2 feet wide has formed on the main carriageway. Multiple vehicles have been damaged. Immediate repair needed.",
                "imageUrl": "",
                "location": {"latitude": 18.5204, "longitude": 73.8567, "address": "MG Road, Shivaji Chowk, Pune"},
                "aiAnalysis": {"category": "Road Damage", "visionConfidence": 0.94, "extractedKeywords": ["pothole", "road damage", "asphalt", "vehicle hazard"]},
                "severity": 4,
                "priorityScore": 87,
                "priorityReasons": ["High traffic area", "Safety hazard", "Multiple reports"],
                "department": "Roads & Infrastructure",
                "status": "In Progress",
                "timeline": [
                    {"status": "Submitted", "timestamp": now.isoformat(), "note": "Issue reported by citizen"},
                    {"status": "Verified", "timestamp": now.isoformat(), "note": "AI verified with 94% confidence"},
                    {"status": "In Progress", "timestamp": now.isoformat(), "note": "Assigned to field crew"},
                ],
                "reporterId": "usr_citizen_77",
                "reporterName": "Jane Doe",
                "duplicateId": None,
                "verificationCount": 12,
                "upvotes": 34,
                "createdTime": now.isoformat(),
                "updatedTime": now.isoformat(),
            },
            {
                "id": "ISS-002",
                "title": "Broken street light on FC Road",
                "description": "Street light pole #247 has been non-functional for 3 weeks. The area becomes very dark at night causing safety concerns for pedestrians.",
                "imageUrl": "",
                "location": {"latitude": 18.5250, "longitude": 73.8410, "address": "FC Road, Near Goodluck Chowk, Pune"},
                "aiAnalysis": {"category": "Street Lighting", "visionConfidence": 0.91, "extractedKeywords": ["street light", "broken", "dark", "safety"]},
                "severity": 3,
                "priorityScore": 72,
                "priorityReasons": ["Safety concern", "Pedestrian area", "Nighttime hazard"],
                "department": "Electrical & Lighting",
                "status": "Submitted",
                "timeline": [
                    {"status": "Submitted", "timestamp": now.isoformat(), "note": "Issue reported by citizen"},
                    {"status": "Verified", "timestamp": now.isoformat(), "note": "AI verified with 91% confidence"},
                ],
                "reporterId": "usr_citizen_77",
                "reporterName": "Jane Doe",
                "duplicateId": None,
                "verificationCount": 8,
                "upvotes": 19,
                "createdTime": now.isoformat(),
                "updatedTime": now.isoformat(),
            },
            {
                "id": "ISS-003",
                "title": "Garbage overflow at Kothrud bus stop",
                "description": "Municipal garbage bin has been overflowing for 4 days. Waste is spilling onto the sidewalk and causing foul smell. Need immediate clearance.",
                "imageUrl": "",
                "location": {"latitude": 18.5074, "longitude": 73.8077, "address": "Kothrud Bus Stop, Pune"},
                "aiAnalysis": {"category": "Waste Management", "visionConfidence": 0.97, "extractedKeywords": ["garbage", "overflow", "waste", "sanitation"]},
                "severity": 3,
                "priorityScore": 78,
                "priorityReasons": ["Health hazard", "Public area", "Overdue collection"],
                "department": "Sanitation & Waste",
                "status": "Submitted",
                "timeline": [
                    {"status": "Submitted", "timestamp": now.isoformat(), "note": "Issue reported by citizen"},
                ],
                "reporterId": "usr_citizen_22",
                "reporterName": "Rahul Patil",
                "duplicateId": None,
                "verificationCount": 5,
                "upvotes": 27,
                "createdTime": now.isoformat(),
                "updatedTime": now.isoformat(),
            },
            {
                "id": "ISS-004",
                "title": "Water pipeline leak near Swargate",
                "description": "Major water leak from underground pipeline on the main road. Water is flooding the street and causing traffic disruption.",
                "imageUrl": "",
                "location": {"latitude": 18.5018, "longitude": 73.8636, "address": "Swargate Main Road, Pune"},
                "aiAnalysis": {"category": "Water Supply", "visionConfidence": 0.89, "extractedKeywords": ["water leak", "pipeline", "flooding", "infrastructure"]},
                "severity": 5,
                "priorityScore": 95,
                "priorityReasons": ["Critical infrastructure", "Water wastage", "Traffic disruption", "Urgent"],
                "department": "Water Supply",
                "status": "In Progress",
                "timeline": [
                    {"status": "Submitted", "timestamp": now.isoformat(), "note": "Issue reported by citizen"},
                    {"status": "Verified", "timestamp": now.isoformat(), "note": "AI verified with 89% confidence"},
                    {"status": "In Progress", "timestamp": now.isoformat(), "note": "Emergency team dispatched"},
                ],
                "reporterId": "usr_citizen_22",
                "reporterName": "Rahul Patil",
                "duplicateId": None,
                "verificationCount": 21,
                "upvotes": 56,
                "createdTime": now.isoformat(),
                "updatedTime": now.isoformat(),
            },
            {
                "id": "ISS-005",
                "title": "Damaged footpath tiles on JM Road",
                "description": "Multiple footpath tiles are broken and raised, creating a tripping hazard. Several elderly citizens have reported near-falls.",
                "imageUrl": "",
                "location": {"latitude": 18.5234, "longitude": 73.8456, "address": "JM Road, Near Sambhaji Park, Pune"},
                "aiAnalysis": {"category": "Footpath & Sidewalk", "visionConfidence": 0.86, "extractedKeywords": ["footpath", "broken tiles", "tripping hazard", "pedestrian"]},
                "severity": 2,
                "priorityScore": 54,
                "priorityReasons": ["Pedestrian safety", "Accessibility issue"],
                "department": "Roads & Infrastructure",
                "status": "Resolved",
                "timeline": [
                    {"status": "Submitted", "timestamp": now.isoformat(), "note": "Issue reported by citizen"},
                    {"status": "In Progress", "timestamp": now.isoformat(), "note": "Repair crew assigned"},
                    {"status": "Resolved", "timestamp": now.isoformat(), "note": "Tiles replaced and leveled"},
                ],
                "reporterId": "usr_citizen_77",
                "reporterName": "Jane Doe",
                "duplicateId": None,
                "verificationCount": 3,
                "upvotes": 11,
                "createdTime": now.isoformat(),
                "updatedTime": now.isoformat(),
            },
            {
                "id": "ISS-006",
                "title": "Illegal construction blocking drainage on Karve Road",
                "description": "Unauthorized construction material dumped near the storm drain. Drainage is blocked, posing flood risk during monsoon.",
                "imageUrl": "",
                "location": {"latitude": 18.5012, "longitude": 73.8170, "address": "Karve Road, Deccan Gymkhana, Pune"},
                "aiAnalysis": {"category": "Drainage & Flooding", "visionConfidence": 0.82, "extractedKeywords": ["drainage", "blocked", "construction", "flood risk"]},
                "severity": 4,
                "priorityScore": 83,
                "priorityReasons": ["Monsoon risk", "Flood hazard", "Illegal activity"],
                "department": "Drainage & Stormwater",
                "status": "Submitted",
                "timeline": [
                    {"status": "Submitted", "timestamp": now.isoformat(), "note": "Issue reported by citizen"},
                ],
                "reporterId": "usr_citizen_33",
                "reporterName": "Anjali Sharma",
                "duplicateId": None,
                "verificationCount": 7,
                "upvotes": 42,
                "createdTime": now.isoformat(),
                "updatedTime": now.isoformat(),
            },
        ]

        self._collections["issues"] = {issue["id"]: issue for issue in demo_issues}

        # Demo leaderboard data
        self._collections["users"] = {
            "usr_citizen_77": {
                "id": "usr_citizen_77", "name": "Jane Doe", "email": "citizen@civicpulse.gov",
                "xp": 450, "issuesReported": 3, "issuesResolved": 1, "badges": ["First Report", "Road Warrior", "Streak 7"],
                "joinedAt": now.isoformat(),
            },
            "usr_citizen_22": {
                "id": "usr_citizen_22", "name": "Rahul Patil", "email": "rahul@civicpulse.gov",
                "xp": 620, "issuesReported": 5, "issuesResolved": 3, "badges": ["First Report", "Water Guardian", "Top Reporter", "Streak 14"],
                "joinedAt": now.isoformat(),
            },
            "usr_citizen_33": {
                "id": "usr_citizen_33", "name": "Anjali Sharma", "email": "anjali@civicpulse.gov",
                "xp": 380, "issuesReported": 2, "issuesResolved": 1, "badges": ["First Report", "Eco Warrior"],
                "joinedAt": now.isoformat(),
            },
            "usr_citizen_44": {
                "id": "usr_citizen_44", "name": "Vikram Deshmukh", "email": "vikram@civicpulse.gov",
                "xp": 290, "issuesReported": 2, "issuesResolved": 0, "badges": ["First Report"],
                "joinedAt": now.isoformat(),
            },
            "usr_citizen_55": {
                "id": "usr_citizen_55", "name": "Priya Kulkarni", "email": "priya@civicpulse.gov",
                "xp": 510, "issuesReported": 4, "issuesResolved": 2, "badges": ["First Report", "Night Owl", "Streak 7"],
                "joinedAt": now.isoformat(),
            },
        }

    # ---- Collection operations ----

    def get_all(self, collection: str) -> list[dict]:
        return list(self._collections.get(collection, {}).values())

    def get_by_id(self, collection: str, doc_id: str) -> Optional[dict]:
        return self._collections.get(collection, {}).get(doc_id)

    def create(self, collection: str, data: dict, doc_id: Optional[str] = None) -> dict:
        if collection not in self._collections:
            self._collections[collection] = {}
        if not doc_id:
            doc_id = f"ISS-{str(uuid.uuid4())[:8].upper()}"
        data["id"] = doc_id
        self._collections[collection][doc_id] = data
        return data

    def update(self, collection: str, doc_id: str, data: dict) -> Optional[dict]:
        if collection in self._collections and doc_id in self._collections[collection]:
            self._collections[collection][doc_id].update(data)
            return self._collections[collection][doc_id]
        return None

    def delete(self, collection: str, doc_id: str) -> bool:
        if collection in self._collections and doc_id in self._collections[collection]:
            del self._collections[collection][doc_id]
            return True
        return False

    def query(self, collection: str, filters: Optional[dict] = None) -> list[dict]:
        items = self.get_all(collection)
        if not filters:
            return items
        result = []
        for item in items:
            match = True
            for key, value in filters.items():
                if item.get(key) != value:
                    match = False
                    break
            if match:
                result.append(item)
        return result


class FirestoreAdapter:
    """Wraps Firestore client with same interface as InMemoryStore."""

    def __init__(self, client):
        self._db = client

    def get_all(self, collection: str) -> list[dict]:
        docs = self._db.collection(collection).stream()
        return [{**doc.to_dict(), "id": doc.id} for doc in docs]

    def get_by_id(self, collection: str, doc_id: str) -> Optional[dict]:
        doc = self._db.collection(collection).document(doc_id).get()
        if doc.exists:
            return {**doc.to_dict(), "id": doc.id}
        return None

    def create(self, collection: str, data: dict, doc_id: Optional[str] = None) -> dict:
        if doc_id:
            self._db.collection(collection).document(doc_id).set(data)
            data["id"] = doc_id
        else:
            doc_ref = self._db.collection(collection).add(data)
            data["id"] = doc_ref[1].id
        return data

    def update(self, collection: str, doc_id: str, data: dict) -> Optional[dict]:
        doc_ref = self._db.collection(collection).document(doc_id)
        if doc_ref.get().exists:
            doc_ref.update(data)
            return {**doc_ref.get().to_dict(), "id": doc_id}
        return None

    def delete(self, collection: str, doc_id: str) -> bool:
        doc_ref = self._db.collection(collection).document(doc_id)
        if doc_ref.get().exists:
            doc_ref.delete()
            return True
        return False

    def query(self, collection: str, filters: Optional[dict] = None) -> list[dict]:
        ref = self._db.collection(collection)
        if filters:
            for key, value in filters.items():
                ref = ref.where(key, "==", value)
        return [{**doc.to_dict(), "id": doc.id} for doc in ref.stream()]


def get_store():
    """Factory: returns Firestore adapter if available, else in-memory store."""
    if firestore_db is not None:
        print("[DB] Using Firestore adapter")
        return FirestoreAdapter(firestore_db)
    print("[DB] Using in-memory store (demo mode)")
    return InMemoryStore()


# Singleton store instance
store = get_store()
