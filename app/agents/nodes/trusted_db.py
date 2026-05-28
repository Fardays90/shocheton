import os
import chromadb
import asyncio
from app.agents.state import AgentState, EvidenceSource
from tavily import AsyncTavilyClient

DB_PATH = os.path.join(os.getcwd(), "chroma_storage")
chroma_client = chromadb.PersistentClient(path=DB_PATH)
collection = chroma_client.get_or_create_collection(name="trusted_sources_docs")

async def trusted_db_node(state: AgentState) -> dict:
    if not state.isolated_claim:
        return {"retrieved_evidence": []}
    def sync_lookup():
        return collection.get(
            where={"category": state.category.value}
        )
    lookup_results = await asyncio.to_thread(sync_lookup)
    domains = lookup_results.get("documents", []) if lookup_results else []
    query_string = state.isolated_claim
    if domains:
        site_filters = " OR ".join([f"site:{d}" for d in domains])
        query_string = f"{state.isolated_claim} ({site_filters})"
    tavily_client = AsyncTavilyClient()
    try:
        response = await tavily_client.search(
            query=query_string,
            search_depth='advanced',
            max_results=3
        )
        new_evidence = []
        for result in response.get("results", []):
            new_evidence.append(
                EvidenceSource(
                    title=result.get("title", "Verified Source Document"),
                    url=result.get("url", ""),
                    origin=f"Trusted db Scoped Search ({state.category.value})",
                    credibility_percentage=90 if domains else 70,
                    extracted_snippet=result.get("content", "")
                )
            )
        return {"retrieved_evidence": new_evidence}
    except Exception as e:
        print(f"Precise scoped web search node failed: {e}")
        return {"retrieved_evidence": []}