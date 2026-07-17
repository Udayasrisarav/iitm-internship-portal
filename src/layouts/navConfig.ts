import type { Role } from '../types';

export interface NavItem {
  label: string;
  to: string;
  icon: string;
  end?: boolean;
}

// Application-centric navigation. Every role works from the same
// Internship Application entity — nav entries reflect the workflow
// stage rather than a separate business module per role.
export const roleNavItems: Record<Role, NavItem[]> = {
  applicant: [
    { label: 'Dashboard', to: '/applications', icon: 'LayoutDashboard', end: true },
    { label: 'My Application', to: '/applications/my', icon: 'FileText' },
    { label: 'New Application', to: '/applications/new', icon: 'FilePlus' },
  ],
  supervisor: [
    { label: 'Applications', to: '/applications', icon: 'Inbox', end: true },
    { label: 'Pending Review', to: '/applications?filter=under_review', icon: 'ClipboardCheck' },
  ],
  chairman: [
    { label: 'Applications', to: '/applications', icon: 'Inbox', end: true },
    { label: 'Awaiting Signature', to: '/applications?filter=awaiting_chairman', icon: 'PenTool' },
  ],
  admin: [
    { label: 'Dashboard', to: '/admin/dashboard', icon: 'LayoutDashboard', end: true },
    { label: 'Applications', to: '/applications', icon: 'FolderOpen', end: false },
    { label: 'Users', to: '/admin/users', icon: 'Users' },
  ],
};

export const roleMeta: Record<Role, { title: string; subtitle: string }> = {
  applicant: { title: 'Internship Portal', subtitle: 'Apply, track, and complete your internship' },
  supervisor: { title: 'Internship Portal', subtitle: 'Review and verify internship applications' },
  chairman: { title: 'Internship Portal', subtitle: 'Sign documents and certificates' },
  admin: { title: 'Internship Portal', subtitle: 'Manage users and platform applications' },
};
