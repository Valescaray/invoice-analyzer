# backend/schemas.py
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
from uuid import UUID, uuid4
from decimal import Decimal

class InvoiceCreate(BaseModel):
    user_id: UUID = Field(default_factory=uuid4)
    filename: Optional[str]
    vendor_name: Optional[str]
    invoice_number: Optional[str]
    invoice_date: Optional[date]
    total_amount: Optional[float]
    tax_amount: Optional[float]
    currency: Optional[str]
    raw_text: Optional[str]

class InvoiceOut(InvoiceCreate):
    id: UUID
    processed: bool
    created_at: Optional[str]
    
    
class InvoiceResponse(BaseModel):
    id: UUID
    user_id: Optional[UUID] = None
    filename: Optional[str] = None
    vendor_name: Optional[str] = None
    invoice_number: Optional[str] = None
    invoice_date: Optional[date] = None
    total_amount: Optional[Decimal] = None
    tax_amount: Optional[Decimal] = None
    currency: Optional[str] = None
    raw_text: Optional[str] = None
    processed: bool = False
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True
        json_encoders = {
            Decimal: lambda v: float(v),
            datetime: lambda v: v.isoformat() if v else None,
            date: lambda v: v.isoformat() if v else None,
        }

class InvoiceListResponse(BaseModel):
    total: int
    page: int
    per_page: int
    invoices: List[InvoiceResponse]

class DashboardStats(BaseModel):
    total_invoices: int
    total_expenses: Optional[float] = 0.0
    top_vendors: List[dict] = []
    expenses_by_currency: List[dict] = []
