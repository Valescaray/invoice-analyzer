from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import analyze
from routes import query
from routes import upload
from routes import auth_routes
from services.vectorstore import search_invoice_text

app = FastAPI(
    title="Smart Invoice & Receipt Analyzer",
    description="LangChain-powered backend for automated invoice extraction.",
    version="1.0.0"
)

# --- CORS (React frontend can talk to API) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten later in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include Routers ---
app.include_router(upload.router, prefix="/api")
app.include_router(analyze.router, prefix="/api")
app.include_router(query.router, prefix="/api")
app.include_router(auth_routes.router)

@app.get("/")
def root():
    return {"message": "Smart Invoice Analyzer API is running 🚀"}

@app.get("/search")
async def search_invoices(q: str):
    results = search_invoice_text(q)
    
    return [
        {
            "text": doc.page_content,
            "metadata": doc.metadata
        }
        for doc in results
    ]
