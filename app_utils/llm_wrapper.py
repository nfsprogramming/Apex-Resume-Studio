from openai import OpenAI
from config import APIKeys
import os

# Initialize the OpenAI client pointing to NVIDIA's OpenAI-compatible NIM endpoint
client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=APIKeys.NVIDIA_API_KEY or "dummy_key_to_prevent_startup_crash"
)

# Standardize on one of the most capable NVIDIA NIM models
NVIDIA_MODEL = "meta/llama-3.1-70b-instruct"

def ai_engine(prompt: str, system_message: str = "You are a helpful AI career assistant.") -> str:
    """Wrapper function used by all modules to generate text via NVIDIA NIM."""
    try:
        response = client.chat.completions.create(
            model=NVIDIA_MODEL,
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            top_p=0.7,
            max_tokens=1024,
            stream=False
        )
        
        if response.choices[0].message.content is not None:
            return response.choices[0].message.content
        return "Error: Empty response."
    except Exception as e:
        print(f"AI Engine Error: {e}")
        return "Error: Could not generate response from the AI engine."

def generate_text(prompt: str) -> str:
    """Legacy wrapper for simple single-prompt generation."""
    return ai_engine(prompt)
