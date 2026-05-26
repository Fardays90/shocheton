export type Verdict = "Supported" | "Refuted" | "Conflicting";

export interface EvidenceSource {
  id: string;
  sourceName: string;
  url: string;
  snippet: string;
  relevanceScore: number;
  publishedDate?: string;
}

export interface Claim {
  id: string;
  claimText: string;
  credibilityScore: number;
  verdict: Verdict;
  reasoning: string;
  evidenceSources: EvidenceSource[];
}

export interface FactCheckSummary {
  overallCredibilityScore: number;
  overallVerdict: Verdict;
  confidenceLevel: "High" | "Medium" | "Low";
  aiReasoningSummary: string;
  totalClaimsAnalyzed: number;
  analyzedAt: string;
}

export interface FactCheckResult {
  id: string;
  inputText: string;
  summary: FactCheckSummary;
  claims: Claim[];
}

export interface HistoryEntry {
  id: string;
  inputText: string;
  analyzedAt: string;
  overallVerdict: Verdict;
  overallCredibilityScore: number;
  totalClaims: number;
  result: FactCheckResult;
}