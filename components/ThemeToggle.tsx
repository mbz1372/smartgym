"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const applyTheme = (mode: "light" | "dark") => {
    document.documentElement.dataset.theme = mode;
    const isLight = mode === "light";
    document.documentElement.style.setProperty("--bg", isLight ? "#f8fafc" : "#0f172a");
    document.documentElement.style.setProperty("--text", isLight ? "#0b1120" : "#e2e8f0");
    document.documentElement.style.setProperty("--card", isLight ? "#ffffff" : "#1e293b");
    document.body.style.background = isLight ? "#f8fafc" : "#0f172a";
    document.body.style.color = isLight ? "#0b1120" : "#e2e8f0";
  };

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("smartgym_theme") : null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      applyTheme(stored);
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
    if (typeof window !== "undefined") localStorage.setItem("smartgym_theme", theme);
  }, [theme]);

  return (
    <button className="btn secondary" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme">
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
