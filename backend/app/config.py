import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Gen AI Content Transformation Platform"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # AI Engine Keys
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    DEFAULT_MODEL: str = "gemini-2.5-flash"
    
    # Offline Demo Mode: if True, fallback to smart offline synthesizer if API key is invalid or absent
    ENABLE_OFFLINE_DEMO_MODE: bool = True
    
    # Database
    DATABASE_URL: str = "sqlite:///./content_transform.db"
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]
    
    # Storage
    UPLOAD_DIR: str = "./uploads"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
