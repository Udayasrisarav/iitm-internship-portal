import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, ShieldCheck, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/RoleContext';

const DEMO_ACCOUNTS = [
  { name: 'Priya Nair', email: 'priya.nair@gmail.com', role: 'applicant', avatar: 'PN' },
  { name: 'Prof. V. Mahesh', email: 'supervisor.mahesh@iitm.ac.in', role: 'supervisor', avatar: 'VM' },
  { name: 'Dr. S. Ramachandran', email: 'chairman.ram@iitm.ac.in', role: 'chairman', avatar: 'SR' },
  { name: 'Admin User', email: 'portaladmin@iitm.ac.in', role: 'admin', avatar: 'AU' },
] as const;

const AVATAR_COLORS: Record<string, string> = {
  PN: 'bg-rose-500',
  VM: 'bg-blue-600',
  SR: 'bg-emerald-600',
  AU: 'bg-amber-600',
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithAccount } = useAuth();
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/applications';

  const handleSelectAccount = async (acc: (typeof DEMO_ACCOUNTS)[number]) => {
    setLoading(acc.email);
    await signInWithAccount({ name: acc.name, email: acc.email });
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-50 via-white to-brand-50/30">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Brand panel */}
        <div className="relative flex flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 p-8 text-white lg:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 font-display text-sm font-bold backdrop-blur">
                IITM
              </span>
              <div>
                <p className="font-display text-lg font-bold">IIT Madras</p>
                <p className="text-xs text-white/60">Internship Portal</p>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <h1 className="mt-8 max-w-md font-display text-3xl font-bold leading-tight lg:text-4xl">
              Internship Management System
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
              A unified workflow for applicants, supervisors, and chairman — from application to certificate.
            </p>
            <div className="mt-10 hidden grid-cols-3 gap-4 lg:grid">
              {[
                { label: 'Workflow Stages', value: '11' },
                { label: 'User Roles', value: '4' },
                { label: 'Process', value: '1' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-white/5 p-4 ring-1 ring-inset ring-white/10 backdrop-blur"
                >
                  <p className="text-xs font-medium text-brand-200">{stat.label}</p>
                  <p className="mt-1 font-display text-2xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 text-sm text-white/70">
              <GraduationCap className="h-5 w-5 text-white/50" />
              <span>Indian Institute of Technology Madras</span>
            </div>
          </div>
        </div>

        {/* Sign-in panel */}
        <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <h2 className="font-display text-2xl font-bold text-ink-900">Sign in</h2>
            <p className="mt-1 text-sm text-ink-500">Use your Google account to access the portal.</p>

            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={() => setShowPicker(true)}
                className="btn-secondary w-full justify-center bg-white px-4 py-3 text-base ring-1 ring-inset ring-ink-200 hover:bg-ink-50"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-ink-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Your account determines your role in the portal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Google account picker modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl ring-1 ring-ink-200/50 animate-scale-in">
            {/* Google-style header */}
            <div className="flex items-start justify-between px-6 pt-6">
              <div className="flex items-center gap-2">
                <GoogleIcon />
                <span className="text-sm font-medium text-ink-600">Sign in with Google</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPicker(false)}
                className="rounded-full p-1 text-ink-400 transition hover:bg-ink-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 px-6">
              <p className="text-xs text-ink-400">Choose an account to continue to IITM Internship Portal</p>
            </div>

            <div className="mt-3 divide-y divide-ink-100">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleSelectAccount(acc)}
                  disabled={loading !== null}
                  className="flex w-full items-center gap-3 px-6 py-3.5 text-left transition hover:bg-ink-50 disabled:pointer-events-none disabled:opacity-60"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${AVATAR_COLORS[acc.avatar]}`}
                  >
                    {loading === acc.email ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      acc.avatar
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-900">{acc.name}</p>
                    <p className="truncate text-xs text-ink-400">{acc.email}</p>
                  </div>
                  <span className="ml-auto rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-semibold capitalize text-ink-500">
                    {acc.role}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-ink-300" />
                </button>
              ))}
            </div>

            <div className="px-6 py-4">
              <p className="text-center text-[11px] text-ink-300">
                This is a demo environment. Select any account above.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}
