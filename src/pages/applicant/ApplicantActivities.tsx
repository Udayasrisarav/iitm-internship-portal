import { useState } from 'react';
import { useApplications } from '../../contexts/ApplicationContext';
import { useRole } from '../../contexts/RoleContext';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { applicationService } from '../../services/applicationService';
import { formatDate } from '../../utils/format';
import { Plus, Link2, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import type { ActivityEntry, ActivityStatus } from '../../types';

const statusOptions: { value: ActivityStatus; label: string }[] = [
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export function ApplicantActivities() {
  const { applications, refresh } = useApplications();
  const { user } = useRole();
  const application = applications.find((a) => a.personal.email === user.email) ?? applications[0];

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ date: '', taskTitle: '', workDescription: '', status: 'in_progress' as ActivityStatus, reportLink: '' });
  const [uploading, setUploading] = useState(false);
  const [reportName, setReportName] = useState<string | undefined>();

  if (!application) return null;

  const addActivity = async () => {
    if (!form.taskTitle || !form.date) return;
    setSaving(true);
    try {
      await applicationService.addActivity(application.id, {
        date: form.date,
        taskTitle: form.taskTitle,
        workDescription: form.workDescription,
        status: form.status,
        reportLink: form.reportLink || undefined,
        reportFileName: reportName,
      });
      await refresh();
      setOpen(false);
      setForm({ date: '', taskTitle: '', workDescription: '', status: 'in_progress', reportLink: '' });
      setReportName(undefined);
    } finally {
      setSaving(false);
    }
  };

  const onReportUpload = (file: File) => {
    setUploading(true);
    setTimeout(() => {
      setReportName(file.name);
      setUploading(false);
    }, 700);
  };

  const columns = [
    { key: 'date', header: 'Date', render: (r: ActivityEntry) => <span className="font-medium text-ink-800">{formatDate(r.date)}</span> },
    { key: 'taskTitle', header: 'Task Title', render: (r: ActivityEntry) => <span className="font-medium text-ink-900">{r.taskTitle}</span> },
    { key: 'description', header: 'Work Description', render: (r: ActivityEntry) => <span className="block max-w-md truncate text-ink-600">{r.workDescription}</span> },
    {
      key: 'status', header: 'Status',
      render: (r: ActivityEntry) => (
        <span className={r.status === 'completed' ? 'badge bg-success-50 text-success-700 ring-1 ring-inset ring-success-200' : 'badge bg-warning-50 text-warning-700 ring-1 ring-inset ring-warning-200'}>
          {r.status === 'completed' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Loader2 className="h-3.5 w-3.5" />} {r.status === 'completed' ? 'Completed' : 'In Progress'}
        </span>
      ),
    },
    {
      key: 'report', header: 'Report',
      render: (r: ActivityEntry) =>
        r.reportLink ? (
          <a href={r.reportLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline">
            <Link2 className="h-4 w-4" /> {r.reportFileName ?? 'View'}
          </a>
        ) : r.reportFileName ? (
          <span className="text-sm text-ink-500">{r.reportFileName}</span>
        ) : (
          <span className="text-sm text-ink-300">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Daily Activities</h2>
          <p className="section-subtitle">Log your daily work and reports for {application.applicantId}</p>
        </div>
        <button type="button" onClick={() => setOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> Log Activity
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card p-5"><p className="text-sm text-ink-500">Total Activities</p><p className="mt-1 font-display text-2xl font-bold text-ink-900">{application.activities.length}</p></div>
        <div className="card p-5"><p className="text-sm text-ink-500">Completed</p><p className="mt-1 font-display text-2xl font-bold text-success-600">{application.activities.filter((a) => a.status === 'completed').length}</p></div>
        <div className="card p-5"><p className="text-sm text-ink-500">In Progress</p><p className="mt-1 font-display text-2xl font-bold text-warning-600">{application.activities.filter((a) => a.status === 'in_progress').length}</p></div>
      </div>

      <DataTable<ActivityEntry> columns={columns} data={application.activities} emptyMessage="No activities logged yet. Click 'Log Activity' to add your first entry." />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Log Daily Activity"
        description="Record the work you completed today."
        size="lg"
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary">Cancel</button>
            <button type="button" onClick={addActivity} disabled={saving || !form.taskTitle || !form.date} className="btn-primary">
              {saving ? 'Saving…' : 'Save Activity'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Date <span className="text-error-500">*</span></label>
              <input type="date" className="input mt-1.5" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input mt-1.5" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ActivityStatus })}>
                {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Task Title <span className="text-error-500">*</span></label>
            <input className="input mt-1.5" placeholder="e.g. Baseline model training" value={form.taskTitle} onChange={(e) => setForm({ ...form, taskTitle: e.target.value })} />
          </div>
          <div>
            <label className="label">Work Description</label>
            <textarea rows={3} className="input mt-1.5" placeholder="Describe the work performed…" value={form.workDescription} onChange={(e) => setForm({ ...form, workDescription: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Report Link</label>
              <input className="input mt-1.5" placeholder="https://…" value={form.reportLink} onChange={(e) => setForm({ ...form, reportLink: e.target.value })} />
            </div>
            <div>
              <label className="label">Report Upload</label>
              <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ink-200 bg-ink-50/40 px-4 py-2.5 text-sm text-ink-500 transition hover:border-brand-300 hover:bg-brand-50/40">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {reportName ?? 'Choose file'}
                <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && onReportUpload(e.target.files[0])} />
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
