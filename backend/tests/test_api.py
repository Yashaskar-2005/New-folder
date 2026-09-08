import unittest
import os
import sys
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.prompts import get_system_prompt_for_format, FORMAT_DESCRIPTIONS
from app.services.llm_engine import synthesize_offline_content
from app.services.extractor import extract_from_bytes, clean_text
from app.services.exporter import generate_markdown_export, generate_html_export, generate_powerpoint_presentation

def test_format_descriptions():
    """Verify all 7 formats are defined."""
    assert len(FORMAT_DESCRIPTIONS) == 7
    expected = ["linkedin", "twitter", "advisory", "video_script", "infographic", "exec_summary", "presentation"]
    for fmt in expected:
        assert fmt in FORMAT_DESCRIPTIONS

def test_prompt_generation_all_formats():
    """Verify system prompts are generated with required constraints for each format."""
    expected = ["linkedin", "twitter", "advisory", "video_script", "infographic", "exec_summary", "presentation"]
    for fmt in expected:
        prompt = get_system_prompt_for_format(fmt, tone="authoritative", target_audience="developers", language="English")
        assert "valid, parseable JSON" in prompt
        assert fmt.upper() in prompt
        assert "developers" in prompt

def test_synthesizer_offline_all_formats():
    """Verify offline engine produces structured data for all 7 formats."""
    sample_text = """OpenAI has officially launched its newest multimodal reasoning framework designed to autonomously analyze, transform, and repurpose content across enterprise systems. Early benchmarks show an 85% acceleration in content turnaround times and a 4x reduction in manual oversight. The model natively complies with strict safety guidelines and structured output schemas."""
    
    expected = ["linkedin", "twitter", "advisory", "video_script", "infographic", "exec_summary", "presentation"]
    for fmt in expected:
        result = synthesize_offline_content(
            output_type=fmt,
            source_text=sample_text,
            source_title="OpenAI Launch Framework",
            tone="professional",
            target_audience="general"
        )
        assert result is not None
        assert "full_markdown" in result
        assert len(result["full_markdown"]) > 50

def test_text_cleaner_and_extractor():
    """Verify extractor cleans whitespace and parses bytes."""
    raw = "Hello   world!\r\n\r\n\r\n\r\nThis is a test paragraph.\r\n"
    cleaned = clean_text(raw)
    assert "\r" not in cleaned
    
    text_bytes = b"# Sample Document\n\nThis is sample content for testing."
    text, meta = extract_from_bytes(text_bytes, "sample.md")
    assert meta["format"] == "text"
    assert "Sample Document" in text
    assert meta["word_count"] > 0

def test_export_generation():
    """Verify markdown, html, and pptx exporters work smoothly."""
    mock_outputs = [
        {
            "output_type": "linkedin",
            "title": "LinkedIn Post",
            "content_markdown": "🚀 Revolutionary launch!"
        },
        {
            "output_type": "presentation",
            "title": "Slide Deck",
            "content_markdown": "# Slide 1\n\nTitle",
            "structured_data": {
                "slides": [
                    {
                        "title": "Slide 1: Introduction",
                        "bullets": ["Point A", "Point B"],
                        "speaker_notes": "Opening remarks"
                    }
                ]
            }
        }
    ]
    md = generate_markdown_export("Test Report", mock_outputs)
    assert "# Transformation Report: Test Report" in md
    assert "[LINKEDIN]" in md

    html = generate_html_export("Test Report", mock_outputs)
    assert "<!DOCTYPE html>" in html
    assert "TransformAI: Test Report" in html

    pptx_stream = generate_powerpoint_presentation(mock_outputs[1]["structured_data"])
    assert pptx_stream is not None

if __name__ == "__main__":
    print("Running Gen AI Platform Test Suite...")
    test_format_descriptions()
    print("[PASS] test_format_descriptions passed")
    test_prompt_generation_all_formats()
    print("[PASS] test_prompt_generation_all_formats passed")
    test_synthesizer_offline_all_formats()
    print("[PASS] test_synthesizer_offline_all_formats passed")
    test_text_cleaner_and_extractor()
    print("[PASS] test_text_cleaner_and_extractor passed")
    test_export_generation()
    print("[PASS] test_export_generation passed")
    print("\n=== ALL TESTS PASSED SUCCESSFULLY! (5/5) ===")

