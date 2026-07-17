import { useState } from 'react';
import { useApplications } from '../../contexts/ApplicationContext';
import { useRole } from '../../contexts/RoleContext';
import { FileUploader } from '../../components/common/FileUploader';
import { ApplicationFormViewer } from '../../components/documents/ApplicationFormViewer';
import { SecurityFormViewer } from '../../components/documents/SecurityFormViewer';
import { CertificateViewer } from '../../components/documents/CertificateViewer';
import { Modal } from '../../components/common/Modal';
import { documentPlaceholderActions, type DocumentKind } from '../../components/documents/DocumentViewer';
import { formatFileSize, formatDate } from '../../utils/format';
import { FileText, Eye, Download, Printer, Award, ShieldCheck, FileCheck } from 'lucide-react';
import type { DocumentFile, DocumentKey } from '../../types';
import { applicationService } from '../../services/applicationService';

const requiredDocs: { key: DocumentKey; label: string }[] = [
  { key: 'aadhaar', label: 'Aadhaar Card' },
  { key: 'photo', label: 'Passport Photograph' },
  { key: 'passbook', label: 'Bank Passbook' },
  { key: 'bonafide', label: 'Bonafide Certificate' },
  { key: 'college_id', label: 'College ID Card' },
];

export function ApplicantDocuments() {
  const { applications, refresh } = useApplications();
  const { user } = useRole();
  const application = applications.find((a) => a.personal.email === user.email) ?? applications[0];
  const [docs, setDocs] = useState<Partial<Record<DocumentKey, DocumentFile>>>(
    Object.fromEntries(application?.documents.map((d) => [d.key, d]) ?? []),
  );
  const [viewer, setViewer] = useState<{ kind: DocumentKind; title: string } | null>(null);

  if (!application) return null;

  const onUpload = async (key: DocumentKey, file: DocumentFile) => {
    setDocs((prev) => ({ ...prev, [key]: file }));
    await applicationService.uploadDocument(application.id, file);
    await refresh();
  };

  const onRemove = (key: DocumentKey) => {
    setDocs((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const printDocs: { kind: DocumentKind; title: string; desc: string; icon: typeof FileText }[] = [
    { kind: 'internship_form', title: 'Internship Form', desc: 'Application summary (A4)', icon: FileCheck },
    { kind: 'security_form', title: 'Security Form', desc: 'Security permission (A4)', icon: ShieldCheck },
    { kind: 'certificate', title: 'Completion Certificate', desc: 'Issued on completion', icon: Award },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Documents</h2>
        <p className="section-subtitle">Upload required documents and view print-ready forms — {application.applicantId}</p>
      </div>

      {/* Print-ready documents */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-ink-700">Print-Ready Documents</h3>
        <p className="text-xs text-ink-400">A4 layouts ready for download and print.</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {printDocs.map((doc) => {
            const Icon = doc.icon;
            return (
              <div key={doc.kind} className="rounded-xl border border-ink-200 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" />
                </span>
                <h4 className="mt-3 text-sm font-semibold text-ink-900">{doc.title}</h4>
                <p className="text-xs text-ink-400">{doc.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setViewer({ kind: doc.kind, title: doc.title })} className="btn-secondary text-xs">
                    <Eye className="h-3.5 w-3.5" /> View
                  </button>
                  <button type="button" onClick={documentPlaceholderActions.onDownload} className="btn-secondary text-xs">
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                  <button type="button" onClick={documentPlaceholderActions.onPrint} className="btn-secondary text-xs">
                    <Printer className="h-3.5 w-3.5" /> Print
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Uploaded documents */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-ink-700">Uploaded Documents</h3>
        <p className="text-xs text-ink-400">Required uploads for your application.</p>
        {application.documents.length > 0 && (
          <ul className="mt-4 divide-y divide-ink-100 rounded-lg border border-ink-100">
            {application.documents.map((doc) => (
              <li key={doc.key} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <FileText className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink-900">{doc.label}</p>
                    <p className="text-xs text-ink-400">{doc.fileName} · {formatFileSize(doc.fileSize)} · {formatDate(doc.uploadedAt)}</p>
                  </div>
                </div>
                <button type="button" onClick={documentPlaceholderActions.onDownload} className="btn-ghost text-xs">
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </li>
            ))}
          </ul>
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

      <Modal open={!!viewer} onClose={() => setViewer(null)} title={viewer?.title} size="lg" footer={<button type="button" onClick={() => setViewer(null)} className="btn-secondary">Close</button>}>
        <div className="overflow-x-auto rounded-lg bg-ink-100 p-4">
          {viewer?.kind === 'internship_form' && <ApplicationFormViewer application={application} />}
          {viewer?.kind === 'security_form' && <SecurityFormViewer application={application} />}
          {viewer?.kind === 'certificate' && <CertificateViewer application={application} />}
        </div>
      </Modal>
    </div>
  );
}
