import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class TransformationJob(Base):
    __tablename__ = "transformation_jobs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    source_title = Column(String(255), default="Untitled Content")
    source_text = Column(Text, nullable=False)
    source_type = Column(String(50), default="text")  # text, file_pdf, file_docx, sample
    source_word_count = Column(Integer, default=0)
    
    # Parameters
    tone = Column(String(50), default="professional")
    target_audience = Column(String(50), default="general")
    language = Column(String(50), default="English")
    detail_level = Column(String(50), default="standard")
    
    # Execution metadata
    status = Column(String(50), default="completed")
    duration_seconds = Column(Float, default=0.0)
    model_used = Column(String(100), default="offline-synthesizer")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    outputs = relationship("JobOutput", back_populates="job", cascade="all, delete-orphan")

class JobOutput(Base):
    __tablename__ = "job_outputs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String(36), ForeignKey("transformation_jobs.id"), nullable=False)
    output_type = Column(String(50), nullable=False)  # linkedin, twitter, advisory, video_script, infographic, exec_summary, presentation
    title = Column(String(255), default="")
    content_markdown = Column(Text, nullable=False)
    structured_json = Column(Text, default="{}")
    word_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("TransformationJob", back_populates="outputs")

class AnalyticsMetric(Base):
    __tablename__ = "analytics_metrics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    metric_name = Column(String(100), nullable=False)
    metric_value = Column(Float, default=1.0)
    tag = Column(String(100), default="")
    created_at = Column(DateTime, default=datetime.utcnow)
