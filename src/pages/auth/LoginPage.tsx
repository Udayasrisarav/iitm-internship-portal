import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/RoleContext';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle, user, loading, configError } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/applications';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
      </div>
    );
  }

  if (user) {
    navigate(from, { replace: true });
  }

  const onGoogle = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Google sign-in failed.');
      setSubmitting(false);
    }
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
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 font-display text-sm font-bold backdrop-blur">IITM</span>
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
              A single workflow for applicants, supervisors, and chairman — from application to certificate.
            </p>
            <div className="mt-10 hidden grid-cols-3 gap-4 lg:grid">
              {[
                { label: 'Workflow Stages', value: '11' },
                { label: 'User Roles', value: '4' },
                { label: 'Single Entity', value: '1' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/5 p-4 ring-1 ring-inset ring-white/10 backdrop-blur">
                  <p className="text-xs font-medium text-brand-200">{stat.label}</p>
                  <p className="mt-1 font-display text-2xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 space-y-3">
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

            <div className="mt-8">
              <button
                type="button"
                onClick={onGoogle}
                disabled={submitting}
                className="btn-secondary w-full bg-white px-4 py-3 text-base ring-1 ring-inset ring-ink-200 hover:bg-ink-50"
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
                ) : (
                  <GoogleIcon />
                )}
                {submitting ? 'Redirecting to Google…' : 'Continue with Google'}
              </button>

              {(error || configError) && (
                <div className="mt-3 rounded-lg border border-error-200 bg-error-50/60 px-3.5 py-2.5 text-sm font-medium text-error-700">
                  {error || configError}
                </div>
              )}

              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Your email determines your role (applicant / supervisor / chairman / admin).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}
