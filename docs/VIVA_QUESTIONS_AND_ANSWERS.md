# Final Year Project Viva Voce — Top 25 Questions & Answers
## Project: Gen AI Platform for Automated Content Transformation

This guide contains the most probable questions external examiners and university evaluation panels ask during project defense, complete with authoritative, technically sound answers.

---

### Category 1: Project Concept & Motivation

#### Q1: What is the core problem your project solves?
**Answer:**  
In modern organizations, creating high-value content (e.g., technical whitepapers, security advisories, or research reports) requires enormous human effort. However, **repurposing** that single piece of content into multiple channel-specific deliverables—such as LinkedIn thought leadership posts, Twitter threads, executive memos, video storyboards, and slide decks—is currently a manual, fragmented, and time-consuming bottleneck.  
Our platform introduces an autonomous **Content Repurposing Engine** that ingests a single source input and deterministically synthesizes **7 tailored deliverables** in seconds while preserving strict factual accuracy.

#### Q2: Why is this not just a simple wrapper around ChatGPT?
**Answer:**  
A basic ChatGPT interface is unstructured, non-deterministic, and requires users to manually write repetitive prompts for each separate format. In contrast, our platform implements:
1. **End-to-End Orchestration**: Ingests multiple file formats (PDF, DOCX, TXT) and normalizes them.
2. **Deterministic Schema Enforcement**: Uses prompt-engineered JSON schemas ensuring every output has exact structural fields (e.g., character counts for tweets, timing cues for video scripts).
3. **Dual AI Execution Engine**: Seamlessly toggles between live frontier LLMs (Google Gemini 2.5 Flash) and an intelligent offline contextual synthesizer.
4. **Relational Data Persistence & Analytics**: Tracks processing times, word counts, format distributions, and enables instant restoration of past jobs.
5. **Real-world File Exporters**: Direct generation of Markdown, HTML, JSON, and real PowerPoint `.pptx` presentations.

---

### Category 2: Architecture & Technology Stack

#### Q3: Why did you choose FastAPI over Flask or Django?
**Answer:**  
1. **Native Asynchronous Support**: Gen AI calls and file I/O operations are I/O-bound. FastAPI's native `async/await` handling allows high-concurrency throughput without blocking the event loop.
2. **Pydantic Data Validation**: Automatic type validation and serialization reduce runtime errors.
3. **Automatic OpenAPI/Swagger Documentation**: Interactive API documentation is automatically generated at `/docs`.
4. **Speed & Lightweight Footprint**: FastAPI is built on Starlette and Uvicorn, performing significantly faster than Flask and avoiding Django's heavy monolithic overhead.

#### Q4: Why did you select React with TypeScript for the frontend?
**Answer:**  
1. **Type Safety in Academic & Enterprise Applications**: TypeScript catches data mismatch bugs at compile time, particularly important when handling complex structured JSON models across 7 diverse formats.
2. **Component Reusability**: React's modular architecture allowed us to build dedicated, isolated viewers for each format (e.g., `LinkedInViewer`, `TwitterViewer`, `VideoScriptViewer`).
3. **State Management & Interactivity**: Fast, responsive state toggles for format selection, live word counts, and instant copy/export interactions.

#### Q5: Explain the 3-tier architecture of your system.
**Answer:**  
- **Tier 1 (Presentation Layer)**: React + TypeScript + Tailwind CSS UI for user interaction, input handling, format selection, and rich previews.
- **Tier 2 (Application & AI Layer)**: FastAPI backend responsible for authentication, file extraction, prompt orchestration, calling the LLM API, and coordinating exports.
- **Tier 3 (Persistence Layer)**: SQLAlchemy ORM connected to SQLite (for zero-setup local execution) or PostgreSQL, persisting jobs, outputs, and analytics.

---

### Category 3: Generative AI & Prompt Engineering

#### Q6: How do you prevent LLM hallucinations, especially in critical outputs like Security Advisories?
**Answer:**  
We employ three strict techniques:
1. **Source Grounding**: The system prompt explicitly instructs the model: *"Ground all assertions strictly in the provided source text. Do not invent contradictory facts or speculate beyond the provided evidence."*
2. **Low Temperature Sampling**: Setting temperature between `0.2` and `0.4` reduces random token exploration and maximizes determinism.
3. **Structured JSON Schemas**: Constraining the LLM to output specific keys (e.g., `affected_systems`, `mitigation_steps`) prevents conversational fluff and hallucinations.

#### Q7: How do you enforce strict character limits for Twitter/X threads?
**Answer:**  
In the system prompt for the `twitter` format, the schema mandates individual tweet objects with text length strictly under 270 characters, along with explicit instructions: *"Ensure each tweet does not exceed 270 characters to fit Twitter's limit."* On the frontend, our `TwitterViewer` computes live character counts and visually warns if a tweet approaches the limit.

#### Q8: What LLM model is used, and how can the platform switch models?
**Answer:**  
By default, the platform is configured for **Google Gemini 2.5 Flash** due to its low latency, high context window (1M+ tokens), and cost-effectiveness. The system also supports Gemini 1.5 Flash or OpenAI GPT-4o. A model selector is available in the user interface settings, and the orchestrator layer abstracts the underlying API call.

#### Q9: What happens if there is no internet connection or the LLM API key expires during the viva demo?
**Answer:**  
We engineered an **Intelligent Offline Context-Aware Synthesizer**. If the backend detects that no API key is present or an API call fails, it automatically extracts lead sentences, key statistics, entities, and findings directly from the input text and synthesizes high-fidelity, realistic deliverables across all 7 formats. This ensures zero risk during academic evaluations.

---

### Category 4: File Processing & Data Pipeline

#### Q10: How does the system extract text from uploaded PDF and Word documents?
**Answer:**  
- For **PDFs**: We use `pypdf.PdfReader` to read page streams in memory without writing temporary files to disk, extracting page-by-page text.
- For **Word Documents (.docx)**: We use `python-docx` to iterate through document paragraphs and extract text.
- For **Plain Text & Markdown**: Handled via UTF-8/Latin-1 stream decoding.
Extracted text is then normalized through a regex-based `clean_text` routine that eliminates carriage returns, extra spaces, and redundant line breaks.

#### Q11: How is the database structured?
**Answer:**  
We have three core tables:
1. `transformation_jobs`: Stores the primary job record, source text, title, input word count, parameters (tone, audience, language), and execution duration.
2. `job_outputs`: Has a foreign key relationship to `transformation_jobs` (one-to-many), storing the output type, title, Markdown text, structured JSON payload, and word count.
3. `analytics_metrics`: Stores time-series events (jobs completed, words processed, format distribution) for the analytics dashboard.

---

### Category 5: Practical Applications & Future Scope

#### Q12: What are the primary commercial use cases for this platform?
**Answer:**  
1. **Cybersecurity & Threat Intelligence**: Rapidly converting technical CVE advisories into executive summaries for leadership and public advisories for clients.
2. **Marketing & PR**: Transforming technical whitepapers and launch blogs into viral LinkedIn posts and Twitter threads.
3. **Education & EdTech**: Converting textbook chapters or lecture notes into video scripts and presentation slide decks.

#### Q13: How can this system be expanded in future research or enterprise deployment?
**Answer:**  
1. **Multi-Agent RAG**: Adding vector retrieval (ChromaDB/Pinecone) to ground transformations against proprietary company knowledge bases.
2. **Direct Social Media Publishing**: Integrating LinkedIn and X APIs for 1-click scheduled publishing.
3. **Automated Audio/Video Synthesis**: Connecting ElevenLabs API for text-to-speech narration of the generated video scripts.
