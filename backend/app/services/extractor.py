"""
File and Text Content Extraction Engine.
Extracts clean, normalized text from Plain Text, Markdown, PDF, and DOCX files.
"""

import io
import re
from typing import Tuple, Dict, Any

def clean_text(raw_text: str) -> str:
    """Normalizes excessive whitespace, strange unicode characters, and blank lines."""
    if not raw_text:
        return ""
    # Replace carriage returns
    text = raw_text.replace("\r\n", "\n").replace("\r", "\n")
    # Replace 3 or more newlines with 2
    text = re.sub(r'\n{3,}', '\n\n', text)
    # Strip trailing whitespace on lines
    lines = [line.strip() for line in text.split('\n')]
    return '\n'.join(lines).strip()

def extract_from_bytes(file_bytes: bytes, filename: str) -> Tuple[str, Dict[str, Any]]:
    """
    Parses file bytes according to file extension.
    Returns (extracted_text, metadata_dict)
    """
    filename_lower = filename.lower()
    extracted_text = ""
    metadata = {
        "filename": filename,
        "page_count": 1,
        "format": "text"
    }

    if filename_lower.endswith(".pdf"):
        metadata["format"] = "pdf"
        try:
            from pypdf import PdfReader
            pdf_file = io.BytesIO(file_bytes)
            reader = PdfReader(pdf_file)
            metadata["page_count"] = len(reader.pages)
            pages_text = []
            for i, page in enumerate(reader.pages):
                page_content = page.extract_text() or ""
                if page_content.strip():
                    pages_text.append(f"--- Page {i+1} ---\n{page_content.strip()}")
            extracted_text = "\n\n".join(pages_text)
        except Exception as e:
            extracted_text = f"Error extracting PDF: {str(e)}"

    elif filename_lower.endswith(".docx"):
        metadata["format"] = "docx"
        try:
            import docx
            doc_file = io.BytesIO(file_bytes)
            doc = docx.Document(doc_file)
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            metadata["paragraphs_count"] = len(paragraphs)
            extracted_text = "\n\n".join(paragraphs)
        except Exception as e:
            extracted_text = f"Error extracting DOCX: {str(e)}"

    elif filename_lower.endswith((".txt", ".md", ".json", ".csv", ".log")):
        metadata["format"] = "text"
        try:
            extracted_text = file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            try:
                extracted_text = file_bytes.decode("latin-1")
            except Exception as e:
                extracted_text = f"Error decoding text file: {str(e)}"
    else:
        # Generic fallback
        metadata["format"] = "binary/unknown"
        try:
            extracted_text = file_bytes.decode("utf-8", errors="ignore")
        except Exception:
            extracted_text = "Unsupported file format for text extraction."

    cleaned = clean_text(extracted_text)
    words = len(cleaned.split()) if cleaned else 0
    chars = len(cleaned)
    metadata["word_count"] = words
    metadata["char_count"] = chars

    return cleaned, metadata
