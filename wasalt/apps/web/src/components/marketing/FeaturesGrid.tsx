import React from 'react';
import { PLATFORM_FEATURES } from '@wasalt/config';
import { Badge } from '../common/Badge';
import {
  Layers,
  Palette,
  ShieldCheck,
  Monitor,
  Zap,
  Code2,
  LucideIcon,
  CheckCircle2,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Layers,
  Palette,
  ShieldCheck,
  Monitor,
  Zap,
  Code2,
};

export const FeaturesGrid: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="md" className="mb-4">
            Core Capabilities
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Engineered for Modern Enterprise Fleets
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Every feature in Wasalt is designed around multi-company adaptability, bulletproof security,
            and executive visibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PLATFORM_FEATURES.map((feature) => {
            const IconComponent = iconMap[feature.icon] || Layers;
            return (
              <div
                key={feature.id}
                className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {feature.badge && (
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    {feature.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1 mb-3">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                {feature.metrics && (
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{feature.metrics}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
