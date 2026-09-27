"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const TRANSITION_MS = 420;

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.dataset.theme === "light");
    setMounted(true);
  }, []);

  function changeTheme(checked: boolean) {
    const root = document.documentElement;
    const theme = checked ? "light" : "dark";

    root.dataset.themeTransitioning = "true";
    window.requestAnimationFrame(() => {
      root.dataset.theme = theme;
      localStorage.setItem("repforge-theme", theme);
      setIsLight(checked);

      window.setTimeout(() => {
        delete root.dataset.themeTransitioning;
      }, TRANSITION_MS + 40);
    });
  }

  return (
    <div className="theme-toggle">
      <div className="theme-switch-wrap">
        <button
          type="button"
          role="switch"
          aria-checked={isLight}
          aria-label={isLight ? "Use dark mode" : "Use light mode"}
          className="theme-switch"
          data-state={isLight ? "checked" : "unchecked"}
          disabled={!mounted}
          onClick={() => changeTheme(!isLight)}
        >
          <span aria-hidden="true" data-slot="switch-thumb" />
        </button>
        <Moon aria-hidden="true" className="theme-toggle-icon theme-toggle-moon" />
        <Sun aria-hidden="true" className="theme-toggle-icon theme-toggle-sun" />
      </div>
    </div>
  );
}
