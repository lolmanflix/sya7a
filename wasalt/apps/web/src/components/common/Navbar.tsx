import React, { useState, useEffect } from 'react';
import { PRODUCT_CONFIG } from '@wasalt/config';
import { MARKETING_NAV_ITEMS } from '@wasalt/config';
import { Button } from './Button';
import { Badge } from './Badge';
import { Sparkles, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenLogin: () => void;
  onStartOnboarding: () => void;
  onGoToDashboard?: () => void;
  isAuthenticated?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onStartOnboarding,
  onGoToDashboard,
  isAuthenticated,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Product Name */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  {PRODUCT_CONFIG.name}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                  SaaS Platform
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {MARKETING_NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
              >
                <span>{item.label}</span>
                {item.badge && (
                  <Badge variant="primary" size="sm">
                    {item.badge}
                  </Badge>
                )}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && onGoToDashboard ? (
              <Button
                variant="primary"
                onClick={onGoToDashboard}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={onOpenLogin}>
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  onClick={onStartOnboarding}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Start Free Trial
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 pb-2 border-t border-slate-200/80 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl flex flex-col gap-3">
            {MARKETING_NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-700 hover:text-blue-600 py-1"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Button variant="outline" onClick={onOpenLogin} className="w-full">
                Sign In
              </Button>
              <Button variant="primary" onClick={onStartOnboarding} className="w-full">
                Start Free Trial
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
