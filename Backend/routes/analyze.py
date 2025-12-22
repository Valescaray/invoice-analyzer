from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from sqlalchemy.ext.asyncio import AsyncSession
from services.extractor import extract_invoice_data
from services.db_services import save_invoice
from deps import get_db
from database.schemas import InvoiceCreate, InvoiceResponse
from fastapi.responses import JSONResponse
from pathlib import Path
from typing import Optional

router = APIRouter(tags=["Analyze"])

UPLOAD_DIR = Path("uploads")

@router.post("/analyze", response_model=dict)
async def analyze_invoice(
    file: Optional[UploadFile] = File(None),
    file_id: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Analyzes an invoice and extracts structured data via LangChain.
    Accepts either:
    - A direct file upload (file parameter)
    - A file_id from a previous /upload call
    
    Saves the extracted data to the database.
    """
    # 1️⃣ Determine the file source
    if file_id:
        # Load file from upload directory
        matching_files = list(UPLOAD_DIR.glob(f"{file_id}.*"))
        if not matching_files:
            raise HTTPException(status_code=404, detail="File not found. Please upload the file first.")
        
        file_path = matching_files[0]
        filename = file_path.name
        
        # Create a file-like object for the extractor
        with open(file_path, "rb") as f:
            file_content = f.read()
        
        # We'll need to modify this to work with file path
        # For now, raise an error suggesting direct upload
        raise HTTPException(
            status_code=501,
            detail="File ID analysis not yet implemented. Please use direct file upload."
        )
    
    elif file:
        # Direct file upload
        if not file.filename.lower().endswith((".pdf", ".png", ".jpg", ".jpeg")):
            raise HTTPException(status_code=400, detail="Only PDF or image files supported")
        filename = file.filename
    else:
        raise HTTPException(
            status_code=400,
            detail="Either 'file' or 'file_id' must be provided"
        )

    try:
        # 2️⃣ Extract structured data from file using LangChain
        result = await extract_invoice_data(file)

        if "error" in result:
            return JSONResponse({"error": result["error"]}, status_code=400)

        structured = result.get("structured", {})

        # 3️⃣ Create Pydantic schema instance from extracted data
        invoice_data = InvoiceCreate(
            filename=filename,
            vendor_name=structured.get("vendor_name"),
            invoice_number=structured.get("invoice_number"),
            invoice_date=structured.get("invoice_date"),
            total_amount=structured.get("total_amount"),
            tax_amount=structured.get("tax_amount"),
            currency=structured.get("currency"),
            raw_text=result.get("raw_text"),
        )

        # 4️⃣ Save to database using the db service
        saved_invoice = await save_invoice(db, invoice_data)

        # 5️⃣ Return saved data as response
        # return {"status": "success", "data": saved_invoice}
        
        response_data = InvoiceResponse.model_validate(saved_invoice)

        return {"status": "success", "data": response_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
