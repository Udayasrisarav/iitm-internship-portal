import { CheckCircle2, Clock, CircleDashed } from 'lucide-react';
import type { WorkflowStage } from '../../types';
import { formatDate } from '../../utils/format';

export function ProgressTracker({ stages }: { stages: WorkflowStage[] }) {
  return (
    <div className="card p-6">
      <h3 className="section-title">Workflow Progress</h3>
      <p className="section-subtitle">Current stage and completion history.</p>
      <ol className="mt-5 space-y-4">
        {stages.map((stage, idx) => {
          const Icon = stage.status === 'done' ? CheckCircle2 : stage.status === 'current' ? Clock : CircleDashed;
          const color = stage.status === 'done' ? 'text-success-600' : stage.status === 'current' ? 'text-brand-600' : 'text-ink-300';
          const isLast = idx === stages.length - 1;
          return (
            <li key={stage.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <Icon className={`h-5 w-5 shrink-0 ${color}`} />
                {!isLast && <span className={`mt-1 w-px flex-1 ${stage.status === 'done' ? 'bg-success-300' : 'bg-ink-200'}`} style={{ minHeight: '1.5rem' }} />}
              </div>
              <div className={`min-w-0 pb-1 ${stage.status === 'pending' ? 'opacity-60' : ''}`}>
                <p className={`text-sm font-medium ${stage.status === 'pending' ? 'text-ink-400' : 'text-ink-900'}`}>{stage.label}</p>
                <p className="text-xs text-ink-400">{stage.description}</p>
                {stage.completedAt && <p className="mt-0.5 text-xs text-success-600">Completed {formatDate(stage.completedAt)}</p>}
                {stage.status === 'current' && <p className="mt-0.5 text-xs font-medium text-brand-600">In progress</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
