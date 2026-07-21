import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Search, ArrowRight, Inbox, FilePlus, ChevronRight, Clock } from 'lucide-react';
import { useApplications } from '../../contexts/ApplicationContext';
import { useAuth } from '../../contexts/RoleContext';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ApplicationCard } from '../../components/dashboard/ApplicationCard';
import { formatDate, applicationStatusMeta } from '../../utils/format';
import type { ApplicationStatus, InternshipApplication, WorkflowStageId } from '../../types';

// Maps each role to the workflow stages that require their action next.
const roleActionStages: Record<string, { statuses: ApplicationStatus[]; stage: WorkflowStageId; label: string }> = {
  supervisor: { statuses: ['submitted', 'under_review'], stage: 'verification', label: 'Awaiting your verification' },
  chairman: { statuses: ['awaiting_chairman'], stage: 'chairman_signature', label: 'Awaiting your signature' },
};

export function ApplicationsDashboard() {
  const { applications, loading } = useApplications();
  const { role, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = (searchParams.get('filter') as ApplicationStatus | null) ?? 'all';
  const [filter, setFilter] = useState<'all' | ApplicationStatus>(initialFilter);
  const [query, setQuery] = useState('');

  // Applicants see only their own application(s)
  const scoped = useMemo(
    () =>
      role === 'applicant'
        ? applications.filter((a) => a.personal.email === user.email)
        : applications,
    [applications, role, user.email],
  );

  const filtered = scoped
    .filter((a) => (filter === 'all' ? true : a.status === filter))
    .filter((a) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        a.personal.fullName.toLowerCase().includes(q) ||
        a.applicantId.toLowerCase().includes(q) ||
        a.academic.collegeName.toLowerCase().includes(q)
      );
    });

  // Action items: applications that need this role's attention next
  const actionItems = useMemo(() => {
    const cfg = roleActionStages[role];
    if (!cfg) return [];
    return scoped.filter((a) => cfg.statuses.includes(a.status));
  }, [scoped, role]);

  const columns = [
    { key: 'applicantId', header: 'Applicant ID', render: (r: InternshipApplication) => <span className="font-mono text-xs font-medium text-ink-600">{r.applicantId}</span> },
    { key: 'name', header: 'Name', render: (r: InternshipApplication) => <span className="font-medium text-ink-900">{r.personal.fullName}</span> },
    { key: 'college', header: 'College', render: (r: InternshipApplication) => <span className="text-ink-600">{r.academic.collegeName}</span> },
    { key: 'dept', header: 'Department', render: (r: InternshipApplication) => <span className="text-ink-500">{r.schedule.department || '—'}</span> },
    { key: 'status', header: 'Status', render: (r: InternshipApplication) => <StatusBadge status={r.status} /> },
    { key: 'updated', header: 'Updated', render: (r: InternshipApplication) => <span className="text-ink-500">{formatDate(r.updatedAt)}</span> },
    {
      key: 'action', header: '',
      render: (r: InternshipApplication) => (
        <button type="button" onClick={(e) => { e.stopPropagation(); navigate(`/applications/${r.id}`); }} className="btn-primary text-xs">
          Open <ArrowRight className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Action prompt — what do I need to do next? */}
      {actionItems.length > 0 && (
        <div className="card border-l-4 border-l-brand-500 p-5">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand-600" />
            <h3 className="text-sm font-semibold text-ink-900">Action Required</h3>
          </div>
          <p className="mt-1 text-sm text-ink-500">
            {roleActionStages[role].label} — {actionItems.length} application{actionItems.length > 1 ? 's' : ''} pending.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {actionItems.slice(0, 5).map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => navigate(`/applications/${app.id}`)}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 transition hover:bg-brand-100"
              >
                <span className="font-mono">{app.applicantId}</span>
                <span className="text-brand-400">·</span>
                <span>{app.personal.fullName}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="section-title">Internship Applications</h2>
          <p className="section-subtitle">
            {role === 'applicant'
              ? 'Your internship application'
              : role === 'supervisor'
                ? 'Review and verify applications'
                : role === 'chairman'
                  ? 'Documents awaiting signature'
                  : 'All platform applications'}
          </p>
        </div>
        {role === 'applicant' && (
          <button type="button" onClick={() => navigate('/applications/new')} className="btn-primary">
            <FilePlus className="h-4 w-4" /> New Application
          </button>
        )}
      </div>

      {/* Search + filter — staff only */}
      {role !== 'applicant' && (
        <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input className="input pl-9" placeholder="Search by name, ID or college…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip label="All" active={filter === 'all'} onClick={() => { setFilter('all'); setSearchParams({}); }} />
            <FilterChip label="Under Verification" active={filter === 'under_review'} onClick={() => { setFilter('under_review'); setSearchParams({ filter: 'under_review' }); }} />
            <FilterChip label="Active" active={filter === 'internship_active'} onClick={() => { setFilter('internship_active'); setSearchParams({ filter: 'internship_active' }); }} />
            <FilterChip label="Awaiting Signature" active={filter === 'awaiting_chairman'} onClick={() => { setFilter('awaiting_chairman'); setSearchParams({ filter: 'awaiting_chairman' }); }} />
            <FilterChip label="Signed" active={filter === 'signed'} onClick={() => { setFilter('signed'); setSearchParams({ filter: 'signed' }); }} />
            <FilterChip label="Rejected" active={filter === 'rejected'} onClick={() => { setFilter('rejected'); setSearchParams({ filter: 'rejected' }); }} />
          </div>
        </div>
      )}

      {loading ? (
        <div className="card animate-pulse p-8"><div className="h-6 w-40 rounded bg-ink-100" /></div>
      ) : role === 'applicant' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.length > 0 ? (
            filtered.map((app) => (
              <ApplicationCard key={app.id} application={app} onClick={() => navigate(`/applications/${app.id}`)} />
            ))
          ) : (
            <div className="card col-span-full p-10 text-center">
              <Inbox className="mx-auto h-10 w-10 text-ink-300" />
              <p className="mt-3 text-sm text-ink-500">No applications yet. Click "New Application" to begin.</p>
            </div>
          )}
        </div>
      ) : (
        <DataTable<InternshipApplication>
          columns={columns}
          data={filtered}
          emptyMessage={<span className="inline-flex items-center gap-2"><Inbox className="h-4 w-4" /> No applications match your filters.</span>}
          onRowClick={(r) => navigate(`/applications/${r.id}`)}
        />
      )}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? 'rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white' : 'rounded-lg bg-ink-100 px-3 py-1.5 text-xs font-medium text-ink-600 hover:bg-ink-200'}
    >
      {label}
    </button>
  );
}
