# 🚀 Gen AI Platform for Automated Content Transformation
### Final Year Project — Content Repurposing Engine (1 Source In → 7 Formats Out)

Transform articles, research papers, incident reports, PDFs, and DOCX documents into **7 high-impact, channel-tailored deliverables** in seconds using Generative AI.

---

## 🌟 Key Features

- **7 Tailored Output Formats in 1-Click**:
  - 👔 **LinkedIn Post**: High-engagement thought leadership with hooks, takeaways, and hashtags.
  - 🐦 **Twitter/X Thread**: Numbered thread (1/N) with strict character counters (<280 chars) and recap CTA.
  - 🛡️ **Operational / Threat Advisory**: Severity ranking (Critical/High/Medium), scope, impact analysis, and mitigation steps.
  - 🎬 **Video Script & Storyboard**: Scene-by-scene timing, camera/B-roll directions, voiceover script, and captions.
  - 📊 **Infographic Blueprint**: Headline, 4 metric stat callouts, and 4 modular section cards.
  - 💼 **Executive Summary**: 200-word C-Suite briefing memo with strategic risks and decisions.
  - 📽️ **Presentation Deck**: Slide-by-slide structure with bullet points, speaker notes, and downloadable `.pptx`.
- **Multi-Source Ingestion**:
  - Raw Text & Markdown input
  - 1-Click Academic & Enterprise Presets (Cyber Incident, AI Product Launch, Quantum Research)
  - Document File Upload (PDF via `pypdf`, DOCX via `python-docx`, TXT)
- **Dual AI Engine**:
  - **Online**: Google Gemini API (`gemini-2.5-flash` / `gemini-1.5-flash`)
  - **Intelligent Offline Synthesizer**: Fully operational offline mode extracting real sentences and stats for fail-safe viva evaluations!
- **Rich Interactive Viewers**: Dedicated visual cards, live word counters, copy buttons, and export options.
- **Enterprise Exporters**: Download as Markdown (`.md`), Plain Text (`.txt`), HTML report (`.html`), JSON (`.json`), or real PowerPoint presentation (`.pptx`)!
- **Analytics & History**: Database-backed job logging, latency metrics, and format distribution charts.

---

## 📁 Repository Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application with CORS and lifespan
│   │   ├── config.py            # Environment configuration
│   │   ├── database.py          # SQLAlchemy SQLite / Postgres engine
│   │   ├── models.py            # Database tables (Jobs, Outputs, Analytics)
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── routers/             # API Endpoints (/transform, /upload, /history, /analytics)
│   │   └── services/
│   │       ├── extractor.py     # PDF & DOCX text parsing
│   │       ├── prompts.py       # 7 specialized prompt templates with JSON schemas
│   │       ├── llm_engine.py    # Gemini API + Offline Synthesizer
│   │       └── exporter.py      # Markdown, HTML, and PPTX slide deck builders
│   ├── tests/
│   │   └── test_api.py          # Comprehensive pytest suite
│   ├── requirements.txt         # Python dependencies
│   ├── run.py                   # Uvicorn launcher
│   └── .env.example             # Example environment variables
├── frontend/
│   ├── src/
│   │   ├── components/          # React components (Navbar, Inputs, Format viewers, Modals)
│   │   ├── services/api.ts      # Axios/Fetch API client
│   │   ├── types/index.ts       # TypeScript type definitions
│   │   ├── App.tsx              # Main dashboard application
│   │   └── main.tsx             # React entry point
│   ├── package.json
│   └── vite.config.ts
├── docs/
│   ├── FINAL_YEAR_PROJECT_REPORT.md  # 6-Chapter Academic Project Report
│   ├── ARCHITECTURE_DIAGRAMS.md      # 3-Tier and sequence diagrams
│   └── VIVA_QUESTIONS_AND_ANSWERS.md # Top 25 Viva exam Q&A for external examiners
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Backend Setup (Python)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI backend
python run.py
```
Backend will start on: **http://localhost:8000**  
Interactive Swagger API Docs: **http://localhost:8000/docs**

> **Note on API Keys:**  
> The backend works **completely out-of-the-box offline**! If you wish to use live Google Gemini API, simply create a `.env` file in the `backend/` folder:
> ```env
> GEMINI_API_KEY=your_gemini_api_key_here
> ```

---

### 2. Frontend Setup (React + TypeScript)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend will be available on: **http://localhost:5173**

---

### 3. Running Backend Tests

```bash
cd backend
pytest tests/test_api.py -v
```

---

## 🎓 Viva & Presentation Cheatsheet
For college presentation and project evaluation, check out:
- [Architecture Diagrams](file:///c:/Users/Asus/Desktop/Final%20Year%20Project%20Ideas/New%20folder/docs/ARCHITECTURE_DIAGRAMS.md)
- [Top 25 Viva Questions & Answers](file:///c:/Users/Asus/Desktop/Final%20Year%20Project%20Ideas/New%20folder/docs/VIVA_QUESTIONS_AND_ANSWERS.md)
- [Full Academic Project Report Template](file:///c:/Users/Asus/Desktop/Final%20Year%20Project%20Ideas/New%20folder/docs/FINAL_YEAR_PROJECT_REPORT.md)
