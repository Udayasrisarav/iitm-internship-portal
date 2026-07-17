import { Check, ChevronRight } from 'lucide-react';
import type { WorkflowStage } from '../../types';
import { classNames } from '../../utils/format';

interface WorkflowStepperProps {
  stages: WorkflowStage[];
  currentIndex: number;
  onStepClick?: (index: number) => void;
}

export function WorkflowStepper({ stages, currentIndex, onStepClick }: WorkflowStepperProps) {
  return (
    <nav aria-label="Workflow steps" className="border-b border-ink-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <ol className="flex items-center gap-1 overflow-x-auto sm:gap-2">
          {stages.map((stage, idx) => {
            const isDone = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const clickable = onStepClick && idx <= currentIndex;
            return (
              <li key={stage.id} className="flex items-center">
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={() => clickable && onStepClick?.(idx)}
                  className={classNames(
                    'group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition',
                    clickable && 'hover:bg-ink-50',
                  )}
                >
                  <span
                    className={classNames(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition',
                      isDone && 'bg-brand-600 text-white',
                      isCurrent && 'bg-brand-50 text-brand-700 ring-2 ring-brand-500',
                      !isDone && !isCurrent && 'bg-ink-100 text-ink-400',
                    )}
                  >
                    {isDone ? <Check className="h-4 w-4" /> : idx + 1}
                  </span>
                  <span className="hidden text-left sm:block">
                    <span
                      className={classNames(
                        'block text-sm font-semibold leading-tight',
                        isDone || isCurrent ? 'text-ink-900' : 'text-ink-400',
                      )}
                    >
                      {stage.label}
                    </span>
                    <span className="block text-xs text-ink-400">{stage.description}</span>
                  </span>
                </button>
                {idx < stages.length - 1 && (
                  <ChevronRight className="mx-0.5 h-4 w-4 shrink-0 text-ink-300" />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
