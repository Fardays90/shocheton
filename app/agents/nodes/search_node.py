import os
from tavily import AsyncTavilyClient #type: ignore
from app.agents.state import AgentState, EvidenceSource

async def web_search_node(state: AgentState) -> dict:
    if not state.isolated_claim:
        return {
            "retrieved_evidence": []
        }
    api_key = os.getenv("TAVILY_KEY")
    tavily_client = AsyncTavilyClient(api_key=api_key)
    response = await tavily_client.search(
        query=state.isolated_claim,
        search_depth='advanced',
        max_results=3
    )
    raw_results = response.get("results", [])
    structured_sources = []
    for raw in raw_results:
        raw_score = raw.get("score", 0.75)
        calculated_cred = min(100, max(0, (int)(raw_score * 100)))
        source = EvidenceSource(
            title= raw.get("title", "Untitled Source"),
            url = raw.get("url"),
            origin="General Web Search",
            credibility_percentage=calculated_cred,
            extracted_snippet=raw.get("content","").strip()
            )
        structured_sources.append(source)
    return {
        "retrieved_evidence": structured_sources
    }

    

    

