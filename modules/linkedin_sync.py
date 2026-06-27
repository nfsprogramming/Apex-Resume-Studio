import json
from app_utils.llm_wrapper import generate_text

class LinkedinSync:
    """
    Analyzes and compares a Resume PDF against a LinkedIn PDF.
    """

    def compare_profiles(self, resume_text: str, linkedin_text: str) -> dict:
        """
        Calls the LLM to cross-reference the two documents.
        """
        prompt = f"""
You are an expert technical recruiter and AI auditor.
I am providing you with the extracted text from a candidate's Resume, and the extracted text from their LinkedIn profile PDF.

Resume Text:
'''
{resume_text}
'''

LinkedIn Text:
'''
{linkedin_text}
'''

Please cross-reference these two documents. Recruiters look for consistency across digital presence.
Evaluate the following:
1. Do the dates of employment match for the overlapping roles?
2. Do the job titles match for the overlapping roles?
3. Are the core technical skills consistent between the two?

Output your response strictly as a JSON object with the following schema:
{{
    "dates_match": true/false,
    "titles_match": true/false,
    "skills_match": true/false,
    "alignment_score": <an integer from 0 to 100 based on consistency>,
    "discrepancies": [
        "List specific discrepancy 1",
        "List specific discrepancy 2"
    ]
}}
Do NOT output any markdown blocks or extra text. Output ONLY valid JSON.
"""
        response = generate_text(prompt)
        
        try:
            # Clean up potential markdown formatting from the response
            cleaned_response = response.strip()
            if cleaned_response.startswith("```json"):
                cleaned_response = cleaned_response[7:-3].strip()
            elif cleaned_response.startswith("```"):
                cleaned_response = cleaned_response[3:-3].strip()
                
            return json.loads(cleaned_response)
        except Exception as e:
            print(f"Error parsing LLM response: {e}")
            print(f"Raw response: {response}")
            # Fallback response
            return {
                "dates_match": False,
                "titles_match": False,
                "skills_match": False,
                "alignment_score": 0,
                "discrepancies": ["Failed to parse AI analysis. Ensure the documents are valid and try again."]
            }

linkedin_sync = LinkedinSync()
