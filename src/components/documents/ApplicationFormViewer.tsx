import type { InternshipApplication } from '../../types';
import { A4Layout } from './A4Layout';
import { formatDate } from '../../utils/format';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-ink-900">{value || '—'}</dd>
    </div>
  );
}

export function ApplicationFormViewer({ application }: { application: InternshipApplication }) {
  return (
    <A4Layout
      title="Internship Application"
      subtitle={`Ref. ${application.applicantId}`}
      footer="This is a system-generated summary of the internship application submitted via the IIT Madras Internship Management Portal."
    >
      <h2 className="mb-1 text-center font-display text-lg font-bold uppercase tracking-wide text-ink-900">
        Internship Application Form
      </h2>
      <p className="mb-6 text-center text-xs text-ink-500">Application ID: {application.applicantId}</p>

      <section className="mb-6">
        <h3 className="mb-3 border-b border-ink-200 pb-1 text-sm font-bold uppercase tracking-wide text-ink-700">
          Personal Information
        </h3>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
          <Field label="Full Name" value={application.personal.fullName} />
          <Field label="Email" value={application.personal.email} />
          <Field label="Mobile Number" value={application.personal.mobile} />
          <Field label="Gender" value={application.personal.gender} />
          <Field label="Date of Birth" value={formatDate(application.personal.dateOfBirth)} />
          <Field label="Address" value={application.personal.address} />
        </dl>
      </section>

      <section className="mb-6">
        <h3 className="mb-3 border-b border-ink-200 pb-1 text-sm font-bold uppercase tracking-wide text-ink-700">
          Academic Information
        </h3>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
          <Field label="College Name" value={application.academic.collegeName} />
          <Field label="Department" value={application.academic.department} />
          <Field label="Register Number" value={application.academic.registerNumber} />
          <Field label="Year of Study" value={application.academic.yearOfStudy} />
          <Field label="Skills" value={application.academic.skills} />
          <Field label="Area of Interest" value={application.academic.areaOfInterest} />
        </dl>
      </section>

      <section className="mb-6">
        <h3 className="mb-3 border-b border-ink-200 pb-1 text-sm font-bold uppercase tracking-wide text-ink-700">
          Schedule & Bank Details
        </h3>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
          <Field label="Department at IITM" value={application.schedule.department} />
          <Field label="Professor In Charge" value={application.schedule.professor} />
          <Field label="Batch" value={application.schedule.batch} />
          <Field label="Duration" value={`${formatDate(application.schedule.startDate)} – ${formatDate(application.schedule.endDate)}`} />
          <Field label="Account Holder" value={application.bank.accountHolderName} />
          <Field label="Bank Name" value={`${application.bank.bankName}, ${application.bank.branchName}`} />
        </dl>
      </section>

      <section className="grid grid-cols-2 gap-6">
        <div className="border-t border-ink-300 pt-2">
          <p className="text-[11px] text-ink-400">Signature of Applicant</p>
          <div className="mt-8 text-xs text-ink-500">{application.personal.fullName}</div>
        </div>
        <div className="border-t border-ink-300 pt-2">
          <p className="text-[11px] text-ink-400">Signature of Professor In Charge</p>
          <div className="mt-8 text-xs text-ink-500">{application.schedule.professor}</div>
        </div>
      </section>
    </A4Layout>
  );
}
