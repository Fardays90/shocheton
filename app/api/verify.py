from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
router = APIRouter(prefix="/api/v1/verify", tags=["Fact verification engine"])

class requestPayload(BaseModel):
    text_input: str = Field(
        ...,
        description="The unverified claim or body sent by the user",
        examples="NASA discovered a new planet with humanlike life forms yesterday"
    )
    pdf: bool = Field(default=False)
    pdfContent: str = Field(...)