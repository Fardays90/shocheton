import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VerdictBadge from "./VerdictBadge";
import CredibilityMeter from "./CredibilityMeter";
import { FactCheckSummary } from "@/lib/types/factcheck";
import { ShieldCheck, Brain, BarChart3, Clock } from "lucide-react";

interface SummaryPanelProps {
  summary: FactCheckSummary;
}

function getScoreRingColor(score: number): string {
  if (score >= 75) return "border-green-400 text-green-600 dark:border-green-500 dark:text-green-400";
  if (score >= 45) return "border-amber-400 text-amber-600 dark:border-amber-500 dark:text-amber-400";
  return "border-red-400 text-red-600 dark:border-red-500 dark:text-red-400";
}

export default function SummaryPanel({ summary }: SummaryPanelProps) {
  return (
    <Card className="border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-green-50/40 via-white to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-zinc-800 dark:text-zinc-200">
            <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            Analysis Summary
          </CardTitle>
          <VerdictBadge verdict={summary.overallVerdict} size="lg" />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Score dial + key metrics row */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Circular score indicator */}
          <div className="shrink-0 flex flex-col items-center gap-1">
            <div
              className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${getScoreRingColor(summary.overallCredibilityScore)}`}
            >
              <span className="text-2xl font-extrabold tabular-nums">
                {summary.overallCredibilityScore}
              </span>
            </div>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">out of 100</span>
          </div>

          {/* Metrics grid */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                <Brain className="w-3 h-3" />
                Confidence
              </div>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                {summary.confidenceLevel}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                <BarChart3 className="w-3 h-3" />
                Claims Found
              </div>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                {summary.totalClaimsAnalyzed}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                <Clock className="w-3 h-3" />
                Analyzed
              </div>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                {new Date(summary.analyzedAt).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Credibility bar */}
        <CredibilityMeter score={summary.overallCredibilityScore} label="Overall Credibility" />

        {/* AI reasoning */}
        <div className="space-y-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            AI Reasoning Summary
          </p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {summary.aiReasoningSummary}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
