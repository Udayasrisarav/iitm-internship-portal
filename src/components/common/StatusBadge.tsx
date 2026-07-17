import type { ApplicationStatus } from '../../types';
import { applicationStatusMeta, classNames } from '../../utils/format';

const toneClasses: Record<string, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200',
  success: 'bg-success-50 text-success-700 ring-1 ring-inset ring-success-200',
  warning: 'bg-warning-50 text-warning-700 ring-1 ring-inset ring-warning-200',
  error: 'bg-error-50 text-error-700 ring-1 ring-inset ring-error-200',
  neutral: 'bg-ink-100 text-ink-600 ring-1 ring-inset ring-ink-200',
};

const dotClasses: Record<string, string> = {
  brand: 'bg-brand-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
  neutral: 'bg-ink-400',
};

export function StatusBadge({ status, size = 'sm' }: { status: ApplicationStatus; size?: 'sm' | 'xs' }) {
  const meta = applicationStatusMeta[status];
  return (
    <span
      className={classNames(
        'badge',
        toneClasses[meta.tone],
        size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5',
      )}
    >
      <span className={classNames('h-1.5 w-1.5 rounded-full', dotClasses[meta.tone])} />
      {meta.label}
    </span>
  );
}
