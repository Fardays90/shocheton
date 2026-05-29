from app.agents.state import AgentState, FinalVerificationState
from langchain_openai import ChatOpenAI

async def moderator_node(state: AgentState) -> dict:
    if not state.debate_transcript:
        return {
            "final_verdict": "Conflicting",
            "final_justification": "System Error: No debate transcript was recorded to evaluate.",
            "system_confidence": 0,
            "final_top_sources": []
        }
    evidence_dump = ""
    if state.retrieved_evidence:
        for idx, evidence in enumerate(state.retrieved_evidence, 1):
            evidence_dump += (
                f"\nEvidence - {idx}\n"
                f"Title: {evidence.title}\n"
                f"URL: {evidence.url}\n"
                f"Credibility percentage: {evidence.credibility_percentage}\n"
                f"Origin: {evidence.origin}\n"
                f"Snippet of the evidence: {evidence.extracted_snippet}\n"
            )
    else:
        evidence_dump += "\n No external evidence for the claim had been found \n"    
    debate_transcript_str = ""
    if state.debate_transcript:
        for script in state.debate_transcript:
            speaker = script.get("speaker")
            content = script.get("content")
            debate_transcript_str += (
                f"\nREBUTTAL BY {speaker}\n"
                f"\nREBUTTAL - {content}\n"
                )
    else:
        debate_transcript_str += "N/A"
    system_instruction = (
        "You are the Chief Justice and Supreme Moderator of an advanced adversarial fact-checking network.\n"
        "Your task is to review a complete case file and render an absolute, ironclad final verdict with verifiable citations.\n\n"
        "YOUR CASE FILE CONTAINS:\n"
        "1. The Core Isolated Claim\n"
        "2. The Raw Upstream Evidence Snippets (The objective source of truth numbered 1, 2, 3...)\n"
        "3. Agent 1's Perspective (Optimistic validation)\n"
        "4. Agent 2's Perspective (Hyper-skeptical cross-examination)\n"
        "5. The Cross-Rebuttal Transcript (Direct argumentation between the agents)\n\n"
        "CRITICAL CITATION RULES:\n"
        "- Base your decision strictly on the provided 'RAW UPSTREAM EVIDENCE SNIPPETS'.\n"
        "- In your 'final_justification', explicitly reference statements using source brackets like [Source 1] or [Source 2].\n"
        "- your final_verdict must be only either one of these 3 options 'Supported', 'Refuted' or 'Conflicting' "
        "- In your 'top_sources' ONLY make a list of integers corresponding to the evidence number as sent in the original user prompt (1,2,...)"
        "- Ensure indices are mathematically valid: if there are 4 sources, values must be between 1 and 4. Never invent source numbers."
        "- In your 'system_confidence' generate a confidence score of the final justification and verdict an integer between 0 and 100"
    )
    case_file_payload = (
        f"### 1. CORE CLAIM TO JUDGE ###\n{state.isolated_claim}\n\n"
        f"### 2. RAW UPSTREAM EVIDENCE SNIPPETS ###\n{evidence_dump}\n"
        f"### 3. AGENT 1 OPENING BRIEF (OPTIMIST) ###\n"
        f"Verdict: {state.agent1_perspective.verdict if state.agent1_perspective else 'N/A'}\n"
        f"Rationale: {state.agent1_perspective.rationale if state.agent1_perspective else 'N/A'}\n\n"
        f"### 4. AGENT 2 OPENING BRIEF (SKEPTIC) ###\n"
        f"Verdict: {state.agent2_perspective.verdict if state.agent2_perspective else 'N/A'}\n"
        f"Rationale: {state.agent2_perspective.rationale if state.agent2_perspective else 'N/A'}\n\n"
        f"### 5. TARGETED REBUTTAL TRANSCRIPT ###\n{debate_transcript_str}"
    )
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)
    structured_llm = llm.with_structured_output(FinalVerificationState)
    prompt = [{"role": "system", "content": system_instruction}, {"role": "user", "content": case_file_payload}]
    response = await structured_llm.ainvoke(prompt)
    sources_mapped = []
    for idx in response.top_sources:
        if 0 < idx <= len(state.retrieved_evidence):
            sources_mapped.append(state.retrieved_evidence[idx - 1])
    return {
        "final_verdict": response.final_verdict,
        "final_justification": response.final_justification,
        "system_confidence": response.system_confidence,
        "final_top_sources": sources_mapped
    }


