def chunk_text(text: str, chunk_size: int = 800, overlap: int = 120) -> list[str]:
    words = text.split()
    chunks = []
    start = 0

    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start = end - overlap  # sliding window

    return chunks
