import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Verdict } from "@/lib/types/factcheck";

interface VerdictBadgeProps {
  verdict: Verdict;
  size?: "sm" | "default" | "lg";
}

const badgeConfig: Record<Verdict, { icon: typeof CheckCircle; label: string; className: string }> = {
  Supported: {
    icon: CheckCircle,
    label: "Supported",
    className:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
  },
  Refuted: {
    icon: XCircle,
    label: "Refuted",
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
  },
  Conflicting: {
    icon: AlertTriangle,
    label: "Conflicting",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
  },
};

const sizeMap = {
  sm: {
    badge: "text-xs px-2 py-0.5 gap-1",
    icon: "w-3 h-3",
  },
  default: {
    badge: "text-sm px-2.5 py-0.5 gap-1.5",
    icon: "w-3.5 h-3.5",
  },
  lg: {
    badge: "text-base px-3 py-1 gap-1.5",
    icon: "w-4 h-4",
  },
};

export default function VerdictBadge({ verdict, size = "default" }: VerdictBadgeProps) {
  const config = badgeConfig[verdict];
  if (!config) return null;

  const Icon = config.icon;
  const sizing = sizeMap[size];

  return (
    <Badge
      variant="outline"
      className={`flex items-center w-fit font-semibold select-none transition-colors ${config.className} ${sizing.badge}`}
    >
      <Icon className={sizing.icon} />
      {config.label}
    </Badge>
  );
}