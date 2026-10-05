import React, { useState } from 'react';
import { generateThemeFromColor } from '@wasalt/theme';
import { PRESET_THEMES } from '@wasalt/theme';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useLanguageTheme } from '../../context/LanguageThemeContext';
import { Palette, Check, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

interface LiveThemeDemoProps {
  onStartWithTheme?: (primaryColor: string) => void;
  /** Signed-in users must not see the free-trial CTA. */
  isAuthenticated?: boolean;
  onSignIn?: (target?: 'login' | 'dashboard') => void;
}

const presetTranslationsAr: Record<string, { name: string; description: string }> = {
  'wasalt-sapphire': {
    name: 'وسالت الياقوت',
    description: 'أزرق ملكي حاد مصمم للثقة المؤسسية والوضوح التنفيذي.',
  },
  'emerald-ops': {
    name: 'زمرد العمليات',
    description: 'أخضر غابي نابض مخصص لأسطول النقل والخدمات اللوجستية والميدانية.',
  },
  'royal-amethyst': {
    name: 'العقيق الملكي',
    description: 'بنفسجي فاخر مثالي لوكالات التكنولوجيا والتعليم والإبداع.',
  },
  'obsidian-slate': {
    name: 'سبج الأردواز',
    description: 'أسود أحادي عصري بلمسات سماوية نيون لمركزات العمليات.',
  },
};

export const LiveThemeDemo: React.FC<LiveThemeDemoProps> = ({
  onStartWithTheme,
  isAuthenticated,
  onSignIn,
}) => {
  const { t, language } = useLanguageTheme();
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
    <section id="theme-demo" className="py-20 bg-slate-900 dark:bg-black text-white relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="primary" size="md" className="bg-blue-900/50 text-blue-300 border-blue-700 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {t('theme.badge')}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            {t('theme.title')}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            {t('theme.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          {/* Controls column */}
          <div className="lg:col-span-5 bg-slate-800/90 dark:bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-400" />
              {t('theme.chooseTitle')}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {t('theme.chooseSubtitle')}
            </p>

            {/* Presets */}
            <div className="space-y-3 mb-6">
              {PRESET_THEMES.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                const arPreset = language === 'ar' ? presetTranslationsAr[preset.id] : undefined;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset.id, preset.primary)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left rtl:text-right transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-950/40 text-white'
                        : 'border-slate-700/80 bg-slate-800/50 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg shadow-sm border border-white/20 shrink-0"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div>
                        <div className="text-sm font-semibold">{arPreset?.name || preset.name}</div>
                        <div className="text-[11px] text-slate-400">{arPreset?.description || preset.description}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Color Picker */}
            <div className="pt-4 border-t border-slate-700/80">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {t('theme.customColor')}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={activeColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={activeColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="flex-1 bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white"
                  placeholder="#2563EB"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="lg:col-span-7">
            <div
              className="rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 border"
              style={{
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border,
              }}
            >
              <div className="flex items-center justify-between pb-4 border-b mb-6" style={{ borderColor: currentTheme.colors.border }}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: currentTheme.colors.primary }}
                  >
                    W
                  </div>
                  <div>
                    <h4 className="font-bold text-base" style={{ color: currentTheme.colors.text }}>
                      {t('theme.previewTitle')}
                    </h4>
                    <p className="text-xs" style={{ color: currentTheme.colors.textMuted }}>
                      {t('theme.previewSubtitle')}
                    </p>
                  </div>
                </div>

                <div
                  className="px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                  style={{
                    backgroundColor: currentTheme.colors.primaryLight,
                    color: currentTheme.colors.primary,
                  }}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'مطابق لمعيار WCAG AA' : 'WCAG AA Passed'}</span>
                </div>
              </div>

              {/* Sample components */}
              <div className="space-y-4">
                <div
                  className="p-4 rounded-xl border flex items-center justify-between"
                  style={{
                    backgroundColor: currentTheme.colors.background,
                    borderColor: currentTheme.colors.border,
                  }}
                >
                  <div className="text-xs">
                    <span className="font-bold block" style={{ color: currentTheme.colors.text }}>
                      {language === 'ar' ? 'بطاقة إجراء تجريبية' : 'Sample Action Card'}
                    </span>
                    <span style={{ color: currentTheme.colors.textMuted }}>
                      {language === 'ar' ? 'حقن متغيرات CSS لحظياً' : 'Real-time CSS custom property injection'}
                    </span>
                  </div>
                  <button
                    className="px-4 py-2 rounded-lg text-xs font-bold text-white shadow-sm transition-transform active:scale-95"
                    style={{ backgroundColor: currentTheme.colors.primary }}
                  >
                    {language === 'ar' ? 'زر أساسي' : 'Primary Button'}
                  </button>
                </div>
              </div>

              {onStartWithTheme && (
                <div className="mt-8 pt-4 border-t" style={{ borderColor: currentTheme.colors.border }}>
                  <Button
                    variant="primary"
                    onClick={
                      isAuthenticated
                        ? () => onSignIn?.('dashboard')
                        : () => onStartWithTheme(activeColor)
                    }
                    className="w-full justify-center"
                    icon={<ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />}
                  >
                    {isAuthenticated ? t('nav.dashboard') : t('nav.startTrial')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
