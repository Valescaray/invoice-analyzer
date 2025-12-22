from pydantic import BaseModel, Field
from typing import Optional

class InvoiceSchema(BaseModel):
    """
    Defines the fields we want to extract from invoices/receipts.
    Used both for validation and LangChain structured output.
    """
    invoice_number: Optional[str] = Field(None, description="Unique invoice or receipt number")
    vendor_name: Optional[str] = Field(None, description="Name of vendor or company issuing the invoice")
    customer_name: Optional[str] = Field(None, description="Name of customer or buyer")
    invoice_date: Optional[str] = Field(None, description="Date invoice was issued")
    due_date: Optional[str] = Field(None, description="Payment due date if specified")
    total_amount: Optional[float] = Field(None, description="Total amount billed")
    tax_amount: Optional[float] = Field(None, description="Total tax applied")
    currency: Optional[str] = Field(None, description="Currency symbol or code, e.g. USD, EUR, NGN")
    payment_method: Optional[str] = Field(None, description="Payment method (e.g., cash, card, transfer)")
    items: Optional[str] = Field(None, description="List or description of billed items or services")
