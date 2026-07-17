import type { Role } from '../types';

export interface NavItem {
  label: string;
  to: string;
  icon: string;
  end?: boolean;
}

export const roleNavItems: Record<Role, NavItem[]> = {
  applicant: [
    { label: 'Dashboard', to: '/applicant', icon: 'LayoutDashboard', end: true },
    { label: 'Application', to: '/applicant/application', icon: 'FileText' },
    { label: 'Workflow', to: '/applicant/workflow', icon: 'GitBranch' },
    { label: 'Daily Activities', to: '/applicant/activities', icon: 'ListChecks' },
    { label: 'Attendance', to: '/applicant/attendance', icon: 'CalendarCheck' },
    { label: 'Documents', to: '/applicant/documents', icon: 'FolderOpen' },
  ],
  supervisor: [
    { label: 'Dashboard', to: '/supervisor', icon: 'LayoutDashboard', end: true },
    { label: 'Applications', to: '/supervisor/applications', icon: 'Inbox' },
  ],
  chairman: [
    { label: 'Dashboard', to: '/chairman', icon: 'LayoutDashboard', end: true },
    { label: 'Documents', to: '/chairman/documents', icon: 'ShieldCheck' },
  ],
  admin: [
    { label: 'Dashboard', to: '/admin/dashboard', icon: 'LayoutDashboard', end: true },
    { label: 'Users', to: '/admin/users', icon: 'Users' },
    { label: 'Applications', to: '/admin/applications', icon: 'FolderOpen' },
  ],
};

export const roleMeta: Record<Role, { title: string; subtitle: string }> = {
  applicant: { title: 'Applicant Portal', subtitle: 'Apply, track, and complete your internship' },
  supervisor: { title: 'Supervisor Console', subtitle: 'Review and verify internship applications' },
  chairman: { title: 'Chairman Console', subtitle: 'Approve documents and certificates' },
  admin: { title: 'Super Admin', subtitle: 'Manage users and platform applications' },
};
