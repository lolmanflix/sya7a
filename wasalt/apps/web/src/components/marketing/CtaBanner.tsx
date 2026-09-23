import React from 'react';
import { Button } from '../common/Button';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CtaBannerProps {
  onStartOnboarding: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onStartOnboarding }) => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-teal-400/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-blue-100 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Deploy Your First Workspace In Under 2 Minutes</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
          Ready to Unify Your Multi-Company Operations?
        </h2>

        <p className="text-blue-100 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Join leading fleet operators and campus transit directors who trust Wasalt for
          mission-critical coordination.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Button
            size="lg"
            variant="secondary"
            onClick={onStartOnboarding}
            icon={<ArrowRight className="w-5 h-5 text-blue-700" />}
            className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-xl shadow-blue-900/20"
          >
            Start Your 14-Day Free Trial
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-blue-100 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Cancel anytime
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-300" /> 100% Data isolation
          </span>
        </div>
      </div>
    </section>
  );
};
