import React from "react";
import { Moon, Sun, WifiOff } from "lucide-react";
import { MapTheme } from "./mapLayerManager";

interface MapThemeSelectorProps {
  currentTheme: MapTheme;
  onThemeChange: (theme: MapTheme) => void;
}

/**
 * Toolbar widget allowing operators to switch between Dark Ops, Clean Street, and Offline maps.
 */
export const MapThemeSelector: React.FC<MapThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  return (
    <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700 rounded-lg p-0.5 text-xs">
      <button
        type="button"
        onClick={() => onThemeChange("dark")}
        title="Dark Operations Theme (Clear Nile, Buildings & Streets)"
        className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
          currentTheme === "dark"
            ? "bg-brand-600 text-white shadow-sm font-semibold"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <Moon className="w-3 h-3 text-cyan-400" />
        <span className="hidden sm:inline">Dark</span>
      </button>

      <button
        type="button"
        onClick={() => onThemeChange("clean")}
        title="Clean Transit Street Map (Daylight High-Contrast)"
        className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
          currentTheme === "clean"
            ? "bg-brand-600 text-white shadow-sm font-semibold"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <Sun className="w-3 h-3 text-amber-400" />
        <span className="hidden sm:inline">Street</span>
      </button>

      <button
        type="button"
        onClick={() => onThemeChange("offline")}
        title="Offline Vector Wireframe (Local File Fallback)"
        className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
          currentTheme === "offline"
            ? "bg-amber-600 text-white shadow-sm font-semibold"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <WifiOff className="w-3 h-3 text-rose-400" />
        <span className="hidden sm:inline">Offline</span>
      </button>
    </div>
  );
};
