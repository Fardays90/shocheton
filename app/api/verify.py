from typing import Optional
from fastapi import APIRouter, HTTPException, status, FastAPI
from pydantic import BaseModel, Field
from pdf_to_markdown import pdf_to_md
from app.agents.nodes.langgraph import verification_graph

app = FastAPI()

class RequestPayload(BaseModel):
    text_input: str = Field(
        ...,
        description="The unverified claim or body sent by the user",
        examples=["NASA discovered a new planet with humanlike life forms yesterday"]
    )
    pdf: bool = Field(default=False)
    pdfContent: Optional[str] = Field(default=None, description="The pdf content")

@app.post("/api/v1/verify")
async def verify_claim(payload: RequestPayload):
    query_string = ""
    raw_query = payload.text_input
    if payload.pdf:
        if not payload.pdfContent:
            raise HTTPException(
                status_code= status.HTTP_400_BAD_REQUEST,
                detail="Pdf flag raised to true but no pdf content found"
            )
        md = pdf_to_md(payload.pdfContent)
        merged_query = (
            f"Raw input text from user: {raw_query}"
            f"\n --- PDF SOURCE CONTEXT --- \n"
            f"{md}"
        )
        query_string = merged_query
    else:
        query_string = f"Raw input from user: {raw_query}"
    initial_input = {"raw_input_text" : query_string}
    try: 
        final_output_state = await verification_graph.ainvoke(initial_input)
        return final_output_state
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error occured in the engine: {e}"
        )
    





