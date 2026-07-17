import { Link } from 'react-router-dom';
import {
  FileText,
  GitBranch,
  CalendarCheck,
  ListChecks,
  FolderOpen,
  ArrowRight,
  Clock,
  Mail,
  Phone,
  CreditCard,
} from 'lucide-react';
import { useApplications } from '../../contexts/ApplicationContext';
import { useRole } from '../../contexts/RoleContext';
import { ProgressTracker } from '../../components/workflow/ProgressTracker';
import { StatCard } from '../../components/dashboard/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { applicationStatusMeta, formatDate, initials } from '../../utils/format';

export function ApplicantDashboard() {
  const { applications, loading } = useApplications();
  const { user } = useRole();
  const application = applications.find((a) => a.personal.email === user.email) ?? applications[0];

  if (loading || !application) {
    return (
      <div className="card animate-pulse p-8">
        <div className="h-6 w-40 rounded bg-ink-100" />
        <div className="mt-4 h-32 rounded bg-ink-100" />
      </div>
    );
  }

  const presentDays = application.attendance.filter((a) => a.status === 'present').length;
  const totalDays = application.attendance.filter((a) => a.status !== 'holiday').length;
  const attendancePct = totalDays ? Math.round((presentDays / totalDays) * 100) : 0;
  const completedActivities = application.activities.filter((a) => a.status === 'completed').length;

  const quickLinks = [
    { to: '/applicant/application', label: 'Application', icon: FileText, desc: 'Edit or submit your application' },
    { to: '/applicant/workflow', label: 'Workflow', icon: GitBranch, desc: 'Track application stages' },
    { to: '/applicant/activities', label: 'Activities', icon: ListChecks, desc: 'Log daily work' },
    { to: '/applicant/attendance', label: 'Attendance', icon: CalendarCheck, desc: 'View attendance' },
    { to: '/applicant/documents', label: 'Documents', icon: FolderOpen, desc: 'Upload & view documents' },
  ];

  return (
    <div className="space-y-6">
      {/* Info card */}
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-600 font-display text-xl font-bold text-white">
              {initials(application.personal.fullName)}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-ink-400">Applicant ID</p>
              <p className="font-display text-xl font-bold text-ink-900">{application.applicantId}</p>
              <h2 className="mt-0.5 text-sm font-medium text-ink-600">{application.personal.fullName}</h2>
            </div>
          </div>
          <div className="hidden h-12 w-px bg-ink-100 sm:block" />
          <div className="grid flex-1 grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            <div className="flex items-center gap-2 text-ink-600">
              <Mail className="h-4 w-4 text-ink-400" />
              <span className="truncate">{application.personal.email}</span>
            </div>
            <div className="flex items-center gap-2 text-ink-600">
              <Phone className="h-4 w-4 text-ink-400" />
              <span className="truncate">{application.personal.mobile}</span>
            </div>
            <div className="flex items-center gap-2 text-ink-600">
              <CreditCard className="h-4 w-4 text-ink-400" />
              <span className="truncate">{application.academic.registerNumber}</span>
            </div>
          </div>
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <StatusBadge status={application.status} />
            <span className="flex items-center gap-1.5 text-xs text-ink-400">
              <Clock className="h-3.5 w-3.5" /> Updated {formatDate(application.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Workflow Stage" value={`${application.workflow.filter((s) => s.status === 'done').length}/${application.workflow.length}`} icon={GitBranch} tone="brand" hint={applicationStatusMeta[application.status].label} />
        <StatCard label="Attendance" value={`${attendancePct}%`} icon={CalendarCheck} tone="success" hint={`${presentDays} of ${totalDays} working days`} />
        <StatCard label="Activities Logged" value={application.activities.length} icon={ListChecks} tone="warning" hint={`${completedActivities} completed`} />
        <StatCard label="Documents" value={application.documents.length} icon={FolderOpen} tone="neutral" hint="Required uploads" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProgressTracker stages={application.workflow} />
        </div>
        <div className="space-y-3">
          <h3 className="px-1 text-sm font-semibold text-ink-700">Quick Actions</h3>
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.to} to={link.to} className="card group flex items-center gap-3 p-4 transition hover:shadow-elevated">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-900">{link.label}</p>
                  <p className="truncate text-xs text-ink-400">{link.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
