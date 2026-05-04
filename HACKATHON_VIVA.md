# 🏆 Hackathon Viva & Technical Q&A Guide

Welcome to the **HireWell AI** technical briefing. This document is specifically curated for hackathon judges and invigilators to understand the "Why" and "How" behind our platform.

---

## 🚀 The Elevator Pitch
**HireWell AI** is an intelligent recruitment ecosystem that solves the "Resume Overload" problem. While traditional ATS systems use simple keyword filters, HireWell uses **Semantic Vector Embeddings** to understand candidate experience contextually. We merge AI-driven screening with technical verification to find the 1% of talent in minutes, not weeks.

---

## 🛠 Technical Architecture (The Stack)

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | High-performance Dashboard & UI. |
| **Backend** | FastAPI (Python) | Asynchronous API for rapid AI inference. |
| **Database** | SQLAlchemy + SQLite | Secure data persistence and ORM. |
| **Styling** | Tailwind CSS | Utility-first, responsive, and dark-mode ready design. |
| **Intelligence** | Semantic Embeddings | Text-to-Vector conversion for "meaning-based" matching. |

---

## 🧠 Core Algorithms & Logic

### 1. Weighted Scoring Algorithm (100 pts)
We don't rely on a single metric. The final score is a composite:
- **Skill Match (40%)**: Uses a **Knowledge Graph** to infer related skills.
- **Experience (25%)**: Matches tenure against job requirements.
- **Project Relevance (20%)**: Uses **Cosine Similarity** of vector embeddings.
- **Evidence Quality (10%)**: Scans for specific snippets of proof in the resume.
- **Education (5%)**: Academic alignment.

### 2. Hallucination & Inflation Detection
The system runs heuristics to flag "Skill Inflation" (e.g., listing 50+ skills with 0 projects) and "Timeline Overlap" to ensure resume integrity.

---

## 🎤 Top Hackathon Q&A (Judge's Favorites)

### Q: Why use FastAPI instead of the more common Django or Flask?
**A:** **Concurrency.** Hackathons require real-time demos. FastAPI is built on ASGI, making it capable of handling hundreds of resume uploads and AI score computations simultaneously without blocking the main thread.

### Q: How do you solve for AI Bias (Gender, Race, Age)?
**A:** We implement **Blind Screening**. The AI normalization layer can strip PII (Personally Identifiable Information) before the scoring engine runs. Additionally, our **Explainable AI** shows exactly which sentences led to a score, allowing recruiters to override bias.

### Q: What makes this different from LinkedIn or standard ATS?
**A:** Standard ATS are "Keyword Filters." If you write "ReactJS" and the JD says "React," they might reject you. HireWell uses **Semantic Similarity**—it understands they are the same thing. We also integrate technical tasks directly into the workflow.

### Q: How do you handle "Keyword Stuffers"?
**A:** Our **Evidence Quality** metric looks for context. Keywords must be backed by project descriptions to count towards the score.

### Q: How do you handle multi-column or complex resume layouts?
**A:** Currently, our parser handles basic text flow. In a production setting, we would move to **Layout-Aware OCR** (like Amazon Textract) which can identify columns and blocks of text to maintain logical order.

### Q: What happens if the Backend is unreachable?
**A:** We built a **Simulation Mode (MockDB)**. The frontend can detect server failures and switch to high-fidelity simulated data, ensuring the dashboard remains interactive for demos even in "offline" scenarios.

---

## ⚙️ Technical Challenges & Solutions

### Challenge: The "Cold Start" Problem
**Solution:** How do we score candidates without historical data? We use an industry-standard knowledge graph and semantic similarity to baseline scores against job descriptions immediately.

### Challenge: Responsive Data Streams
**Solution:** AI scoring can be slow. We use asynchronous FastAPI workers and a polished React UI with "Pending" states to keep the recruiter experience fluid while background tasks run.

---

## 🎤 Strategy & Monetization

### Q: What is the monetization strategy?
**A:** We operate on a **SaaS Tiered Model**:
1. **Startup (Free)**: 50 resumes/month.
2. **Pro ($99/mo)**: Unlimited resumes + Technical Library.
3. **Enterprise (Custom)**: On-premise deployment with custom AI training for high-security firms.

---

## 🖥 VS Code Setup Guide (From Basics)
1. **Open Project**: Launch VS Code and `File > Open Folder`, select the root "Hire well" directory.
2. **Backend Setup**:
   - `cd backend`
   - `python -m venv venv`
   - `.\venv\Scripts\activate`
   - `pip install -r requirements.txt`
   - `uvicorn app.main:app --reload`
3. **Frontend Setup**:
   - `cd frontend-app`
   - `npm install`
   - `npm run dev`

---

## 📂 Detailed Folder Roles

### Backend (`/backend/app`)
- **/api**: Handles URL routing and incoming requests.
- **/services**: The AI Engine. Contains logic for semantic matching and scoring.
- **/db**: Database schema and candidate models.
- **/schemas**: Pydantic models for data validation.

### Frontend (`/frontend-app/src`)
- **/components**: Reusable UI elements (Sidebars, Cards, Modals).
- **/pages**: Main dashboard screens (Shortlist, Training, Settings).
- **/services**: API connection functions.
- **/context**: Global state (User auth, selected jobs).

---

## 🗺 Future Roadmap
- **Phase 1**: OCR (Optical Character Recognition) for scanned image resumes.
- **Phase 2**: Multi-lingual support (Hindi, Spanish, etc.).
- **Phase 3**: Blockchain-based certificate verification to eliminate resume fraud.

---

*HireWell AI - Empowering recruiters to find the 1% through data-driven intelligence.*
