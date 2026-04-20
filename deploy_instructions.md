# Deployment Guide: Resume Intelligence Platform

This guide will help you deploy your full-stack application for free using **Render** (for the backends) and **Vercel/Netlify** (for the frontend).

## 1. Prepare Your Backends (Render.com)

Your project has two backend services that both need to be deployed.

### A. Analysis Service (`backend-analysis`)
This service handles AI-powered resume intelligence and requires your Groq API key.
1.  **Repository**: Ensure your code is pushed to a GitHub repository.
2.  **Create Web Service**: In the Render dashboard, click **New +** > **Web Service**.
3.  **Connectivity**: Select your repository.
4.  **Configuration**:
    *   **Name**: `resume-analysis-service`
    *   **Root Directory**: `backend-analysis`
    *   **Runtime**: `Python 3`
    *   **Build Command**: `pip install -r requirements.txt && python -m spacy download en_core_web_sm`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
5.  **Environment Variables**: Add the following:
    *   `GROQ_API_KEY`: *(Your real Groq API key — the one from GROQ_API_KEY_ANALYZER in your .env)*
    *   `USE_LLM`: `true`
    *   `LLM_PROVIDER`: `groq`
    *   `LLM_MODEL`: `llama-3.3-70b-versatile`

### B. Export Service (`backend`)
This service handles PDF and DOCX generation.
1.  **Create Web Service**: Click **New +** > **Web Service**.
2.  **Root Directory**: `backend`
3.  **Configuration**:
    *   **Name**: `resume-export-service`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
    *   *(Note: No API keys are needed for this service)*

---

## 2. Deploy Your Frontend (Vercel or Netlify)

The frontend is a React/Vite app. Vercel is recommended for the best experience.

1.  **Connect GitHub**: Sign in to [Vercel](https://vercel.com) and import your repository.
2.  **Configuration**:
    *   **Root Directory**: `frontend`
    *   **Framework Preset**: `Vite`
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
3.  **Environment Variables (CRITICAL)**:
    You must tell the frontend where your new deployed backends are. Add these:
    *   `VITE_ANALYZE_API_URL`: *(Your Render URL for backend-analysis, e.g., `https://resume-analysis-service.onrender.com`)*
    *   `VITE_API_URL`: *(Your Render URL for backend, e.g., `https://resume-export-service.onrender.com`)*

---

## 3. Post-Deployment Checklist

> [!IMPORTANT]
> **Wait for the Backends**: Render's free tier "sleeps" after 15 minutes of inactivity. The first time you use the app after a break, it might take ~30 seconds for the backend to "wake up" and respond.

> [!TIP]
> **Testing**: Once both are deployed, open your frontend URL and try to "Analyze Profile". If it works, your deployment is successful!

---

## 4. Summary of URLs
| Service | Local URL | Deployment Platform |
| :--- | :--- | :--- |
| **Frontend** | `http://localhost:5173` | Vercel / Netlify |
| **Analysis API** | `http://localhost:8000` | Render |
| **Export API** | `http://localhost:8001` | Render |
