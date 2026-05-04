# HireWell AI: Full-Stack Recruitment Ecosystem

HireWell is a state-of-the-art, AI-driven recruitment platform designed to transform unstructured resumes into actionable, ranked shortlists. This repository contains the unified codebase for both the **React/Vite Frontend** and the **FastAPI Backend**.

![HireWell Banner](https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop)

## 📁 Project Structure

```text
Hire well/
├── frontend-app/        # React + Vite + Tailwind CSS (UI/UX Layer)
├── backend/             # FastAPI + SQLAlchemy (Compute & API Layer)
├── README.md            # Unified Project Documentation
├── HACKATHON_VIVA.md    # 🏆 Specialized Hackathon/Viva Guide (Q&A)
└── .gitignore           # Global exclusion rules
```

## 🚀 Full-Stack Setup Guide

To run the complete HireWell ecosystem on your local machine, follow these steps:

### 1. Start the Backend (API & Engine)
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Install deps
pip install -r requirements.txt
# Run server
uvicorn app.main:app --reload --port 8000
```

### 2. Start the Frontend (Dashboard & UI)
```bash
cd frontend-app
npm install
npm run dev
```

The platform will be accessible at [http://localhost:5173](http://localhost:5173).

---

## 💎 Key Modules

### 🏛 AI Semantic Matching
Eliminate manual screening. Our backend extracts skills, experience, and domain knowledge from **1-2 page PDF resumes** and matches them against your Job Description with clinical precision.

### 🧪 Technical Verification
Move beyond the resume. Assign technical tasks (React, SQL, System Design) directly from the Shortlist Dashboard and track auto-evaluated scores.

### 🎓 Recruiter Training
Upskill your talent acquisition team with integrated learning modules, XP tracking, and a global leaderboard to foster healthy competition and ethical hiring.

### 📊 Explainable Analytics
Every candidate score is backed by a dimension breakdown (Technical, Growth, Culture, Alignment) to ensure transparency in every hiring decision.

## 🛡 System Policies
*   **Resume Compliance**: The system strictly enforces a **1-2 page PDF-only** policy for resumes to ensure concise and relevant applications.
*   **Simulation Mode**: The frontend includes a high-fidelity **MockDB** fallback, allowing the platform to be demoed or tested even when the backend is unreachable.

## 🛠 Tech Stack Summary
*   **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Framer Motion.
*   **Backend**: Python, FastAPI, Pydantic, SQLAlchemy, Alembic.
*   **Intelligence**: Semantic Vector Matching, Regex-based Parsing, Composite Scoring Algorithms.

---
---
*Empowering recruiters to find the 1% through data-driven intelligence.*

## 🌟 Latest Production Updates (May 4, 2026)
*   **Role-Specific AI Scoring**: Specialized analysis for **Senior UX Designer** positions (Figma, WCAG, UX Research).
*   **Domain Alignment Engine**: Intelligent detection of role mismatches (e.g., rejecting Python devs for Design roles).
*   **Premium UI**: High-fidelity "AI Intelligence Scan" loading states and "profesnol" error handling.
*   **Deterministic Demo**: Guaranteed outcomes for sample candidates (Alex Rivers, Jordan Lee, Pat Smith).

*Last Updated: May 4, 2026 | 18:00 IST*
