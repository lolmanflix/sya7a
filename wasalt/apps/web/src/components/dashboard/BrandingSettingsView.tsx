import React, { useState } from 'react';
import { CompanyTheme } from '@wasalt/types';
import { extractColorsFromImageUrl, generateThemeFromColor } from '@wasalt/theme';
import { PRESET_THEMES, getPresetThemeById } from '@wasalt/theme';
import { useCompany } from '../../context/CompanyContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Palette,
  Upload,
  Check,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';

export const BrandingSettingsView: React.FC = () => {
  const { activeCompany, updateCurrentCompany } = useCompany();
  const { setTheme: setGlobalTheme } = useTheme();

  const [currentTheme, setCurrentTheme] = useState<CompanyTheme>(
    activeCompany?.theme || getPresetThemeById('wasalt-sapphire')
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(activeCompany?.logoUrl || null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setLogoPreview(dataUrl);
      setIsExtracting(true);

      try {
        const result = await extractColorsFromImageUrl(dataUrl);
        const generated = generateThemeFromColor({
          primaryHex: result.dominantHex,
          source: 'logo',
        });
        setCurrentTheme(generated);
        setGlobalTheme(generated);
      } finally {
        setIsExtracting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (presetId: string) => {
    const chosen = getPresetThemeById(presetId);
    setCurrentTheme(chosen);
    setGlobalTheme(chosen);
  };

  const handleSave = async () => {
    if (!activeCompany) return;
    setIsSaving(true);
    try {
      await updateCurrentCompany({
        theme: currentTheme,
        logoUrl: logoPreview || undefined,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Dynamic Workspace Branding</h2>
        <p className="text-xs text-slate-500">
          Customize colors, logo, and visual tokens for{' '}
          <span className="font-semibold text-slate-800">{activeCompany?.name}</span>.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Branding saved and applied across the entire portal!</span>
        </div>
      )}

      {/* Logo Upload Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
          {logoPreview ? (
            <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
          ) : (
            <ImageIcon className="w-8 h-8 text-slate-400" />
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-slate-900">Company Logo (PNG / SVG)</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {isExtracting ? (
              <span className="text-blue-600 font-medium animate-pulse flex items-center gap-1 justify-center sm:justify-start">
                <Sparkles className="w-3.5 h-3.5" /> Synthesizing palette via Canvas...
              </span>
            ) : (
              'Upload your vector or transparent logo to automatically synthesize matching brand tones.'
            )}
          </p>
        </div>

        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-all">
          <Upload className="w-4 h-4" />
          <span>Upload Logo</span>
          <input
            type="file"
            accept="image/png, image/jpeg, image/svg+xml, image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Curated Presets */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Palette className="w-4 h-4 text-slate-500" />
          Curated Palette Presets
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PRESET_THEMES.map((preset) => {
            const isSelected = currentTheme.presetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  className="w-full h-8 rounded-lg mb-2 flex items-center justify-end px-2"
                  style={{ backgroundColor: preset.primary }}
                >
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
                <div className="text-xs font-bold text-slate-900">{preset.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{preset.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Live Custom Property Evaluation</h3>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
            <span>WCAG AA Ratio: {currentTheme.contrastRatio}:1</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Primary</span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="w-4 h-4 rounded-full border border-black/10"
                style={{ backgroundColor: currentTheme.colors.primary }}
              ></span>
              <span className="font-mono text-slate-800">{currentTheme.colors.primary}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Secondary</span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="w-4 h-4 rounded-full border border-black/10"
                style={{ backgroundColor: currentTheme.colors.secondary }}
              ></span>
              <span className="font-mono text-slate-800">{currentTheme.colors.secondary}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Accent</span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="w-4 h-4 rounded-full border border-black/10"
                style={{ backgroundColor: currentTheme.colors.accent }}
              ></span>
              <span className="font-mono text-slate-800">{currentTheme.colors.accent}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Surface</span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="w-4 h-4 rounded-full border border-black/10"
                style={{ backgroundColor: currentTheme.colors.surface }}
              ></span>
              <span className="font-mono text-slate-800">{currentTheme.colors.surface}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="primary" size="lg" onClick={handleSave} isLoading={isSaving}>
          Save Branding Changes
        </Button>
      </div>
    </div>
  );
};
