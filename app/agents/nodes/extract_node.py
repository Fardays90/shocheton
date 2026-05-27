from langchain_openai import ChatOpenAI # type: ignore
from pydantic import BaseModel, Field
from app.agents.state import AgentState

class ClaimExtraction(BaseModel):
    extracted_claim: str = Field(..., description="Clean, atomic, factual claim stripped of conversational filler")

async def extract_claim_node(state: AgentState) -> dict:
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.0)
    structured_llm = llm.with_structured_output(ClaimExtraction)
    system_prompt = (
        "You are an expert fact-checking triage engine.\n"
        "Your job is to analyze the provided input text and isolate the single, primary factual assertion "
        "that requires cross-examination and external verification.\n\n"
        "CRITICAL INSTRUCTIONS:\n"
        "1. Strip away all conversational filler, emotional rhetoric, and meta-commentary.\n"
        "2. If the input contains a 'USER VERIFICATION TARGET' and 'PDF SOURCE CONTEXT', focus strictly on "
        "the core assertion the user wants verified, using the PDF context to resolve any pronouns or vague terms.\n"
        "3. Ensure the output is a single, standalone declarative sentence. It must contain complete context "
        "and proper nouns so that an external search engine can process it cleanly without context clues "
        "(e.g., instead of 'it dropped 15%', write 'Company X's operational overhead dropped by 15% in Q3 2025').\n"
        "4. Convert questions into declarative assertions if necessary."
    )
    prompt = [{"role": "system", "content": system_prompt}, {"role": "user", "content": state.raw_input_text}]
    result = await structured_llm.ainvoke(prompt)
    return {
        "isolated_claim": result.extracted_claim
    }


