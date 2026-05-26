"use client";

import { useHistory } from "@/lib/hooks/useHistory";
import { HistoryEntry } from "@/lib/types/factcheck";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ArrowLeft, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import VerdictBadge from "@/components/fact-check/VerdictBadge";

export default function HistoryPage() {
  const { history, clearHistory } = useHistory();

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Analysis History
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            View and manage your previously analyzed statements.
          </p>
        </div>
        {history.length > 0 && (
          <Button variant="destructive" size="sm" onClick={clearHistory} className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Clear All
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <Card className="border-dashed border-zinc-200 p-12 text-center">
          <CardContent className="space-y-3 pt-6">
            <FileText className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="font-semibold text-zinc-700">No history found</h3>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto">
              Statements you submit for verification on the homepage will be preserved locally here.
            </p>
            <Link href="/">
              <Button className="mt-2 bg-green-700 hover:bg-green-800">Analyze a Statement</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((entry: HistoryEntry) => (
            <Card key={entry.id} className="border-zinc-200 hover:border-green-200 transition-colors">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="space-y-1 pr-4 max-w-[70%]">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2">
                    "{entry.inputText}"
                  </p>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(entry.analyzedAt).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <VerdictBadge verdict={entry.overallVerdict} size="sm" />
                  <span className="text-xs font-semibold text-zinc-500">
                    Score: {entry.overallCredibilityScore}/100
                  </span>
                </div>
              </CardHeader>
              <CardContent className="border-t border-zinc-100/80 pt-3 bg-zinc-50/50">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>Claims Extracted: {entry.totalClaims}</span>
                  <Link href={`/fact-check?id=${entry.id}`}>
                    <Button variant="link" size="sm" className="h-auto p-0 text-green-700 hover:text-green-800 font-semibold">
                      View Full Report →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}