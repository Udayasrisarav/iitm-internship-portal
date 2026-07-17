import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Inbox, Clock, CheckCircle2, UserCheck, ArrowRight } from 'lucide-react';
import { useApplications } from '../../contexts/ApplicationContext';
import { StatCard } from '../../components/dashboard/StatCard';
import { ApplicationCard } from '../../components/dashboard/ApplicationCard';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/format';
import type { InternshipApplication } from '../../types';

export function SupervisorDashboard() {
  const { applications, loading } = useApplications();
  const navigate = useNavigate();

  const total = applications.length;
  const pending = applications.filter((a) => a.status === 'submitted' || a.status === 'under_review').length;
  const approved = applications.filter((a) => a.status === 'approved' || a.status === 'in_progress').length;
  const active = applications.filter((a) => a.status === 'in_progress').length;

  const pendingApps = applications.filter((a) => a.status === 'submitted' || a.status === 'under_review');

  const columns = [
    { key: 'applicantId', header: 'Applicant ID', render: (r: InternshipApplication) => <span className="font-mono text-xs font-medium text-ink-600">{r.applicantId}</span> },
    { key: 'name', header: 'Name', render: (r: InternshipApplication) => <span className="font-medium text-ink-900">{r.personal.fullName}</span> },
    { key: 'college', header: 'College', render: (r: InternshipApplication) => <span className="text-ink-600">{r.academic.collegeName}</span> },
    { key: 'status', header: 'Status', render: (r: InternshipApplication) => <StatusBadge status={r.status} /> },
    { key: 'submitted', header: 'Submitted', render: (r: InternshipApplication) => <span className="text-ink-500">{formatDate(r.submittedAt)}</span> },
    {
      key: 'action', header: 'Action',
      render: (r: InternshipApplication) => (
        <button type="button" onClick={(e) => { e.stopPropagation(); navigate(`/supervisor/review/${r.id}`); }} className="btn-primary text-xs">
          Review <ArrowRight className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Supervisor Overview</h2>
        <p className="section-subtitle">Review and verify internship applications assigned to you.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Applications" value={total} icon={Inbox} tone="brand" />
        <StatCard label="Pending Verification" value={pending} icon={Clock} tone="warning" hint="Awaiting your review" />
        <StatCard label="Approved" value={approved} icon={CheckCircle2} tone="success" />
        <StatCard label="Active Interns" value={active} icon={UserCheck} tone="neutral" hint="Currently in progress" />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink-700">Pending Applications</h3>
          <Link to="/supervisor/applications" className="text-sm font-medium text-brand-600 hover:underline">View all</Link>
        </div>
        {loading ? (
          <div className="card animate-pulse p-8"><div className="h-6 w-40 rounded bg-ink-100" /></div>
        ) : (
          <DataTable<InternshipApplication>
            columns={columns}
            data={pendingApps}
            emptyMessage="No applications pending review."
            onRowClick={(r) => navigate(`/supervisor/review/${r.id}`)}
          />
        )}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink-700">Recent Applications</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {applications.slice(0, 3).map((app) => (
            <ApplicationCard key={app.id} application={app} onClick={() => navigate(`/supervisor/review/${app.id}`)} />
          ))}
        </div>
      </div>
    </div>
  );
}
