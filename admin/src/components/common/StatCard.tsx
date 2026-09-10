import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'blue' | 'emerald' | 'amber' | 'indigo' | 'rose';
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  trend,
}) => {
  const colorStyles = {
    blue: 'from-blue-500/10 to-transparent text-blue-400 border-blue-500/20 bg-blue-500/10',
    emerald: 'from-emerald-500/10 to-transparent text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    amber: 'from-amber-500/10 to-transparent text-amber-400 border-amber-500/20 bg-amber-500/10',
    indigo: 'from-indigo-500/10 to-transparent text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
    rose: 'from-rose-500/10 to-transparent text-rose-400 border-rose-500/20 bg-rose-500/10',
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden backdrop-blur-sm transition-all hover:border-slate-700/80">
      <div className={cn('absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br rounded-full blur-2xl pointer-events-none', colorStyles[color])} />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className={cn('p-2 rounded-xl border', colorStyles[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-white tracking-tight">{value}</span>
        {trend && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
};
