import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, FileText, Calendar, ShieldCheck, CreditCard, FolderOpen,
  CheckCircle2, X, MessageSquare, ListChecks, CalendarCheck, Award,
  Download, Printer, PenTool, Lock, Info,
} from 'lucide-react';
import { useApplications } from '../../contexts/ApplicationContext';
import { useRole } from '../../contexts/RoleContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { FileUploader } from '../../components/common/FileUploader';
import { ProgressTracker } from '../../components/workflow/ProgressTracker';
import { VerificationHistory } from '../../components/forms/ApplicationWizardSteps';
import { ApplicationFormViewer } from '../../components/documents/ApplicationFormViewer';
import { SecurityFormViewer } from '../../components/documents/SecurityFormViewer';
import { CertificateViewer } from '../../components/documents/CertificateViewer';
import { AttendanceCertificateViewer } from '../../components/documents/AttendanceCertificateViewer';
import { InternshipReportViewer } from '../../components/documents/InternshipReportViewer';
import { documentPlaceholderActions, type DocumentKind } from '../../components/documents/DocumentViewer';
import { applicationService } from '../../services/applicationService';
import { applicationStatusMeta, classNames, computeDuration, formatDate, formatDateTime, formatFileSize, initials } from '../../utils/format';
import type { DocumentFile, DocumentKey, VerificationAction } from '../../types';

type Tab = 'overview' | 'schedule' | 'security' | 'bank_docs' | 'activities' | 'attendance' | 'certificates' | 'workflow';

const requiredDocs: { key: DocumentKey; label: string }[] = [
  { key: 'aadhaar', label: 'Aadhaar Card' },
  { key: 'photo', label: 'Passport Photograph' },
  { key: 'passbook', label: 'Bank Passbook' },
  { key: 'bonafide', label: 'Bonafide Certificate' },
  { key: 'college_id', label: 'College ID Card' },
];

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-ink-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-ink-900">{value || '—'}</dd>
    </div>
  );
}

export function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications, refresh, currentApplication, loadById, currentLoading } = useApplications();
  const { role, user } = useRole();
  const application = applications.find((a) => a.id === id) ?? currentApplication;
  const [tab, setTab] = useState<Tab>('overview');
  const [modal, setModal] = useState<{ action: VerificationAction } | null>(null);
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [docs, setDocs] = useState<Partial<Record<DocumentKey, DocumentFile>>>({});
  const [viewer, setViewer] = useState<{ kind: DocumentKind; title: string } | null>(null);

  useEffect(() => {
    if (id && !application && !currentLoading) loadById(id);
  }, [id, application, currentLoading, loadById]);

  useEffect(() => {
    if (application) {
      setDocs(Object.fromEntries(application.documents.map((d) => [d.key, d])));
    }
  }, [application]);

  if (!application) {
    return <div className="card animate-pulse p-8"><div className="h-6 w-40 rounded bg-ink-100" /></div>;
  }

  const isLocked = application.locked || application.status !== 'draft';
  const isUnderReview = application.status === 'under_review';
  const isAwaitingChairman = application.status === 'awaiting_chairman';
  const isApproved = application.status === 'approved' || application.status === 'internship_active' || application.status === 'in_progress';
  const isCompleted = application.status === 'completed' || application.status === 'certificates_generated' || application.status === 'awaiting_chairman' || application.status === 'signed' || application.status === 'closed';

  const openModal = (action: VerificationAction) => { setRemarks(''); setModal({ action }); };

  const confirm = async () => {
    if (!modal) return;
    setSubmitting(true);
    try {
      if (modal.action === 'approved') {
        await applicationService.setStatus(application.id, 'approved', 'internship_progress');
      } else if (modal.action === 'rejected') {
        await applicationService.setStatus(application.id, 'rejected', 'verification');
      }
      await applicationService.addVerification(application.id, {
        action: modal.action, actorName: user.name, actorRole: user.role, remarks,
      });
      await refresh();
      setModal(null);
    } finally { setSubmitting(false); }
  };

  const onSignChairman = async () => {
    setSubmitting(true);
    try {
      await applicationService.signChairman(application.id, user.name);
      await refresh();
    } finally { setSubmitting(false); }
  };

  const onUpload = async (key: DocumentKey, file: DocumentFile) => {
    setDocs((prev) => ({ ...prev, [key]: file }));
    await applicationService.uploadDocument(application.id, file);
    await refresh();
  };

  const onRemove = (key: DocumentKey) => {
    setDocs((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

  const presentDays = application.attendance.filter((a) => a.status === 'present').length;
  const totalDays = application.attendance.filter((a) => a.status !== 'holiday').length;
  const attendancePct = totalDays ? Math.round((presentDays / totalDays) * 100) : 0;

  const tabs: { id: Tab; label: string; icon: typeof FileText }[] = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'security', label: 'Security Form', icon: ShieldCheck },
    { id: 'bank_docs', label: 'Bank & Documents', icon: CreditCard },
    { id: 'activities', label: 'Activities', icon: ListChecks },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'workflow', label: 'Workflow', icon: ListChecks },
  ];

  const docViewerMap: Record<DocumentKind, () => React.ReactNode> = {
    internship_form: () => <ApplicationFormViewer application={application} />,
    security_form: () => <SecurityFormViewer application={application} />,
    certificate: () => <CertificateViewer application={application} />,
    attendance_certificate: () => <AttendanceCertificateViewer application={application} />,
    internship_report: () => <InternshipReportViewer application={application} />,
  };

  const allDocsUploaded = requiredDocs.every((d) => docs[d.key]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => navigate('/applications')} className="btn-ghost">
          <ArrowLeft className="h-4 w-4" /> Back to applications
        </button>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => window.print()} className="btn-secondary"><Printer className="h-4 w-4" /> Print</button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 font-display text-lg font-bold text-white">
              {initials(application.personal.fullName)}
            </span>
            <div>
              <p className="text-xs font-medium text-ink-400">{application.applicantId}</p>
              <h2 className="font-display text-xl font-bold text-ink-900">{application.personal.fullName}</h2>
              <p className="text-sm text-ink-500">{application.academic.collegeName} · {application.schedule.department || 'Department TBD'}</p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <StatusBadge status={application.status} />
            {isLocked && <span className="inline-flex items-center gap-1 text-xs text-ink-400"><Lock className="h-3 w-3" /> Locked</span>}
            <span className="text-xs text-ink-400">Updated {formatDateTime(application.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Role-based action panels */}
      {isUnderReview && role === 'supervisor' && (
        <div className="card border-warning-200 bg-warning-50/40 p-6">
          <h3 className="section-title">Verification Actions</h3>
          <p className="section-subtitle">Review and act on this application.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => openModal('approved')} className="btn-primary"><CheckCircle2 className="h-4 w-4" /> Approve</button>
            <button type="button" onClick={() => openModal('rejected')} className="btn-danger"><X className="h-4 w-4" /> Reject</button>
            <button type="button" onClick={() => openModal('remark')} className="btn-secondary"><MessageSquare className="h-4 w-4" /> Add Remarks</button>
          </div>
        </div>
      )}

      {isAwaitingChairman && role === 'chairman' && (
        <div className="card border-brand-200 bg-brand-50/40 p-6">
          <h3 className="section-title flex items-center gap-2"><PenTool className="h-5 w-5 text-brand-600" /> Chairman Signature Required</h3>
          <p className="section-subtitle">Review and sign the documents below.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => setViewer({ kind: 'internship_form', title: 'Internship Form' })} className="btn-secondary text-xs"><FileText className="h-3.5 w-3.5" /> View Internship Form</button>
            <button type="button" onClick={() => setViewer({ kind: 'security_form', title: 'Security Form' })} className="btn-secondary text-xs"><ShieldCheck className="h-3.5 w-3.5" /> View Security Form</button>
            <button type="button" onClick={() => setViewer({ kind: 'certificate', title: 'Internship Certificate' })} className="btn-secondary text-xs"><Award className="h-3.5 w-3.5" /> View Certificate</button>
            <button type="button" onClick={onSignChairman} disabled={submitting} className="btn-primary">
              <PenTool className="h-4 w-4" /> {submitting ? 'Signing…' : 'Sign Documents'}
            </button>
            <button type="button" onClick={documentPlaceholderActions.onDownload} className="btn-secondary text-xs"><Download className="h-3.5 w-3.5" /> Download</button>
            <button type="button" onClick={documentPlaceholderActions.onPrint} className="btn-secondary text-xs"><Printer className="h-3.5 w-3.5" /> Print</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="card p-2">
        <div className="flex flex-wrap gap-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={classNames(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
                  tab === t.id ? 'bg-brand-600 text-white shadow-sm' : 'text-ink-600 hover:bg-ink-50',
                )}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="space-y-6">
        {tab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h3 className="section-title">Applicant Information</h3>
              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow label="Full Name" value={application.personal.fullName} />
                <InfoRow label="Email" value={application.personal.email} />
                <InfoRow label="Mobile" value={application.personal.mobile} />
                <InfoRow label="Gender" value={application.personal.gender} />
                <InfoRow label="Date of Birth" value={formatDate(application.personal.dateOfBirth)} />
                <InfoRow label="Address" value={application.personal.address} />
              </dl>
            </div>
            <div className="card p-6">
              <h3 className="section-title">Academic Information</h3>
              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow label="College" value={application.academic.collegeName} />
                <InfoRow label="Department" value={application.academic.department} />
                <InfoRow label="Register Number" value={application.academic.registerNumber} />
                <InfoRow label="Year of Study" value={application.academic.yearOfStudy} />
                <InfoRow label="Skills" value={application.academic.skills} />
                <InfoRow label="Area of Interest" value={application.academic.areaOfInterest} />
              </dl>
            </div>
            <div className="card p-6 lg:col-span-2">
              <h3 className="section-title">Verification Status</h3>
              <p className="mt-2 text-sm text-ink-600">Current status: <span className="font-semibold text-ink-900">{applicationStatusMeta[application.status].label}</span></p>
              <VerificationHistory application={application} />
            </div>
          </div>
        )}

        {tab === 'schedule' && (
          <div className="card p-6">
            <h3 className="section-title">Internship Schedule</h3>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoRow label="Department" value={application.schedule.department} />
              <InfoRow label="Professor In Charge" value={application.schedule.professor} />
              <InfoRow label="Internship Batch" value={application.schedule.batch} />
              <InfoRow label="Start Date" value={formatDate(application.schedule.startDate)} />
              <InfoRow label="End Date" value={formatDate(application.schedule.endDate)} />
              <InfoRow label="Duration" value={application.schedule.duration || computeDuration(application.schedule.startDate, application.schedule.endDate)} />
            </dl>
          </div>
        )}

        {tab === 'security' && (
          <div className="space-y-4">
            <div className="card p-6">
              <h3 className="section-title">Security Permission Form</h3>
              <p className="section-subtitle">Security permission for internship training programme (A4).</p>
              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow label="Name of Student" value={application.security.studentName} />
                <InfoRow label="Father's Name" value={application.security.fatherName} />
                <InfoRow label="Name of College" value={application.security.collegeName} />
                <InfoRow label="Present Address" value={application.security.presentAddress} />
                <InfoRow label="Contact Number" value={application.security.contactNumber} />
                <InfoRow label="ID Type" value={application.security.idType} />
                <InfoRow label="ID Number" value={application.security.idNumber} />
                <InfoRow label="Department in IIT Madras" value={application.security.departmentIITM} />
                <InfoRow label="Professor In Charge" value={application.security.professorInCharge} />
                <InfoRow label="Duration From" value={formatDate(application.security.durationFrom)} />
                <InfoRow label="Duration To" value={formatDate(application.security.durationTo)} />
              </dl>
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-ink-400">A4 Preview</p>
            <div className="overflow-x-auto rounded-xl bg-ink-100 p-4">
              <SecurityFormViewer application={application} />
            </div>
          </div>
        )}

        {tab === 'bank_docs' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="section-title">Bank Details</h3>
              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow label="Account Holder Name" value={application.bank.accountHolderName} />
                <InfoRow label="Account Number" value={application.bank.accountNumber} />
                <InfoRow label="IFSC Code" value={application.bank.ifscCode} />
                <InfoRow label="Bank Name" value={application.bank.bankName} />
                <InfoRow label="Branch Name" value={application.bank.branchName} />
              </dl>
            </div>
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h3 className="section-title">Uploaded Documents</h3>
                <span className="text-xs text-ink-400">{application.documents.length}/5 uploaded</span>
              </div>
              {!allDocsUploaded && !isLocked && (
                <p className="mt-2 text-xs text-warning-600">All 5 required documents must be uploaded before submission.</p>
              )}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {requiredDocs.map((spec) => (
                  <FileUploader
                    key={spec.key}
                    documentKey={spec.key}
                    label={spec.label}
                    existing={docs[spec.key]}
                    onUploaded={(file) => onUpload(spec.key, file)}
                    onRemove={() => onRemove(spec.key)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'activities' && (
          <div className="card p-6">
            <h3 className="section-title">Daily Activities</h3>
            {!isApproved && !isCompleted ? (
              <div className="mt-6 flex flex-col items-center justify-center rounded-xl bg-ink-50 py-12 text-center">
                <Info className="h-8 w-8 text-ink-300" />
                <p className="mt-3 max-w-sm text-sm text-ink-500">Daily Activities will become available after your application has been approved.</p>
              </div>
            ) : application.activities.length === 0 ? (
              <p className="mt-4 text-sm text-ink-500">No activities logged yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-ink-100 rounded-lg border border-ink-100">
                {application.activities.map((a) => (
                  <li key={a.id} className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-ink-900">{a.taskTitle}</p>
                      <span className={a.status === 'completed' ? 'badge bg-success-50 text-success-700 ring-1 ring-inset ring-success-200' : 'badge bg-warning-50 text-warning-700 ring-1 ring-inset ring-warning-200'}>
                        {a.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink-400">{formatDate(a.date)}</p>
                    {a.workDescription && <p className="mt-1 text-sm text-ink-600">{a.workDescription}</p>}
                    {a.reportFileName && <p className="mt-1 text-xs text-brand-600">Report: {a.reportFileName}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === 'attendance' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="card flex flex-col items-center p-6">
              <h3 className="self-start text-sm font-semibold text-ink-700">Attendance Percentage</h3>
              <p className="mt-4 font-display text-4xl font-bold text-ink-900">{attendancePct}%</p>
              <p className="mt-1 text-xs text-ink-400">{presentDays} / {totalDays} working days</p>
            </div>
            <div className="card p-6 lg:col-span-2">
              <h3 className="text-sm font-semibold text-ink-700">Attendance Records</h3>
              {application.attendance.length === 0 ? (
                <p className="mt-4 text-sm text-ink-500">No attendance records available.</p>
              ) : (
                <ul className="mt-4 divide-y divide-ink-100 rounded-lg border border-ink-100">
                  {application.attendance.slice(0, 20).map((r) => (
                    <li key={r.id} className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-sm font-medium text-ink-800">{formatDate(r.date)}</span>
                      <span className="text-xs capitalize text-ink-500">{r.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {tab === 'certificates' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="section-title">Certificates & Reports</h3>
              <p className="section-subtitle">View, download and print completion documents.</p>
              {!isCompleted ? (
                <div className="mt-6 flex flex-col items-center justify-center rounded-xl bg-ink-50 py-12 text-center">
                  <Info className="h-8 w-8 text-ink-300" />
                  <p className="mt-3 max-w-sm text-sm text-ink-500">Certificates will be available after internship completion.</p>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {([
                    { kind: 'certificate' as DocumentKind, title: 'Internship Certificate', icon: Award, desc: 'Completion certificate' },
                    { kind: 'attendance_certificate' as DocumentKind, title: 'Attendance Certificate', icon: CalendarCheck, desc: 'Attendance record' },
                    { kind: 'internship_report' as DocumentKind, title: 'Internship Report', icon: FileText, desc: 'Summary report' },
                  ]).map((doc) => {
                    const Icon = doc.icon;
                    return (
                      <div key={doc.kind} className="rounded-xl border border-ink-200 p-5">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Icon className="h-5 w-5" /></span>
                        <h4 className="mt-3 text-sm font-semibold text-ink-900">{doc.title}</h4>
                        <p className="text-xs text-ink-400">{doc.desc}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button type="button" onClick={() => setViewer({ kind: doc.kind, title: doc.title })} className="btn-secondary text-xs">View</button>
                          <button type="button" onClick={documentPlaceholderActions.onDownload} className="btn-secondary text-xs"><Download className="h-3.5 w-3.5" /> PDF</button>
                          <button type="button" onClick={documentPlaceholderActions.onPrint} className="btn-secondary text-xs"><Printer className="h-3.5 w-3.5" /> Print</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'workflow' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ProgressTracker stages={application.workflow} />
            </div>
            <VerificationHistory application={application} />
          </div>
        )}
      </div>

      {/* Verification modal */}
      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.action === 'approved' ? 'Approve Application' : modal?.action === 'rejected' ? 'Reject Application' : 'Add Remarks'}
        description={modal?.action === 'approved' ? 'Confirm approval of this internship application.' : modal?.action === 'rejected' ? 'Provide a reason for rejection.' : 'Leave a remark for the applicant.'}
        footer={
          <>
            <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            <button type="button" onClick={confirm} disabled={submitting || (modal?.action === 'rejected' && !remarks)} className={modal?.action === 'rejected' ? 'btn-danger' : 'btn-primary'}>
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

      {/* Document viewer modal */}
      <Modal
        open={!!viewer}
        onClose={() => setViewer(null)}
        title={viewer?.title}
        size="lg"
        footer={
          <>
            <button type="button" onClick={documentPlaceholderActions.onPrint} className="btn-secondary"><Printer className="h-4 w-4" /> Print</button>
            <button type="button" onClick={() => setViewer(null)} className="btn-primary">Close</button>
          </>
        }
      >
        <div className="overflow-x-auto rounded-lg bg-ink-100 p-4">
          {viewer && docViewerMap[viewer.kind]()}
        </div>
      </Modal>
    </div>
  );
}
