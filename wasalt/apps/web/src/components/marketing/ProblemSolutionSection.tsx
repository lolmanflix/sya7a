import React from 'react';
import { Badge } from '../common/Badge';
import { XCircle, CheckCircle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export const ProblemSolutionSection: React.FC = () => {
  const problems = [
    'Scattered credentials and disjointed logins across multiple client portals',
    'Hardcoded company branding requiring full code deployments to change a single color',
    'Accidental data cross-contamination between different company clients or departments',
    'Rigid permissions where team members cannot have different roles in different companies',
    'Zero desktop native support, locking operators to cluttered browser tabs',
  ];

  const solutions = [
    'One master administrator identity with seamless instant company switching',
    'Automated dynamic brand synthesis from logo upload with WCAG AA compliance',
    'Cryptographic and logical multi-tenant database isolation guaranteed server-side',
    'Granular many-to-many RBAC: be an Owner in Company A and Manager in Company B',
    'Unified Web and high-performance Electron desktop application synchronization',
  ];

  return (
    <section className="py-24 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="md" className="mb-4">
            The Paradigm Shift
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Why Modern Operations Demand Wasalt
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Stop forcing enterprise organizations into monolithic, single-tenant silos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Without Wasalt */}
          <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Without Wasalt</h3>
                <p className="text-xs text-rose-600 font-medium">Legacy Fragmented Operations</p>
              </div>
            </div>

            <ul className="space-y-4">
              {problems.map((prob, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 leading-snug">{prob}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* With Wasalt */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-8 shadow-md relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">With Wasalt</h3>
                <p className="text-xs text-blue-600 font-medium">Unified Multi-Tenant Power</p>
              </div>
            </div>

            <ul className="space-y-4">
              {solutions.map((sol, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-900 font-medium leading-snug">{sol}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
