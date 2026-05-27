from tavily import AsyncTavilyClient #type: ignore
from app.agents.state import AgentState, EvidenceSource

async def parallel_retriever_node(state: AgentState) -> dict:
    if not state.isolated_claim:
        return {
            "retrieved_evidence": []
        }
    tavily_client = AsyncTavilyClient()
    response = await tavily_client.search(
        query=state.isolated_claim,
        search_depth='basic',
        max_results=3
    )
    raw_results = response.get("results", [])
    structured_sources = []
    for raw in raw_results:
        raw_score = raw.get("score", 0.75)
        calculated_cred = (int)(raw_score * 100)
        source = EvidenceSource(
            title= raw.get("title", "Untitled Source"),
            url = raw.get("url"),
            origin="Web Search",
            credibility_percentage=calculated_cred,
            extracted_snippet=raw.get("content","")
            )
        structured_sources.append(source)
    return {
        "retrieved_evidence": structured_sources
    }

    

    

