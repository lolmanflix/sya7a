import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { MapStyleMode, getStoredMapStyle, subscribeMapStyle } from "../../config/openFreeMap";
import { setMapStyle } from "./mapLayerManager";
import { useTranslation } from "../../i18n/useTranslation";

/**
 * Compact light/dark base-map toggle pill. Persists the choice (localStorage
 * `wasalt_map_style`), swaps the OpenFreeMap style on every mounted map via
 * `setMapStyle`, and stays in sync across components through store subscription.
 */
export const MapThemeSelector: React.FC = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<MapStyleMode>(() => getStoredMapStyle());

  useEffect(() => subscribeMapStyle(setMode), []);

  const handleSelect = (next: MapStyleMode) => {
    if (next === mode) return;
    setMode(next);
    setMapStyle(next);
  };

  return (
    <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700 rounded-lg p-0.5 text-xs">
      <button
        type="button"
        onClick={() => handleSelect("light")}
        title={t("map.lightTitle")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
          mode === "light"
            ? "bg-brand-600 text-white shadow-sm font-semibold"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <Sun className="w-3.5 h-3.5 text-amber-400" />
        <span>{t("map.light")}</span>
      </button>

      <button
        type="button"
        onClick={() => handleSelect("dark")}
        title={t("map.darkTitle")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
          mode === "dark"
            ? "bg-brand-600 text-white shadow-sm font-semibold"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <Moon className="w-3.5 h-3.5 text-cyan-400" />
        <span>{t("map.dark")}</span>
      </button>
    </div>
  );
};
