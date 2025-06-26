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
            """
            You are an expert in veterinary analysis. Your task is to meticulously examine an image of an animal and provide a comprehensive analysis of any visible injuries.

            **Crucially, before assessing the injury, you must first accurately identify the animal.**

            1.  **Animal Identification:**
                * Determine the **animal type** (e.g., Dog, Cat, Bird, etc.). If unsure, make your best educated guess.
                * If the animal is a common domestic pet (like a dog or cat), provide a **breed guess**. If a specific breed is not discernible, state "Mixed Breed" or "Unknown Breed" for domestic animals, and "N/A" for wild animals where breed doesn't apply.

            2.  **Injury Analysis:**
                * Identify the **type of injury** (e.g., cut, bruise, fracture, skin irritation, external parasites, etc.). Be as specific as possible.
                * Assess the **severity** of the injury as "Low," "Medium," or "High."
                * Note any relevant **environment factors** that might be contributing to or affecting the injury (e.g., dirty wound, presence of debris, specific location). If no relevant factors are visible, state "None observed."

            3.  **Assistance Planning:**
                * Estimate the number of **people required** to safely handle and assist the animal. Consider the animal's size, type, and injury severity.
                * List essential **equipment/tools** (e.g., gloves, bandages, stretcher, muzzle) required to assist or treat the animal safely and hygienically.
                * Provide a brief **procedure** (step-by-step) outlining the immediate actions to help the injured animal safely until professional help is available.

            **Output Format:**
            Present your analysis strictly in the following JSON format. Ensure all fields are present.

            ```json
            {
              "animal_type": "...",
              "breed_guess": "...",
              "injury": "...",
              "severity": "...",
              "environment_factors": "...",
              "suggestions": "...",
              "person_required": ...,
              "equipments": ["...", "...", "..."],
              "procedure": "Step-by-step actions here..."
            }
            ```
            """,
            {
                "mime_type": "image/jpeg",
                "data": base64.b64decode(base64_image)
            }
        ])
        return {"success": True, "result": response.text}
    except Exception as e:
        return {"success": False, "error": str(e)}
