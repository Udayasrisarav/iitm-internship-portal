import type { InternshipApplication } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate } from '../../utils/format';
import { CalendarDays, Building2, User2, ChevronRight } from 'lucide-react';

interface ApplicationCardProps {
  application: InternshipApplication;
  onClick?: () => void;
}

export function ApplicationCard({ application, onClick }: ApplicationCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card group w-full p-5 text-left transition hover:shadow-elevated"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-ink-400">{application.applicantId}</p>
          <h4 className="mt-0.5 truncate text-base font-semibold text-ink-900">{application.personal.fullName}</h4>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-2 text-ink-600">
          <Building2 className="h-4 w-4 text-ink-400" />
          <span className="truncate">{application.academic.collegeName}</span>
        </div>
        <div className="flex items-center gap-2 text-ink-600">
          <User2 className="h-4 w-4 text-ink-400" />
          <span className="truncate">{application.schedule.professor}</span>
        </div>
        <div className="flex items-center gap-2 text-ink-600">
          <CalendarDays className="h-4 w-4 text-ink-400" />
          <span>
            {formatDate(application.schedule.startDate)} – {formatDate(application.schedule.endDate)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-ink-600">
          <span className="truncate text-ink-500">{application.schedule.department}</span>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3">
        <span className="text-xs text-ink-400">Submitted {formatDate(application.submittedAt)}</span>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition group-hover:gap-1.5">
          View <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
}
