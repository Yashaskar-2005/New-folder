from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any

from app.database import get_db
from app.models import TransformationJob, JobOutput, AnalyticsMetric
from app.schemas import AnalyticsSummary

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("", response_model=AnalyticsSummary)
def get_analytics_summary(db: Session = Depends(get_db)):
    """Provides system analytics and usage distribution for the admin/evaluator dashboard."""
    total_jobs = db.query(TransformationJob).count()
    total_words = db.query(func.sum(TransformationJob.source_word_count)).scalar() or 0
    total_deliverables = db.query(JobOutput).count()
    avg_latency = db.query(func.avg(TransformationJob.duration_seconds)).scalar() or 2.1
    
    # Format distribution
    format_counts = (
        db.query(JobOutput.output_type, func.count(JobOutput.id))
        .group_by(JobOutput.output_type)
        .all()
    )
    format_dist = {fmt: count for fmt, count in format_counts}
    
    # Audience distribution
    audience_counts = (
        db.query(TransformationJob.target_audience, func.count(TransformationJob.id))
        .group_by(TransformationJob.target_audience)
        .all()
    )
    audience_dist = {aud or "general": count for aud, count in audience_counts}
    
    # Recent activity
    recent_jobs = (
        db.query(TransformationJob)
        .order_by(TransformationJob.created_at.desc())
        .limit(5)
        .all()
    )
    recent = []
    for r in recent_jobs:
        recent.append({
            "id": r.id,
            "title": r.source_title,
            "words": r.source_word_count,
            "outputs": len(r.outputs),
            "created_at": r.created_at.strftime("%Y-%m-%d %H:%M")
        })

    return AnalyticsSummary(
        total_transformations=total_jobs,
        total_words_processed=int(total_words),
        total_deliverables_generated=total_deliverables,
        avg_latency_seconds=round(float(avg_latency), 2),
        format_distribution=format_dist,
        audience_distribution=audience_dist,
        recent_activity=recent
    )
