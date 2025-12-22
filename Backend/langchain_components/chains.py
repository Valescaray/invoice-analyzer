# LangChain_Components/extraction_chain.py
from pydantic import BaseModel, Field
from langchain_core.prompts import PromptTemplate


# ✅ 1. Define the structured schema using Pydantic
class InvoiceData(BaseModel):
    vendor_name: str = Field(..., description="Name of the vendor or company issuing the invoice")
    invoice_number: str = Field(..., description="Unique invoice or receipt number")
    invoice_date: str = Field(..., description="Date of invoice in YYYY-MM-DD format")
    total_amount: float = Field(..., description="Total billed amount")
    tax_amount: float | None = Field(None, description="Applicable tax amount if any")
    currency: str | None = Field(None, description="Currency symbol or code (e.g., USD, NGN, EUR)")


# ✅ 2. Build a chain factory (works with any LLM)
def build_extraction_chain(llm):
    """
    Returns a universal extraction chain that can work with OpenAI, Gemini, Anthropic, etc.
    """
    # Wrap LLM to produce structured (typed) output
    structured_llm = llm.with_structured_output(InvoiceData)

    # Define the prompt template
    prompt = PromptTemplate.from_template("""
You are an intelligent financial document extractor. 
Given the raw text of an invoice or receipt, extract and return the following fields:
- vendor_name
- invoice_number
- invoice_date
- total_amount
- tax_amount
- currency

If any field is missing, leave it blank or null.

Invoice Text:
{text}
""")

     # Return a callable function-like chain
    def run_extraction(text: str):
        # Format the input prompt manually and pass to LLM
        final_prompt = prompt.format(text=text)
        return structured_llm.invoke(final_prompt)  # returns an InvoiceData object

    return run_extraction
