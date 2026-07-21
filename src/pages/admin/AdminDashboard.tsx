import { Link, useNavigate } from 'react-router-dom';
import { Users, FolderOpen, ArrowRight, Settings } from 'lucide-react';
import { useApplications } from '../../contexts/ApplicationContext';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { mockAdminUsers } from '../../mock-data/applications';
import { formatDate } from '../../utils/format';
import type { InternshipApplication } from '../../types';

export function AdminDashboard() {
  const { applications, loading } = useApplications();
  const navigate = useNavigate();

  const recentColumns = [
    { key: 'applicantId', header: 'Applicant ID', render: (r: InternshipApplication) => <span className="font-mono text-xs text-ink-600">{r.applicantId}</span> },
    { key: 'name', header: 'Name', render: (r: InternshipApplication) => <span className="font-medium text-ink-900">{r.personal.fullName}</span> },
    { key: 'status', header: 'Status', render: (r: InternshipApplication) => <StatusBadge status={r.status} /> },
    { key: 'updated', header: 'Last Updated', render: (r: InternshipApplication) => <span className="text-ink-500">{formatDate(r.updatedAt)}</span> },
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
      <div>
        <h2 className="section-title">Administration</h2>
        <p className="section-subtitle">Manage users, roles, and applications across the portal.</p>
      </div>

      {/* Management actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminActionCard
          to="/admin/users"
          icon={Users}
          title="User Management"
          desc="Manage user accounts and roles"
          meta={`${mockAdminUsers.length} users`}
        />
        <AdminActionCard
          to="/applications"
          icon={FolderOpen}
          title="Application Management"
          desc="View and manage all applications"
          meta={`${applications.length} applications`}
        />
        <AdminActionCard
          to="/admin/users"
          icon={Settings}
          title="Role Management"
          desc="Configure role permissions"
          meta="4 roles"
        />
        <AdminActionCard
          to="/applications"
          icon={FolderOpen}
          title="Workflow Management"
          desc="Monitor workflow progression"
          meta="11 stages"
        />
      </div>

      {/* Recent applications */}
      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="section-title">Recent Applications</h3>
            <p className="section-subtitle">Latest activity across the portal.</p>
          </div>
          <Link to="/applications" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <div className="h-32 animate-pulse rounded bg-ink-100" />
        ) : (
          <DataTable<InternshipApplication>
            columns={recentColumns}
            data={applications.slice(0, 5)}
            onRowClick={(r) => navigate(`/applications/${r.id}`)}
          />
        )}
      </div>
    </div>
  );
}

function AdminActionCard({ to, icon: Icon, title, desc, meta }: { to: string; icon: typeof Users; title: string; desc: string; meta: string }) {
  return (
    <Link to={to} className="card group flex flex-col gap-3 p-5 transition hover:shadow-elevated">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-xs font-medium text-ink-400">{meta}</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-ink-900">{title}</p>
        <p className="mt-0.5 text-xs text-ink-500">{desc}</p>
      </div>
    </Link>
  );
}
