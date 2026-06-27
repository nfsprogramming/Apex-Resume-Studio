from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
import sys
import io
import PyPDF2
from dotenv import load_dotenv

load_dotenv()

# Add the parent directory to the path to import from modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from modules.jd_fetcher import jd_fetcher
from modules.ats_emulator import ATSEmulator
from modules.skill_analyzer import skill_analyzer
from modules.resume_rewriter import resume_rewriter
from modules.project_recommender import project_recommender
from modules.course_aggregator import course_aggregator
from modules.interview_prep import interview_coach
from modules.authenticity_checker import authenticity_checker
from modules.soft_skill_analyzer import soft_skill_analyzer
from modules.heatmap_generator import heatmap_generator
from modules.github_analyzer import github_analyzer
from modules.student_mode import student_coach
from modules.linkedin_sync import linkedin_sync

ats_emulator = ATSEmulator()

app = FastAPI(title="Smart Resume Analyzer API", version="2.0.0")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow Vercel frontend to access Render backend
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JDRequest(BaseModel):
    url: str

@app.get("/api/status")
def get_status():
    has_key = bool(os.getenv("NVIDIA_API_KEY"))
    return {
        "status": "online", 
        "ai_engine": "online", 
        "database": "connected",
        "has_nim_key": has_key
    }

@app.post("/api/fetch-jd")
def fetch_jd(request: JDRequest):
    try:
        jd_text = jd_fetcher.fetch_from_url(request.url)
        if jd_text:
            return {"success": True, "text": jd_text}
        else:
            raise HTTPException(status_code=400, detail="Could not extract job description from the provided URL.")
    except Exception as e:
        # Pass the specific error message from the fetcher to the frontend
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
                
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract any text from the PDF.")
            
        # Run ATS Emulator (Defaulting to Google for generic tech screening)
        ats_results = ats_emulator.simulate_scan(text, "Google")
        
        # Run Skill Analyzer (mocking some found skills for now based on ATS results)
        found_skills = ats_results.get("found_keywords", [])
        if not found_skills:
            # Fallback mock skills if none found in basic ATS check
            mock_keywords = ["Python", "React", "JavaScript", "SQL", "Git"]
            found_skills = [k for k in mock_keywords if k.lower() in text.lower()]
            
        proficiency = skill_analyzer.analyze_proficiency(text, found_skills)
        
        return {
            "success": True,
            "filename": file.filename,
            "ats_score": ats_results.get("score", 0),
            "status": ats_results.get("status", "Unknown"),
            "feedback": ats_results.get("feedback", []),
            "length_status": ats_results.get("length_status", "Unknown"),
            "found_keywords": found_skills,
            "missing_keywords": ats_results.get("missing_keywords", []),
            "proficiency": proficiency
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze resume: {str(e)}")

@app.post("/api/optimize-resume")
async def optimize_resume(
    file: UploadFile = File(...),
    target_role: str = Form(...),
    jd_text: str = Form("")
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
                
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract any text from the PDF.")
            
        # Generate Tailored Summary
        summary = resume_rewriter.generate_tailored_summary(text, jd_text if jd_text else target_role)
        
        # Rewrite the experience section to match target role
        # We pass the full text here to the LLM to extract and rewrite experience
        rewritten_experience = resume_rewriter.rewrite_section(text, target_role)
        
        return {
            "success": True,
            "tailored_summary": summary,
            "rewritten_experience": rewritten_experience
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to optimize resume: {str(e)}")

@app.post("/api/recommend-projects")
async def recommend_projects(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
                
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract any text from the PDF.")
            
        # Simulate ATS to get missing skills
        ats_results = ats_emulator.simulate_scan(text, "Google")
        missing_skills = ats_results.get("missing_keywords", [])
        
        if not missing_skills:
            # If no specific skills missing, mock some common advanced skills for project ideas
            missing_skills = ["Docker", "Kubernetes", "GraphQL", "Redis"]
            
        # Get AI recommendations
        projects = project_recommender.get_recommendations(missing_skills)
        
        return {
            "success": True,
            "projects": projects
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate project recommendations: {str(e)}")

@app.post("/api/learning-path")
async def get_learning_path(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
                
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract any text from the PDF.")
            
        # Simulate ATS to get missing skills
        ats_results = ats_emulator.simulate_scan(text, "Google")
        missing_skills = ats_results.get("missing_keywords", [])
        
        if not missing_skills:
            # If no specific skills missing, mock some advanced ones
            missing_skills = ["System Design", "Cloud Architecture", "Advanced React"]
            
        # Get AI learning path
        roadmap = course_aggregator.get_learning_path(missing_skills)
        
        return {
            "success": True,
            "roadmap": roadmap
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate learning path: {str(e)}")

@app.post("/api/generate-questions")
async def generate_questions(
    file: UploadFile = File(...),
    target_role: str = Form(...),
    difficulty: str = Form(...)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
                
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract any text from the PDF.")
            
        # Simulate ATS to get found skills
        ats_results = ats_emulator.simulate_scan(text, "Google")
        found_skills = ats_results.get("found_keywords", [])
        
        if not found_skills:
            found_skills = ["Python", "Problem Solving", "Communication"]
            
        # Get AI questions
        questions = interview_coach.generate_questions(target_role, found_skills, difficulty)
        
        return {
            "success": True,
            "questions": questions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate questions: {str(e)}")

@app.post("/api/model-answer")
async def get_model_answer(question: str = Form(...)):
    try:
        answer = interview_coach.get_model_answer(question)
        return {
            "success": True,
            "answer": answer
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate model answer: {str(e)}")

@app.post("/api/intelligence-suite")
async def get_intelligence_suite(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
                
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract any text from the PDF.")
            
        # 1. Authenticity Check
        authenticity = authenticity_checker.analyze_claims(text)
        
        # 2. Soft Skills Analysis
        soft_skills = soft_skill_analyzer.analyze(text)
        
        # 3. Heatmap & Structure
        heatmap_df = heatmap_generator.generate_section_analysis(text)
        heatmap_data = heatmap_df.to_dict(orient='records')
        
        return {
            "success": True,
            "authenticity": authenticity,
            "soft_skills": soft_skills,
            "heatmap": heatmap_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to run intelligence suite: {str(e)}")

@app.post("/api/github-analyze")
async def github_analyze(username: str = Form(...)):
    try:
        data = github_analyzer.analyze_profile(username)
        if data.get("error"):
            return {"success": False, "detail": data["error"]}
        
        return {
            "success": True,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze GitHub profile: {str(e)}")

@app.post("/api/student-audit")
async def get_student_audit(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
                
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract any text from the PDF.")
            
        audit_data = student_coach.analyze_fresher_potential(text)
        
        return {
            "success": True,
            "data": audit_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to run student audit: {str(e)}")

@app.post("/api/linkedin-sync")
async def run_linkedin_sync(
    resume_file: UploadFile = File(...),
    linkedin_file: UploadFile = File(...)
):
    if not resume_file.filename.endswith(".pdf") or not linkedin_file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Both files must be PDFs.")
        
    try:
        # Extract Resume text
        resume_content = await resume_file.read()
        resume_pdf = PyPDF2.PdfReader(io.BytesIO(resume_content))
        resume_text = ""
        for page in resume_pdf.pages:
            t = page.extract_text()
            if t: resume_text += t + "\n"
            
        # Extract LinkedIn text
        linkedin_content = await linkedin_file.read()
        linkedin_pdf = PyPDF2.PdfReader(io.BytesIO(linkedin_content))
        linkedin_text = ""
        for page in linkedin_pdf.pages:
            t = page.extract_text()
            if t: linkedin_text += t + "\n"
            
        if not resume_text.strip() or not linkedin_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from one or both PDFs.")
            
        sync_data = linkedin_sync.compare_profiles(resume_text, linkedin_text)
        
        return {
            "success": True,
            "data": sync_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to run LinkedIn sync: {str(e)}")

@app.post("/api/ats-simulate")
async def run_ats_simulate(
    file: UploadFile = File(...),
    target_company: str = Form(...)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        
        text = ""
        for page in pdf_reader.pages:
            t = page.extract_text()
            if t: text += t + "\n"
            
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the PDF.")
            
        result = ats_emulator.simulate_scan(text, target_company)
        
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to run ATS simulation: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
