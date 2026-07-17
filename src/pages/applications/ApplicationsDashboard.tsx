import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, ArrowRight, Inbox, FilePlus, Users, FolderOpen, Clock, CheckCircle2, PenTool } from 'lucide-react';
import { useApplications } from '../../contexts/ApplicationContext';
import { useRole } from '../../contexts/RoleContext';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/dashboard/StatCard';
import { ApplicationCard } from '../../components/dashboard/ApplicationCard';
import { formatDate, applicationStatusMeta } from '../../utils/format';
import type { ApplicationStatus, InternshipApplication } from '../../types';

const statusFilters: { value: 'all' | ApplicationStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'under_review', label: 'Under Verification' },
  { value: 'internship_active', label: 'Active' },
  { value: 'awaiting_chairman', label: 'Awaiting Signature' },
  { value: 'signed', label: 'Signed' },
  { value: 'rejected', label: 'Rejected' },
];

export function ApplicationsDashboard() {
  const { applications, loading } = useApplications();
  const { role, user } = useRole();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | ApplicationStatus>('all');
  const [query, setQuery] = useState('');

  // Applicants see only their own application(s)
  const scoped = role === 'applicant'
    ? applications.filter((a) => a.personal.email === user.email || a.applicantId === 'IITM-2026-0001')
    : applications;

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

  const total = scoped.length;
  const pending = scoped.filter((a) => a.status === 'under_review').length;
  const active = scoped.filter((a) => a.status === 'internship_active' || a.status === 'in_progress').length;
  const awaitingChair = scoped.filter((a) => a.status === 'awaiting_chairman').length;

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="section-title">Internship Applications</h2>
          <p className="section-subtitle">
            {role === 'applicant' ? 'Your internship application' : role === 'supervisor' ? 'Review and verify applications' : role === 'chairman' ? 'Documents awaiting signature' : 'All platform applications'}
          </p>
        </div>
        {role === 'applicant' && (
          <button type="button" onClick={() => navigate('/applications/new')} className="btn-primary">
            <FilePlus className="h-4 w-4" /> New Application
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Applications" value={total} icon={FolderOpen} tone="brand" />
        <StatCard label="Pending Verification" value={pending} icon={Clock} tone="warning" />
        <StatCard label="Active Interns" value={active} icon={CheckCircle2} tone="success" />
        <StatCard label="Awaiting Chairman" value={awaitingChair} icon={PenTool} tone="neutral" />
      </div>

      {role !== 'applicant' && (
        <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input className="input pl-9" placeholder="Search by name, ID or college…" value={query} onChange={(e) => setQuery(e.target.value)} />
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
