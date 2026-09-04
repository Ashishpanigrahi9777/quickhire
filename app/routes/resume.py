import json
import os
import re

import fitz
from google import genai
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from google.genai import errors as genai_errors
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import ResumeAnalysis, User
from app.schemas import ResumeAnalysisResponse, ResumeAnalysisResult


router = APIRouter(prefix="/resume", tags=["Resume Reviewer"])
MAX_FILE_SIZE = 5 * 1024 * 1024
GEMINI_MODEL = "gemini-3.6-flash"


PROMPT_TEMPLATE = """You are an experienced Technical Recruiter + ATS Resume Reviewer.
Analyze the resume below for software engineering, SDE, backend, and full-stack roles.
Return ONLY valid JSON matching this exact structure. Do not use Markdown or code fences.
Do not invent experience, education, projects, skills, certifications, or achievements.
Use empty lists when information is absent. Scores must be integers from 0 to 100.

{
  "overall_score": 0,
  "ats_score": 0,
  "summary": "",
  "strengths": [],
  "improvements": [],
  "section_analysis": {
    "contact_information": {"score": 0, "feedback": "", "strengths": [], "improvements": []},
    "professional_summary": {"score": 0, "feedback": "", "strengths": [], "improvements": []},
    "education": {"score": 0, "feedback": "", "strengths": [], "improvements": []},
    "technical_skills": {"score": 0, "feedback": "", "strengths": [], "improvements": [], "detected_skills": [], "missing_skills": []},
    "projects": {"score": 0, "feedback": "", "strengths": [], "improvements": []},
    "experience": {"score": 0, "feedback": "", "strengths": [], "improvements": []},
    "certifications": {"score": 0, "feedback": "", "strengths": [], "improvements": []}
  },
  "keywords": {"matched_keywords": [], "missing_keywords": []},
  "target_role": {"role_match_score": 0, "matching_points": [], "missing_requirements": []},
  "action_plan": [{"priority": 1, "recommendation": "", "reason": ""}]
}

Resume text:
"""


def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        with fitz.open(stream=file_bytes, filetype="pdf") as document:
            text = "\n".join(page.get_text() for page in document)
    except (fitz.FileDataError, RuntimeError):
        raise HTTPException(status_code=400, detail="The uploaded PDF is corrupt or cannot be read.")
    return re.sub(r"\s+", " ", text).strip()


def parse_json_response(response_text: str) -> dict:
    cleaned = response_text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", cleaned, flags=re.IGNORECASE).strip()
    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError:
        start, end = cleaned.find("{"), cleaned.rfind("}")
        if start < 0 or end <= start:
            raise ValueError("Gemini did not return a JSON object")
        parsed = json.loads(cleaned[start:end + 1])
    if not isinstance(parsed, dict):
        raise ValueError("Gemini response was not a JSON object")
    return parsed


@router.post("/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    filename = file.filename or "resume.pdf"
    if file.content_type != "application/pdf" and not filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_bytes = await file.read(MAX_FILE_SIZE + 1)
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Please select a non-empty PDF.")
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File size exceeds the 5 MB limit.")

    resume_text = extract_text_from_pdf(file_bytes)
    if len(resume_text) < 50:
        raise HTTPException(status_code=400, detail="No meaningful text could be extracted. Please upload a text-based PDF.")

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "YOUR_KEY_HERE":
        raise HTTPException(status_code=503, detail="Resume analysis is not configured yet.")

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=PROMPT_TEMPLATE + resume_text,
            config={"response_mime_type": "application/json"},
        )
        result = ResumeAnalysisResult.model_validate(parse_json_response(response.text))
    except ValidationError:
        raise HTTPException(status_code=502, detail="The AI returned incomplete resume feedback. Please try again.")
    except (ValueError, json.JSONDecodeError):
        raise HTTPException(status_code=502, detail="The AI returned an invalid analysis. Please try again.")
    except genai_errors.APIError as error:
        if error.code == 429:
            raise HTTPException(status_code=429, detail="Resume analysis is temporarily busy. Please try again shortly.")
        if error.code == 404:
            raise HTTPException(status_code=502, detail="The configured Gemini model is unavailable. Please update the backend model configuration.")
        raise HTTPException(status_code=502, detail="The resume analysis service is temporarily unavailable.")
    except Exception:
        raise HTTPException(status_code=502, detail="Resume analysis failed. Please try again later.")

    analysis = ResumeAnalysis(
        user_id=current_user.id,
        filename=filename,
        overall_score=result.overall_score,
        ats_score=result.ats_score,
        analysis_json=result.model_dump_json(),
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return ResumeAnalysisResponse(
        id=analysis.id,
        filename=analysis.filename,
        result=result,
        created_at=analysis.created_at,
    )
