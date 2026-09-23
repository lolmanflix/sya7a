import React from 'react';
import { Badge } from '../common/Badge';
import { UserPlus, Building, Palette, Rocket } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Create Your Master Admin Identity',
      description:
        'Sign up once with your work email. This global identity gives you executive access across all future workspaces.',
    },
    {
      number: '02',
      icon: Building,
      title: 'Provision Your First Company Workspace',
      description:
        'Set your company name, custom slug, industry, and fleet scope. Wasalt configures isolated storage instantly.',
    },
    {
      number: '03',
      icon: Palette,
      title: 'Upload Logo & Synthesize Brand Theme',
      description:
        'Upload your brand logo. Our Canvas engine extracts dominant tones and computes an accessible WCAG AA palette.',
    },
    {
      number: '04',
      icon: Rocket,
      title: 'Invite Team & Launch Operations',
      description:
        'Assign team members as Admins or Managers, stream live telematics, and switch between companies on the fly.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="md" className="mb-4">
            Simple 4-Step Onboarding
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            From Zero to Branded Operations in Minutes
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            No complex infrastructure setups or server provisioning required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative flex flex-col items-center text-center group">
                {/* Step pill */}
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center mb-6 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Icon className="w-7 h-7" />
                </div>

                <span className="text-xs font-mono font-bold text-blue-600 mb-2">
                  STEP {step.number}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
