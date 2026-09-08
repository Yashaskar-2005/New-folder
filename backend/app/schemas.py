from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class TransformRequest(BaseModel):
    source_title: Optional[str] = "Untitled Source Content"
    source_text: str = Field(..., min_length=10, description="The input source text to transform")
    source_type: Optional[str] = "text"
    output_types: List[str] = Field(
        default=["linkedin", "twitter", "advisory", "video_script", "infographic", "exec_summary", "presentation"],
        description="List of target formats to generate"
    )
    tone: Optional[str] = "professional"  # professional, casual, authoritative, technical, urgent
    target_audience: Optional[str] = "general"  # general, c_suite, developers, marketers, students
    language: Optional[str] = "English"
    detail_level: Optional[str] = "standard"  # brief, standard, comprehensive
    api_key_override: Optional[str] = None
    model_choice: Optional[str] = "gemini-2.5-flash"

class StructuredOutputItem(BaseModel):
    output_type: str
    title: str
    content_markdown: str
    structured_data: Dict[str, Any] = {}
    word_count: int = 0
    tags: List[str] = []

class TransformResponse(BaseModel):
    job_id: str
    status: str
    source_title: str
    source_word_count: int
    duration_seconds: float
    model_used: str
    created_at: datetime
    outputs: List[StructuredOutputItem]

class FileUploadResponse(BaseModel):
    filename: str
    file_type: str
    char_count: int
    word_count: int
    extracted_text: str
    preview_snippet: str

class JobListItem(BaseModel):
    id: str
    source_title: str
    source_type: str
    source_word_count: int
    outputs_count: int
    output_types: List[str]
    tone: str
    target_audience: str
    language: str
    duration_seconds: float
    model_used: str
    created_at: datetime

class AnalyticsSummary(BaseModel):
    total_transformations: int
    total_words_processed: int
    total_deliverables_generated: int
    avg_latency_seconds: float
    format_distribution: Dict[str, int]
    audience_distribution: Dict[str, int]
    recent_activity: List[Dict[str, Any]]
