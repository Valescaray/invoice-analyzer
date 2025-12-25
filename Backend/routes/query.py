# backend/routes/query.py
from fastapi import APIRouter, Depends, HTTPException, Query, Path
from deps import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from services.db_services import get_invoices, get_invoice_by_id, delete_invoice, get_dashboard_stats
from database.schemas import InvoiceListResponse, InvoiceResponse, DashboardStats
from typing import Optional

router = APIRouter(tags=["Query"])

@router.get("/invoices", response_model=InvoiceListResponse)
async def list_invoices(page: int = Query(1, ge=1), per_page: int = Query(20, ge=1, le=200), db: AsyncSession = Depends(get_db), user_id: Optional[str] = None):
    
    if user_id:
        user_id = user_id.strip() 
    rows, total = await get_invoices(db, page=page, per_page=per_page, user_id=user_id)
    return {"total": total, "page": page, "per_page": per_page, "invoices": rows}

@router.get("/invoices/{invoice_id}", response_model=InvoiceResponse)
async def get_invoice(invoice_id: str = Path(...), db: AsyncSession = Depends(get_db)):
    
    if invoice_id:
        invoice_id = invoice_id.strip() 
         
    inv = await get_invoice_by_id(db, invoice_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return inv

@router.get("/dashboard/stats", response_model=DashboardStats)
async def dashboard_stats(db: AsyncSession = Depends(get_db), user_id: Optional[str] = None):
    
    if user_id:
        user_id = user_id.strip() 
    stats = await get_dashboard_stats(db, user_id=user_id)
    return stats

@router.delete("/invoices/{invoice_id}")
async def remove_invoice(invoice_id: str, hard: bool = Query(True), db: AsyncSession = Depends(get_db)):
    # Basic user check placeholder: ideally compare to current_user.id (when auth implemented)
    deleted = await delete_invoice(db, invoice_id, soft=not hard)
    if not deleted:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return {"status": "success", "data": deleted}
