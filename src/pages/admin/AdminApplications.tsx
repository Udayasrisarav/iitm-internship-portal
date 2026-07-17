import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, ArrowRight, Inbox } from 'lucide-react';
import { useApplications } from '../../contexts/ApplicationContext';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/format';
import type { ApplicationStatus, InternshipApplication } from '../../types';

const statusFilters: { value: 'all' | ApplicationStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'rejected', label: 'Rejected' },
];

export function AdminApplications() {
  const { applications } = useApplications();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | ApplicationStatus>('all');
  const [query, setQuery] = useState('');

  const filtered = applications
    .filter((a) => (filter === 'all' ? true : a.status === filter))
    .filter((a) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return a.personal.fullName.toLowerCase().includes(q) || a.applicantId.toLowerCase().includes(q) || a.academic.collegeName.toLowerCase().includes(q);
    });

  const columns = [
    { key: 'applicantId', header: 'Applicant ID', render: (r: InternshipApplication) => <span className="font-mono text-xs text-ink-600">{r.applicantId}</span> },
    { key: 'name', header: 'Name', render: (r: InternshipApplication) => <span className="font-medium text-ink-900">{r.personal.fullName}</span> },
    { key: 'college', header: 'College', render: (r: InternshipApplication) => <span className="text-ink-600">{r.academic.collegeName}</span> },
    { key: 'dept', header: 'Department', render: (r: InternshipApplication) => <span className="text-ink-500">{r.schedule.department}</span> },
    { key: 'status', header: 'Status', render: (r: InternshipApplication) => <StatusBadge status={r.status} /> },
    { key: 'submitted', header: 'Submitted', render: (r: InternshipApplication) => <span className="text-ink-500">{formatDate(r.submittedAt)}</span> },
    {
      key: 'action', header: 'Action',
      render: (r: InternshipApplication) => (
        <button type="button" onClick={(e) => { e.stopPropagation(); navigate(`/supervisor/review/${r.id}`); }} className="btn-secondary text-xs">
          View <ArrowRight className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">All Applications</h2>
        <p className="section-subtitle">Platform-wide application management.</p>
      </div>

      <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input className="input pl-9" placeholder="Search applications…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={filter === f.value ? 'rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white' : 'rounded-lg bg-ink-100 px-3 py-1.5 text-xs font-medium text-ink-600 hover:bg-ink-200'}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <DataTable<InternshipApplication>
        columns={columns}
        data={filtered}
        emptyMessage={<span className="inline-flex items-center gap-2"><Inbox className="h-4 w-4" /> No applications match your filters.</span>}
        onRowClick={(r) => navigate(`/supervisor/review/${r.id}`)}
      />
    </div>
  );
}
