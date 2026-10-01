import React, { useState } from 'react';
import { CompanyTheme } from '@wasalt/types';
import { extractColorsFromImageUrl, generateThemeFromColor } from '@wasalt/theme';
import { PRESET_THEMES, getPresetThemeById } from '@wasalt/theme';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Palette,
  Check,
  ShieldCheck,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';

interface StepBrandThemeProps {
  initialTheme?: CompanyTheme;
  companyName: string;
  onNext: (theme: CompanyTheme, logoUrl?: string) => void;
  onBack: () => void;
}

export const StepBrandTheme: React.FC<StepBrandThemeProps> = ({
  initialTheme,
  companyName,
  onNext,
  onBack,
}) => {
  const [theme, setTheme] = useState<CompanyTheme>(
    initialTheme || getPresetThemeById('wasalt-sapphire')
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    initialTheme?.presetId || 'wasalt-sapphire'
  );

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
        setTheme(generated);
        setSelectedPresetId('custom');
      } finally {
        setIsExtracting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const chosen = getPresetThemeById(presetId);
    setTheme(chosen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(theme, logoPreview || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">Brand Your Workspace</h3>
        <p className="text-xs text-slate-500">
          Upload your logo to automatically extract brand tones, or select one of our curated
          accessible themes.
        </p>
      </div>

      {/* Logo Upload Card */}
      <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
          {logoPreview ? (
            <img src={logoPreview} alt="Company Logo" className="w-full h-full object-contain p-1" />
          ) : (
            <ImageIcon className="w-6 h-6 text-slate-400" />
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h4 className="text-sm font-semibold text-slate-800">Company Logo (PNG, SVG, JPG)</h4>
          <p className="text-xs text-slate-500">
            {isExtracting ? (
              <span className="text-blue-600 font-medium animate-pulse flex items-center gap-1 justify-center sm:justify-start">
                <Sparkles className="w-3.5 h-3.5" /> Synthesizing brand colors...
              </span>
            ) : (
              'Our engine extracts dominant colors and builds your theme automatically.'
            )}
          </p>
        </div>

        <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Logo</span>
          <input
            type="file"
            accept="image/png, image/jpeg, image/svg+xml, image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Preset Themes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Or Choose a Curated Palette:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRESET_THEMES.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  className="w-full h-6 rounded-md mb-2 flex items-center justify-end px-1.5 shadow-xs"
                  style={{ backgroundColor: preset.primary }}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className="text-xs font-bold text-slate-900 truncate">{preset.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Preview Card & Contrast Badge */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Real-Time Workspace Preview
          </span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>WCAG Contrast: {theme.contrastRatio}:1 (Pass)</span>
          </div>
        </div>

        {/* Miniature Workspace Header */}
        <div
          className="p-3 rounded-lg text-white flex items-center justify-between transition-colors duration-300 shadow-sm"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-white/20 flex items-center justify-center font-bold text-xs">
              {companyName ? companyName[0].toUpperCase() : 'W'}
            </div>
            <span className="text-xs font-bold truncate max-w-[200px]">
              {companyName || 'My Workspace'}
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/20 font-semibold">
            Active Theme
          </span>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
        <Button variant="ghost" type="button" onClick={onBack} icon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>
        <Button variant="primary" type="submit" icon={<ArrowRight className="w-4 h-4" />}>
          Next: Confirm & Launch
        </Button>
      </div>
    </form>
  );
};
