"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Upload, Sparkles, ArrowLeft, ShieldCheck } from "lucide-react";
import SummaryPanel from "@/components/fact-check/SummaryPanel";
import ClaimCard from "@/components/fact-check/ClaimCard";
import { FactCheckResult } from "@/lib/types/factcheck";
import { mockFactCheck } from "@/lib/api/mockFactCheck";
import { useHistory } from "@/lib/hooks/useHistory";

/* ------------------------------------------------------------------ */
/*  Inner component that reads searchParams (must be inside Suspense) */
/* ------------------------------------------------------------------ */
function FactCheckInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addEntry } = useHistory();

  const queryFromUrl = searchParams.get("query") ?? "";

  const [input, setInput] = useState(queryFromUrl);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FactCheckResult | null>(null);

  /* ---- Run analysis and persist to history ---- */
  const runAnalysis = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      setLoading(true);
      setResult(null);

      const data = await mockFactCheck(text);
      setResult(data);

      // Persist to localStorage via our history hook
      addEntry({
        id: data.id,
        inputText: text,
        analyzedAt: data.summary.analyzedAt,
        overallVerdict: data.summary.overallVerdict,
        overallCredibilityScore: data.summary.overallCredibilityScore,
        totalClaims: data.summary.totalClaimsAnalyzed,
        result: data,
      });

      setLoading(false);
    },
    [addEntry],
  );

  /* ---- Auto-analyze if a query was passed via the URL ---- */
  useEffect(() => {
    if (queryFromUrl) {
      setInput(queryFromUrl);
      runAnalysis(queryFromUrl);
    }
    // Only run once when the page loads with a query
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- Manual submit handler ---- */
  const handleAnalyze = async () => {
    await runAnalysis(input);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page header */}
      <div className="space-y-1">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-green-600 dark:text-green-400" />
          Fact Check
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Enter text containing factual claims to analyze, or paste a URL snippet.
        </p>
      </div>

      {/* Input card */}
      <Card className="border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm shadow-sm">
        <CardContent className="pt-6 space-y-4">
          <Textarea
            placeholder="Paste any text with factual claims… e.g. 'The Great Wall of China is visible from space. Humans only use 10% of their brain.'"
            className="min-h-[140px] resize-none border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus-visible:ring-green-400/30 focus-visible:border-green-500 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <Button
              variant="outline"
              className="gap-2 border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400"
              disabled
            >
              <Upload className="w-4 h-4" /> Upload Document (coming soon)
            </Button>
            <Button
              onClick={handleAnalyze}
              disabled={loading || !input.trim()}
              className="bg-green-700 hover:bg-green-800 text-white gap-2 min-w-[160px] shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Analyze Claims
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading skeleton */}
      {loading && !result && (
        <div className="space-y-4 animate-pulse">
          <div className="h-48 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-32 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-32 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
        </div>
      )}

      {/* Results dashboard */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <SummaryPanel summary={result.summary} />

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
              Extracted Claims ({result.claims.length})
            </h2>
            <div className="space-y-4">
              {result.claims.map((claim, i) => (
                <ClaimCard key={claim.id} claim={claim} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty state — no query and no result */}
      {!loading && !result && !queryFromUrl && (
        <Card className="border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
          <CardContent className="py-16 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto" />
            <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">
              Ready to analyze
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
              Paste a statement, article excerpt, or social media post above and click
              &ldquo;Analyze Claims&rdquo; to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page wrapper with Suspense boundary for useSearchParams           */
/* ------------------------------------------------------------------ */
export default function FactCheckPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        </div>
      }
    >
      <FactCheckInner />
    </Suspense>
  );
}