# backend/models.py
import uuid
from sqlalchemy import Column, String, Date, TIMESTAMP, Text, Numeric, Boolean
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.sql import func
from database.db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    firebase_uid = Column(String, unique=True, nullable=False)  # Firebase user ID
    email = Column(String, unique=True, nullable=False)
    full_name = Column(String, nullable=True)
    company = Column(String, nullable=True)  # Company name
    photo_url = Column(String, nullable=True)  # Profile picture URL
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(PG_UUID(as_uuid=True), nullable=True)  # optionally link to User
    filename = Column(String, nullable=True)
    vendor_name = Column(String, nullable=True)
    invoice_number = Column(String, nullable=True)
    invoice_date = Column(Date, nullable=True)
    total_amount = Column(Numeric(12, 2), nullable=True)
    tax_amount = Column(Numeric(12, 2), nullable=True)
    currency = Column(String(10), nullable=True)
    raw_text = Column(Text, nullable=True)
    processed = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
