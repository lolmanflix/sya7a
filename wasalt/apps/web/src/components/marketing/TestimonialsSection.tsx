import React from 'react';
import { Badge } from '../common/Badge';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote:
        'Wasalt allowed us to consolidate 14 regional shuttle divisions under one master operations console. Brand adaptation takes seconds and dispatcher onboarding dropped by 80%.',
      author: 'Marcus Vance',
      role: 'VP of Transportation Systems',
      company: 'MetroMobility Group',
      metric: '80% faster onboarding',
    },
    {
      quote:
        'The automatic logo color extraction and WCAG compliance engine is magical. Our campus shuttle portals look bespoke to our university colors without touching CSS.',
      author: 'Dr. Elena Rostova',
      role: 'Director of Campus Services',
      company: 'Highland State University',
      metric: '12k daily active riders',
    },
    {
      quote:
        'Multi-company switching with isolated tenant data was non-negotiable for our contract fleet business. Wasalt delivered enterprise-grade governance out of the box.',
      author: 'Tariq Al-Mansoor',
      role: 'Chief Operating Officer',
      company: 'Gulf Corporate Transit',
      metric: '100% data isolation',
    },
  ];

  return (
    <section className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="md" className="mb-4">
            Trusted Worldwide
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Empowering Modern Fleet Operations
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            See how operations directors, campus leaders, and enterprise dispatchers transform their
            workspaces with Wasalt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60">
                <div className="font-bold text-slate-900 text-sm">{item.author}</div>
                <div className="text-xs text-slate-500">
                  {item.role} &bull; {item.company}
                </div>
                <div className="mt-3 inline-block text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {item.metric}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
