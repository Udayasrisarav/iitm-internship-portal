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
  submitted: { label: 'Submitted', tone: 'brand' },
  under_review: { label: 'Under Review', tone: 'warning' },
  approved: { label: 'Approved', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'error' },
  in_progress: { label: 'In Progress', tone: 'brand' },
  completed: { label: 'Completed', tone: 'success' },
};

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
