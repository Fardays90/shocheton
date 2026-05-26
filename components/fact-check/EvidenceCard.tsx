import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EvidenceSource } from "@/lib/types/factcheck";

interface EvidenceCardProps {
  source: EvidenceSource;
}

function getRelevanceColor(score: number): string {
  if (score >= 90) return "border-green-300 text-green-700 dark:border-green-800 dark:text-green-400";
  if (score >= 70) return "border-amber-300 text-amber-700 dark:border-amber-800 dark:text-amber-400";
  return "border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400";
}

export default function EvidenceCard({ source }: EvidenceCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-800/40 p-3.5 space-y-2 transition-colors hover:border-green-200 dark:hover:border-green-800/50">
      <div className="flex items-start justify-between gap-3">
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-semibold text-green-700 dark:text-green-400 hover:underline underline-offset-2 transition-colors"
        >
          {source.sourceName}
          <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
        </a>
        <Badge
          variant="outline"
          className={`text-xs font-semibold shrink-0 tabular-nums ${getRelevanceColor(source.relevanceScore)}`}
        >
          {source.relevanceScore}% relevant
        </Badge>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
        &ldquo;{source.snippet}&rdquo;
      </p>
      {source.publishedDate && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 tabular-nums">
          Published: {new Date(source.publishedDate).toLocaleDateString(undefined, { dateStyle: "medium" })}
        </p>
      )}
    </div>
  );
}