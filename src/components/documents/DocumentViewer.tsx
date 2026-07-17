import { Eye, Download, Printer } from 'lucide-react';
import type { ReactNode } from 'react';
import type { InternshipApplication } from '../../types';

interface DocumentViewerActionsProps {
  onView?: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
}

export function DocumentViewerActions({ onView, onDownload, onPrint }: DocumentViewerActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {onView && (
        <button type="button" onClick={onView} className="btn-secondary">
          <Eye className="h-4 w-4" /> View
        </button>
      )}
      {onDownload && (
        <button type="button" onClick={onDownload} className="btn-secondary">
          <Download className="h-4 w-4" /> Download
        </button>
      )}
      {onPrint && (
        <button type="button" onClick={onPrint} className="btn-secondary">
          <Printer className="h-4 w-4" /> Print
        </button>
      )}
    </div>
  );
}

export const documentPlaceholderActions = {
  onView: () => window.alert('View: Connect to document storage / PDF generation service.'),
  onDownload: () => window.alert('Download: Connect to PDF generation service.'),
  onPrint: () => window.print(),
};

export type DocumentKind = 'internship_form' | 'security_form' | 'certificate' | 'attendance_certificate' | 'internship_report';

export interface DocumentDescriptor {
  kind: DocumentKind;
  title: string;
  description: string;
  render: (app: InternshipApplication) => ReactNode;
}
