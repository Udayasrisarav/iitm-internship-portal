import { useRef, useState } from 'react';
import { FileUp, FileText, Loader2, Trash2, CheckCircle2, Eye } from 'lucide-react';
import type { DocumentFile, DocumentKey } from '../../types';
import { formatFileSize } from '../../utils/format';
import { classNames } from '../../utils/format';

interface FileUploaderProps {
  documentKey: DocumentKey;
  label: string;
  existing?: DocumentFile;
  onUploaded: (file: DocumentFile) => void;
  onRemove?: () => void;
}

const requiredMime: Record<DocumentKey, string> = {
  aadhaar: 'application/pdf',
  photo: 'image/jpeg',
  passbook: 'application/pdf',
  bonafide: 'application/pdf',
  college_id: 'application/pdf',
};

export function FileUploader({ documentKey, label, existing, onUploaded, onRemove }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [current, setCurrent] = useState<DocumentFile | undefined>(existing);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleFile = (file: File) => {
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 22;
        if (next >= 100) {
          clearInterval(interval);
          const doc: DocumentFile = {
            key: documentKey,
            label,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type || requiredMime[documentKey],
            uploadedAt: new Date().toISOString(),
            previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
          };
          setCurrent(doc);
          onUploaded(doc);
          setUploading(false);
          return 100;
        }
        return next;
      });
    }, 120);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const remove = () => {
    setCurrent(undefined);
    setProgress(0);
    onRemove?.();
  };

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <FileText className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink-900">{label}</p>
            <p className="text-xs text-ink-400">Required</p>
          </div>
        </div>
        {current && (
          <span className="badge bg-success-50 text-success-700 ring-1 ring-inset ring-success-200">
            <CheckCircle2 className="h-3.5 w-3.5" /> Uploaded
          </span>
        )}
      </div>

      {!current && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-3 flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ink-200 bg-ink-50/40 px-4 py-6 text-center transition hover:border-brand-300 hover:bg-brand-50/40"
        >
          <FileUp className="h-6 w-6 text-ink-400" />
          <span className="text-sm font-medium text-ink-600">Click to upload</span>
          <span className="text-xs text-ink-400">PDF or image up to 5MB</span>
        </button>
      )}

      {uploading && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-ink-500">
            <span className="flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading…
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {current && !uploading && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-ink-50 px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            {current.previewUrl ? (
              <img src={current.previewUrl} alt={current.label} className="h-9 w-9 rounded object-cover" />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded bg-white text-ink-500 ring-1 ring-ink-200">
                <FileText className="h-4 w-4" />
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink-800">{current.fileName}</p>
              <p className="text-xs text-ink-400">{formatFileSize(current.fileSize)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {current.previewUrl && (
              <button
                type="button"
                onClick={() => setPreviewOpen((v) => !v)}
                className="rounded-md p-1.5 text-ink-500 transition hover:bg-white hover:text-brand-600"
                aria-label="Preview"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={remove}
              className="rounded-md p-1.5 text-ink-500 transition hover:bg-white hover:text-error-600"
              aria-label="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {previewOpen && current?.previewUrl && (
        <div className="mt-3 overflow-hidden rounded-lg border border-ink-200">
          <img src={current.previewUrl} alt={current.label} className={classNames('w-full object-contain')} />
        </div>
      )}

      <input ref={inputRef} type="file" className="hidden" accept={requiredMime[documentKey]} onChange={onChange} />
    </div>
  );
}
