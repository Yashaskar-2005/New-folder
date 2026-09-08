"""
Prompt Engineering Templates for Gen AI Content Repurposing Engine.
Defines system instructions, formatting guidelines, and JSON schemas for all 7 formats.
"""

from typing import Dict, Any

FORMAT_DESCRIPTIONS = {
    "linkedin": "High-engagement LinkedIn thought leadership post with hook, narrative, bullet points, CTA, and hashtags.",
    "twitter": "X / Twitter multi-tweet thread (1/N) with character-limited tweets (<280 chars), hooks, and conclusion.",
    "advisory": "Formal Incident / Threat / Operational Advisory with severity rating, impact scope, and mitigations.",
    "video_script": "Scene-by-scene video script and storyboard with timings, visual/B-roll cues, voiceover, and captions.",
    "infographic": "Infographic architecture blueprint with statistics, modular visual sections, and iconography guidelines.",
    "exec_summary": "High-level 200-300 word executive briefing with core takeaways, strategic risks, and decisions.",
    "presentation": "Slide deck presentation with slide titles, concise bullet points, speaker notes, and visual prompts."
}

def get_system_prompt_for_format(
    output_type: str,
    tone: str = "professional",
    target_audience: str = "general",
    language: str = "English",
    detail_level: str = "standard"
) -> str:
    """
    Returns an engineered system prompt instructing the LLM to output structured JSON
    adhering to the specific format rules.
    """
    base_instructions = f"""You are an elite, world-class Generative AI Content Transformation Engine.
Your objective is to ingest source content and repurpose it into a specialized, high-impact deliverable.

CONSTRAINTS & PARAMETERS:
- Output Format: {output_type.upper()}
- Tone: {tone}
- Target Audience: {target_audience}
- Target Language: {language} (Ensure all generated copy is cleanly localized in this language)
- Detail Level: {detail_level}
- Factual Fidelity: Ground all assertions strictly in the source text. Do not invent contradictory facts.

You MUST respond strictly with a valid, parseable JSON object. No Markdown code fences, no extra commentary outside JSON.
"""

    format_specific_schemas = {
        "linkedin": """
Your JSON response must match this schema:
{
  "title": "Short title for this post",
  "hook": "Attention-grabbing opening sentence (1-2 lines)",
  "body": "Detailed engaging narrative explaining the context and value",
  "key_takeaways": ["Point 1", "Point 2", "Point 3"],
  "call_to_action": "Engaging question or prompt encouraging comments",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4"],
  "full_markdown": "Complete, ready-to-copy LinkedIn post formatted with line breaks, emojis, and hashtags"
}
""",
        "twitter": """
Your JSON response must match this schema:
{
  "title": "Thread Title / Topic",
  "total_tweets": 5,
  "tweets": [
    {
      "tweet_number": 1,
      "text": "1/ Hook tweet opening the topic with curiosity and emoji. (under 260 chars)",
      "character_count": 85
    },
    {
      "tweet_number": 2,
      "text": "2/ Core point or shocking statistic from source. (under 260 chars)",
      "character_count": 92
    }
  ],
  "full_markdown": "Full thread concatenated ready for review"
}
""",
        "advisory": """
Your JSON response must match this schema:
{
  "title": "Formal Advisory Title",
  "advisory_id": "ADV-2026-001",
  "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "target_audience": "Systems / Leadership / Security Operations",
  "executive_summary": "2-3 sentence overview of the issue or update",
  "affected_systems": ["System or component 1", "System or component 2"],
  "impact_analysis": "Detailed technical and business impact",
  "mitigation_steps": [
    {"step_number": 1, "action": "Immediate containment action", "owner": "Ops Team"},
    {"step_number": 2, "action": "Long term patching or review", "owner": "Engineering"}
  ],
  "full_markdown": "Clean, formatted Markdown advisory ready for distribution"
}
""",
        "video_script": """
Your JSON response must match this schema:
{
  "title": "Video Title",
  "target_duration": "60-90 seconds",
  "video_style": "Explainer / Reel / Corporate Showcase",
  "scenes": [
    {
      "scene_number": 1,
      "timestamp": "00:00 - 00:15",
      "visual_direction": "Dynamic motion graphics / B-roll of modern server rack or relevant imagery",
      "spoken_narration": "Exact words spoken by the narrator",
      "on_screen_text": "HOOK TEXT ON SCREEN"
    },
    {
      "scene_number": 2,
      "timestamp": "00:15 - 00:35",
      "visual_direction": "Presenter to camera with chart overlay",
      "spoken_narration": "Deep dive into the core message",
      "on_screen_text": "Key Stat Callout"
    }
  ],
  "full_markdown": "Full screenplay formatted table and transcript"
}
""",
        "infographic": """
Your JSON response must match this schema:
{
  "headline": "Punchy Infographic Banner Headline",
  "subheadline": "Contextual subtitle explaining the scope",
  "color_palette": "Deep Indigo, Cyber Cyan, and Clean Slate",
  "key_metrics": [
    {"stat": "85%", "label": "Efficiency Gain", "context": "Compared to manual workflows"},
    {"stat": "3.5x", "label": "Speed Multiplier", "context": "Across cross-functional teams"}
  ],
  "sections": [
    {
      "section_number": 1,
      "section_title": "The Challenge",
      "icon": "AlertTriangle",
      "bullet_points": ["Point 1", "Point 2"]
    },
    {
      "section_number": 2,
      "section_title": "The Strategic Solution",
      "icon": "Cpu",
      "bullet_points": ["Point 1", "Point 2"]
    }
  ],
  "footer_source": "Source data summary and attribution",
  "full_markdown": "Markdown representation of the infographic wireframe"
}
""",
        "exec_summary": """
Your JSON response must match this schema:
{
  "title": "Executive Briefing",
  "briefing_date": "Current Date",
  "overview": "Crisp 150-250 word high-level summary for C-Suite",
  "key_findings": [
    "Strategic insight 1 with business impact",
    "Strategic insight 2 with resource implications"
  ],
  "risk_assessment": "Primary risks, bottlenecks, or regulatory considerations",
  "recommended_decisions": [
    "Action item 1 for senior leadership",
    "Action item 2 for resource allocation"
  ],
  "full_markdown": "Clean C-Suite formatted briefing memo in Markdown"
}
""",
        "presentation": """
Your JSON response must match this schema:
{
  "deck_title": "Presentation Deck Title",
  "subtitle": "Strategic overview deck",
  "total_slides": 5,
  "slides": [
    {
      "slide_number": 1,
      "slide_type": "Title Slide",
      "title": "Opening Title",
      "bullets": ["Subtitle or Author credit"],
      "speaker_notes": "Welcome the audience and introduce the presentation topic.",
      "visual_prompt": "Minimalist modern gradient background with clean typography"
    },
    {
      "slide_number": 2,
      "slide_type": "Content",
      "title": "Problem Statement",
      "bullets": ["Challenge 1 in current landscape", "Challenge 2", "Impact on productivity"],
      "speaker_notes": "Emphasize why this problem requires urgent attention.",
      "visual_prompt": "Split comparison diagram of current bottlenecks"
    }
  ],
  "full_markdown": "Slide-by-slide markdown with speaker notes"
}
"""
    }

    schema = format_specific_schemas.get(output_type, format_specific_schemas["linkedin"])
    return base_instructions + "\n" + schema
