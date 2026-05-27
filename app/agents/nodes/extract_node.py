from langchain_openai import ChatOpenAI # type: ignore
from pydantic import BaseModel, Field
from app.agents.state import AgentState

class ClaimExtraction(BaseModel):
    extracted_claim: str = Field(..., description="Clean, atomic, factual claim stripped of conversational filler")

async def extract_claim_node(state: AgentState) -> dict:
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.0)
    structured_llm = llm.with_structured_output(ClaimExtraction)
    system_prompt = (
        "You are an expert forensic data analyst. Your job is to analyze messy user input, "
        "strip away all conversational filler, emotional rhetoric, background fluff, and nuance, "
        "and isolate the core target factual claim that needs to be verified.\n\n"
        f"User Input text:\n{state.raw_input_text}"
    )
    result: ClaimExtraction = await structured_llm.ainvoke(system_prompt)
    return {
        "isolated_claim": result.extracted_claim
    }


