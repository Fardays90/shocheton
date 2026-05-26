import { cn } from "@/lib/utils";

interface CredibilityMeterProps {
  score: number;
  label?: string;
  showBar?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 75) return "text-green-600 dark:text-green-400";
  if (score >= 45) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function getBarColor(score: number): string {
  if (score >= 75) return "bg-green-500 dark:bg-green-400";
  if (score >= 45) return "bg-amber-500 dark:bg-amber-400";
  return "bg-red-500 dark:bg-red-400";
}

export default function CredibilityMeter({
  score,
  label = "Credibility",
  showBar = true,
}: CredibilityMeterProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          {label}
        </span>
        <span className={cn("text-sm font-bold tabular-nums", getScoreColor(clampedScore))}>
          {clampedScore}/100
        </span>
      </div>
      {showBar && (
        <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-700 ease-out", getBarColor(clampedScore))}
            style={{ width: `${clampedScore}%` }}
          />
        </div>
      )}
    </div>
  );
}