import type { InternshipApplication } from '../../types';
import { A4Layout } from './A4Layout';
import { formatDate } from '../../utils/format';

const idTypeLabels: Record<string, string> = {
  aadhaar: 'Aadhaar Card',
  passport: 'Passport',
  voter_id: 'Voter ID',
  driving_license: 'Driving License',
  pan: 'PAN Card',
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-ink-200">
      <td className="w-1/3 py-2.5 pr-4 align-top text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</td>
      <td className="py-2.5 align-top text-sm font-medium text-ink-900">{value || '—'}</td>
    </tr>
  );
}

export function SecurityFormViewer({ application }: { application: InternshipApplication }) {
  const s = application.security;
  return (
    <A4Layout
      showHeader={false}
      footer="Security permission form — IIT Madras Internship Management Portal. To be retained by the Security Section."
    >
      <div className="text-center">
        <p className="font-display text-sm font-bold uppercase tracking-wider text-ink-700">
          Indian Institute of Technology Madras
        </p>
        <p className="text-xs text-ink-500">Security Section</p>
      </div>

      <h2 className="mt-6 text-center font-display text-base font-bold uppercase tracking-wide text-ink-900">
        Security Permission for Internship Training Programme
      </h2>
      <p className="mb-6 text-center text-xs text-ink-500">Ref. {application.applicantId}</p>

      <table className="w-full">
        <tbody>
          <Row label="Student Name" value={s.studentName} />
          <Row label="Father's Name" value={s.fatherName} />
          <Row label="College Name" value={s.collegeName} />
          <Row label="Present Address" value={s.presentAddress} />
          <Row label="Contact Number" value={s.contactNumber} />
          <Row label="ID Type" value={idTypeLabels[s.idType] ?? s.idType} />
          <Row label="ID Number" value={s.idNumber} />
          <Row label="Department at IIT Madras" value={s.departmentIITM} />
          <Row label="Professor In Charge" value={s.professorInCharge} />
          <Row label="Internship Duration From" value={formatDate(s.durationFrom)} />
          <Row label="Internship Duration To" value={formatDate(s.durationTo)} />
        </tbody>
      </table>

      <div className="mt-10 grid grid-cols-3 gap-6 text-xs">
        <div className="border-t border-ink-400 pt-1.5">
          <p className="font-semibold text-ink-700">Applicant Signature</p>
          {application.securitySignatures?.applicant ? (
            <p className="mt-2 text-[10px] text-success-600">Signed {formatDate(application.securitySignatures.applicant.signedAt)}</p>
          ) : <p className="mt-2 text-[10px] text-ink-300">Pending</p>}
          <div className="mt-8 text-ink-500">{s.studentName}</div>
        </div>
        <div className="border-t border-ink-400 pt-1.5">
          <p className="font-semibold text-ink-700">Chief Security Officer</p>
          {application.securitySignatures?.chiefSecurityOfficer ? (
            <p className="mt-2 text-[10px] text-success-600">Signed {formatDate(application.securitySignatures.chiefSecurityOfficer.signedAt)}</p>
          ) : <p className="mt-2 text-[10px] text-ink-300">Pending</p>}
          <div className="mt-8 text-ink-400">Security Section</div>
        </div>
        <div className="border-t border-ink-400 pt-1.5">
          <p className="font-semibold text-ink-700">Chairman Signature</p>
          {application.securitySignatures?.chairman ? (
            <p className="mt-2 text-[10px] text-success-600">Signed {formatDate(application.securitySignatures.chairman.signedAt)}</p>
          ) : <p className="mt-2 text-[10px] text-ink-300">Pending</p>}
          <div className="mt-8 text-ink-400">{s.departmentIITM}</div>
        </div>
      </div>
    </A4Layout>
  );
}
