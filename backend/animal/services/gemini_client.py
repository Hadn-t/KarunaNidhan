import os
import base64
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv() # Loading the enviroment variables

genai.configure(
    api_key=os.getenv("GENAI_API_KEY"),
)
model = genai.GenerativeModel(os.getenv("GENAI_MODEL", "gemini-1.5-flash"))

def analyze_animal_injury(base64_image: str) -> str:
    """
    Analyzes an animal injury using Gemini AI and returns the analysis result.
    """
    try:
        response = model.generate_content([
            "You are an expert in identifying the animal type, the breed, and the type of injury from an image. Please analyze the image and answer with a JSON like {injury: type, severity: level, breed_guess: ..., environment_factors:..., suggestions: ...}",
            {
                "mime_type": "image/jpeg",
                "data": base64.b64decode(base64_image)
            }
        ])
        return {"success": True, "result": response.text}
    except Exception as e:
        return {"success": False, "error": str(e)}