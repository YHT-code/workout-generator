"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Flame,
  Scale,
  Clock3,
  Dumbbell,
  ArrowRight,
  Sparkles,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PageModuleId } from "@/components/information-pane";

interface DashboardViewProps {
  onNavigate: (module: PageModuleId) => void;
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
  const [savedCount, setSavedCount] = useState(0);
  const [bodyStats, setBodyStats] = useState<{ weight?: string; height?: string; unit?: string } | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("repforge-saved") || "[]");
      setSavedCount(Array.isArray(saved) ? saved.length : 0);
    } catch {}

    try {
      const body = JSON.parse(localStorage.getItem("repforge-body-info") || "null");
      if (body) setBodyStats(body);
    } catch {}
  }, []);

  return (
    <div className="module-page-container">
      <section className="intro">
        <div>
          <p className="eyebrow"><span /> MODULE 01 · HOME</p>
          <h1>TRAINING HUB<br /><em>AT A GLANCE</em></h1>
        </div>
        <p>Monitor your physical profile, workout library, and daily session targets.</p>
      </section>

      <div className="dashboard-shell">
        {/* KPI Grid */}
        <div className="dashboard-kpi-grid">
          {/* Card 1: Saved Workouts */}
          <div className="kpi-card">
            <div className="kpi-icon-wrap">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <span className="kpi-label">Saved Sessions</span>
              <strong className="kpi-value">{savedCount}</strong>
              <p className="kpi-subtext">Routines in library</p>
            </div>
          </div>

          {/* Card 2: Current Weight */}
          <div className="kpi-card">
            <div className="kpi-icon-wrap">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="kpi-label">Current Weight</span>
              <strong className="kpi-value">
                {bodyStats?.weight ? `${bodyStats.weight} ${bodyStats.unit === "imperial" ? "lbs" : "kg"}` : "—"}
              </strong>
              <p className="kpi-subtext">From profile data</p>
            </div>
          </div>

          {/* Card 3: Training Status */}
          <div className="kpi-card">
            <div className="kpi-icon-wrap">
              <Flame className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <span className="kpi-label">Ready Status</span>
              <strong className="kpi-value">Active</strong>
              <p className="kpi-subtext">Ready for next session</p>
            </div>
          </div>

          {/* Card 4: Quick Launch */}
          <div className="kpi-card">
            <div className="kpi-icon-wrap">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="kpi-label">Weekly Focus</span>
              <strong className="kpi-value">Full Body</strong>
              <p className="kpi-subtext">Recommended routine</p>
            </div>
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div className="dashboard-cards-grid">
          {/* Action 1: Build Your Session */}
          <div className="action-card">
            <div className="action-card-top">
              <span className="action-badge">SESSION BUILDER</span>
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h3>Build Your Next Workout</h3>
            <p>Select your available equipment, duration, and target muscles to get a custom routine.</p>
            <Button
              onClick={() => onNavigate("build-session")}
              className="action-btn"
            >
              <span>Open Session Builder</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Action 2: Profile / Body Information */}
          <div className="action-card">
            <div className="action-card-top">
              <span className="action-badge">BIOMETRICS</span>
              <UserCheck className="w-5 h-5 text-primary" />
            </div>
            <h3>Update Body Profile</h3>
            <p>Keep your height, weight, and biometric details up-to-date for accurate workout prescriptions.</p>
            <Button
              onClick={() => onNavigate("profile")}
              variant="outline"
              className="action-btn"
            >
              <span>Manage Body Profile</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
