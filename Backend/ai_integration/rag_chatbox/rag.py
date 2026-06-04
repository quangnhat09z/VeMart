# rag_service/rag.py
import os, json, uuid
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_classic.prompts import PromptTemplate
from langchain_classic.chains.question_answering import load_qa_chain

SYSTEM_PROMPT = """Bạn là trợ lý AI của VeMart - cửa hàng thương mại điện tử.
Chỉ trả lời dựa trên thông tin được cung cấp trong context bên dưới.
Nếu không tìm thấy thông tin liên quan, hãy nói: "Xin lỗi, tôi không có thông tin về vấn đề này."
Trả lời thân thiện, ngắn gọn, bằng tiếng Việt.

Context: {context}
"""

class RAGPipeline:
    def __init__(self):
        self.kb_path     = "knowledge-base"
        self.product_vs  = None
        self.category_vs = None

        # ── Gemini Embeddings ──────────────────────────────────
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model=os.getenv("GEMINI_EMBEDDING_MODEL", "models/gemini-embedding-001"),
            google_api_key=os.getenv("GEMINI_API_KEY"),
            task_type="retrieval_document",  # tối ưu cho RAG
        )

        # ── Gemini LLM ─────────────────────────────────────────
        self.llm = ChatGoogleGenerativeAI(
            model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
            google_api_key=os.getenv("GEMINI_API_KEY"),
            temperature=0.7,
        )

    # ── Data loading ───────────────────────────────────────────
    def _load_json_folder(self, folder: str, doc_type: str) -> list[Document]:
        docs = []
        for fname in os.listdir(folder):
            if not fname.endswith(".json"):
                continue
            with open(os.path.join(folder, fname), encoding="utf-8") as f:
                data = json.load(f)
            items = data if isinstance(data, list) else [data]
            for idx, item in enumerate(items):
                docs.append(Document(
                    page_content=json.dumps(item, ensure_ascii=False, indent=2),
                    metadata={"source": fname, "type": doc_type, "index": idx}
                ))
        return docs

    # ── Build / load vectorstore ───────────────────────────────
    def load_or_build_vectorstore(self):
        product_dir  = "vector_db/vector_db_products"
        category_dir = "vector_db/vector_db_categories"

        if os.path.exists(product_dir) and os.path.exists(category_dir):
            print("📂 Load vectorstore từ disk...")
            self.product_vs  = Chroma(persist_directory=product_dir,  embedding_function=self.embeddings)
            self.category_vs = Chroma(persist_directory=category_dir, embedding_function=self.embeddings)
            return

        print("🔨 Build vectorstore từ đầu...")
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=600, chunk_overlap=50,
            separators=["\n\n", "\n", ". ", " "]
        )

        products   = self._load_json_folder(f"{self.kb_path}/products",   "product")
        categories = self._load_json_folder(f"{self.kb_path}/categories", "categories")

        chunks = splitter.split_documents(products + categories)
        product_chunks  = [c for c in chunks if c.metadata["type"] == "product"]
        category_chunks = [c for c in chunks if c.metadata["type"] == "categories"]

        self.product_vs = Chroma.from_documents(
            product_chunks, self.embeddings,
            ids=[str(uuid.uuid4()) for _ in product_chunks],
            persist_directory=product_dir
        )
        self.category_vs = Chroma.from_documents(
            category_chunks, self.embeddings,
            ids=[str(uuid.uuid4()) for _ in category_chunks],
            persist_directory=category_dir
        )
        print(f"✅ Built {self.product_vs._collection.count()} product vectors, "
              f"{self.category_vs._collection.count()} category vectors")

    # ── Smart routing ──────────────────────────────────────────
    def _detect_query_type(self, query: str) -> str:
        q = query.lower()
        product_kw  = ["sản phẩm", "product", "mua", "giá", "discount", "giảm giá", "hàng"]
        category_kw = ["danh mục", "category", "loại", "thể loại", "nhóm", "chuyên mục"]
        has_p = any(k in q for k in product_kw)
        has_c = any(k in q for k in category_kw)
        if has_c and not has_p: return "category"
        if has_p and not has_c: return "product"
        return "both"

    def _retrieve(self, query: str) -> list[Document]:
        qtype = self._detect_query_type(query)
        # Gemini embedding tốt hơn → tăng k để lấy nhiều context hơn
        p_ret = self.product_vs.as_retriever(
            search_kwargs={"k": 10},
            search_type="mmr"   # MMR giảm duplicate, tăng đa dạng kết quả
        )
        c_ret = self.category_vs.as_retriever(search_kwargs={"k": 5})
        if qtype == "product":  return p_ret.invoke(query)
        if qtype == "category": return c_ret.invoke(query)
        return p_ret.invoke(query) + c_ret.invoke(query)

    # ── Question classifier ────────────────────────────────────
    def _classify_question(self, question: str, chat_history: list[dict]) -> str:
        q = question.lower()
        history_keywords = [
            "trước đó", "vừa rồi", "đã nói", "đã hỏi", "đã cung cấp", "vừa nãy",
            "đã liệt kê", "lúc nãy", "ban nãy", "ở trên", "bạn vừa",
            "những gì bạn", "nhắc lại", "tóm tắt cuộc", "tổng kết lại"
        ]
        if any(k in q for k in history_keywords):
            return "history"
        if not chat_history:
            return "knowledge"
        general_keywords = [
            "xin chào", "hello", "hi ", "chào bạn", "bạn là ai",
            "bạn có thể làm gì", "cảm ơn", "tạm biệt", "bye"
        ]
        if any(k in q for k in general_keywords):
            return "general"
        return "knowledge"

    def _format_history_for_llm(self, chat_history: list[dict]) -> str:
        lines = []
        for msg in chat_history[-20:]:
            role = "Người dùng" if msg["role"] == "user" else "Trợ lý"
            lines.append(f"{role}: {msg['content']}")
        return "\n".join(lines)

    # ── Main query ─────────────────────────────────────────────
    def query(self, question: str, chat_history: list[dict]) -> dict:
        question_type = self._classify_question(question, chat_history)

        # Loại 1: hỏi về lịch sử hội thoại
        if question_type == "history":
            history_text = self._format_history_for_llm(chat_history)
            prompt = f"""Dựa vào lịch sử cuộc trò chuyện dưới đây, hãy trả lời câu hỏi của người dùng.
                Lịch sử hội thoại:
                {history_text}

Câu hỏi: {question}
Trả lời (bằng tiếng Việt, thân thiện):"""
            response = self.llm.invoke(prompt)
            return {"answer": response.content, "sources": []}

        # Loại 2: chào hỏi thông thường
        if question_type == "general":
            prompt = f"""Bạn là trợ lý AI của VeMart - cửa hàng thương mại điện tử.
                Hãy trả lời thân thiện, ngắn gọn bằng tiếng Việt.
                Câu hỏi: {question}
                Trả lời:"""
            response = self.llm.invoke(prompt)
            return {"answer": response.content, "sources": []}

        # Loại 3: hỏi về sản phẩm/danh mục → RAG
        docs    = self._retrieve(question)
        sources = list({d.metadata["source"] for d in docs})

        qa_prompt = PromptTemplate(
            input_variables=["context", "question"],
            template=SYSTEM_PROMPT + "\nCâu hỏi: {question}\nTrả lời:"
        )
        qa_chain = load_qa_chain(self.llm, chain_type="stuff", prompt=qa_prompt)
        result   = qa_chain.invoke({"input_documents": docs, "question": question})

        return {"answer": result["output_text"], "sources": sources}