import os
import chromadb
import asyncio
from app.agents.state import AgentState, EvidenceSource

DB_PATH = os.path.join(os.getcwd(), "chroma_storage")
chroma_client = chromadb.PersistentClient(path=DB_PATH)
collection = chroma_client.get_or_create_collection(name="trusted_sources_docs")

async def trusted_db_node(state: AgentState) -> dict:
    if not state.isolated_claim:
        return {"retrieved_evidence":[]}
    def sync_query():
        return collection.query(
            query_texts=[state.isolated_claim],
            n_results=1
        )
    query_results = await asyncio.to_thread(sync_query)
    if not query_results or not query_results.get("documents") or not query_results.get("documents")[0]:
        return {"retrieved_evidence":[]}
    documents_text = query_results["documents"][0][0]
    metadata = query_results["metadatas"][0][0] if query_results.get("metadatas") else {}
    distance = query_results["distances"][0][0] if query_results.get("distances") else 0.5
    if distance > 0.7:
        return {"retrieved_evidence": []}
    calculated_credibility = max(70, int((1.0 - distance)* 100))

    source_packet = EvidenceSource(
        title=metadata.get("title", "Internal Archive document"),
        url= metadata.get("url", "http://internal.records.local"),
        origin="Internal trusted db",
        credibility_percentage=calculated_credibility,
        extracted_snippet=documents_text
    )
    return {"retrieved_evidence": [source_packet]}

 