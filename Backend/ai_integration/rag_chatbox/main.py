from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from rag import RAGPipeline

load_dotenv()

rag: RAGPipeline = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global rag
    print("🚀 Đang khởi động RAG pipeline...")
    rag = RAGPipeline()
    rag.load_or_build_vectorstore()
    print("✅ RAG pipeline sẵn sàng!")
    yield
    print("🔴 Shutting down...")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str
    chat_history: list[dict] = []  # [{"role": "user/assistant", "content": "..."}]

class QueryResponse(BaseModel):
    answer: str
    sources: list[str] = []

@app.get("/health")
def health():
    return {"status": "ok", "rag_ready": rag is not None}

@app.post("/query", response_model=QueryResponse)
def query(req: QueryRequest):
    if not rag:
        raise HTTPException(status_code=503, detail="RAG chưa sẵn sàng")
    
    result = rag.query(req.question, req.chat_history)
    return QueryResponse(
        answer=result["answer"],
        sources=result.get("sources", [])
    )