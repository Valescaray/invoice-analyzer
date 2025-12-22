from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import os
import uuid
from pathlib import Path
from typing import Optional

router = APIRouter(tags=["Upload"])

# Configure upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a file (PDF or image) and return file metadata.
    The file is stored temporarily for later analysis.
    """
    # 1️⃣ Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not supported. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # 2️⃣ Read file content and validate size
    contents = await file.read()
    file_size = len(contents)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE / 1024 / 1024}MB"
        )
    
    if file_size == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded")
    
    # 3️⃣ Generate unique file ID and save file
    file_id = str(uuid.uuid4())
    safe_filename = f"{file_id}{file_ext}"
    file_path = UPLOAD_DIR / safe_filename
    
    try:
        with open(file_path, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # 4️⃣ Return file metadata
    return {
        "status": "success",
        "data": {
            "file_id": file_id,
            "filename": file.filename,
            "file_path": str(file_path),
            "file_size": file_size,
            "content_type": file.content_type,
            "message": "File uploaded successfully. Use the file_id to analyze this invoice."
        }
    }

@router.get("/upload/{file_id}")
async def get_uploaded_file_info(file_id: str):
    """
    Get information about an uploaded file.
    """
    # Search for file with this ID
    matching_files = list(UPLOAD_DIR.glob(f"{file_id}.*"))
    
    if not matching_files:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = matching_files[0]
    file_stat = file_path.stat()
    
    return {
        "status": "success",
        "data": {
            "file_id": file_id,
            "filename": file_path.name,
            "file_size": file_stat.st_size,
            "file_path": str(file_path),
            "exists": True
        }
    }

@router.delete("/upload/{file_id}")
async def delete_uploaded_file(file_id: str):
    """
    Delete an uploaded file from temporary storage.
    """
    matching_files = list(UPLOAD_DIR.glob(f"{file_id}.*"))
    
    if not matching_files:
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        file_path = matching_files[0]
        os.remove(file_path)
        return {
            "status": "success",
            "message": "File deleted successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")
