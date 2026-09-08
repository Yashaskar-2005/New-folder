import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database import get_db
from app.models import TransformationJob, JobOutput
from app.schemas import JobListItem, TransformResponse, StructuredOutputItem

router = APIRouter(prefix="/history", tags=["History"])

@router.get("", response_model=List[JobListItem])
def list_jobs(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """Fetches list of recently completed transformation jobs."""
    jobs = db.query(TransformationJob).order_by(TransformationJob.created_at.desc()).offset(skip).limit(limit).all()
    
    results = []
    for j in jobs:
        output_types = [o.output_type for o in j.outputs]
        results.append(JobListItem(
            id=j.id,
            source_title=j.source_title,
            source_type=j.source_type,
            source_word_count=j.source_word_count,
            outputs_count=len(j.outputs),
            output_types=output_types,
            tone=j.tone,
            target_audience=j.target_audience,
            language=j.language,
            duration_seconds=j.duration_seconds,
            model_used=j.model_used,
            created_at=j.created_at
        ))
    return results

@router.get("/{job_id}", response_model=TransformResponse)
def get_job_detail(job_id: str, db: Session = Depends(get_db)):
    """Fetches complete outputs and structured data for a specific transformation job."""
    job = db.query(TransformationJob).filter(TransformationJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    outputs = []
    for o in job.outputs:
        structured_data = {}
        if o.structured_json:
            try:
                structured_data = json.loads(o.structured_json)
            except Exception:
                pass
                
        outputs.append(StructuredOutputItem(
            output_type=o.output_type,
            title=o.title,
            content_markdown=o.content_markdown,
            structured_data=structured_data,
            word_count=o.word_count,
            tags=[job.tone, job.target_audience, job.language]
        ))
        
    return TransformResponse(
        job_id=job.id,
        status=job.status,
        source_title=job.source_title,
        source_word_count=job.source_word_count,
        duration_seconds=job.duration_seconds,
        model_used=job.model_used,
        created_at=job.created_at,
        outputs=outputs
    )

@router.delete("/{job_id}")
def delete_job(job_id: str, db: Session = Depends(get_db)):
    """Deletes a job and its associated outputs."""
    job = db.query(TransformationJob).filter(TransformationJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    db.delete(job)
    db.commit()
    return {"message": "Job deleted successfully", "job_id": job_id}
