import { Link } from 'react-router-dom';
import { Users, FolderOpen, Inbox, CheckCircle2, ArrowRight, TrendingUp } from 'lucide-react';
import { useApplications } from '../../contexts/ApplicationContext';
import { StatCard } from '../../components/dashboard/StatCard';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { mockAdminUsers } from '../../mock-data/applications';
import { applicationStatusMeta, formatDate } from '../../utils/format';
import type { InternshipApplication } from '../../types';

export function AdminDashboard() {
  const { applications } = useApplications();

  const total = applications.length;
  const pending = applications.filter((a) => a.status === 'submitted' || a.status === 'under_review').length;
  const approved = applications.filter((a) => a.status === 'approved' || a.status === 'in_progress').length;

  const statusBreakdown = (Object.keys(applicationStatusMeta) as InternshipApplication['status'][]).map((status) => ({
    status,
    count: applications.filter((a) => a.status === status).length,
  }));

  const recentColumns = [
    { key: 'applicantId', header: 'Applicant ID', render: (r: InternshipApplication) => <span className="font-mono text-xs text-ink-600">{r.applicantId}</span> },
    { key: 'name', header: 'Name', render: (r: InternshipApplication) => <span className="font-medium text-ink-900">{r.personal.fullName}</span> },
    { key: 'status', header: 'Status', render: (r: InternshipApplication) => <StatusBadge status={r.status} /> },
    { key: 'updated', header: 'Last Updated', render: (r: InternshipApplication) => <span className="text-ink-500">{formatDate(r.updatedAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Admin Overview</h2>
        <p className="section-subtitle">Platform-wide statistics and recent activity.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={mockAdminUsers.length} icon={Users} tone="brand" />
        <StatCard label="Total Applications" value={total} icon={FolderOpen} tone="neutral" />
        <StatCard label="Pending Review" value={pending} icon={Inbox} tone="warning" />
        <StatCard label="Approved / Active" value={approved} icon={CheckCircle2} tone="success" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h3 className="section-title">Recent Applications</h3>
          <p className="section-subtitle">Latest activity across the portal.</p>
          <div className="mt-4">
            <DataTable<InternshipApplication> columns={recentColumns} data={applications.slice(0, 5)} />
          </div>
          <Link to="/admin/applications" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
            View all applications <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-600" />
            <h3 className="section-title">Status Breakdown</h3>
          </div>
          <ul className="mt-5 space-y-3">
            {statusBreakdown.map((row) => {
              const meta = applicationStatusMeta[row.status];
              const pct = total ? Math.round((row.count / total) * 100) : 0;
              return (
                <li key={row.status}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-600">{meta.label}</span>
                    <span className="font-semibold text-ink-900">{row.count}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
