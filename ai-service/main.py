from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from rag.pipeline import ingest_document
from rag.retriever import generate_answer

app = FastAPI(title="EduBot RAG AI Service", version="1.0.0")

# Request Models
class ChatMessage(BaseModel):
    role: str
    content: str
    
class ChatRequest(BaseModel):
    user_id: str
    message: str
    history: Optional[List[ChatMessage]] = []
    weak_areas: Optional[List[str]] = []

class ChatResponse(BaseModel):
    answer: str
    recommended_materials_ids: List[str] = []
    recommended_quizzes_ids: List[str] = []

class IngestRequest(BaseModel):
    document_id: str
    text: str
    metadata: dict

class IngestResponse(BaseModel):
    status: str
    chunks_processed: int

@app.get("/")
def read_root():
    return {"status": "ok", "service": "EduBot AI Service"}

@app.post("/ai/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        response = generate_answer(
            query=request.message,
            history=[{"role": msg.role, "content": msg.content} for msg in request.history],
            weak_areas=request.weak_areas
        )
        return ChatResponse(
            answer=response.get("answer", "I could not generate an answer."),
            recommended_materials_ids=response.get("recommended_materials_ids", []),
            recommended_quizzes_ids=response.get("recommended_quizzes_ids", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/ingest", response_model=IngestResponse)
async def ingest_endpoint(request: IngestRequest):
    try:
        chunks_count = ingest_document(request.text, request.metadata, request.document_id)
        return IngestResponse(status="success", chunks_processed=chunks_count)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
