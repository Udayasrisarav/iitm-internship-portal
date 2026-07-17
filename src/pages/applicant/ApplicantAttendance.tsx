import { useApplications } from '../../contexts/ApplicationContext';
import { useRole } from '../../contexts/RoleContext';
import { DataTable } from '../../components/common/DataTable';
import { attendanceStatusMeta, classNames, formatDate } from '../../utils/format';
import type { AttendanceEntry } from '../../types';

export function ApplicantAttendance() {
  const { applications, loading } = useApplications();
  const { user } = useRole();
  const application = applications.find((a) => a.personal.email === user.email) ?? applications[0];

  if (loading || !application) {
    return <div className="card animate-pulse p-8"><div className="h-6 w-40 rounded bg-ink-100" /><div className="mt-4 h-64 rounded bg-ink-100" /></div>;
  }

  const records = application.attendance;
  const present = records.filter((r) => r.status === 'present').length;
  const absent = records.filter((r) => r.status === 'absent').length;
  const onLeave = records.filter((r) => r.status === 'leave').length;
  const workingDays = records.filter((r) => r.status !== 'holiday').length;
  const percentage = workingDays ? Math.round((present / workingDays) * 100) : 0;

  const weekdayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Build calendar grid starting from the first record's month start
  const first = records[0] ? new Date(records[0].date) : new Date();
  const year = first.getFullYear();
  const month = first.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = new Date(year, month, 1).getDay();

  const byDate = new Map(records.map((r) => [r.date, r]));
  const cells: (AttendanceEntry | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push(byDate.get(dateStr) ?? { id: `empty-${d}`, date: dateStr, status: 'holiday' });
  }

  const columns = [
    { key: 'date', header: 'Date', render: (r: AttendanceEntry) => <span className="font-medium text-ink-800">{formatDate(r.date)}</span> },
    { key: 'day', header: 'Day', render: (r: AttendanceEntry) => <span className="text-ink-500">{new Date(r.date).toLocaleDateString('en-IN', { weekday: 'long' })}</span> },
    {
      key: 'status', header: 'Status',
      render: (r: AttendanceEntry) => {
        const meta = attendanceStatusMeta[r.status];
        return <span className={classNames('badge', meta.className)}><span className={classNames('h-1.5 w-1.5 rounded-full', meta.dot)} /> {meta.label}</span>;
      },
    },
    { key: 'in', header: 'Check In', render: (r: AttendanceEntry) => <span className="text-ink-600">{r.checkIn ?? '—'}</span> },
    { key: 'out', header: 'Check Out', render: (r: AttendanceEntry) => <span className="text-ink-600">{r.checkOut ?? '—'}</span> },
  ];

  const ring = (pct: number) => {
    const r = 52;
    const c = 2 * Math.PI * r;
    return { strokeDasharray: c, strokeDashoffset: c - (pct / 100) * c };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Attendance</h2>
        <p className="section-subtitle">Daily attendance for {application.applicantId} — {application.schedule.batch}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Percentage ring */}
        <div className="card flex flex-col items-center justify-center p-6">
          <h3 className="self-start text-sm font-semibold text-ink-700">Attendance Percentage</h3>
          <div className="relative mt-4 flex h-40 w-40 items-center justify-center">
            <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="10" className="text-ink-100" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" className={percentage >= 75 ? 'text-success-500' : percentage >= 50 ? 'text-warning-500' : 'text-error-500'} style={ring(percentage)} />
            </svg>
            <div className="absolute text-center">
              <p className="font-display text-3xl font-bold text-ink-900">{percentage}%</p>
              <p className="text-xs text-ink-400">{present} / {workingDays} days</p>
            </div>
          </div>
          <div className="mt-4 grid w-full grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-success-50 p-2"><p className="text-lg font-bold text-success-700">{present}</p><p className="text-[11px] text-ink-500">Present</p></div>
            <div className="rounded-lg bg-error-50 p-2"><p className="text-lg font-bold text-error-700">{absent}</p><p className="text-[11px] text-ink-500">Absent</p></div>
            <div className="rounded-lg bg-warning-50 p-2"><p className="text-lg font-bold text-warning-700">{onLeave}</p><p className="text-[11px] text-ink-500">Leave</p></div>
          </div>
        </div>

        {/* Calendar */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-700">Attendance Calendar</h3>
            <p className="text-xs text-ink-400">{first.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
            {weekdayLabels.map((d, i) => <div key={i} className="text-[11px] font-semibold text-ink-400">{d}</div>)}
            {cells.map((cell, i) => {
              if (!cell) return <div key={i} className="aspect-square rounded-lg bg-transparent" />;
              const day = Number(cell.date.slice(-2));
              const meta = attendanceStatusMeta[cell.status];
              const isRecorded = records.some((r) => r.date === cell.date);
              return (
                <div
                  key={i}
                  title={`${formatDate(cell.date)} — ${meta.label}`}
                  className={classNames(
                    'flex aspect-square flex-col items-center justify-center rounded-lg text-xs font-medium transition',
                    isRecorded ? meta.className : 'bg-ink-50 text-ink-300',
                  )}
                >
                  <span>{day}</span>
                  {isRecorded && <span className={classNames('mt-0.5 h-1 w-1 rounded-full', meta.dot)} />}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-ink-100 pt-3">
            {Object.entries(attendanceStatusMeta).map(([key, meta]) => (
              <span key={key} className="inline-flex items-center gap-1.5 text-xs text-ink-500">
                <span className={classNames('h-2.5 w-2.5 rounded-full', meta.dot)} /> {meta.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <DataTable<AttendanceEntry> columns={columns} data={records} />
    </div>
  );
}
