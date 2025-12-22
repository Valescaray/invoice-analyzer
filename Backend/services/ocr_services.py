# services/ocr_services.py

import fitz  # PyMuPDF
import pytesseract
from pdf2image import convert_from_path


# 1️⃣ Digital PDF text extraction
async def extract_text_from_file(file_path: str) -> str:
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()

    return text.strip()


# 2️⃣ OCR extraction for scanned PDFs
async def ocr_scanned_pdf(file_path: str) -> str:
    images = convert_from_path(file_path)
    text = ""
    for img in images:
        text += pytesseract.image_to_string(img)

    return text.strip()


# 3️⃣ Smart function that uses both
async def extract_invoice_text(file_path: str) -> str:
    """
    Aim:
    - Try digital text extraction first (PyMuPDF)
    - If no text → run OCR using Tesseract
    """

    # Try digital extraction
    digital_text = await extract_text_from_file(file_path)

    if digital_text and len(digital_text) > 20:
        # Text found successfully → just return it
        return digital_text

    # No text or too little = scanned PDF → use OCR
    ocr_text = await ocr_scanned_pdf(file_path)

    if ocr_text:
        return ocr_text

    return "No text could be extracted from this PDF."
