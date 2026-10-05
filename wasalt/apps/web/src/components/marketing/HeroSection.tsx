import React from 'react';
import { Button } from '../common/Button';
import { useLanguageTheme } from '../../context/LanguageThemeContext';
import { ArrowRight, CheckCircle2, Play } from 'lucide-react';

interface HeroSectionProps {
  onStartOnboarding: () => void;
  onExploreDemo: () => void;
  /** Signed-in users must not see the free-trial CTA. */
  isAuthenticated?: boolean;
  onSignIn?: (target?: 'login' | 'dashboard') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartOnboarding,
  onExploreDemo,
  isAuthenticated,
  onSignIn,
}) => {
  const { t, language } = useLanguageTheme();

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden transition-colors">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-teal-500/10 dark:bg-teal-600/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-6">
            {t('hero.headlineMain')}{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
              {t('hero.headlineGradient')}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-2xl">
            {t('hero.subheadline')}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-10">
            <Button
              size="lg"
              variant="primary"
              onClick={
                isAuthenticated
                  ? () => onSignIn?.('dashboard')
                  : onStartOnboarding
              }
              icon={<ArrowRight className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />}
              className="w-full sm:w-auto shadow-lg shadow-blue-600/25"
            >
              {isAuthenticated ? t('nav.dashboard') : t('hero.ctaStartTrial')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onExploreDemo}
              icon={<Play className={`w-4 h-4 fill-slate-700 dark:fill-slate-200 ${language === 'ar' ? 'rotate-180' : ''}`} />}
              className="w-full sm:w-auto"
            >
              {t('hero.ctaExplore')}
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t('hero.badgeBuiltFor')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t('hero.badgeOperations')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
