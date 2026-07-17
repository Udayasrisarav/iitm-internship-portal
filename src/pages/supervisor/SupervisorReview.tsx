import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, X, MessageSquare, Download, Printer } from 'lucide-react';
import { useApplications } from '../../contexts/ApplicationContext';
import { useRole } from '../../contexts/RoleContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { VerificationHistory } from '../../components/forms/ApplicationWizardSteps';
import { ApplicationFormViewer } from '../../components/documents/ApplicationFormViewer';
import { SecurityFormViewer } from '../../components/documents/SecurityFormViewer';
import { applicationService } from '../../services/applicationService';
import { formatDate, formatDateTime, formatFileSize, initials } from '../../utils/format';
import type { VerificationAction } from '../../types';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-ink-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-ink-900">{value || '—'}</dd>
    </div>
  );
}

export function SupervisorReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications, refresh, currentApplication, loadById, currentLoading } = useApplications();
  const { user } = useRole();
  const application = applications.find((a) => a.id === id) ?? currentApplication;
  const [modal, setModal] = useState<{ action: VerificationAction } | null>(null);
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!application) {
    if (!currentLoading && id) loadById(id);
    return <div className="card animate-pulse p-8"><div className="h-6 w-40 rounded bg-ink-100" /></div>;
  }

  const openModal = (action: VerificationAction) => {
    setRemarks('');
    setModal({ action });
  };

  const confirm = async () => {
    if (!modal) return;
    setSubmitting(true);
    try {
      await applicationService.addVerification(application.id, {
        action: modal.action,
        actorName: user.name,
        actorRole: user.role,
        remarks,
      });
      await refresh();
      setModal(null);
      navigate('/supervisor/applications');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => navigate('/supervisor/applications')} className="btn-ghost">
          <ArrowLeft className="h-4 w-4" /> Back to applications
        </button>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => window.print()} className="btn-secondary"><Printer className="h-4 w-4" /> Print</button>
          <button type="button" onClick={() => window.alert('Download: connect to PDF generation service.')} className="btn-secondary"><Download className="h-4 w-4" /> Download</button>
        </div>
      </div>

      {/* Applicant header */}
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 font-display text-lg font-bold text-white">
              {initials(application.personal.fullName)}
            </span>
            <div>
              <p className="text-xs font-medium text-ink-400">{application.applicantId}</p>
              <h2 className="font-display text-xl font-bold text-ink-900">{application.personal.fullName}</h2>
              <p className="text-sm text-ink-500">{application.academic.collegeName}</p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <StatusBadge status={application.status} />
            <span className="text-xs text-ink-400">Submitted {formatDate(application.submittedAt)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-6">
            <h3 className="section-title">Applicant Information</h3>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoRow label="Email" value={application.personal.email} />
              <InfoRow label="Mobile" value={application.personal.mobile} />
              <InfoRow label="Gender" value={application.personal.gender} />
              <InfoRow label="Date of Birth" value={formatDate(application.personal.dateOfBirth)} />
              <InfoRow label="Register Number" value={application.academic.registerNumber} />
              <InfoRow label="Year of Study" value={application.academic.yearOfStudy} />
              <InfoRow label="Skills" value={application.academic.skills} />
              <InfoRow label="Area of Interest" value={application.academic.areaOfInterest} />
            </dl>
          </div>

          <div className="card p-6">
            <h3 className="section-title">Schedule Details</h3>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoRow label="Department" value={application.schedule.department} />
              <InfoRow label="Professor" value={application.schedule.professor} />
              <InfoRow label="Batch" value={application.schedule.batch} />
              <InfoRow label="Duration" value={`${formatDate(application.schedule.startDate)} – ${formatDate(application.schedule.endDate)}`} />
            </dl>
          </div>

          <div className="card p-6">
            <h3 className="section-title">Bank Details</h3>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoRow label="Account Holder" value={application.bank.accountHolderName} />
              <InfoRow label="Account Number" value={application.bank.accountNumber} />
              <InfoRow label="IFSC Code" value={application.bank.ifscCode} />
              <InfoRow label="Bank" value={`${application.bank.bankName}, ${application.bank.branchName}`} />
            </dl>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="section-title">Documents</h3>
              <span className="text-xs text-ink-400">{application.documents.length} uploaded</span>
            </div>
            <ul className="mt-4 divide-y divide-ink-100 rounded-lg border border-ink-100">
              {application.documents.map((doc) => (
                <li key={doc.key} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink-900">{doc.label}</p>
                    <p className="text-xs text-ink-400">{doc.fileName} · {formatFileSize(doc.fileSize)}</p>
                  </div>
                  <button type="button" onClick={() => window.alert('Download: connect to document storage.')} className="btn-ghost text-xs">
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-400">Internship Form (A4)</p>
            <div className="overflow-x-auto rounded-xl bg-ink-100 p-4">
              <ApplicationFormViewer application={application} />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-400">Security Form (A4)</p>
            <div className="overflow-x-auto rounded-xl bg-ink-100 p-4">
              <SecurityFormViewer application={application} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card sticky top-20 p-6">
            <h3 className="section-title">Verification Actions</h3>
            <p className="section-subtitle">Approve, reject or add remarks.</p>
            <div className="mt-4 space-y-2">
              <button type="button" onClick={() => openModal('approved')} className="btn-primary w-full">
                <Check className="h-4 w-4" /> Approve
              </button>
              <button type="button" onClick={() => openModal('rejected')} className="btn-danger w-full">
                <X className="h-4 w-4" /> Reject
              </button>
              <button type="button" onClick={() => openModal('remark')} className="btn-secondary w-full">
                <MessageSquare className="h-4 w-4" /> Add Remarks
              </button>
            </div>
          </div>

          <VerificationHistory application={application} />
        </div>
      </div>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.action === 'approved' ? 'Approve Application' : modal?.action === 'rejected' ? 'Reject Application' : 'Add Remarks'}
        description={modal?.action === 'approved' ? 'Confirm approval of this internship application.' : modal?.action === 'rejected' ? 'Provide a reason for rejection.' : 'Leave a remark for the applicant.'}
        footer={
          <>
            <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            <button
              type="button"
              onClick={confirm}
              disabled={submitting || (modal?.action === 'rejected' && !remarks)}
              className={modal?.action === 'rejected' ? 'btn-danger' : 'btn-primary'}
            >
              {submitting ? 'Saving…' : modal?.action === 'approved' ? 'Confirm Approval' : modal?.action === 'rejected' ? 'Confirm Rejection' : 'Save Remark'}
            </button>
          </>
        }
      >
        <div>
          <label className="label">Remarks {modal?.action === 'rejected' && <span className="text-error-500">*</span>}</label>
          <textarea rows={4} className="input mt-1.5" placeholder="Enter your remarks…" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
          <p className="mt-2 text-xs text-ink-400">Logged by {user.name} on {formatDateTime(new Date().toISOString())}</p>
        </div>
      </Modal>
    </div>
  );
}
