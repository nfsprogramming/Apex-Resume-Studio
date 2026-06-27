# 🚀 Apex Resume Studio (formerly Smart Resume Analyzer)

An Enterprise-Grade AI Career Platform that helps you land your dream job using advanced Job Description analysis, Resume Rewriting, and ATS simulations. 

![React](https://img.shields.io/badge/React-18.2+-61DAFB.svg?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF.svg?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?logo=python&logoColor=white)

## 🌟 Features

This application includes highly advanced tools organized into a modern, lightning-fast dashboard:

### 🧠 Core Analysis
*   **Resume Analysis**: Deep insights into keywords, structure, and action verbs.
*   **JD Auto-Fetcher**: Scrape job descriptions directly from LinkedIn/Indeed URLs.
*   **Resume Optimizer**: AI-powered rewriting of your summary and bullet points.

### 🎓 Learning & Prep
*   **Learning Path**: Auto-generated course roadmap (YouTube/Coursera) for missing skills.
*   **Interview Prep**: Generates role-specific technical & behavioral questions based on the STAR method.
*   **Project Recommender**: Suggests portfolio projects to fill skill gaps.

### 💼 Platform Integrations
*   **GitHub Portfolio**: Analyzes your GitHub profile to showcase your coding stats.
*   **LinkedIn Sync**: Compares your resume against your LinkedIn PDF export.
*   **Student Coach**: Specialized mode for freshers/interns focusing on potential over experience.

### ⚙️ Advanced Tools
*   **Enterprise ATS Simulator**: Simulates screening algorithms of FAANG companies (Google, Amazon, Meta, etc.) providing exact keyword matches and scoring metrics.
*   **Resume Vault**: Save and manage different versions of your tailored resumes.

---

## 🛠️ Installation & Setup

This project uses a decoupled architecture with a Python/FastAPI backend and a React/Vite frontend.

### 1. Setup the Backend (FastAPI)
1. Navigate to the root directory.
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Rename `.env.example` to `.env` and add your required API keys (e.g., `NVIDIA_API_KEY`).
4. Start the backend server:
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```

### 2. Setup the Frontend (React + Vite)
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The app will open in your browser at `http://localhost:5173`.

## 📂 Project Structure

*   `frontend/`: React application built with Vite and Tailwind CSS.
    *   `src/pages/`: Individual UI tools (JD Fetcher, Rewriter, ATS Simulator, etc.).
    *   `src/components/`: Reusable UI components (Sidebar, Navbar, Layout).
*   `backend/`: FastAPI server providing endpoints for the UI.
    *   `main.py`: Core API router.
*   `modules/`: Core Python AI logic and analysis engines.

## 🎨 UI & Design

The app features a **Premium Cyber-Themed Design System** utilizing:
*   Tailwind CSS for highly responsive layout and styling.
*   Dark Mode tailored for long productivity sessions with deep "midnight" backgrounds.
*   Glassmorphism components, glowing borders, and stunning gradient action buttons.

---
**Author**: NFS Photographer
**Version**: 3.0 (React/FastAPI Rebuild)
