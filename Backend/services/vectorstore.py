from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv

load_dotenv()


# CHROMA_PATH = "vector_store"
embeddings = OpenAIEmbeddings()

vectorstore = Chroma(
    collection_name="invoices",
    embedding_function=embeddings,
    # persist_directory=CHROMA_PATH
)

def add_invoice_chunks(invoice_id: str, chunks: list[str], metadata_base: dict):
    ids = [f"{invoice_id}::{i}" for i in range(len(chunks))]
    metadatas = [{**metadata_base, "chunk_index": i} for i in range(len(chunks))]
    
    vectorstore.add_texts(texts=chunks, metadatas=metadatas, ids=ids)

    # persist to disk
    try:
        vectorstore.persist()
    except:
        pass

def search_invoice_text(query: str, k=5):
    return vectorstore.similarity_search(query, k=k)
