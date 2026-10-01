import React, { useState } from 'react';
import { generateThemeFromColor } from '@wasalt/theme';
import { PRESET_THEMES } from '@wasalt/theme';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Palette, Check, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

interface LiveThemeDemoProps {
  onStartWithTheme?: (primaryColor: string) => void;
}

export const LiveThemeDemo: React.FC<LiveThemeDemoProps> = ({ onStartWithTheme }) => {
  const [selectedPresetId, setSelectedPresetId] = useState(PRESET_THEMES[0].id);
  const [customColor, setCustomColor] = useState('#2563EB');

  const activePreset =
    PRESET_THEMES.find((p) => p.id === selectedPresetId) || PRESET_THEMES[0];
  const activeColor = selectedPresetId === 'custom' ? customColor : activePreset.primary;
  const currentTheme = generateThemeFromColor({ primaryHex: activeColor });

  const handlePresetSelect = (id: string, color: string) => {
    setSelectedPresetId(id);
    setCustomColor(color);
  };

  const handleColorChange = (hex: string) => {
    setSelectedPresetId('custom');
    setCustomColor(hex);
  };

  return (
    <section id="theme-demo" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="primary" size="md" className="bg-blue-900/50 text-blue-300 border-blue-700 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Brand Synthesizer
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Experience Instant Brand Synthesis
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Select a brand preset or pick any custom hex. Watch our engine compute an accessible
            color palette and re-skin an entire company portal in milliseconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          {/* Controls column */}
          <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-400" />
              1. Choose or Test Brand Color
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              In production, you can simply upload your company PNG/SVG logo and our Canvas
              engine extracts this automatically.
            </p>

            {/* Presets */}
            <div className="space-y-3 mb-6">
              {PRESET_THEMES.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset.id, preset.primary)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-500 bg-slate-700/80 shadow-md'
                        : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg shadow-sm flex items-center justify-center text-white"
                        style={{ backgroundColor: preset.primary }}
                      >
                        {isSelected && <Check className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{preset.name}</div>
                        <div className="text-xs text-slate-400">{preset.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom color picker input */}
            <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-800/50 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">Custom Brand Hex:</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-xs uppercase text-slate-300 px-2 py-1 bg-slate-900 rounded">
                  {customColor}
                </span>
              </div>
            </div>

            {/* WCAG accessibility metric */}
            <div className="mt-6 pt-5 border-t border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>WCAG AA Contrast:</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                {currentTheme.contrastRatio}:1 (Compliant)
              </span>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="lg:col-span-7 bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            {/* Mock Header */}
            <div
              className="p-5 text-white flex items-center justify-between transition-colors duration-300"
              style={{ backgroundColor: currentTheme.colors.primary }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg">
                  W
                </div>
                <div>
                  <h4 className="font-bold text-base leading-tight">Your Branded Portal</h4>
                  <p className="text-xs text-white/80">Active Company Workspace</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-white/20 backdrop-blur-sm font-semibold">
                Live Dynamic Skin
              </span>
            </div>

            {/* Mock Dashboard body */}
            <div className="p-6 bg-slate-50 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">Fleet & Team Operations</span>
                <button
                  className="text-xs px-3 py-1.5 rounded-lg text-white font-medium transition-colors"
                  style={{ backgroundColor: currentTheme.colors.primary }}
                >
                  + Add New Dispatch
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-500 mb-1">Assigned Vehicles</div>
                  <div className="text-2xl font-bold" style={{ color: currentTheme.colors.primary }}>
                    42 Active
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-500 mb-1">Company Admins</div>
                  <div className="text-2xl font-bold text-slate-900">8 Members</div>
                </div>
              </div>

              {/* Progress Bar with theme secondary/accent */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between text-xs text-slate-600 mb-2 font-medium">
                  <span>Workspace Capacity</span>
                  <span>78% utilized</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: '78%',
                      backgroundColor: currentTheme.colors.primary,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
