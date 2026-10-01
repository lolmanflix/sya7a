import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Badge } from './Badge';
import { useLanguageTheme } from '../../context/LanguageThemeContext';
import { Bus, Menu, X, ArrowRight, Sun, Moon, Globe } from 'lucide-react';

interface NavbarProps {
  onStartOnboarding: () => void;
  isAuthenticated?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartOnboarding,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, colorMode, toggleColorMode, t } = useLanguageTheme();

  const navItems = [
    { label: t('nav.features'), href: '#features' },
    { label: t('nav.howItWorks'), href: '#how-it-works' },
    { label: t('nav.liveTracking'), href: '#live-tracking', badge: t('nav.liveViewBadge') },
    { label: t('nav.forSchools'), href: '#schools' },
    { label: t('nav.forCompanies'), href: '#companies' },
    { label: t('nav.pricing'), href: '#pricing' },
    { label: t('nav.faq'), href: '#faq' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 dark:border-slate-800 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Product Name */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Bus className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {t('nav.brand')}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
                  {t('nav.tagline')}
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-7">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>{item.label}</span>
                {item.badge && (
                  <Badge variant="primary" size="sm" className="whitespace-nowrap px-2 py-0.5 text-[10px]">
                    {item.badge}
                  </Badge>
                )}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden xl:flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center gap-1.5"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t('nav.toggleLanguage')}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleColorMode}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
              title="Toggle Dark Mode"
            >
              {colorMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <Button
              variant="primary"
              onClick={onStartOnboarding}
              icon={<ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />}
              className="whitespace-nowrap"
            >
              {t('nav.startTrial')}
            </Button>
          </div>

          {/* Mobile/Tablet Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-4 pt-4 pb-2 border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 shadow-xl flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 py-1"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
              >
                <Globe className="w-4 h-4" />
                <span>{t('nav.toggleLanguage')}</span>
              </button>

              <button
                onClick={toggleColorMode}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
              >
                {colorMode === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            <Button
              variant="primary"
              onClick={() => {
                setMobileMenuOpen(false);
                onStartOnboarding();
              }}
              className="w-full justify-center"
            >
              {t('nav.startTrial')}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
