"use client";

import { useEffect, useState } from "react";
import {
  Info,
  Home,
  User,
  Sliders,
  PlayCircle,
  ListFilter,
  X,
  ChevronRight,
  PanelLeft,
} from "lucide-react";

export type PageModuleId =
  | "home"
  | "profile"
  | "build-session"
  | "ready-to-move"
  | "session"
  | "list-of-workout"
  | "dashboard"
  | "body-info";

export type WorkoutSplitId = "ppl" | "upper-lower" | "bro-split" | "full-body" | "custom";

interface InformationPaneProps {
  currentModule: PageModuleId;
  onSelectModule: (module: PageModuleId, split?: WorkoutSplitId) => void;
  activeSplit?: WorkoutSplitId;
}

export function InformationPane({ currentModule, onSelectModule }: InformationPaneProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function handleModuleClick(moduleId: PageModuleId) {
    onSelectModule(moduleId);
    setIsOpen(false);
  }

  const isHomeActive = currentModule === "home" || currentModule === "dashboard";
  const isProfileActive = currentModule === "profile" || currentModule === "body-info";
  const isBuildActive = currentModule === "build-session" || currentModule === "ready-to-move";

  return (
    <>
      {/* Top-Left Icon-Only Button - disappears when pane is open */}
      {!isOpen && (
        <button
          type="button"
          className="info-pane-icon-trigger print:hidden"
          onClick={() => setIsOpen(true)}
          aria-label="Open Information Pane"
          title="Information Pane"
        >
          <PanelLeft className="icon-panel" aria-hidden="true" />
          <span className="icon-badge">
            <Info className="icon-info" aria-hidden="true" />
          </span>
        </button>
      )}

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="info-pane-backdrop print:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Dedicated Left-Side Information Pane */}
      <aside
        className={`info-pane-sidebar print:hidden ${isOpen ? "open" : ""}`}
        aria-label="Information Pane"
        aria-hidden={!isOpen}
      >
        <div className="sidebar-inner">
          {/* Header */}
          <div className="sidebar-header">
            <div className="sidebar-title-group">
              <span className="sidebar-icon-badge">
                <Info className="w-4 h-4" aria-hidden="true" />
              </span>
              <div>
                <h2>Information Pane</h2>
                <p>Navigation & Settings</p>
              </div>
            </div>
            <button
              type="button"
              className="sidebar-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close Information Pane"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Module Navigation List - Flat, No Hierarchy */}
          <nav className="sidebar-modules-nav" aria-label="Website Modules">
            {/* 01 Home (Dashboard) */}
            <button
              type="button"
              className={`sidebar-module-tab ${isHomeActive ? "active" : ""}`}
              onClick={() => handleModuleClick("home")}
            >
              <span className="module-tab-left">
                <span className="module-tab-index">01</span>
                <Home className="module-tab-icon" aria-hidden="true" />
                <span className="module-tab-label">Home</span>
              </span>
              <ChevronRight className="module-tab-arrow" />
            </button>

            {/* 02 Profile (Body Information) */}
            <button
              type="button"
              className={`sidebar-module-tab ${isProfileActive ? "active" : ""}`}
              onClick={() => handleModuleClick("profile")}
            >
              <span className="module-tab-left">
                <span className="module-tab-index">02</span>
                <User className="module-tab-icon" aria-hidden="true" />
                <span className="module-tab-label">Profile</span>
              </span>
              <ChevronRight className="module-tab-arrow" />
            </button>

            {/* 03 Build your session */}
            <button
              type="button"
              className={`sidebar-module-tab ${isBuildActive ? "active" : ""}`}
              onClick={() => handleModuleClick("build-session")}
            >
              <span className="module-tab-left">
                <span className="module-tab-index">03</span>
                <Sliders className="module-tab-icon" aria-hidden="true" />
                <span className="module-tab-label">Build your session</span>
              </span>
              <ChevronRight className="module-tab-arrow" />
            </button>

            {/* 04 Session */}
            <button
              type="button"
              className={`sidebar-module-tab ${currentModule === "session" ? "active" : ""}`}
              onClick={() => handleModuleClick("session")}
            >
              <span className="module-tab-left">
                <span className="module-tab-index">04</span>
                <PlayCircle className="module-tab-icon" aria-hidden="true" />
                <span className="module-tab-label">Session</span>
              </span>
              <ChevronRight className="module-tab-arrow" />
            </button>

            {/* 05 List of workout */}
            <button
              type="button"
              className={`sidebar-module-tab ${currentModule === "list-of-workout" ? "active" : ""}`}
              onClick={() => handleModuleClick("list-of-workout")}
            >
              <span className="module-tab-left">
                <span className="module-tab-index">05</span>
                <ListFilter className="module-tab-icon" aria-hidden="true" />
                <span className="module-tab-label">List of workout</span>
              </span>
              <ChevronRight className="module-tab-arrow" />
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
}
