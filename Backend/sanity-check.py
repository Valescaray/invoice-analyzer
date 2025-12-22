from langchain_components.schemas import InvoiceSchema


invoice = InvoiceSchema(invoice_number="INV-001", total_amount=4200.50)
print(invoice.model_dump_json())