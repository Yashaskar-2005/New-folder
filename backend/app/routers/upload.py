from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas import FileUploadResponse
from app.services.extractor import extract_from_bytes

router = APIRouter(prefix="/upload", tags=["File Upload"])

@router.post("", response_model=FileUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """
    Accepts PDF, DOCX, TXT, MD, and parses clean text for the transformation engine.
    """
    try:
        content_bytes = await file.read()
        if len(content_bytes) > 25 * 1024 * 1024:  # 25MB limit
            raise HTTPException(status_code=400, detail="File size exceeds 25MB limit.")
            
        extracted_text, metadata = extract_from_bytes(content_bytes, file.filename)
        
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the uploaded document.")
            
        snippet = extracted_text[:350] + ("..." if len(extracted_text) > 350 else "")
        
        return FileUploadResponse(
            filename=file.filename,
            file_type=metadata.get("format", "text"),
            char_count=metadata.get("char_count", len(extracted_text)),
            word_count=metadata.get("word_count", len(extracted_text.split())),
            extracted_text=extracted_text,
            preview_snippet=snippet
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
