import type { InternshipApplication } from '../../types';
import { A4Layout } from './A4Layout';
import { formatDate } from '../../utils/format';

export function InternshipReportViewer({ application }: { application: InternshipApplication }) {
  const completed = application.activities.filter((a) => a.status === 'completed').length;

  return (
    <A4Layout
      title="Internship Report"
      subtitle={application.applicantId}
      footer="This report is system-issued by the IIT Madras Internship Management Portal."
    >
      <div className="mb-6">
        <h2 className="font-display text-lg font-bold text-ink-900">Internship Summary Report</h2>
        <p className="text-xs text-ink-500">Applicant ID: {application.applicantId}</p>
      </div>

      <section className="mb-6">
        <h3 className="text-sm font-semibold text-ink-800">1. Applicant Details</h3>
        <table className="mt-3 w-full text-sm">
          <tbody>
            <tr className="border-b border-ink-100"><td className="w-1/3 py-2 text-ink-500">Full Name</td><td className="py-2 font-medium text-ink-900">{application.personal.fullName}</td></tr>
            <tr className="border-b border-ink-100"><td className="py-2 text-ink-500">College</td><td className="py-2 font-medium text-ink-900">{application.academic.collegeName}</td></tr>
            <tr className="border-b border-ink-100"><td className="py-2 text-ink-500">Register Number</td><td className="py-2 font-medium text-ink-900">{application.academic.registerNumber}</td></tr>
            <tr className="border-b border-ink-100"><td className="py-2 text-ink-500">Department</td><td className="py-2 font-medium text-ink-900">{application.academic.department}</td></tr>
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        <h3 className="text-sm font-semibold text-ink-800">2. Internship Details</h3>
        <table className="mt-3 w-full text-sm">
          <tbody>
            <tr className="border-b border-ink-100"><td className="w-1/3 py-2 text-ink-500">Department at IITM</td><td className="py-2 font-medium text-ink-900">{application.schedule.department}</td></tr>
            <tr className="border-b border-ink-100"><td className="py-2 text-ink-500">Professor In Charge</td><td className="py-2 font-medium text-ink-900">{application.schedule.professor}</td></tr>
            <tr className="border-b border-ink-100"><td className="py-2 text-ink-500">Batch</td><td className="py-2 font-medium text-ink-900">{application.schedule.batch}</td></tr>
            <tr className="border-b border-ink-100"><td className="py-2 text-ink-500">Duration</td><td className="py-2 font-medium text-ink-900">{formatDate(application.schedule.startDate)} — {formatDate(application.schedule.endDate)} ({application.schedule.duration || '—'})</td></tr>
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        <h3 className="text-sm font-semibold text-ink-800">3. Activity Summary</h3>
        <p className="mt-2 text-sm text-ink-600">
          Total activities logged: <span className="font-semibold text-ink-900">{application.activities.length}</span>,
          with <span className="font-semibold text-success-700">{completed}</span> completed.
        </p>
        {application.activities.length > 0 && (
          <table className="mt-3 w-full text-xs">
            <thead className="bg-ink-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-ink-600">Date</th>
                <th className="px-3 py-2 text-left font-semibold text-ink-600">Task</th>
                <th className="px-3 py-2 text-left font-semibold text-ink-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {application.activities.slice(0, 10).map((a) => (
                <tr key={a.id} className="border-b border-ink-100">
                  <td className="px-3 py-2 text-ink-600">{formatDate(a.date)}</td>
                  <td className="px-3 py-2 font-medium text-ink-900">{a.taskTitle}</td>
                  <td className="px-3 py-2 capitalize text-ink-600">{a.status.replace('_', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <div className="mt-12 grid grid-cols-2 gap-6 text-center text-xs">
        <div className="border-t border-ink-400 pt-1.5">
          <p className="font-semibold text-ink-700">Applicant Signature</p>
          <p className="mt-6 text-ink-500">{application.personal.fullName}</p>
        </div>
        <div className="border-t border-ink-400 pt-1.5">
          <p className="font-semibold text-ink-700">Supervisor</p>
          <p className="mt-6 text-ink-500">{application.schedule.professor}</p>
        </div>
      </div>
    </A4Layout>
  );
}
