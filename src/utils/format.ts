import type { ApplicationStatus, AttendanceStatus } from '../types';

export function formatDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const applicationStatusMeta: Record<
  ApplicationStatus,
  { label: string; tone: 'brand' | 'success' | 'warning' | 'error' | 'neutral' }
> = {
  draft: { label: 'Draft', tone: 'neutral' },
  submitted: { label: 'Application Submitted', tone: 'brand' },
  schedule_selected: { label: 'Schedule Selected', tone: 'brand' },
  security_submitted: { label: 'Security Form Submitted', tone: 'brand' },
  bank_docs_submitted: { label: 'Bank & Documents Submitted', tone: 'brand' },
  under_review: { label: 'Under Verification', tone: 'warning' },
  approved: { label: 'Approved', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'error' },
  internship_active: { label: 'Internship Active', tone: 'brand' },
  in_progress: { label: 'In Progress', tone: 'brand' },
  completed: { label: 'Internship Completed', tone: 'success' },
  certificates_generated: { label: 'Certificates Generated', tone: 'success' },
  awaiting_chairman: { label: 'Awaiting Chairman Signature', tone: 'warning' },
  signed: { label: 'Signed', tone: 'success' },
  closed: { label: 'Closed', tone: 'neutral' },
};

export const statusOrder: ApplicationStatus[] = [
  'draft',
  'submitted',
  'schedule_selected',
  'security_submitted',
  'bank_docs_submitted',
  'under_review',
  'approved',
  'rejected',
  'internship_active',
  'in_progress',
  'completed',
  'certificates_generated',
  'awaiting_chairman',
  'signed',
  'closed',
];

export function computeDuration(startISO?: string, endISO?: string): string {
  if (!startISO || !endISO) return '';
  const start = new Date(startISO);
  const end = new Date(endISO);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '';
  const diff = Math.max(0, end.getTime() - start.getTime());
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  if (months >= 1) return `${months} month${months > 1 ? 's' : ''}`;
  if (weeks >= 1) return `${weeks} week${weeks > 1 ? 's' : ''}`;
  return `${days} day${days > 1 ? 's' : ''}`;
}

export const attendanceStatusMeta: Record<
  AttendanceStatus,
  { label: string; className: string; dot: string }
> = {
  present: {
    label: 'Present',
    className: 'bg-success-100 text-success-700',
    dot: 'bg-success-500',
  },
  absent: {
    label: 'Absent',
    className: 'bg-error-100 text-error-700',
    dot: 'bg-error-500',
  },
  leave: {
    label: 'On Leave',
    className: 'bg-warning-100 text-warning-700',
    dot: 'bg-warning-500',
  },
  holiday: {
    label: 'Holiday',
    className: 'bg-ink-100 text-ink-500',
    dot: 'bg-ink-300',
  },
};

export function classNames(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
