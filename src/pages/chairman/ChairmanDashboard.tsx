import { useState } from 'react';
import { FileCheck, ShieldCheck, Award, Eye, Download, Printer } from 'lucide-react';
import { useApplications } from '../../contexts/ApplicationContext';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ApplicationFormViewer } from '../../components/documents/ApplicationFormViewer';
import { SecurityFormViewer } from '../../components/documents/SecurityFormViewer';
import { CertificateViewer } from '../../components/documents/CertificateViewer';
import { documentPlaceholderActions, type DocumentKind } from '../../components/documents/DocumentViewer';
import { formatDate } from '../../utils/format';

export function ChairmanDashboard() {
  const { applications } = useApplications();
  const [viewer, setViewer] = useState<{ kind: DocumentKind; title: string; appId: string } | null>(null);

  const awaiting = applications.filter((a) => a.status === 'approved' || a.status === 'in_progress');

  const docsForApp = [
    { kind: 'internship_form' as DocumentKind, title: 'Internship Form', icon: FileCheck },
    { kind: 'security_form' as DocumentKind, title: 'Security Form', icon: ShieldCheck },
    { kind: 'certificate' as DocumentKind, title: 'Certificate', icon: Award },
  ];

  const viewingApp = viewer ? applications.find((a) => a.id === viewer.appId) : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Chairman Console</h2>
        <p className="section-subtitle">Documents awaiting your signature and approval.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card p-5"><p className="text-sm text-ink-500">Awaiting Signature</p><p className="mt-1 font-display text-2xl font-bold text-ink-900">{awaiting.length}</p></div>
        <div className="card p-5"><p className="text-sm text-ink-500">Certificates Pending</p><p className="mt-1 font-display text-2xl font-bold text-brand-600">{awaiting.length}</p></div>
        <div className="card p-5"><p className="text-sm text-ink-500">Security Forms</p><p className="mt-1 font-display text-2xl font-bold text-ink-900">{awaiting.length}</p></div>
      </div>

      <div className="space-y-4">
        {awaiting.length === 0 ? (
          <div className="card p-10 text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-ink-300" />
            <p className="mt-3 text-sm text-ink-500">No documents awaiting signature.</p>
          </div>
        ) : (
          awaiting.map((app) => (
            <div key={app.id} className="card p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-mono text-xs text-ink-400">{app.applicantId}</p>
                    <p className="font-semibold text-ink-900">{app.personal.fullName}</p>
                    <p className="text-xs text-ink-500">{app.schedule.department} · {formatDate(app.schedule.startDate)} – {formatDate(app.schedule.endDate)}</p>
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {docsForApp.map((doc) => {
                  const Icon = doc.icon;
                  return (
                    <div key={doc.kind} className="rounded-lg border border-ink-200 p-4">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4.5 w-4.5 text-brand-600" />
                        <p className="text-sm font-semibold text-ink-900">{doc.title}</p>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <button type="button" onClick={() => setViewer({ kind: doc.kind, title: doc.title, appId: app.id })} className="btn-secondary text-xs">
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
          ))
        )}
      </div>

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
          {viewingApp && viewer?.kind === 'internship_form' && <ApplicationFormViewer application={viewingApp} />}
          {viewingApp && viewer?.kind === 'security_form' && <SecurityFormViewer application={viewingApp} />}
          {viewingApp && viewer?.kind === 'certificate' && <CertificateViewer application={viewingApp} />}
        </div>
      </Modal>
    </div>
  );
}
