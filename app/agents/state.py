import operator
from enum import Enum
from typing import List, Optional, Dict
from typing_extensions import Annotated
from pydantic import BaseModel, Field

class claim_category(str, Enum):
    GENERAL = "general"
    FINANCE = "finance"
    TECH = "tech"
    LEGAL = "legal"
    MEDICAL = "medical"
class EvidenceSource(BaseModel):
    title: str = Field(..., description="The title of the webpage, article, or document section.")
    url: Optional[str] = Field(default=None, description="The direct web url of the source if retrieved from the live web search.")
    origin: Optional[str] = Field(default=None, description="Must be explicitly labeled as either 'General Web Search' or 'Trusted db Scoped Search'.")
    credibility_percentage: int = Field(..., description="The evaluated domain credibility score from 0 to 100")
    extracted_snippet: str = Field(..., description="The raw semantic sentence or proof block utilized by the models")

class ModelPerspective(BaseModel):
    verdict: str = Field(..., description="The isolated evaluation. Must be: Supported, Refuted or Conflicting")
    confidence_score: Optional[int] = Field(default=None, description="Model certainty score from 0 to 100 based on the evidence collection")
    rationale: str = Field(..., description="Logical step by step reasoning justification behind this perspective")
    cited_sources: List[int] = Field(default_factory=list, description="The specific 2-3 sources indices (1,2,3,...) this agent relies on.")
class ModelPerspectiveMapped(BaseModel):
    verdict: str = Field(..., description="The isolated evaluation. Must be: Supported, Refuted or Conflicting")
    confidence_score: Optional[int] = Field(default=None, description="Model certainty score from 0 to 100 based on the evidence collection")
    rationale: str = Field(..., description="Logical step by step reasoning justification behind this perspective")
    cited_sources: List[EvidenceSource] = Field(default_factory=list, description="The specific 2-3 sources this agent relies on.")

class AgentState(BaseModel):
    raw_input_text: str = Field(..., description="The raw text block from the user or extracted from pdf.")
    isolated_claim: Optional[str] = Field(default=None, description="The isolated claim extracted from the raw input by the system")
    category: claim_category = claim_category.GENERAL
    retrieved_evidence: Annotated[List[EvidenceSource], operator.add] = Field(default_factory=list)
    agent1_perspective: Optional[ModelPerspectiveMapped] = Field(default=None)
    agent2_perspective: Optional[ModelPerspectiveMapped] = Field(default=None)
    debate_transcript: Annotated[List[Dict[str, str]], operator.add] = Field(default_factory=list)
    final_verdict: Optional[str] = Field(default=None, description="The final system verdict of the user input.")
    final_justification: Optional[str] = Field(default=None, description="Final system logical explanation behind the final verdict.")
    system_confidence: int = Field(default=0, description="Overall system confidence score from 0 to 100")
    final_top_sources: List[EvidenceSource] = Field(default_factory=list, description="The top sources used for the justification")
    # metadata: Dict[str, Any] = Field(default_factory=dict, description="Execution times, token usage, and system stats")
class FinalVerificationState(BaseModel):
    final_verdict: str = Field(..., description="The final evaluation outcome, Must be either 'Supported', 'Refuted', 'Conflicting'")
    final_justification: str=  Field(..., description="The final step by step logical justification as to why the final verdict was chosen.")
    system_confidence: int = Field(..., ge=0, le=100, description="The aggregated final confidence score.")
    top_sources: List[int] = Field(..., description= "The final validated source indices used for arbitration.")

    

