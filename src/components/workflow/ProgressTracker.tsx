import { Check } from 'lucide-react';
import type { WorkflowStage } from '../../types';
import { classNames } from '../../utils/format';

interface ProgressTrackerProps {
  stages: WorkflowStage[];
  compact?: boolean;
}

export function ProgressTracker({ stages, compact = false }: ProgressTrackerProps) {
  const doneCount = stages.filter((s) => s.status === 'done').length;
  const percent = Math.round((doneCount / stages.length) * 100);

  if (compact) {
    return (
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink-600">Workflow Progress</p>
          <p className="font-display text-lg font-bold text-ink-900">{percent}%</p>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-ink-400">{doneCount} of {stages.length} stages complete</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="section-title">Workflow Progress</h3>
          <p className="section-subtitle">{doneCount} of {stages.length} stages complete</p>
        </div>
        <p className="font-display text-2xl font-bold text-brand-600">{percent}%</p>
      </div>

      <ol className="relative space-y-5">
        {stages.map((stage, idx) => {
          const isDone = stage.status === 'done';
          const isCurrent = stage.status === 'current';
          return (
            <li key={stage.id} className="relative flex gap-3.5">
              {idx < stages.length - 1 && (
                <span
                  className={classNames(
                    'absolute left-[13px] top-7 h-[calc(100%+4px)] w-0.5',
                    isDone ? 'bg-brand-500' : 'bg-ink-200',
                  )}
                />
              )}
              <span
                className={classNames(
                  'relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-4 ring-white',
                  isDone && 'bg-brand-600 text-white',
                  isCurrent && 'bg-white text-brand-600 ring-brand-100 ring-4 border-2 border-brand-500',
                  !isDone && !isCurrent && 'bg-ink-100 text-ink-400 border-2 border-ink-200',
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : <span className="text-xs font-semibold">{idx + 1}</span>}
              </span>
              <div className="pt-0.5">
                <p
                  className={classNames(
                    'text-sm font-semibold',
                    isDone && 'text-ink-900',
                    isCurrent && 'text-brand-700',
                    !isDone && !isCurrent && 'text-ink-500',
                  )}
                >
                  {stage.label}
                </p>
                <p className="text-xs text-ink-400">{stage.description}</p>
                {isCurrent && (
                  <span className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-brand-600">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" /> Current stage
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
