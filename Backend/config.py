# config.py
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv


# Load API keys from .env file
load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Initialize the model once for reuse
def get_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.7,
        api_key=GOOGLE_API_KEY
    )