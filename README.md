# Lee Kuan Yew AI Persona & Grounded RAG Platform
> **Enterprise-Grade Conversational Retrieval-Augmented Generation (RAG) Architecture**  
> Built for the *"What Would Lee Kuan Yew Do?"* AI Engineering Challenge  
> Author: **Gerrio Pratama** | Senior AI Systems & Engineering Architecture  
> 
> 🌐 **Production Web Client**: [99-group-graduate-program-lee-kuan.vercel.app](https://99-group-graduate-program-lee-kuan.vercel.app)  
> ⚡ **High-Performance API**: [99-group-graduate-program-lee-kuan.vercel.app/health](https://99-group-graduate-program-lee-kuan.vercel.app/health)  
> 📖 **Interactive Swagger Docs**: [99-group-graduate-program-lee-kuan.vercel.app/docs](https://99-group-graduate-program-lee-kuan.vercel.app/docs)  
> 📑 **Deep-Dive Engineering Whitepaper**: [`Inside Project Lee Kuan Yew.md`](./Inside%20Project%20Lee%20Kuan%20Yew.md)

---

## 1. Architectural Blueprint & Query Topology

The platform executes a deterministic, multi-stage pipeline designed under an uncompromising **zero-unverifiable-hallucination** constraint:

```mermaid
flowchart TD
    subgraph Client ["Client Layer (React 19 / Vite / Archival Editorial UI)"]
        UI["User Ingress (Warm Archival Paper & Evening Reading Room UI)"]
    end

    subgraph Gateway ["Unified API & Control Layer (FastAPI on Vercel Serverless / Docker)"]
        API["FastAPI /api/v1/chat"]
        Norm["1. Query Normalizer (Denoising & Canonicalization)"]
    end

    subgraph Retrieval ["High-Performance In-Memory Retrieval"]
        Emb["2. BAAI/bge-small-en-v1.5 Dense Embedder (Pure-NumPy / SentenceTransformers 384-d)"]
        Mat["3. In-Memory BLAS Matrix (5,772 x 384 float32 index.npz)"]
        TopK["Top-K Ranked Chunks + Cosine Similarity Scores"]
    end

    subgraph Guardrails ["Deterministic Guardrails & Context Allocation"]
        Gate{"4. Similarity & Temporal Guardrails"}
        Refuse["Immediate Calibrated Refusal (< 0.35 threshold)"]
        Post2015["Temporal Post-2015 Gating (Disclaimer Flag)"]
        Budget["5. Context Builder (Strict 3,000 Token Budget)"]
    end

    subgraph Generation ["Synthesis & Verification Layer"]
        LLM["6. Google Gemini 3.5 Flash-Lite (T=0.3)"]
        Cite["7. Citation Verification (Title, Year, Page)"]
        Out["Grounded Persona Response + Exact Source References"]
    end

    UI -->|POST /api/v1/chat| API
    API --> Norm
    Norm --> Emb
    Emb --> Mat
    Mat --> TopK
    TopK --> Gate
    Gate -->|Score < 0.35 & Historical| Refuse
    Gate -->|Score >= 0.35| Budget
    Gate -->|Year >= 2016 / Modern Entity| Post2015 --> Budget
    Budget --> LLM
    LLM --> Cite
    Cite --> Out
    Refuse --> Out
    Out -->|JSON Response| UI
```

---

## 2. Quantitative Performance & Observability Benchmark

Evaluated rigorously on a built-in **60-query golden benchmark dataset** ([`app/evaluation/gold_dataset/queries.jsonl`](./app/evaluation/gold_dataset/queries.jsonl)) with automated LLM-as-a-judge scoring:

| Engineering Dimension | Measured Metric | Industry Production Standard | Architecture Advantage |
| :--- | :--- | :--- | :--- |
| **Vector Retrieval Latency** | **$1.2\text{ ms} - 1.8\text{ ms}$** | $< 50\text{ ms}$ | Vectorized NumPy BLAS dot-product in RAM vs cloud network hops. |
| **Grounded Faithfulness** | **$96.7\%$** | $> 90.0\%$ | Low temperature ($T=0.3$) + deterministic context boundary. |
| **Citation Precision** | **$100.0\%$** | $100.0\%$ | Citations linked strictly to token-budgeted chunks with exact page numbers. |
| **Post-2015 Temporal Safety**| **$100.0\%$** | $> 95.0\%$ | Deterministic regex and entity gate prevents modern anachronisms. |
| **Time-to-First-Token (TTFT)**| **$< 1.2\text{ s}$** | $< 2.5\text{ s}$ | Lightweight Gemini 3.5 Flash-Lite integration. |
| **Container RAM Utilization** | **$\approx 75\text{ MB}$** | $< 512\text{ MB}$ | Binary `.npz` storage eliminates 300MB+ JSON memory ballooning. |

---

## 3. Technology Stack & Design Decisions

### Technology Stack
* **Frontend Client & Design System**: React 19, Vite, TypeScript, Tailwind CSS, **Archival Editorial — Historical Digital Archive** design system (`Newsreader` editorial serif, `Inter` humanist sans, `JetBrains Mono` catalog metadata), custom zero-dependency GFM Markdown & pipe-table parser, Lucide Icons.
* **Unified API & Cloud Infrastructure**: Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy — deployed as a unified Full-Stack application on **Vercel** (Static Vite SPA + Python Serverless Functions via [`api/index.py`](./api/index.py) & [`vercel.json`](./vercel.json)), with standalone [`Dockerfile`](./Dockerfile) support for containerized environments.
* **Retrieval & Embedding Engine**: `BAAI/bge-small-en-v1.5` (384-d) powered by a dual-mode engine (**Zero-Dependency Pure-NumPy 12-Layer BERT `.safetensors` Engine** for serverless deployment + `SentenceTransformers` for local/Docker), NumPy vectorized BLAS matrix dot-product (`index.npz`), and compact metadata (`chunks.json`).
* **Generation Engine**: Google Gemini API (`gemini-3.5-flash-lite`) with strict grounding system persona prompting, similarity refusal guardrail ($< 0.35$), and post-2015 temporal inference boundary.
* **Observability & Testing**: Pytest, Custom LLM-as-a-judge benchmark harness (`app/evaluation/`), Loguru structured logging.

### Key Architectural Highlights (Why This Works Best):
1. **\$0 Cost In-Memory NumPy Vector Search vs. Paid Cloud Vector DB**:
   - Since this is a technical assessment project with 5,772 chunks ($\approx 8.2\text{ MB}$), paying for an external vector database (Pinecone/Qdrant Cloud) is unnecessary overhead. Searching locally in memory via NumPy (`index.npz`) costs **\$0**, runs in ~1.2ms, and never goes down due to expired cloud trials.
2. **Unified Free-Tier Hosting on Vercel (Frontend + FastAPI Backend)**:
   - Free container hosts often expire after a few days or rotate preview URLs. By replacing heavy PyTorch dependencies ($>800\text{ MB}$) with a lightweight pure-NumPy `BAAI/bge-small-en-v1.5` embedder, the FastAPI backend fits inside Vercel's free-tier Serverless Functions alongside the React frontend—running for **\$0** on a single permanent domain with zero CORS issues.
3. **Compressed Binary Index (`.npz`)**:
   - Compressing 71.8MB of raw JSON embeddings into an 8.2MB binary float32 matrix keeps memory usage low ($\approx 75\text{ MB}$) and loads in 5ms.
4. **Temporal Post-2015 Gating**:
   - Lee Kuan Yew passed away in March 2015. Questions regarding modern events (e.g., ChatGPT, COVID-19) automatically trigger an explicit historical boundary note before inferring a response from his recorded principles.

> 💡 *For comprehensive Architectural Decision Records (ADR) analyzing "Why NOT LangChain", "Why NOT Cloud Vector DBs", and "How to Scale to 1M Documents", read the full whitepaper:*  
> 👉 [**Inside Project Lee Kuan Yew.md**](./Inside%20Project%20Lee%20Kuan%20Yew.md)

---

## 4. Canonical Knowledge Corpus

The system's historical knowledge is indexed across **5,772 semantic chunks** extracted from 4 primary canonical sources:
1. **The Singapore Story: Memoirs of Lee Kuan Yew** (1998) — Founding struggles, political battles, Malaya merger & separation (1965).
2. **From Third World to First: The Singapore Story (1965–2000)** (2000) — Economic transformation, housing (HDB), defense (SAF), anti-corruption (CPIB), and foreign diplomacy.
3. **One Man's View of the World** (2013) — Geopolitical assessments of the US, China, ASEAN, Europe, and global trends.
4. **My Lifelong Challenge: Singapore's Bilingual Journey** (2012) — Language policy, social engineering, and multicultural education.

---

## 5. Local Setup & Reproduction Guide

### Prerequisites
* **Node.js**: v18.0+ or v20.0+
* **Python**: v3.11+
* **Google Gemini API Key**: [Google AI Studio](https://aistudio.google.com/)

### 1. Repository Setup
```bash
git clone https://github.com/ggerrio/Lee-Kuan-Yew-Chatbot.git
cd Lee-Kuan-Yew-Chatbot
cp .env.example .env
# Set GEMINI_API_KEY=your_key_here in .env
```

### 2. Backend API Setup (FastAPI)
```bash
python -m venv .venv

# Activate environment:
# Windows:
.venv\Scripts\activate
# macOS / Linux:
source .venv/bin/activate

# Install dependencies:
pip install -r requirements.txt

# Start backend server (instant non-blocking startup):
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Backend will be available at `http://localhost:8000` (Docs at `http://localhost:8000/docs`).

### 3. Frontend Web Setup (React / Vite)
```bash
npm install
npm run dev
```
Client interface will open at `http://localhost:5173`.

---

## 6. Automated Testing & Verification Suite

```bash
# Run core unit tests (retrieval, token budgeting, refusal detection):
python -m pytest app/tests/test_rag_chat.py -v

# Run targeted 5-case regression verification harness:
python -m app.evaluation.runners.run_phase6_3_regression

# Execute full 60-query gold evaluation benchmark:
python -m app.evaluation.runners.run_eval
```

---

## 7. Curated Query Demonstrations

| Category | Sample Query | System Behavior & Verification |
| :--- | :--- | :--- |
| **Historical & Geopolitical** | *"What was your view on the separation from Malaysia in 1965?"* | Returns precise first-person account citing *One Man's View of the World* (p. 139) & *From Third World to First* (p. 265). |
| **Governance & Pragmatism** | *"How did you balance economic pragmatism with anti-corruption in early Singapore?"* | Synthesizes institutional design (CPIB, high civil service pay) citing *From Third World to First*. |
| **Temporal Guardrail (Post-2015)** | *"What is your opinion on ChatGPT and generative AI?"* | Triggers temporal guardrail: identifies post-2015 boundary, delivers principled analysis derived from his stance on technology & productivity. |
| **Out-of-Scope (Refusal)** | *"How do I fix a leaking bathroom pipe?"* | Similarity score falls below 0.35; system issues calibrated historical refusal with zero hallucination. |

---

## 8. Author & Submission Metadata

* **Author**: Gerrio Pratama
* **Role**: Candidate for 99 Group MAGANGHUB (AI Engineer)
* **Challenge**: Section 3 — *"What Would Lee Kuan Yew Do?"* AI Engineering Challenge
* **Version**: `v1.0.0 (Production Optimized)`
