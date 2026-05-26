"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ShieldAlert, Sparkles } from "lucide-react";

export default function Home() {
  const [statement, setStatement] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statement.trim()) return;

    setIsLoading(true);
    router.push(`/fact-check?query=${encodeURIComponent(statement.trim())}`);
  };

  return (
    <div className="container max-w-3xl mx-auto py-16 px-4 space-y-8 min-h-[calc(100vh-65px)] flex flex-col justify-center">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-green-200/60 dark:border-green-900/50">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Advanced AI Fact-Verification Platform
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Verify Claims with <span className="text-green-600 dark:text-green-500">Socheton</span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Analyze political remarks, viral social media posts, or news articles against trusted contextual cross-references.
        </p>
      </div>

      <Card className="shadow-lg border-zinc-200/80 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
            What statement would you like to verify?
          </CardTitle>
          <CardDescription>
            Enter a full assertion or paste an article snippet below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="relative">
              <textarea
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                placeholder="e.g., 'The government announced a new 10% tax exemption framework for local electronics manufacturing institutions starting next month.'"
                rows={4}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none transition-all"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!statement.trim() || isLoading}
                className="bg-green-700 hover:bg-green-800 text-white gap-2 min-w-[160px]"
              >
                {isLoading ? (
                  <>
                    <Search className="w-4 h-4 animate-spin" /> Analyzing…
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" /> Verify Statement
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
