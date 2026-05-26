"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Quote } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VerdictBadge from "./VerdictBadge";
import CredibilityMeter from "./CredibilityMeter";
import EvidenceCard from "./EvidenceCard";
import { Claim } from "@/lib/types/factcheck";

interface ClaimCardProps {
  claim: Claim;
  index: number;
}

export default function ClaimCard({ claim, index }: ClaimCardProps) {
  const [expanded, setExpanded] = useState(false);

  const borderTint =
    claim.verdict === "Supported"
      ? "border-green-200/60 dark:border-green-900/30"
      : claim.verdict === "Refuted"
        ? "border-red-200/60 dark:border-red-900/30"
        : "border-amber-200/60 dark:border-amber-900/30";

  const numberBg =
    claim.verdict === "Supported"
      ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
      : claim.verdict === "Refuted"
        ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400"
        : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400";

  const expandBtnClass =
    claim.verdict === "Supported"
      ? "text-green-700 hover:text-green-800 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
      : claim.verdict === "Refuted"
        ? "text-red-700 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
        : "text-amber-700 hover:text-amber-800 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20";

  return (
    <Card
      className={`bg-white dark:bg-zinc-900 transition-all duration-200 hover:shadow-md ${borderTint}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <span
              className={`shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 ${numberBg}`}
            >
              {index + 1}
            </span>
            <div className="space-y-1 min-w-0">
              <div className="flex items-start gap-2">
                <Quote className="w-3 h-3 text-zinc-400 shrink-0 mt-1" />
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-snug">
                  {claim.claimText}
                </p>
              </div>
            </div>
          </div>
          <VerdictBadge verdict={claim.verdict} size="sm" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CredibilityMeter score={claim.credibilityScore} />

        {expanded && (
          <div className="space-y-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                AI Reasoning
              </p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {claim.reasoning}
              </p>
            </div>
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                Evidence Sources ({claim.evidenceSources.length})
              </p>
              <div className="grid gap-2.5">
                {claim.evidenceSources.map((src) => (
                  <EvidenceCard key={src.id} source={src} />
                ))}
              </div>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className={`w-full gap-1 font-medium ${expandBtnClass}`}
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" /> Hide Evidence
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" /> Show Evidence & Reasoning
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}