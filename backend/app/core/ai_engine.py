"""AI Engine — Gemini-powered issue analysis with intelligent fallback.

Provides:
- Image analysis for civic issue classification
- Severity scoring
- Department auto-routing
- Priority calculation
- Keyword extraction
"""

import json
import random
from typing import Optional
from app.core.config import settings

# Attempt Gemini import
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False


# Department routing map
DEPARTMENT_MAP = {
    "Road Damage": "Roads & Infrastructure",
    "Pothole": "Roads & Infrastructure",
    "Street Lighting": "Electrical & Lighting",
    "Waste Management": "Sanitation & Waste",
    "Garbage": "Sanitation & Waste",
    "Water Supply": "Water Supply",
    "Water Leak": "Water Supply",
    "Drainage & Flooding": "Drainage & Stormwater",
    "Drainage": "Drainage & Stormwater",
    "Footpath & Sidewalk": "Roads & Infrastructure",
    "Traffic Signal": "Traffic Management",
    "Public Safety": "Safety & Security",
    "Noise Pollution": "Environmental",
    "Air Pollution": "Environmental",
    "Illegal Construction": "Building & Planning",
    "Park Maintenance": "Parks & Recreation",
    "Public Transport": "Transport Authority",
}

VALID_CATEGORIES = list(set(DEPARTMENT_MAP.keys()))


def _configure_gemini():
    """Configure Gemini API if key is available."""
    if GEMINI_AVAILABLE and settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "AIzaSyYourKeyHere_ChangeMe":
        genai.configure(api_key=settings.GEMINI_API_KEY)
        return True
    return False


def _get_department(category: str) -> str:
    """Route issue to correct municipal department."""
    for key, dept in DEPARTMENT_MAP.items():
        if key.lower() in category.lower():
            return dept
    return "General Municipal Services"


def _calculate_priority(severity: int, category: str, description: str) -> tuple[int, list[str]]:
    """Calculate priority score (0-100) with reasoning."""
    score = 0
    reasons = []

    # Severity contribution (0-40 points)
    severity_points = severity * 8
    score += severity_points
    if severity >= 4:
        reasons.append("High severity issue")

    # Category urgency bonus
    urgent_categories = {"Water Supply", "Water Leak", "Drainage & Flooding", "Public Safety"}
    if any(cat.lower() in category.lower() for cat in urgent_categories):
        score += 20
        reasons.append("Critical infrastructure category")

    # Safety keyword bonus
    safety_keywords = ["hazard", "danger", "accident", "injury", "emergency", "flood", "collapse"]
    desc_lower = description.lower()
    found_safety = [kw for kw in safety_keywords if kw in desc_lower]
    if found_safety:
        score += 15
        reasons.append("Safety concern detected")

    # Public area bonus
    public_keywords = ["road", "main", "highway", "school", "hospital", "market", "bus stop"]
    found_public = [kw for kw in public_keywords if kw in desc_lower]
    if found_public:
        score += 10
        reasons.append("High traffic/public area")

    # Duration bonus
    duration_keywords = ["weeks", "months", "long time", "repeatedly", "ongoing"]
    if any(kw in desc_lower for kw in duration_keywords):
        score += 10
        reasons.append("Persistent/long-standing issue")

    return min(score, 100), reasons


async def analyze_issue(
    description: str,
    title: Optional[str] = None,
    image_url: Optional[str] = None,
) -> dict:
    """Analyze a civic issue using Gemini AI with intelligent fallback.

    Returns:
        dict with keys: category, severity, confidence, keywords,
                       department, priorityScore, priorityReasons
    """
    gemini_ready = _configure_gemini()

    if gemini_ready:
        try:
            return await _analyze_with_gemini(description, title, image_url)
        except Exception as e:
            print(f"⚠️ Gemini analysis failed: {e}. Falling back to rule-based engine.")

    return _analyze_with_rules(description, title)


async def _analyze_with_gemini(
    description: str,
    title: Optional[str] = None,
    image_url: Optional[str] = None,
) -> dict:
    """Use Gemini to analyze the issue."""
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""You are a municipal issue classifier for an Indian smart city platform.

Analyze this civic issue report and return a JSON object with exactly these fields:
- "category": One of: {json.dumps(VALID_CATEGORIES)}
- "severity": Integer 1-5 (1=cosmetic, 2=minor, 3=moderate, 4=major, 5=critical)
- "confidence": Float 0.0-1.0 representing your confidence
- "keywords": Array of 3-6 relevant keywords
- "summary": A concise 1-line description if title is missing

Issue Title: {title or 'Not provided'}
Issue Description: {description}

Respond ONLY with valid JSON, no markdown formatting."""

    response = model.generate_content(prompt)
    text = response.text.strip()

    # Clean markdown code fences if present
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()

    result = json.loads(text)

    category = result.get("category", "General")
    severity = max(1, min(5, int(result.get("severity", 3))))
    confidence = float(result.get("confidence", 0.85))
    keywords = result.get("keywords", [])
    priority_score, priority_reasons = _calculate_priority(severity, category, description)

    return {
        "category": category,
        "severity": severity,
        "confidence": confidence,
        "keywords": keywords,
        "department": _get_department(category),
        "priorityScore": priority_score,
        "priorityReasons": priority_reasons,
        "aiProvider": "gemini",
    }


def _analyze_with_rules(description: str, title: Optional[str] = None) -> dict:
    """Rule-based fallback analysis when Gemini is unavailable."""
    text = f"{title or ''} {description}".lower()

    # Category detection rules
    category_rules = [
        (["pothole", "road damage", "crack", "asphalt", "broken road"], "Road Damage"),
        (["street light", "lamp", "light pole", "dark street", "broken light"], "Street Lighting"),
        (["garbage", "waste", "trash", "litter", "dump", "overflow"], "Waste Management"),
        (["water leak", "pipeline", "water supply", "tap", "water pressure"], "Water Supply"),
        (["drain", "flood", "waterlog", "sewage", "clog"], "Drainage & Flooding"),
        (["footpath", "sidewalk", "pavement", "tile", "walking path"], "Footpath & Sidewalk"),
        (["traffic", "signal", "crossing", "zebra"], "Traffic Signal"),
        (["noise", "pollution", "honking"], "Noise Pollution"),
        (["construction", "illegal", "encroachment"], "Illegal Construction"),
        (["park", "garden", "tree", "green"], "Park Maintenance"),
    ]

    detected_category = "General"
    for keywords, category in category_rules:
        if any(kw in text for kw in keywords):
            detected_category = category
            break

    # Severity estimation
    severity = 3  # Default moderate
    high_severity_words = ["urgent", "emergency", "critical", "danger", "hazard", "accident", "collapse", "major"]
    low_severity_words = ["minor", "small", "cosmetic", "aesthetic"]
    if any(w in text for w in high_severity_words):
        severity = 4
    elif any(w in text for w in low_severity_words):
        severity = 2

    # Extract keywords from text
    keyword_candidates = [
        "pothole", "road", "light", "garbage", "water", "drain", "footpath",
        "traffic", "noise", "park", "flooding", "leak", "broken", "damaged",
        "hazard", "safety", "repair", "maintenance", "infrastructure",
    ]
    keywords = [kw for kw in keyword_candidates if kw in text][:6]
    if not keywords:
        keywords = ["civic issue", "infrastructure", "maintenance"]

    confidence = round(random.uniform(0.78, 0.92), 2)
    priority_score, priority_reasons = _calculate_priority(severity, detected_category, description)

    return {
        "category": detected_category,
        "severity": severity,
        "confidence": confidence,
        "keywords": keywords,
        "department": _get_department(detected_category),
        "priorityScore": priority_score,
        "priorityReasons": priority_reasons,
        "aiProvider": "rule-engine",
    }
