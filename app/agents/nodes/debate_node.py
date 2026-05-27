from langchain_openai import ChatOpenAI
from app.agents.state import AgentState
import asyncio
async def debate_node(state: AgentState) -> dict:
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.4)
    evidence_context = ""
    if not state.agent1_perspective or not state.agent2_perspective:
        return {"debate_transcript": []}
    if state.retrieved_evidence:
        for idx, source in enumerate(state.retrieved_evidence, 1):
            evidence_context += f"Source {idx} ({source.origin}) ({source.extracted_snippet})\n"
    else:
        evidence_context = "No evidence found for this claim \n"
    agent1_prompt = (
        "You are Agent 1 (The Optimistic Corroborator). You are inside a formal fact-checking cross-examination.\n"
        f"The target claim is: '{state.isolated_claim}'\n\n"
        f"Your opening position was '{state.agent1_perspective.verdict}' because: \"{state.agent1_perspective.rationale}\"\n\n"
        f"Your opponent, Agent 2 (The Adversarial Skeptic), has countered with a '{state.agent2_perspective.verdict}' verdict, arguing:\n"
        f"\"{state.agent2_perspective.rationale}\"\n\n"
        f"RAW GROUND TRUTH EVIDENCE:\n{evidence_context}\n"
        "TASK:\n"
        "Write a sharp, direct rebuttal to Agent 2's brief. Point out where their skepticism ignores explicit data points "
        "in the source snippets, expose any overly cynical logical leaps they made, and defend your validation. Do not repeat your opening brief."
    )
    agent2_prompt = (
        "You are Agent 2 (The Adversarial Skeptic). You are inside a formal fact-checking cross-examination.\n"
        f"The target claim is: '{state.isolated_claim}'\n\n"
        f"Your opening position was '{state.agent2_perspective.verdict}' because: \"{state.agent2_perspective.rationale}\"\n\n"
        f"Your opponent, Agent 1 (The Optimistic Corroborator), has countered with a '{state.agent1_perspective.verdict}' verdict, arguing:\n"
        f"\"{state.agent1_perspective.rationale}\"\n\n"
        f"RAW GROUND TRUTH EVIDENCE:\n{evidence_context}\n"
        "TASK:\n"
        "Write a sharp, direct rebuttal to Agent 1's brief. Tear their optimism apart. Point out where they are falling victim "
        "to confirmation bias, highlight assumptions they made that aren't explicitly backed by the source text, and show why "
        "the evidence they rely on is weak or incomplete. Do not repeat your opening brief."
    )
    task1 = llm.ainvoke([{"role":"user", "content": agent1_prompt}])
    task2 = llm.ainvoke([{"role":"user", "content": agent2_prompt}])
    response1, response2 = await asyncio.gather(task1, task2)
    new_transcript_entry = [
        {
            "speaker": "Agent 1 (Optimist)",
            "content": response1.content.strip()
        },
        {
            "speaker": "Agent 2 (Skeptic)",
            "content": response2.content.strip()
        }
    ]
    return {
        "debate_transcript": new_transcript_entry
    }


