# backend/services/db_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import insert, select, delete, desc, func
from database.models import Invoice
from datetime import date
from typing import Tuple, List, Optional
from database.models import Invoice  # your SQLAlchemy model
from database.schemas import InvoiceCreate, InvoiceResponse, DashboardStats
from sqlalchemy.sql import text

async def save_invoice(db: AsyncSession, invoice_in: InvoiceCreate):
    stmt = (
        insert(Invoice)
        .values(
            user_id=invoice_in.user_id,
            filename=invoice_in.filename,
            vendor_name=invoice_in.vendor_name,
            invoice_number=invoice_in.invoice_number,
            invoice_date=invoice_in.invoice_date,
            total_amount=invoice_in.total_amount,
            tax_amount=invoice_in.tax_amount,
            currency=invoice_in.currency,
            raw_text=invoice_in.raw_text,
            processed=True
        )
        .returning(Invoice)
    )
    result = await db.execute(stmt)
    await db.commit()
    # row = result.fetchone()
    # return row
    
     # Convert row to dict
    # row = result.mappings().first()  # now it’s a dict-like object
    # return dict(row) if row else None
    row = result.mappings().first()
    invoice_obj = row["Invoice"]   # extract real SQLAlchemy object

# Convert SQLAlchemy model → dict manually
    return {
      "id": invoice_obj.id,
      "user_id": invoice_obj.user_id,
      "filename": invoice_obj.filename,
      "vendor_name": invoice_obj.vendor_name,
      "invoice_number": invoice_obj.invoice_number,
      "invoice_date": invoice_obj.invoice_date,
      "total_amount": invoice_obj.total_amount,
      "tax_amount": invoice_obj.tax_amount,
      "currency": invoice_obj.currency,
      "raw_text": invoice_obj.raw_text,
      "processed": invoice_obj.processed,
      "created_at": invoice_obj.created_at,
}

async def get_invoices_for_user(db: AsyncSession, user_id):
    stmt = select(Invoice).where(Invoice.user_id == user_id).order_by(Invoice.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

# Utility to convert SQLAlchemy result to Pydantic/primitive dict
def invoice_to_dict(invoice) -> dict:
    return {
        "id": invoice.id,
        "user_id": invoice.user_id,
        "filename": invoice.filename,
        "vendor_name": invoice.vendor_name,
        "invoice_number": invoice.invoice_number,
        "invoice_date": invoice.invoice_date,
        "total_amount": invoice.total_amount,
        "tax_amount": invoice.tax_amount,
        "currency": invoice.currency,
        "raw_text": invoice.raw_text,
        "processed": invoice.processed,
        "created_at": invoice.created_at,
    }

# 1) Paginated invoices
async def get_invoices(db: AsyncSession, page: int = 1, per_page: int = 20, user_id: Optional[str] = None) -> Tuple[List[dict], int]:
    offset = (page - 1) * per_page
    stmt = select(Invoice).order_by(Invoice.created_at.desc()).offset(offset).limit(per_page)
    count_stmt = select(func.count()).select_from(Invoice)
    if user_id:
        stmt = stmt.where(Invoice.user_id == user_id)
        count_stmt = count_stmt.where(Invoice.user_id == user_id)

    total_res = await db.execute(count_stmt)
    total = total_res.scalar_one()
    result = await db.execute(stmt)
    rows = result.scalars().all()
    return [invoice_to_dict(r) for r in rows], total

# 2) Single invoice by id
async def get_invoice_by_id(db: AsyncSession, invoice_id):
    stmt = select(Invoice).where(Invoice.id == invoice_id)
    res = await db.execute(stmt)
    row = res.scalar_one_or_none()
    return invoice_to_dict(row) if row else None

# 3) Delete invoice (soft or hard)
async def delete_invoice(db: AsyncSession, invoice_id, soft: bool = True):
    if soft:
        # set processed=False or add deleted flag — demonstrate processed->False as soft example
        stmt = select(Invoice).where(Invoice.id == invoice_id)
        res = await db.execute(stmt)
        invoice = res.scalar_one_or_none()
        if not invoice:
            return None
        invoice.processed = False
        await db.commit()
        await db.refresh(invoice)
        return invoice_to_dict(invoice)
    else:
        # hard delete
        stmt = delete(Invoice).where(Invoice.id == invoice_id).returning(Invoice)
        res = await db.execute(stmt)
        await db.commit()
        deleted = res.fetchone()
        return invoice_to_dict(deleted[0]) if deleted else None

# 4) Dashboard stats
async def get_dashboard_stats(db: AsyncSession, user_id: Optional[str] = None):
    # Total invoices count
    total_stmt = select(func.count()).select_from(Invoice)
    sum_stmt = select(func.coalesce(func.sum(Invoice.total_amount), 0))
    vendor_stmt = select(Invoice.vendor_name, func.count().label("count"), func.coalesce(func.sum(Invoice.total_amount), 0).label("sum")).group_by(Invoice.vendor_name).order_by(desc("sum")).limit(10)

    if user_id:
        total_stmt = total_stmt.where(Invoice.user_id == user_id)
        sum_stmt = sum_stmt.where(Invoice.user_id == user_id)
        vendor_stmt = vendor_stmt.where(Invoice.user_id == user_id)

    total = (await db.execute(total_stmt)).scalar_one()
    total_expenses = (await db.execute(sum_stmt)).scalar_one()
    vendor_rows = (await db.execute(vendor_stmt)).all()

    top_vendors = [{"vendor_name": v[0], "count": int(v[1]), "sum": float(v[2] or 0)} for v in vendor_rows]

    # Expenses by currency aggregation
    currency_stmt = select(Invoice.currency, func.coalesce(func.sum(Invoice.total_amount), 0)).group_by(Invoice.currency)
    if user_id:
        currency_stmt = currency_stmt.where(Invoice.user_id == user_id)
    currency_rows = (await db.execute(currency_stmt)).all()
    expenses_by_currency = [{"currency": r[0] or "UNKNOWN", "sum": float(r[1] or 0)} for r in currency_rows]

    return {
        "total_invoices": int(total),
        "total_expenses": float(total_expenses or 0),
        "top_vendors": top_vendors,
        "expenses_by_currency": expenses_by_currency,
    }