import type { InternshipApplication } from '../../types';
import { A4Layout } from './A4Layout';
import { formatDate } from '../../utils/format';

export function AttendanceCertificateViewer({ application }: { application: InternshipApplication }) {
  const records = application.attendance;
  const present = records.filter((r) => r.status === 'present').length;
  const workingDays = records.filter((r) => r.status !== 'holiday').length;
  const percentage = workingDays ? Math.round((present / workingDays) * 100) : 0;

  return (
    <A4Layout
      showHeader={false}
      footer="This attendance certificate is system-issued by the IIT Madras Internship Management Portal and is subject to verification."
    >
      <div className="text-center">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-ink-500">
          Indian Institute of Technology Madras
        </p>
        <p className="mt-0.5 text-xs text-ink-400">Chennai — 600036</p>
      </div>

      <div className="my-8 flex justify-center">
        <span className="inline-block rounded-full border-2 border-brand-700 px-6 py-1 font-display text-xs font-bold uppercase tracking-widest text-brand-700">
          Certificate of Attendance
        </span>
      </div>

      <p className="text-center text-sm text-ink-600">This is to certify that</p>
      <p className="mt-3 text-center font-display text-2xl font-bold text-ink-900">
        {application.personal.fullName}
      </p>
      <p className="mt-2 text-center text-sm text-ink-600">
        has maintained satisfactory attendance during the internship in the
      </p>
      <p className="mt-2 text-center font-display text-lg font-semibold text-brand-700">
        {application.schedule.department}
      </p>
      <p className="mt-2 text-center text-sm text-ink-600">
        for the period{' '}
        <span className="font-semibold text-ink-800">
          {formatDate(application.schedule.startDate)} to {formatDate(application.schedule.endDate)}
        </span>
      </p>

      <div className="mx-auto mt-8 max-w-md">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-ink-200">
              <td className="py-2.5 text-ink-600">Total Working Days</td>
              <td className="py-2.5 text-right font-semibold text-ink-900">{workingDays}</td>
            </tr>
            <tr className="border-b border-ink-200">
              <td className="py-2.5 text-ink-600">Days Present</td>
              <td className="py-2.5 text-right font-semibold text-success-700">{present}</td>
            </tr>
            <tr className="border-b border-ink-200">
              <td className="py-2.5 text-ink-600">Attendance Percentage</td>
              <td className="py-2.5 text-right font-display text-lg font-bold text-brand-700">{percentage}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-6 text-center text-xs">
        <div className="border-t border-ink-400 pt-1.5">
          <p className="font-semibold text-ink-700">Date</p>
          <p className="mt-6 text-ink-500">{formatDate(application.schedule.endDate)}</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="mb-2 h-14 w-14 rounded-full border-2 border-brand-700/40" />
          <p className="text-[11px] text-ink-400">Institution Seal</p>
        </div>
        <div className="border-t border-ink-400 pt-1.5">
          <p className="font-semibold text-ink-700">Chairman</p>
          <p className="mt-6 text-ink-500">{application.schedule.department}</p>
        </div>
      </div>

      <p className="mt-8 text-center text-[11px] text-ink-400">
        Ref. No. IITM/INT/ATT/{application.applicantId.split('-').pop()}
      </p>
    </A4Layout>
  );
}
