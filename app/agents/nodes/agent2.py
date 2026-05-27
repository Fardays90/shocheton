from langchain_openai import ChatOpenAI
from app.agents.state import AgentState, ModelPerspective, ModelPerspectiveMapped

async def agent2_node(state: AgentState) -> dict:
    if not state.isolated_claim:
        return {
            "agent2_perspective": ModelPerspective(
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
        "You are a hyper-skeptical, adversarial cross-examination agent operating inside a multi-agent fact-checking pipeline.\n\n"
        "YOUR CORE MISSION:\n"
        "Analyze the provided 'Isolated Claim' against the collected 'Retrieved Evidence Context'. "
        "Actively look for contradictions, logical gaps, missing context, weak source credibility, or outright counter-evidence that refutes the claim.\n"
        "Be uncharitable: assume the claim is unverified or false until proven true by flawless, high-credibility proof. "
        "Do not invent data, but aggressively highlight every flaw, assumption, or omission in the provided sources.\n\n"
        "CRITICAL RULES FOR STRUCTURED OUTPUT:\n"
        "1. For 'verdict', choose strictly from these exact options:\n"
        "   - 'Refuted': If the evidence directly contradicts, disproves, or fails to logically sustain the claim.\n"
        "   - 'Conflicting': If the context contains massive contradictions between sources, or if there is entirely insufficient evidence to support it.\n"
        "   - 'Supported': ONLY choose this if the evidence is so bulletproof, explicit, and highly credible that it is impossible to argue against.\n"
        "2. For 'confidence_score', assign an integer from 0 to 100 based on how strongly you feel your cynical assessment holds up against the context.\n"
        "3. For 'rationale', provide a critical, step-by-step uncharitable logical breakdown exposing the weaknesses, gaps, or outright falsities of the claim based on the sources.\n"
        "4. For 'cited_sources', return an array of integers representing the Source IDs (e.g., [1, 2]) that directly expose the claim's flaws or contain contradictory information."
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
        if 0 < i <= len(state.retrieved_evidence):
            cited_sources_chosen.append(state.retrieved_evidence[i - 1])

    structured_response = ModelPerspectiveMapped(
        verdict=resp.verdict,
        confidence_score=resp.confidence_score,
        rationale=resp.rationale,
        cited_sources = cited_sources_chosen
    )
    return {"agent2_perspective": structured_response}