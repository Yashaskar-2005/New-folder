import time
import json
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.responses import StreamingResponse, Response
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database import get_db
from app.models import TransformationJob, JobOutput, AnalyticsMetric
from app.schemas import TransformRequest, TransformResponse, StructuredOutputItem
from app.services.llm_engine import generate_transformation
from app.services.exporter import (
    generate_markdown_export,
    generate_html_export,
    generate_powerpoint_presentation
)

router = APIRouter(prefix="/transform", tags=["Transformation"])

@router.post("", response_model=TransformResponse)
def transform_content(req: TransformRequest, db: Session = Depends(get_db)):
    """
    Main Content Repurposing Pipeline.
    Ingests source content and transforms it into the selected output formats.
    """
    start_time = time.time()
    words = len(req.source_text.split())
    
    # Resolve job title
    title = req.source_title
    if not title or title.strip() == "Untitled Source Content":
        first_line = req.source_text.strip().split("\n")[0]
        title = first_line[:50] if len(first_line) > 5 else "Content Transformation"

    # Create job record
    job_id = str(uuid.uuid4())
    model_used = req.model_choice or "gemini-2.5-flash (with offline fallback)"
    
    generated_outputs: List[StructuredOutputItem] = []
    db_outputs: List[JobOutput] = []

    # Process each requested output format
    for fmt in req.output_types:
        try:
            res_dict = generate_transformation(
                output_type=fmt,
                source_text=req.source_text,
                source_title=title,
                tone=req.tone or "professional",
                target_audience=req.target_audience or "general",
                language=req.language or "English",
                detail_level=req.detail_level or "standard",
                api_key_override=req.api_key_override,
                model_choice=req.model_choice
            )
            
            output_title = res_dict.get("title", f"{fmt.replace('_', ' ').title()} Repurposed")
            content_md = res_dict.get("full_markdown", "")
            out_words = len(content_md.split())
            
            item = StructuredOutputItem(
                output_type=fmt,
                title=output_title,
                content_markdown=content_md,
                structured_data=res_dict,
                word_count=out_words,
                tags=[req.tone, req.target_audience, req.language]
            )
            generated_outputs.append(item)
            
            db_out = JobOutput(
                id=str(uuid.uuid4()),
                job_id=job_id,
                output_type=fmt,
                title=output_title,
                content_markdown=content_md,
                structured_json=json.dumps(res_dict),
                word_count=out_words
            )
            db_outputs.append(db_out)
        except Exception as e:
            print(f"[Error transforming {fmt}]: {e}")

    duration = round(time.time() - start_time, 2)

    # Persist to database
    db_job = TransformationJob(
        id=job_id,
        source_title=title,
        source_text=req.source_text,
        source_type=req.source_type or "text",
        source_word_count=words,
        tone=req.tone or "professional",
        target_audience=req.target_audience or "general",
        language=req.language or "English",
        detail_level=req.detail_level or "standard",
        status="completed",
        duration_seconds=duration,
        model_used=model_used,
        created_at=datetime.utcnow()
    )
    db.add(db_job)
    for out in db_outputs:
        db.add(out)

    # Record analytics metrics
    db.add(AnalyticsMetric(metric_name="job_completed", metric_value=1.0, tag=req.source_type or "text"))
    db.add(AnalyticsMetric(metric_name="words_processed", metric_value=float(words), tag="input_words"))
    for fmt in req.output_types:
        db.add(AnalyticsMetric(metric_name="format_generated", metric_value=1.0, tag=fmt))

    db.commit()

    return TransformResponse(
        job_id=job_id,
        status="completed",
        source_title=title,
        source_word_count=words,
        duration_seconds=duration,
        model_used=model_used,
        created_at=datetime.utcnow(),
        outputs=generated_outputs
    )

@router.post("/single", response_model=StructuredOutputItem)
def regenerate_single_format(
    fmt: str,
    req: TransformRequest
):
    """Regenerates a single format with updated parameters."""
    res_dict = generate_transformation(
        output_type=fmt,
        source_text=req.source_text,
        source_title=req.source_title or "Content Transformation",
        tone=req.tone or "professional",
        target_audience=req.target_audience or "general",
        language=req.language or "English",
        detail_level=req.detail_level or "standard",
        api_key_override=req.api_key_override,
        model_choice=req.model_choice
    )
    content_md = res_dict.get("full_markdown", "")
    return StructuredOutputItem(
        output_type=fmt,
        title=res_dict.get("title", f"{fmt.capitalize()} Output"),
        content_markdown=content_md,
        structured_data=res_dict,
        word_count=len(content_md.split()),
        tags=[req.tone or "professional", req.target_audience or "general"]
    )

@router.post("/export/{export_format}")
def export_content(
    export_format: str,
    payload: Dict[str, Any] = Body(...)
):
    """
    Exports generated outputs to markdown (.md), plaintext (.txt), html, json, or PowerPoint (.pptx).
    """
    job_title = payload.get("source_title", "Repurposed_Content")
    outputs = payload.get("outputs", [])
    safe_title = "".join(c for c in job_title if c.isalnum() or c in (' ', '_', '-')).rstrip().replace(" ", "_")

    if export_format == "markdown" or export_format == "md":
        md_text = generate_markdown_export(job_title, outputs)
        return Response(
            content=md_text,
            media_type="text/markdown",
            headers={"Content-Disposition": f'attachment; filename="{safe_title}_Report.md"'}
        )

    elif export_format == "txt" or export_format == "text":
        md_text = generate_markdown_export(job_title, outputs)
        return Response(
            content=md_text,
            media_type="text/plain",
            headers={"Content-Disposition": f'attachment; filename="{safe_title}_Report.txt"'}
        )

    elif export_format == "html":
        html_doc = generate_html_export(job_title, outputs)
        return Response(
            content=html_doc,
            media_type="text/html",
            headers={"Content-Disposition": f'attachment; filename="{safe_title}_Report.html"'}
        )

    elif export_format == "json":
        json_str = json.dumps({"title": job_title, "outputs": outputs}, indent=2)
        return Response(
            content=json_str,
            media_type="application/json",
            headers={"Content-Disposition": f'attachment; filename="{safe_title}_Export.json"'}
        )

    elif export_format == "pptx":
        # Find presentation output or format first output into slides
        pres_output = next((o for o in outputs if o.get("output_type") == "presentation"), None)
        presentation_data = pres_output.get("structured_data", {}) if pres_output else {}
        pptx_buffer = generate_powerpoint_presentation(presentation_data)
        
        return StreamingResponse(
            pptx_buffer,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers={"Content-Disposition": f'attachment; filename="{safe_title}_Slides.pptx"'}
        )

    raise HTTPException(status_code=400, detail=f"Unsupported export format: {export_format}")
