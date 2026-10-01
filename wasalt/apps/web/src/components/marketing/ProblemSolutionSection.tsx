import React from 'react';
import { Badge } from '../common/Badge';
import { XCircle, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

export const ProblemSolutionSection: React.FC = () => {
  const problems = [
    'Unclear bus locations when teams need answers quickly',
    'Manual driver coordination through phone calls and messages',
    'Scattered route, stop, and schedule information',
    'Difficult fleet monitoring across active transportation operations',
    'No centralized view of buses and route progress',
  ];

  const solutions = [
    'Real-time bus visibility from a centralized fleet view',
    'Organized routes, stops, drivers, and transportation schedules',
    'A clear operational picture for transportation administrators',
    'Role-based access for the people responsible for transportation',
    'Organization-wide visibility without losing the details',
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="md" className="mb-4">
            Transportation operations
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Transportation shouldn’t run on phone calls and spreadsheets.
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            Give transportation teams a single, clear place to understand their fleet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Without Wasalt */}
          <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Without Wasalt</h3>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Fragmented transportation operations</p>
              </div>
            </div>

            <ul className="space-y-4">
              {problems.map((prob, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{prob}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* With Wasalt */}
          <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl p-8 shadow-md relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">With Wasalt</h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Centralized fleet operations</p>
              </div>
            </div>

            <ul className="space-y-4">
              {solutions.map((sol, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-900 dark:text-slate-100 font-medium leading-snug">{sol}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
