import { useApplications } from '../../contexts/ApplicationContext';
import { useRole } from '../../contexts/RoleContext';
import { ProgressTracker } from '../../components/workflow/ProgressTracker';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate, formatDateTime } from '../../utils/format';
import { CheckCircle2, Clock, CircleDashed } from 'lucide-react';

export function ApplicantWorkflow() {
  const { applications, loading } = useApplications();
  const { user } = useRole();
  const application = applications.find((a) => a.personal.email === user.email) ?? applications[0];

  if (loading || !application) {
    return <div className="card animate-pulse p-8"><div className="h-6 w-40 rounded bg-ink-100" /><div className="mt-4 h-64 rounded bg-ink-100" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="section-title">Application Workflow</h2>
          <p className="section-subtitle">Track your application through every stage — {application.applicantId}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={application.status} />
          <span className="text-xs text-ink-400">Last updated {formatDateTime(application.updatedAt)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProgressTracker stages={application.workflow} />
        </div>
        <div className="card p-6">
          <h3 className="section-title">Stage Timeline</h3>
          <p className="section-subtitle">Completion history</p>
          <ol className="mt-5 space-y-3">
            {application.workflow.map((stage) => {
              const Icon = stage.status === 'done' ? CheckCircle2 : stage.status === 'current' ? Clock : CircleDashed;
              const color = stage.status === 'done' ? 'text-success-600' : stage.status === 'current' ? 'text-brand-600' : 'text-ink-300';
              return (
                <li key={stage.id} className="flex items-start gap-3">
                  <Icon className={`mt-0.5 h-4.5 w-4.5 shrink-0 ${color}`} />
                  <div className="min-w-0">
                    <p className={`text-sm font-medium ${stage.status === 'pending' ? 'text-ink-400' : 'text-ink-800'}`}>{stage.label}</p>
                    {stage.completedAt && <p className="text-xs text-ink-400">Completed {formatDate(stage.completedAt)}</p>}
                    {stage.status === 'current' && <p className="text-xs font-medium text-brand-600">In progress</p>}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
