import React from "react";
import { Moon, Sun } from "lucide-react";
import { MapTheme } from "./mapLayerManager";

interface MapThemeSelectorProps {
  currentTheme: MapTheme;
  onThemeChange: (theme: MapTheme) => void;
}

/**
 * Toolbar widget allowing operators to toggle between Dark Operations and Clean Street maps.
 * Both themes are 100% locally rendered from /home/kimo/Storage/datasets/map.mbtiles.
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
        title="Dark Operations Theme"
        className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
          currentTheme === "dark"
            ? "bg-brand-600 text-white shadow-sm font-semibold"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <Moon className="w-3.5 h-3.5 text-cyan-400" />
        <span>Dark</span>
      </button>

      <button
        type="button"
        onClick={() => onThemeChange("clean")}
        title="Street Daylight Theme"
        className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
          currentTheme === "clean"
            ? "bg-brand-600 text-white shadow-sm font-semibold"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <Sun className="w-3.5 h-3.5 text-amber-400" />
        <span>Street</span>
      </button>
    </div>
  );
};
