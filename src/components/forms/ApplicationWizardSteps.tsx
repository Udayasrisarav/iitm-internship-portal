import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Field, FieldSection } from './Field';
import { FileUploader } from '../common/FileUploader';
import { SecurityFormViewer } from '../documents/SecurityFormViewer';
import { scheduleService } from '../../services/applicationService';
import type { ScheduleOption } from '../../services/applicationService';
import type { DocumentFile, DocumentKey, InternshipApplication } from '../../types';
import { formatDateTime, formatFileSize } from '../../utils/format';
import { StatusBadge } from '../common/StatusBadge';

export type ApplicationFormData = Omit<InternshipApplication, 'id' | 'applicantId' | 'status' | 'createdAt' | 'updatedAt' | 'submittedAt' | 'verification' | 'activities' | 'attendance' | 'workflow' | 'currentStage'> & {
  documentsByKey?: Partial<Record<DocumentKey, DocumentFile>>;
};

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const idTypeOptions = [
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'passport', label: 'Passport' },
  { value: 'voter_id', label: 'Voter ID' },
  { value: 'driving_license', label: 'Driving License' },
  { value: 'pan', label: 'PAN Card' },
];

const requiredDocSpec: { key: DocumentKey; label: string }[] = [
  { key: 'aadhaar', label: 'Aadhaar Card' },
  { key: 'photo', label: 'Passport Photograph' },
  { key: 'passbook', label: 'Bank Passbook' },
  { key: 'bonafide', label: 'Bonafide Certificate' },
  { key: 'college_id', label: 'College ID Card' },
];

export function Step1ApplicationForm() {
  return (
    <div className="space-y-6">
      <FieldSection title="Personal Information" description="Tell us about yourself.">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field name="personal.fullName" label="Full Name" placeholder="As per your ID" rules={{ required: 'Full name is required' }} />
          <Field name="personal.email" label="Email" type="email" placeholder="you@college.edu" rules={{ required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } }} />
          <Field name="personal.mobile" label="Mobile Number" placeholder="+91 98765 43210" rules={{ required: 'Mobile number is required' }} />
          <Field name="personal.gender" label="Gender" type="select" options={genderOptions} rules={{ required: 'Gender is required' }} />
          <Field name="personal.dateOfBirth" label="Date of Birth" type="date" rules={{ required: 'Date of birth is required' }} />
          <Field name="personal.address" label="Address" type="textarea" rows={2} placeholder="Complete postal address" className="sm:col-span-2" rules={{ required: 'Address is required' }} />
        </div>
      </FieldSection>

      <FieldSection title="Academic Information" description="Your current academic standing.">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field name="academic.collegeName" label="College Name" placeholder="Your college / university" rules={{ required: 'College name is required' }} />
          <Field name="academic.department" label="Department" placeholder="e.g. Computer Science & Engineering" rules={{ required: 'Department is required' }} />
          <Field name="academic.registerNumber" label="Register Number" placeholder="e.g. CS21B045" rules={{ required: 'Register number is required' }} />
          <Field name="academic.yearOfStudy" label="Year of Study" placeholder="e.g. 3rd Year" rules={{ required: 'Year of study is required' }} />
          <Field name="academic.skills" label="Skills" type="textarea" rows={2} placeholder="Comma-separated list of technical skills" className="sm:col-span-2" rules={{ required: 'Skills are required' }} />
          <Field name="academic.areaOfInterest" label="Area of Interest" type="textarea" rows={2} placeholder="Research or domain interests" className="sm:col-span-2" rules={{ required: 'Area of interest is required' }} />
        </div>
      </FieldSection>
    </div>
  );
}

export function Step2ScheduleSelection() {
  const { watch, setValue } = useFormContext<ApplicationFormData>();
  const [options, setOptions] = useState<ScheduleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedDept = watch('schedule.department');
  const selectedProf = watch('schedule.professor');

  useEffect(() => {
    scheduleService.listOptions().then((opts) => {
      setOptions(opts);
      setLoading(false);
    });
  }, []);

  const departments = Array.from(new Set(options.map((o) => o.department)));
  const professors = Array.from(new Set(options.filter((o) => o.department === selectedDept).map((o) => o.professor)));
  const selected = options.find((o) => o.department === selectedDept && o.professor === selectedProf);

  useEffect(() => {
    if (selected) {
      setValue('schedule.batch', selected.batch);
      setValue('schedule.startDate', selected.startDate);
      setValue('schedule.endDate', selected.endDate);
      setValue('schedule.duration', selected.duration ?? '');
    }
  }, [selected, setValue]);

  return (
    <div className="space-y-6">
      <FieldSection title="Schedule Selection" description="Choose the department, professor and batch for your internship.">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field name="schedule.department" label="Department" type="select" options={departments.map((d) => ({ value: d, label: d }))} rules={{ required: 'Select a department' }} hint={loading ? 'Loading departments…' : undefined} />
          <Field name="schedule.professor" label="Professor" type="select" options={professors.map((p) => ({ value: p, label: p }))} rules={{ required: 'Select a professor' }} hint={loading ? 'Loading professors…' : undefined} />
          <Field name="schedule.batch" label="Batch" placeholder="Auto-filled from selection" rules={{ required: 'Batch is required' }} />
          <div className="grid grid-cols-2 gap-4">
            <Field name="schedule.startDate" label="Start Date" type="date" rules={{ required: 'Start date is required' }} />
            <Field name="schedule.endDate" label="End Date" type="date" rules={{ required: 'End date is required' }} />
          </div>
        </div>
      </FieldSection>

      <div className="card p-6">
        <h3 className="section-title">Available Batches</h3>
        <p className="section-subtitle">Mock schedule options offered this term.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {loading ? (
            <p className="text-sm text-ink-400">Loading…</p>
          ) : (
            options.map((o) => (
              <button
                key={`${o.department}-${o.professor}-${o.batch}`}
                type="button"
                onClick={() => {
                  setValue('schedule.department', o.department);
                  setValue('schedule.professor', o.professor);
                  setValue('schedule.batch', o.batch);
                  setValue('schedule.startDate', o.startDate);
                  setValue('schedule.endDate', o.endDate);
                }}
                className="rounded-lg border border-ink-200 p-4 text-left transition hover:border-brand-300 hover:bg-brand-50/40"
              >
                <p className="text-sm font-semibold text-ink-900">{o.department}</p>
                <p className="mt-1 text-xs text-ink-500">{o.professor}</p>
                <p className="mt-2 text-xs text-ink-400">{o.batch}</p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function Step3SecurityForm() {
  const { watch } = useFormContext<ApplicationFormData>();
  const data = watch() as unknown as InternshipApplication;

  return (
    <div className="space-y-6">
      <FieldSection title="Security Permission Form" description="Complete the security permission details. A print-ready preview appears below.">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field name="security.studentName" label="Student Name" rules={{ required: 'Required' }} />
          <Field name="security.fatherName" label="Father's Name" rules={{ required: 'Required' }} />
          <Field name="security.collegeName" label="College Name" rules={{ required: 'Required' }} />
          <Field name="security.contactNumber" label="Contact Number" rules={{ required: 'Required' }} />
          <Field name="security.presentAddress" label="Present Address" type="textarea" rows={2} className="sm:col-span-2" rules={{ required: 'Required' }} />
          <Field name="security.idType" label="ID Type" type="select" options={idTypeOptions} rules={{ required: 'Required' }} />
          <Field name="security.idNumber" label="ID Number" rules={{ required: 'Required' }} />
          <Field name="security.departmentIITM" label="Department at IIT Madras" rules={{ required: 'Required' }} />
          <Field name="security.professorInCharge" label="Professor In Charge" rules={{ required: 'Required' }} />
          <Field name="security.durationFrom" label="Internship Duration From" type="date" rules={{ required: 'Required' }} />
          <Field name="security.durationTo" label="Internship Duration To" type="date" rules={{ required: 'Required' }} />
        </div>
      </FieldSection>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-400">Live A4 Preview</p>
        <div className="overflow-x-auto rounded-xl bg-ink-100 p-4">
          <SecurityFormViewer application={data} />
        </div>
      </div>
    </div>
  );
}

export function Step4BankDocuments({ documentsByKey, onUpload, onRemove }: {
  documentsByKey: Partial<Record<DocumentKey, DocumentFile>>;
  onUpload: (key: DocumentKey, file: DocumentFile) => void;
  onRemove: (key: DocumentKey) => void;
}) {
  return (
    <div className="space-y-6">
      <FieldSection title="Bank Details" description="Stipend (if applicable) will be credited to this account.">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field name="bank.accountHolderName" label="Account Holder Name" rules={{ required: 'Required' }} />
          <Field name="bank.accountNumber" label="Account Number" rules={{ required: 'Required' }} />
          <Field name="bank.ifscCode" label="IFSC Code" placeholder="SBIN0001234" rules={{ required: 'Required' }} />
          <Field name="bank.bankName" label="Bank Name" rules={{ required: 'Required' }} />
          <Field name="bank.branchName" label="Branch Name" rules={{ required: 'Required' }} />
        </div>
      </FieldSection>

      <FieldSection title="Required Documents" description="Upload clear scans. Accepted formats: PDF / JPG.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {requiredDocSpec.map((spec) => (
            <FileUploader
              key={spec.key}
              documentKey={spec.key}
              label={spec.label}
              existing={documentsByKey[spec.key]}
              onUploaded={(file) => onUpload(spec.key, file)}
              onRemove={() => onRemove(spec.key)}
            />
          ))}
        </div>
      </FieldSection>
    </div>
  );
}

export function Step5Review({ onSubmit }: { onSubmit: () => void }) {
  const { watch } = useFormContext<ApplicationFormData>();
  const data = watch() as unknown as InternshipApplication;

  const sections: { title: string; rows: { label: string; value: string }[] }[] = [
    {
      title: 'Application Form',
      rows: [
        { label: 'Full Name', value: data.personal?.fullName ?? '' },
        { label: 'Email', value: data.personal?.email ?? '' },
        { label: 'Mobile', value: data.personal?.mobile ?? '' },
        { label: 'College', value: data.academic?.collegeName ?? '' },
        { label: 'Department', value: data.academic?.department ?? '' },
        { label: 'Register No.', value: data.academic?.registerNumber ?? '' },
      ],
    },
    {
      title: 'Schedule',
      rows: [
        { label: 'Department', value: data.schedule?.department ?? '' },
        { label: 'Professor', value: data.schedule?.professor ?? '' },
        { label: 'Batch', value: data.schedule?.batch ?? '' },
        { label: 'Start Date', value: data.schedule?.startDate ?? '' },
        { label: 'End Date', value: data.schedule?.endDate ?? '' },
      ],
    },
    {
      title: 'Security Form',
      rows: [
        { label: 'Student Name', value: data.security?.studentName ?? '' },
        { label: "Father's Name", value: data.security?.fatherName ?? '' },
        { label: 'ID Type', value: data.security?.idType ?? '' },
        { label: 'ID Number', value: data.security?.idNumber ?? '' },
        { label: 'Professor In Charge', value: data.security?.professorInCharge ?? '' },
      ],
    },
    {
      title: 'Bank Details',
      rows: [
        { label: 'Account Holder', value: data.bank?.accountHolderName ?? '' },
        { label: 'Account Number', value: data.bank?.accountNumber ?? '' },
        { label: 'IFSC', value: data.bank?.ifscCode ?? '' },
        { label: 'Bank', value: `${data.bank?.bankName ?? ''}, ${data.bank?.branchName ?? ''}` },
      ],
    },
  ];

  const uploadedDocs = data.documents ?? [];

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        <div className="border-b border-ink-100 bg-brand-50/50 px-6 py-4">
          <h3 className="section-title">Review & Submit</h3>
          <p className="section-subtitle">Confirm the details below before submitting for verification.</p>
        </div>
        <div className="divide-y divide-ink-100">
          {sections.map((section) => (
            <div key={section.title} className="px-6 py-5">
              <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-500">{section.title}</h4>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {section.rows.map((row) => (
                  <div key={row.label}>
                    <dt className="text-xs text-ink-400">{row.label}</dt>
                    <dd className="text-sm font-medium text-ink-900">{row.value || '—'}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
          <div className="px-6 py-5">
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-500">Documents</h4>
            {uploadedDocs.length === 0 ? (
              <p className="text-sm text-ink-400">No documents uploaded.</p>
            ) : (
              <ul className="space-y-2">
                {uploadedDocs.map((doc) => (
                  <li key={doc.key} className="flex items-center justify-between rounded-lg bg-ink-50 px-3 py-2">
                    <span className="text-sm font-medium text-ink-800">{doc.label}</span>
                    <span className="text-xs text-ink-400">{doc.fileName} · {formatFileSize(doc.fileSize)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 rounded-xl border border-brand-200 bg-brand-50/40 p-6 text-center">
        <StatusBadge status="submitted" />
        <p className="max-w-md text-sm text-ink-600">
          Submitting will lock this application and send it to your supervisor for verification. You will not be able to edit after submission.
        </p>
        <button type="button" onClick={onSubmit} className="btn-primary">
          Submit For Verification
        </button>
      </div>
    </div>
  );
}

export function VerificationHistory({ application }: { application: InternshipApplication }) {
  const entries = application.verification;
  return (
    <div className="card p-6">
      <h3 className="section-title">Verification History</h3>
      <p className="section-subtitle">Chronological log of approvals, rejections and remarks.</p>
      {entries.length === 0 ? (
        <p className="mt-4 text-sm text-ink-400">No verification activity yet.</p>
      ) : (
        <ol className="mt-5 space-y-4">
          {entries.map((e) => (
            <li key={e.id} className="relative flex gap-3.5">
              <span
                className={
                  'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ' +
                  (e.action === 'approved' ? 'bg-success-100 text-success-700' : e.action === 'rejected' ? 'bg-error-100 text-error-700' : 'bg-brand-100 text-brand-700')
                }
              >
                {e.action === 'approved' ? 'A' : e.action === 'rejected' ? 'R' : 'N'}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold capitalize text-ink-900">
                  {e.action} <span className="font-normal text-ink-500">by {e.actorName}</span>
                </p>
                <p className="text-xs text-ink-400">{formatDateTime(e.timestamp)}</p>
                {e.remarks && <p className="mt-1 text-sm text-ink-700">{e.remarks}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
