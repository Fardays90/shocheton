# Adversarial Fact-Checking Pipeline

A multi agent LangGraph pipeline that evaluates claims through structured debate, grounding, and moderated judgment. Built with FastAPI, ChromaDB, and Tavily.

---

## Architecture Overview

The system is organized into six sequential layers, each with a distinct responsibility.

### 1. Ingestion Layer

The entry point accepts requests from a frontend application in two forms:

- **Raw Text Input**: a plain string block containing the claim
- **PDF Document + Text Query**: a document paired with a specific query

### 2. Pre-Processing Gatekeepers

Before any analysis begins, the input passes through a token management stage.

- **Token Counter (Size Check Evaluator)**: evaluates the total token count of the input
  - If the input exceeds **60k tokens**, it is routed to the **Truncation Node**, which enforces the limit before continuing
  - If within limit, it proceeds directly
- **Claim Extraction Node**: isolates the core claim and assigns it a category, producing an `Isolated Claim + Category` for downstream use

### 3. Concurrent Grounding Engine

Two search nodes run in parallel to retrieve supporting evidence:

- **Trusted DB Search Node (Domain Filter Pipeline)**: queries a **ChromaDB** instance (`trusted_sources_docs`) using a domain lookup to retrieve vetted, curated evidence
- **Web Search Node (General Tavily API Call)**: performs a live web search via the **Tavily API** to retrieve broader, real-time evidence

Both nodes append their results as `retrieved_evidence` to the shared state.

### 4. State Synchronization Runtime

- **State Barrier Node (Thread Join & State Reducer)**: acts as a synchronization point that waits for both grounding threads to complete, then merges their outputs into a single **Unified State Map** before passing it forward

### 5. Adversarial Debate Framework

The unified evidence is handed to two competing agents powered by **GPT-4o-mini**:

- **Agent 1 Node (Optimistic)**: constructs the strongest case *in support* of the claim
- **Agent 2 Node (Skeptical)**: constructs the strongest case *against* the claim

Both agents receive the same Unified State Map. Their perspectives (`agent1_perspective`, `agent2_perspective`) are fed into the:

- **Cross-Rebuttal Node (Adversarial Conversation Loop)**: runs a structured back-and-forth exchange between the two agents, producing a **Completed Case File**

### 6. Judgment & Delivery Layer

- **Chief Moderator Node (Case Evaluation & Citation Mapping)** — powered by **GPT-4o**, reviews the completed case file, evaluates the arguments, and maps citations back to their sources
- The state is serialized to JSON and delivered as a **Final State Payload (Structured JSON Response)**

---

## Tech Stack

| Component | Technology |
|---|---|
| Pipeline Orchestration | LangGraph |
| Web Framework | FastAPI |
| ASGI Server | Uvicorn |
| Vector Database | ChromaDB |
| Web Search | Tavily API |
| Debate Agents | GPT-4o-mini |
| Chief Moderator | GPT-4o |

---

## Data Flow Summary

```
Client Request
    └── Token Check (>60k → Truncate)
        └── Claim Extraction
            ├── ChromaDB Search ──┐
            └── Tavily Web Search ┘
                └── State Barrier (Thread Join)
                    ├── Agent 1 (Support)
                    └── Agent 2 (Refute)
                        └── Cross-Rebuttal Loop
                            └── Chief Moderator
                                └── Structured JSON Response
```

---

## API

The service is served via **FastAPI + Uvicorn**.

### Run the server

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Endpoint

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/verify` | Submit a raw text or raw text with pdf claim for evaluation |
