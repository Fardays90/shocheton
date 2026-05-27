from langchain_openai import ChatOpenAI
from app.agents.state import AgentState, ModelPerspective, ModelPerspectiveMapped

async def agent1_node(state: AgentState) -> dict:
    if not state.isolated_claim:
        return {
            "agent1_perspective": ModelPerspective(
                verdict="Conflicting",
                confidence_score=0,
                rationale="No cited sources found",
                cited_sources=[]
            )
        }
    evidence_context = ""
    if not state.retrieved_evidence:
        evidence_context = "No relevant web or db sources found for claim"
    else:
        for idx, source in enumerate(state.retrieved_evidence,1):
            evidence_context += (
                f"\n --- Source [{idx}] --- \n"
                f"Title: {source.title}\n"
                f"URL: {source.url}\n"
                f"Origin: {source.origin}\n"
                f"Crediblity rating: {source.credibility_percentage}%\n"
                f"Extracted Snippet: {source.extracted_snippet}\n"
            )
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.4)
    structured_llm = llm.with_structured_output(ModelPerspective)
    system_instruction = (
        "You are an optimistic, analytical corroboration agent operating inside an adversarial multi-agent system.\n\n"
        "YOUR CORE MISSION:\n"
        "Analyze the provided 'Isolated Claim' against the collected 'Retrieved Evidence Context'. "
        "Actively look for alignments, validations, implicit agreements, and direct corroborations that prove the claim is correct. "
        "Be generous but stay strictly factual—do not invent data out of thin air.\n\n"
        "CRITICAL RULES FOR STRUCTURED OUTPUT:\n"
        "1. For 'verdict', choose strictly from these exact options:\n"
        "   - 'Supported': If the evidence strongly validates or correlates positively with the claim.\n"
        "   - 'Refuted': If the evidence directly contradicts, disproves, or denies the claim.\n"
        "   - 'Conflicting': If some sources agree while others disagree, or if there is entirely insufficient context to verify it.\n"
        "2. For 'confidence_score', assign an integer from 0 to 100 based on the strength and credibility percentages of the matching sources.\n"
        "3. For 'rationale', provide a detailed, step-by-step logical breakdown showing how you found supporting connections.\n"
        "4. For 'cited_sources', filter the 'Retrieved Evidence Context' array down to the top 2-3 specific EvidenceSource objects you heavily relied on to form this perspective.\n"
    )
    user_input = (
        f"Isolated claim to investigate: {state.isolated_claim}\n\n"
        f"Retrieved evidence Context: \n {evidence_context}"
    )
    resp = await structured_llm.ainvoke([
        {"role":"system", "content": system_instruction},
        {"role":"user", "content":user_input}
    ])
    indices = resp.cited_sources or []
    cited_sources_chosen = []
    for i in indices:
        if 0 < i < len(state.retrieved_evidence):
            cited_sources_chosen.append(state.retrieved_evidence[i - 1])

    structured_response = ModelPerspectiveMapped(
        verdict=resp.verdict,
        confidence_score=resp.confidence_score,
        rationale=resp.rationale,
        cited_sources = cited_sources_chosen
    )
    return {"agent1_perspective": structured_response}