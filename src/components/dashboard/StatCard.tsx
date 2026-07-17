import { LucideIcon } from 'lucide-react';
import { classNames } from '../../utils/format';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: 'brand' | 'success' | 'warning' | 'error' | 'neutral';
  hint?: string;
}

const iconTone: Record<string, string> = {
  brand: 'bg-brand-50 text-brand-600',
  success: 'bg-success-50 text-success-600',
  warning: 'bg-warning-50 text-warning-600',
  error: 'bg-error-50 text-error-600',
  neutral: 'bg-ink-100 text-ink-600',
};

export function StatCard({ label, value, icon: Icon, tone = 'brand', hint }: StatCardProps) {
  return (
    <div className="card p-5 transition hover:shadow-elevated">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink-500">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
        </div>
        <span className={classNames('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', iconTone[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
