import os
from dotenv import load_dotenv

load_dotenv()

class APIKeys:
    NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "")
    GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")

class Settings:
    APP_NAME = "Smart Resume Analyzer"
    VERSION = "3.0.0"

# Used by ats_emulator.py
COMPANY_ATS_KEYWORDS = {
    "Google": ["scalability", "distributed systems", "gcp", "data structures", "algorithms"],
    "Amazon": ["aws", "customer obsession", "ownership", "microservices", "leadership"],
    "Meta": ["react", "graphql", "hack", "impact", "fast-paced"],
    "Apple": ["design", "ux", "c++", "swift", "hardware-software integration"],
    "Microsoft": ["azure", "c#", ".net", "enterprise", "typescript"]
}
