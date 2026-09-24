"""
Autonomous Multi-Channel GenAI Content Transformation Engine
Final Year Engineering Project — Streamlit Cloud Web Application
"""

import os
import sys
import time
import json
from typing import Dict, Any, List

# Ensure backend modules are discoverable
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

import streamlit as st

# Import core backend services
try:
    from app.services.llm_engine import generate_transformation
    from app.services.extractor import extract_from_bytes
except ImportError as e:
    st.error(f"Error loading backend services: {e}")
    st.stop()

# ---------------------------------------------------------
# Page Configuration
# ---------------------------------------------------------
st.set_page_config(
    page_title="GenAI Content Transformation Engine",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ---------------------------------------------------------
# Custom Styling (Dark-Themed Modern Enterprise Design)
# ---------------------------------------------------------
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    .main-header {
        background: linear-gradient(135deg, rgba(20, 24, 39, 0.95), rgba(30, 41, 59, 0.95));
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 24px 32px;
        margin-bottom: 24px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    
    .badge-primary {
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        display: inline-block;
        margin-right: 8px;
    }

    .badge-secondary {
        background: rgba(16, 185, 129, 0.2);
        color: #34d399;
        border: 1px solid rgba(52, 211, 153, 0.3);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        display: inline-block;
    }
    
    .metric-card {
        background: rgba(30, 41, 59, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 16px;
        text-align: center;
    }
    
    .format-card {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
        margin-top: 12px;
    }
    
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
    }
    
    .stTabs [data-baseweb="tab"] {
        border-radius: 8px;
        padding: 8px 16px;
        font-weight: 600;
    }
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Session State Initialization
# ---------------------------------------------------------
if "transformation_results" not in st.session_state:
    st.session_state["transformation_results"] = None
if "source_title" not in st.session_state:
    st.session_state["source_title"] = ""
if "source_text" not in st.session_state:
    st.session_state["source_text"] = ""
if "last_duration" not in st.session_state:
    st.session_state["last_duration"] = 0.0
if "history" not in st.session_state:
    st.session_state["history"] = []

# Sample Presets
SAMPLE_PRESETS = {
    "CrowdStrike Global Outage Analysis": {
        "title": "CrowdStrike Global IT Kernel Incident Advisory",
        "text": """On July 19, 2024, CrowdStrike released a sensor configuration update for Windows systems that triggered a widespread logic error in Channel File 291, resulting in system crashes (Blue Screen of Death) across an estimated 8.5 million enterprise Windows machines worldwide. The incident severely impacted airlines, healthcare providers, banking institutions, and emergency services. Root cause analysis revealed an out-of-bounds memory read in the Content Validator logic. Remediation required manual booting into Safe Mode and deleting the offending configuration file. Organizations are advised to enforce phased deployment rings, kernel-space isolation, and rigorous synthetic validation."""
    },
    "Autonomous Multi-Agent AI Breakthrough": {
        "title": "Breakthrough in Multi-Agent Autonomous Generative Workflows",
        "text": """Recent research in collaborative artificial intelligence introduces autonomous multi-agent frameworks capable of self-refinement and dynamic specialization. By partitioning complex software and analytical operations across dedicated planner, executor, and critique agent personas, overall system accuracy increased by 42% over monolithic foundational models. Furthermore, contextual memory compression reduced latency by 65%, enabling real-time edge processing for enterprise applications."""
    }
}

# ---------------------------------------------------------
# Sidebar Configuration
# ---------------------------------------------------------
with st.sidebar:
    st.image("https://img.icons8.com/fluent/96/000000/artificial-intelligence.png", width=64)
    st.title("Control Center")
    st.caption("Engineered for Final Year B.Tech / BE Academic Defense")
    
    st.markdown("---")
    st.subheader("⚙️ AI Engine Settings")
    
    api_key_input = st.text_input(
        "Google Gemini API Key",
        type="password",
        help="Optional: Leave blank to use the built-in Intelligent Offline Demo Synthesizer."
    )
    
    if api_key_input:
        st.success("🟢 Live Gemini API Mode Active")
    else:
        st.info("💡 Offline Academic Demo Mode Active (No API Key Required)")

    model_choice = st.selectbox(
        "Model Orchestration",
        ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"],
        index=0
    )

    st.markdown("---")
    st.subheader("🎯 Transformation Parameters")
    
    tone_choice = st.selectbox(
        "Voice & Tone",
        ["authoritative", "professional", "engaging", "casual", "persuasive", "academic"],
        index=0
    )
    
    audience_choice = st.selectbox(
        "Target Audience",
        ["c_suite", "technical", "general", "marketers", "students"],
        index=0
    )
    
    language_choice = st.selectbox(
        "Deliverable Language",
        ["English", "Hindi", "Spanish", "French", "German"],
        index=0
    )
    
    detail_choice = st.select_slider(
        "Detail Level",
        options=["concise", "standard", "in_depth"],
        value="standard"
    )

    st.markdown("---")
    st.caption("Developed with ❤️ | Final Year Project")

# ---------------------------------------------------------
# Hero Banner
# ---------------------------------------------------------
st.markdown("""
<div class="main-header">
    <div style="margin-bottom: 8px;">
        <span class="badge-primary">⚡ GenAI Multi-Channel Platform</span>
        <span class="badge-secondary">Dual Online/Offline Synthesizer</span>
    </div>
    <h1 style="color: white; margin: 0; font-size: 2.2rem; font-weight: 800;">
        Autonomous Multi-Format Content Transformation Engine
    </h1>
    <p style="color: #94a3b8; margin-top: 8px; font-size: 1rem; line-height: 1.5;">
        Transform technical reports, research papers, or executive memos into 7 publication-ready deliverables simultaneously — 
        featuring executive summaries, LinkedIn leadership posts, Twitter threads, slide presentations, and video storyboards.
    </p>
</div>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Input Section (Tabs: Direct Text / Presets vs File Upload)
# ---------------------------------------------------------
tab_text, tab_upload = st.tabs(["✍️ Text Input & Presets", "📄 Document Upload (PDF / DOCX / TXT)"])

with tab_text:
    col_preset, col_clear = st.columns([4, 1])
    with col_preset:
        preset_name = st.selectbox("Select Sample Preset (Instant Demo):", ["-- Choose a Preset --"] + list(SAMPLE_PRESETS.keys()))
        if preset_name != "-- Choose a Preset --":
            st.session_state["source_title"] = SAMPLE_PRESETS[preset_name]["title"]
            st.session_state["source_text"] = SAMPLE_PRESETS[preset_name]["text"]
            
    with col_clear:
        if st.button("🧹 Clear Input", use_container_width=True):
            st.session_state["source_title"] = ""
            st.session_state["source_text"] = ""
            st.rerun()

    input_title = st.text_input(
        "Source Content Title",
        value=st.session_state["source_title"],
        placeholder="e.g., Q3 Cloud Migration Security & Cost Optimization Report"
    )
    
    input_text = st.text_area(
        "Raw Source Content",
        value=st.session_state["source_text"],
        height=220,
        placeholder="Paste your report, article, meeting notes, or technical findings here..."
    )

with tab_upload:
    uploaded_file = st.file_uploader(
        "Upload Source File (PDF, DOCX, TXT, Markdown)",
        type=["pdf", "docx", "txt", "md"],
        help="Extracts plain text directly for multi-channel synthesis."
    )
    
    if uploaded_file is not None:
        with st.spinner("Extracting clean text from uploaded document..."):
            file_bytes = uploaded_file.read()
            extracted_text, metadata = extract_from_bytes(file_bytes, uploaded_file.name)
            
            if extracted_text:
                st.success(f"Extracted {metadata.get('word_count', 0):,} words from `{uploaded_file.name}` ({metadata.get('format', '').upper()})")
                input_title = uploaded_file.name.rsplit('.', 1)[0].replace('_', ' ').replace('-', ' ').title()
                input_text = extracted_text
                st.session_state["source_title"] = input_title
                st.session_state["source_text"] = input_text
            else:
                st.error("Failed to extract readable text from document.")

# Live stats
words = len(input_text.split()) if input_text else 0
chars = len(input_text) if input_text else 0
st.caption(f"📊 Content Size: **{words:,} words** | **{chars:,} characters**")

# ---------------------------------------------------------
# Target Channels Selection
# ---------------------------------------------------------
st.markdown("### 🎯 Select Target Deliverables")

FORMAT_CONFIG = {
    "linkedin": {"name": "LinkedIn Thought Leadership", "icon": "💼", "default": True},
    "twitter": {"name": "Twitter / X Thread (Numbered)", "icon": "🐦", "default": True},
    "exec_summary": {"name": "Executive Summary & Brief", "icon": "📋", "default": True},
    "presentation": {"name": "Presentation Slide Deck", "icon": "📽️", "default": True},
    "video_script": {"name": "Video Storyboard Script", "icon": "🎬", "default": True},
    "infographic": {"name": "Infographic Visual Blueprint", "icon": "📊", "default": True},
    "advisory": {"name": "Security & Incident Advisory", "icon": "🚨", "default": True},
}

col_sel_all, col_desel_all, _ = st.columns([1.5, 1.5, 7])
with col_sel_all:
    if st.button("✅ Select All Formats", use_container_width=True):
        for k in FORMAT_CONFIG:
            st.session_state[f"fmt_{k}"] = True
        st.rerun()
with col_desel_all:
    if st.button("❌ Deselect All", use_container_width=True):
        for k in FORMAT_CONFIG:
            st.session_state[f"fmt_{k}"] = False
        st.rerun()

cols = st.columns(4)
selected_formats = []
for i, (fmt_key, fmt_meta) in enumerate(FORMAT_CONFIG.items()):
    default_val = st.session_state.get(f"fmt_{fmt_key}", fmt_meta["default"])
    with cols[i % 4]:
        checked = st.checkbox(
            f"{fmt_meta['icon']} {fmt_meta['name']}",
            value=default_val,
            key=f"fmt_{fmt_key}"
        )
        if checked:
            selected_formats.append(fmt_key)

st.markdown("<br>", unsafe_allow_html=True)

# ---------------------------------------------------------
# Transformation Trigger
# ---------------------------------------------------------
col_action, col_info = st.columns([2, 5])
with col_action:
    btn_transform = st.button("🚀 Transform Content Across Channels", type="primary", use_container_width=True)

if btn_transform:
    if not input_text or not input_text.strip():
        st.warning("⚠️ Please provide source content or choose a sample preset first.")
    elif not selected_formats:
        st.warning("⚠️ Please select at least one target deliverable format.")
    else:
        results = {}
        progress_bar = st.progress(0)
        status_text = st.empty()
        start_time = time.time()
        
        total = len(selected_formats)
        for idx, fmt in enumerate(selected_formats):
            status_text.text(f"Synthesizing {FORMAT_CONFIG[fmt]['icon']} {FORMAT_CONFIG[fmt]['name']}...")
            
            output = generate_transformation(
                output_type=fmt,
                source_text=input_text,
                source_title=input_title or "Untitled Source Content",
                tone=tone_choice,
                target_audience=audience_choice,
                language=language_choice,
                detail_level=detail_choice,
                api_key_override=api_key_input if api_key_input else None,
                model_choice=model_choice
            )
            results[fmt] = output
            progress_bar.progress((idx + 1) / total)
            
        duration = round(time.time() - start_time, 2)
        status_text.empty()
        progress_bar.empty()
        
        st.session_state["transformation_results"] = results
        st.session_state["last_duration"] = duration
        st.session_state["active_title"] = input_title or "Source Content"
        st.success(f"🎉 Generated {len(results)} enterprise deliverables in **{duration}s**!")

# ---------------------------------------------------------
# Results Studio & Multi-Channel Deliverable Viewers
# ---------------------------------------------------------
if st.session_state["transformation_results"]:
    results = st.session_state["transformation_results"]
    duration = st.session_state["last_duration"]
    
    st.markdown("---")
    st.subheader(f"📑 Deliverables Studio: {st.session_state.get('active_title', 'Synthesized Output')}")
    
    # Metrics Row
    m1, m2, m3, m4 = st.columns(4)
    with m1:
        st.metric("Deliverables Generated", f"{len(results)} Channels")
    with m2:
        total_out_words = sum(len(res.get("full_markdown", "").split()) for res in results.values())
        st.metric("Total Output Words", f"{total_out_words:,} words")
    with m3:
        st.metric("Generation Latency", f"{duration}s")
    with m4:
        engine_mode = "Gemini 2.5 Flash" if api_key_input else "Context-Aware Synthesizer"
        st.metric("AI Engine Active", engine_mode)

    # Master Download Buttons
    col_dl_md, col_dl_json = st.columns([1, 1])
    with col_dl_md:
        all_markdown = f"# Multi-Channel Transformation Package: {st.session_state.get('active_title', '')}\n\n"
        all_markdown += f"*Generated via GenAI Transformation Engine on {time.strftime('%Y-%m-%d %H:%M:%S')}*\n\n---\n\n"
        for fmt, data in results.items():
            all_markdown += f"\n\n# --- CHANNEL: {FORMAT_CONFIG[fmt]['name'].upper()} ---\n\n"
            all_markdown += data.get("full_markdown", "") + "\n\n---\n"
            
        st.download_button(
            label="📥 Download All Deliverables (.MD)",
            data=all_markdown,
            file_name=f"all_deliverables_{int(time.time())}.md",
            mime="text/markdown",
            use_container_width=True
        )
    with col_dl_json:
        st.download_button(
            label="📦 Export Structured JSON Package",
            data=json.dumps(results, indent=2),
            file_name=f"deliverables_{int(time.time())}.json",
            mime="application/json",
            use_container_width=True
        )

    # Channel Tabs
    tab_keys = list(results.keys())
    tab_labels = [f"{FORMAT_CONFIG[k]['icon']} {FORMAT_CONFIG[k]['name']}" for k in tab_keys]
    result_tabs = st.tabs(tab_labels)
    
    for i, fmt in enumerate(tab_keys):
        output_data = results[fmt]
        with result_tabs[i]:
            title = output_data.get("title", FORMAT_CONFIG[fmt]["name"])
            full_md = output_data.get("full_markdown", "")
            
            # Format-specific rich view
            if fmt == "presentation" and "slides" in output_data:
                st.markdown(f"### 📽️ {output_data.get('deck_title', title)}")
                st.caption(f"Sub-title: {output_data.get('subtitle', '')} | Total Slides: {len(output_data['slides'])}")
                
                # Interactive Slide Carousel
                for s in output_data["slides"]:
                    with st.expander(f"Slide {s.get('slide_number')}: {s.get('title')} ({s.get('slide_type')})", expanded=True):
                        st.markdown(f"#### {s.get('title')}")
                        for b in s.get("bullets", []):
                            st.markdown(f"- {b}")
                        if s.get("speaker_notes"):
                            st.info(f"🗣️ **Speaker Notes:** {s['speaker_notes']}")
                        if s.get("visual_prompt"):
                            st.caption(f"🎨 **Visual Direction:** `{s['visual_prompt']}`")
            
            elif fmt == "twitter" and "tweets" in output_data:
                st.markdown(f"### 🐦 {title}")
                st.caption(f"Thread Length: {output_data.get('thread_length', len(output_data['tweets']))} tweets")
                for tw in output_data["tweets"]:
                    st.markdown(f"""
                    <div style="background: rgba(30, 41, 59, 0.4); border-left: 4px solid #38bdf8; border-radius: 8px; padding: 14px; margin-bottom: 12px;">
                        <span style="font-weight: 700; color: #38bdf8;">Tweet {tw.get('tweet_number')} / {output_data.get('thread_length', len(output_data['tweets']))}</span>
                        <p style="margin-top: 8px; font-size: 1rem; color: #f1f5f9;">{tw.get('content')}</p>
                    </div>
                    """, unsafe_allow_html=True)
                    
            elif fmt == "linkedin":
                st.markdown(f"### 💼 {title}")
                st.markdown(full_md)
                if "hashtags" in output_data:
                    tags = " ".join(f"#{tag.replace('#', '')}" for tag in output_data["hashtags"])
                    st.code(tags, language="text")
                    
            else:
                st.markdown(f"### {FORMAT_CONFIG[fmt]['icon']} {title}")
                st.markdown(full_md)

            st.download_button(
                label=f"💾 Download {FORMAT_CONFIG[fmt]['name']} (.MD)",
                data=full_md,
                file_name=f"{fmt}_{int(time.time())}.md",
                mime="text/markdown",
                key=f"dl_{fmt}"
            )

# ---------------------------------------------------------
# Academic Defense & Viva Quick Reference (Bottom Expander)
# ---------------------------------------------------------
st.markdown("---")
with st.expander("🎓 Final Year Project Architecture & Viva Defense Reference", expanded=False):
    st.markdown("""
    ### System Architecture & Technical Highlights
    - **Dual AI Engine Execution:** Supports state-of-the-art **Google Gemini 2.5 Flash** with low-latency JSON Mode structured output. For offline / no-API-key college viva demos, an **Intelligent Context-Aware Synthesizer** deterministically parses metrics, key phrases, and arguments to generate realistic deliverables.
    - **Multi-Format Transformation Channels:** Produces 7 distinct modalities with customized prompts enforcing specialized formatting (e.g. numbered tweet threads, presentation slides with speaker notes, executive summaries with action items, and technical advisories with CVSS severity scoring).
    - **Document Parsing Pipeline:** Integrated binary file extraction (`pypdf`, `python-docx`, plain text) with character normalization and whitespace cleaning.
    - **Deployment:** Zero-friction cloud deployment on **Streamlit Community Cloud**, with full Docker/WSGI FastAPI backend parity.
    """)
