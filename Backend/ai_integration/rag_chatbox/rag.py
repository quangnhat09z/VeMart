import os, json, uuid, shutil
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_groq import ChatGroq
# from langchain.chains import ConversationalRetrievalChain
from langchain_classic.chains import ConversationalRetrievalChain
from langchain_classic.prompts import PromptTemplate

SYSTEM_PROMPT = """Bạn là trợ lý AI của VeMart - cửa hàng thương mại điện tử.
Chỉ trả lời dựa trên thông tin được cung cấp trong context bên dưới.
Nếu không tìm thấy thông tin liên quan, hãy nói: "Xin lỗi, tôi không có thông tin về vấn đề này."
Trả lời thân thiện, ngắn gọn, bằng tiếng Việt.

Context: {context}
"""

class RAGPipeline:
    def __init__(self):
        self.model_name   = "sentence-transformers/all-MiniLM-L6-v2"
        self.groq_model   = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        self.kb_path      = "knowledge-base"
        self.embeddings   = HuggingFaceEmbeddings(model_name=self.model_name)
        self.product_vs   = None
        self.category_vs  = None

        self.llm          = ChatGroq(
            temperature=0.7,
            model_name=self.groq_model,
            groq_api_key=os.getenv("GROQ_API_KEY"),
        )

    # ── Data loading ──────────────────────────────────────────
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
        print(f"📄 Loaded {len(docs)} documents from {folder}")
        return docs

    # ── Build / load vectorstore ───────────────────────────────
    def load_or_build_vectorstore(self):
        product_dir  = "vector_db_products"
        category_dir = "vector_db_categories"

        # Nếu đã có thì load lại, không cần build lại từ đầu
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
        all_docs   = products + categories

        chunks = splitter.split_documents(all_docs)
        product_chunks  = [c for c in chunks if c.metadata["type"] == "product"]
        category_chunks = [c for c in chunks if c.metadata["type"] == "categories"]

        self.product_vs = Chroma.from_documents(
            product_chunks,  self.embeddings,
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
        if has_c and not has_p:
            return "category"
        if has_p and not has_c:
            return "product"
        return "both"

    def _retrieve(self, query: str) -> list[Document]:
        qtype = self._detect_query_type(query)
        p_ret = self.product_vs.as_retriever(search_kwargs={"k": 10})
        c_ret = self.category_vs.as_retriever(search_kwargs={"k": 5})
        if qtype == "product":
            return p_ret.invoke(query)
        if qtype == "category":
            return c_ret.invoke(query)
        return p_ret.invoke(query) + c_ret.invoke(query)

    # ── Main query ─────────────────────────────────────────────
    def query(self, question: str, chat_history: list[dict]) -> dict:
        docs    = self._retrieve(question)
        context = "\n\n---\n\n".join(d.page_content for d in docs)
        sources = list({d.metadata["source"] for d in docs})

        # Format chat_history thành list of tuples cho LangChain
        history_tuples = []
        msgs = chat_history[-6:]  # Giữ 3 lượt gần nhất (6 messages)
        for i in range(0, len(msgs) - 1, 2):
            if msgs[i]["role"] == "user" and msgs[i+1]["role"] == "assistant":
                history_tuples.append((msgs[i]["content"], msgs[i+1]["content"]))

        # Build prompt có context
        qa_prompt = PromptTemplate(
            input_variables=["context", "question"],
            template=SYSTEM_PROMPT + "\nCâu hỏi: {question}\nTrả lời:"
        )

        chain = ConversationalRetrievalChain.from_llm(
            llm=self.llm,
            retriever=self.product_vs.as_retriever(),  # retriever placeholder
            combine_docs_chain_kwargs={"prompt": qa_prompt},
        )

        # Override: tự truyền context thay vì để chain tự retrieve
        from langchain_classic.chains.question_answering import load_qa_chain
        qa_chain = load_qa_chain(self.llm, chain_type="stuff", prompt=qa_prompt)
        result   = qa_chain.invoke({"input_documents": docs, "question": question})


        # Check promt
        print("🔍 Prompt sent to LLM:"
              f"\n{qa_prompt.format(context=context, question=question)}")
        return {
            "answer":  result["output_text"],
            "sources": sources
        }
