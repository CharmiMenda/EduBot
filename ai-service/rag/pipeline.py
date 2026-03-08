import os
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

# Initialize Embeddings
# Using all-MiniLM-L6-v2 which is fast and good for general text
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

VECTOR_STORE_PATH = os.path.join(os.path.dirname(__file__), "..", "vectorstore")

def get_vector_store():
    """Load or initialize FAISS vector store"""
    if os.path.exists(VECTOR_STORE_PATH) and os.listdir(VECTOR_STORE_PATH):
        try:
            return FAISS.load_local(VECTOR_STORE_PATH, embeddings, allow_dangerous_deserialization=True)
        except Exception as e:
            print(f"Error loading vector store: {e}, initializing new one.")
            
    # Initialize an empty store if it doesn't exist
    # FAISS requires at least one document to initialize, so we create a dummy one
    dummy_doc = Document(page_content="System Initialized", metadata={"source_type": "system"})
    db = FAISS.from_documents([dummy_doc], embeddings)
    db.save_local(VECTOR_STORE_PATH)
    return db

def ingest_document(text: str, metadata: dict, document_id: str) -> int:
    """
    Chunks a document, generates embeddings, and saves to FAISS.
    """
    # 1. Chunking
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        length_function=len,
        separators=["\n\n", "\n", " ", ""]
    )
    
    chunks = text_splitter.split_text(text)
    
    # 2. Convert to Documents with metadata
    docs = []
    for i, chunk in enumerate(chunks):
        # Merge existing metadata with chunk specific info
        chunk_metadata = metadata.copy()
        chunk_metadata["chunk_id"] = f"{document_id}_{i}"
        chunk_metadata["document_id"] = document_id
        
        docs.append(Document(page_content=chunk, metadata=chunk_metadata))
    
    # 3. Store in Vector DB
    db = get_vector_store()
    db.add_documents(docs)
    db.save_local(VECTOR_STORE_PATH)
    
    return len(chunks)
