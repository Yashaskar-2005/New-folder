from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import TransformationJob, JobOutput, AnalyticsMetric
from app.routers import transform, upload, history, analytics
from app.services.llm_engine import synthesize_offline_content
import uuid
from datetime import datetime, timedelta

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables
    Base.metadata.create_all(bind=engine)
    
    # Pre-seed initial sample data if empty so the UI looks active immediately
    db = SessionLocal()
    try:
        count = db.query(TransformationJob).count()
        if count == 0:
            seed_time = datetime.utcnow() - timedelta(hours=2)
            seed_title = "CrowdStrike Global IT Kernel Incident Advisory"
            seed_text = """On July 19, 2024, CrowdStrike released a sensor configuration update for Windows systems that triggered a widespread logic error in Channel File 291, resulting in system crashes (Blue Screen of Death) across an estimated 8.5 million enterprise Windows machines worldwide. The incident severely impacted airlines, healthcare providers, banking institutions, and emergency services. Root cause analysis revealed an out-of-bounds memory read in the Content Validator logic. Remediation required manual booting into Safe Mode and deleting the offending configuration file. Organizations are advised to enforce phased deployment rings, kernel-space isolation, and rigorous synthetic validation."""
            
            job_id = str(uuid.uuid4())
            job = TransformationJob(
                id=job_id,
                source_title=seed_title,
                source_text=seed_text,
                source_type="sample",
                source_word_count=len(seed_text.split()),
                tone="authoritative",
                target_audience="c_suite",
                language="English",
                detail_level="standard",
                status="completed",
                duration_seconds=1.85,
                model_used="gemini-2.5-flash (with offline fallback)",
                created_at=seed_time
            )
            db.add(job)
            
            for fmt in ["linkedin", "twitter", "advisory", "video_script", "infographic", "exec_summary", "presentation"]:
                content = synthesize_offline_content(
                    output_type=fmt,
                    source_text=seed_text,
                    source_title=seed_title,
                    tone="authoritative",
                    target_audience="c_suite",
                    language="English"
                )
                md = content.get("full_markdown", "")
                db.add(JobOutput(
                    id=str(uuid.uuid4()),
                    job_id=job_id,
                    output_type=fmt,
                    title=content.get("title", f"{fmt.title()} Deliverable"),
                    content_markdown=md,
                    word_count=len(md.split()),
                    created_at=seed_time
                ))
            db.commit()
    except Exception as e:
        print(f"[Seed Database Notice]: {e}")
    finally:
        db.close()
        
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Enterprise Multi-Format Content Repurposing Engine powered by Generative AI",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(transform.router, prefix=settings.API_V1_STR)
app.include_router(upload.router, prefix=settings.API_V1_STR)
app.include_router(history.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)

@app.get("/")
def root_status():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "api_docs": "/docs",
        "supported_formats": [
            "linkedin", "twitter", "advisory", "video_script", "infographic", "exec_summary", "presentation"
        ],
        "default_model": settings.DEFAULT_MODEL
    }
