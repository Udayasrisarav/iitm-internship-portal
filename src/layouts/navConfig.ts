import type { Role } from '../types';

export interface NavItem {
  label: string;
  to: string;
  icon: string;
  end?: boolean;
}

// Unified navigation — every role works from the same Internship Application
// entity. Nav entries reflect what each role needs to do, not separate modules.
export const roleNavItems: Record<Role, NavItem[]> = {
  applicant: [
    { label: 'My Application', to: '/applications', icon: 'FileText', end: true },
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
    { label: 'Applications', to: '/applications', icon: 'FolderOpen' },
    { label: 'Users', to: '/admin/users', icon: 'Users' },
  ],
};

export const roleMeta: Record<Role, { title: string; subtitle: string }> = {
  applicant: { title: 'Internship Portal', subtitle: 'Your application and workflow' },
  supervisor: { title: 'Internship Portal', subtitle: 'Verify and monitor applications' },
  chairman: { title: 'Internship Portal', subtitle: 'Review and sign documents' },
  admin: { title: 'Internship Portal', subtitle: 'Manage users and applications' },
};
