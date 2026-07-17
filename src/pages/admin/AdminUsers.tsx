import { useState } from 'react';
import { Search } from 'lucide-react';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { mockAdminUsers, type AdminUserRow } from '../../mock-data/applications';
import { formatDate, initials } from '../../utils/format';

const roleBadge: Record<string, string> = {
  applicant: 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200',
  supervisor: 'bg-success-50 text-success-700 ring-1 ring-inset ring-success-200',
  chairman: 'bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200',
  admin: 'bg-ink-100 text-ink-700 ring-1 ring-inset ring-ink-200',
};

export function AdminUsers() {
  const [query, setQuery] = useState('');

  const filtered = mockAdminUsers.filter((u) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  const columns = [
    {
      key: 'user', header: 'User',
      render: (r: AdminUserRow) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{initials(r.name)}</span>
          <div>
            <p className="font-medium text-ink-900">{r.name}</p>
            <p className="text-xs text-ink-400">{r.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', header: 'Role', render: (r: AdminUserRow) => <span className={`badge capitalize ${roleBadge[r.role]}`}>{r.role}</span> },
    { key: 'apps', header: 'Applications', render: (r: AdminUserRow) => <span className="font-medium text-ink-800">{r.applicationsCount}</span> },
    { key: 'lastActive', header: 'Last Active', render: (r: AdminUserRow) => <span className="text-ink-500">{formatDate(r.lastActive)}</span> },
    { key: 'status', header: 'Status', render: () => <StatusBadge status="approved" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Users</h2>
        <p className="section-subtitle">All users across the portal.</p>
      </div>

      <div className="card relative p-4">
        <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input className="input pl-9" placeholder="Search users by name, email or role…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <DataTable<AdminUserRow> columns={columns} data={filtered} emptyMessage="No users found." />
    </div>
  );
}
