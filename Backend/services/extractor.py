# Services/extractor.py
import os
import pytesseract
from pdfminer.high_level import extract_text
from PIL.Image import Image
from langchain_components.chains import build_extraction_chain
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from services.chunker import chunk_text
from services.vectorstore import add_invoice_chunks
# from config import get_llm 

load_dotenv()

async def extract_invoice_data(file):
    """
    Takes a file (PDF or image), extracts text using OCR or PDF parser,
    then runs LangChain extraction to identify key invoice fields.
    """

    # --- Step 1: Save uploaded file temporarily ---
    temp_path = f"/tmp/{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(await file.read())

    # --- Step 2: Extract text ---
    text = ""
    if file.filename.lower().endswith(".pdf"):
        try:
            text = extract_text(temp_path)
        except Exception as e:
            print("PDF extraction error:", e)
    else:
        try:
            img = Image.open(temp_path)
            text = pytesseract.image_to_string(img)
        except Exception as e:
            print("OCR error:", e)

    if not text.strip():
        return {"error": "No text could be extracted from file."}

    # --- Step 3: Run LangChain extraction ---
    # llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
    # llm = get_llm()
    llm = ChatOpenAI(model="gpt-4o-mini")
    extract_chain = build_extraction_chain(llm)
    result = extract_chain(text)  # ✅ call the returned function directly

    
    structured_data = result if isinstance(result, dict) else result.dict()

      
    # --- Step 4: Optional – Prepare for semantic search ---
    try:
        chunks = chunk_text(text)
        metadata = {"filename": file.filename}
        invoice_id = structured_data.get("invoice_id", file.filename)
        add_invoice_chunks(invoice_id, chunks, metadata)
    except Exception as e:
        print("Vectorstore error:", e)

   
    # --- Step 5: Clean up ---
    os.remove(temp_path)

    return {
        "invoice_id": structured_data.get("invoice_id"),
        "text": text,
        "structured": structured_data
    }
   
   






# Services/extractor.py
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain_components.chains import build_extraction_chain

# async def extract_invoice_data(text: str):
#     # Initialize LLM (replace with OpenAI if needed)
#     llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro")

#     # Build the chain
#     chain = build_extraction_chain(llm)

#     # Run the extraction
#     result = chain.invoke({"text": text})

#     # Convert to dict (Pydantic object -> JSON)
#     return result.dict()






# import asyncio

# async def extract_invoice_data(file):
#     # temporary mock response until LangChain logic arrives
#     await asyncio.sleep(1)  # simulate processing
#     return {
#         "invoice_number": "INV-001",
#         "vendor_name": "Sample Vendor Ltd.",
#         "invoice_date": "2025-10-20",
#         "total_amount": 4200.50,
#         "tax_amount": 200.50,
#         "currency": "USD"
#     }
