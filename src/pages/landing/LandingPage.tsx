import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  FileText,
  GitBranch,
  FolderOpen,
  CalendarCheck,
  Award,
  ShieldCheck,
  CheckCircle2,
  Building2,
  GraduationCap,
} from 'lucide-react';

const features = [
  { icon: GitBranch, title: 'Application Workflow', desc: 'A guided multi-step wizard takes applicants from personal details to submission with validation at every stage.' },
  { icon: FileText, title: 'Internship Tracking', desc: 'Track every application through eight defined stages — from form submission to certificate generation.' },
  { icon: FolderOpen, title: 'Document Management', desc: 'Upload, preview and manage required documents with print-ready A4 layouts for forms and certificates.' },
  { icon: CalendarCheck, title: 'Attendance Tracking', desc: 'Daily attendance with a visual calendar, percentage summary and a detailed status table.' },
  { icon: Award, title: 'Certificate Generation', desc: 'Automated, professional completion certificates ready for chairman approval and digital signatures.' },
  { icon: ShieldCheck, title: 'Role-Based Access', desc: 'Dedicated dashboards for applicants, supervisors, chairmen and admins — each with the right controls.' },
];

const processSteps = [
  { label: 'Application Form', desc: 'Personal & academic details' },
  { label: 'Schedule Selection', desc: 'Department, professor & batch' },
  { label: 'Security Form', desc: 'Security permission (A4)' },
  { label: 'Bank & Documents', desc: 'Banking & required uploads' },
  { label: 'Review & Submit', desc: 'Confirm & submit for verification' },
  { label: 'Under Verification', desc: 'Supervisor review & approval' },
  { label: 'Internship Active', desc: 'Daily activities & attendance' },
  { label: 'Certificates', desc: 'Generated & signed by chairman' },
];

export function LandingPage() {
  const navigate = useNavigate();

  const getStarted = () => navigate('/login');

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-700 font-display text-sm font-bold text-white">
              IITM
            </span>
            <div className="leading-tight">
              <p className="font-display text-sm font-bold text-ink-900">IIT Madras</p>
              <p className="text-[11px] text-ink-400">Internship Management Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={getStarted} className="btn-primary">
              Sign In <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0, transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.18) 0, transparent 45%)' }} />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white ring-1 ring-inset ring-white/20 backdrop-blur">
              <GraduationCap className="h-4 w-4" /> Indian Institute of Technology Madras
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              IIT Madras Internship Management Portal
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-100">
              A single, structured workflow that moves every internship application from submission to certificate —
              with role-based dashboards for applicants, supervisors, chairmen, and administrators.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button type="button" onClick={getStarted} className="btn-accent text-base">
                Get Started <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6">
              {[
                { label: 'Workflow Stages', value: '11' },
                { label: 'User Roles', value: '4' },
                { label: 'Single Entity', value: '1' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/5 p-4 ring-1 ring-inset ring-white/10 backdrop-blur">
                  <dt className="text-xs font-medium text-brand-200">{stat.label}</dt>
                  <dd className="mt-1 font-display text-3xl font-bold text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Everything in one place</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Built around the Internship Application
          </h2>
          <p className="mt-4 text-lg text-ink-500">
            Forms, approvals, documents, activities, attendance, reports and certificates all belong to the same
            application record — moving through one workflow.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="card group p-6 transition hover:shadow-elevated">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Process timeline */}
      <section className="bg-ink-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">How it works</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              One workflow, eight stages
            </h2>
            <p className="mt-4 text-lg text-ink-500">
              Every role interacts with the same application at different stages of this timeline.
            </p>
          </div>

          <ol className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, idx) => (
              <li key={step.label} className="relative card p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 font-display text-sm font-bold text-white">
                  {idx + 1}
                </span>
                <h3 className="mt-4 text-sm font-semibold text-ink-900">{step.label}</h3>
                <p className="mt-1 text-xs text-ink-400">{step.desc}</p>
                {idx < processSteps.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-7 hidden h-5 w-5 text-ink-300 lg:block" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Roles */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { role: 'applicant', title: 'Applicant', desc: 'Submit and track your internship application.', icon: GraduationCap },
            { role: 'supervisor', title: 'Supervisor', desc: 'Review, approve and monitor interns.', icon: FileText },
            { role: 'chairman', title: 'Chairman', desc: 'Sign documents and certificates.', icon: ShieldCheck },
            { role: 'admin', title: 'Super Admin', desc: 'Manage users and all applications.', icon: Building2 },
          ].map((r) => {
            const Icon = r.icon;
            return (
              <button key={r.role} type="button" onClick={getStarted} className="card group p-6 text-left transition hover:shadow-elevated">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink-900">{r.title}</h3>
                <p className="mt-1 text-sm text-ink-500">{r.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition group-hover:gap-1.5">
                  Enter <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 px-8 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Ready to begin your internship journey?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-brand-100">
            Create your application, track it through every stage, and receive your completion certificate — all in one portal.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={getStarted} className="btn-accent text-base">
              <CheckCircle2 className="h-5 w-5" /> Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-700 font-display text-sm font-bold text-white">
                  IITM
                </span>
                <div className="leading-tight">
                  <p className="font-display text-sm font-bold text-ink-900">IIT Madras</p>
                  <p className="text-[11px] text-ink-400">Internship Management Portal</p>
                </div>
              </div>
              <p className="mt-4 max-w-md text-sm text-ink-500">
                A structured, single-workflow platform for managing internships at the Indian Institute of Technology
                Madras — from application to certificate.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900">Portal</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-500">
                <li><button type="button" onClick={getStarted} className="hover:text-brand-600">Sign In</button></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900">Institute</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-500">
                <li>Indian Institute of Technology Madras</li>
                <li>Chennai, Tamil Nadu — 600036</li>
                <li>India</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-ink-100 pt-6 text-center text-xs text-ink-400">
            © {new Date().getFullYear()} IIT Madras. Internship Management Portal. For academic use.
          </div>
        </div>
      </footer>
    </div>
  );
}
