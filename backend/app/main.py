from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.firebase import db
from app.routers import auth, issues, audit

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-powered civic infrastructure reporting platform",
)

# CORS — allow frontend dev server and production origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(issues.router, prefix="/api/issues", tags=["Issues"])
app.include_router(audit.router, prefix="/api/audit", tags=["Accessibility"])


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "database_connected": db is not None,
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }