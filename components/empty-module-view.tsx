"use client";

import { PlayCircle, ListFilter, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyModuleViewProps {
  moduleKey: "session" | "list-of-workout";
  onBackToHome: () => void;
}

export function EmptyModuleView({ moduleKey, onBackToHome }: EmptyModuleViewProps) {
  const isSession = moduleKey === "session";
  const num = isSession ? "04" : "05";
  const title = isSession ? "SESSION" : "LIST OF WORKOUT";
  const icon = isSession ? (
    <PlayCircle className="w-12 h-12 text-primary opacity-80 mb-3" />
  ) : (
    <ListFilter className="w-12 h-12 text-primary opacity-80 mb-3" />
  );

  return (
    <div className="module-page-container">
      <section className="intro">
        <div>
          <p className="eyebrow"><span /> Module {num} · {title}</p>
          <h1>{title}<br /><em>READY FOR TRAINING</em></h1>
        </div>
        <p>{isSession ? "Track live workout intervals, rest timers, and exercise progressions." : "Review your saved routines, history, and training schedules."}</p>
      </section>

      <div className="empty-module-shell">
        <div className="empty-state">
          {icon}
          <h2>{title} MODULE</h2>
          <p>Module container initialized — no content added yet.</p>
          <div className="mt-6">
            <Button onClick={onBackToHome} variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
