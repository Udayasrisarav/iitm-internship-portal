import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/RoleContext';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithAccount } = useAuth();
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/applications';

  const handleGoogleSignIn = async () => {
    setLoading(true);
    // Simulated Google OAuth — role is derived from email in the auth context.
    // In production this would be a real Supabase OAuth call; the signed-in
    // user's role is determined from the database, never chosen manually.
    await signInWithAccount({ name: 'Priya Nair', email: 'priya.nair@gmail.com' });
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-md">
        {/* Institutional header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-700 font-display text-lg font-bold text-white shadow-lg shadow-brand-700/20">
            IITM
          </span>
          <h1 className="mt-5 font-display text-xl font-bold text-ink-900">
            IIT Madras
          </h1>
          <p className="mt-1 text-sm text-ink-500">Internship Management System</p>
        </div>

        {/* Sign-in card */}
        <div className="card p-8">
          <h2 className="text-center font-display text-lg font-semibold text-ink-900">
            Sign in to your account
          </h2>
          <p className="mt-1 text-center text-sm text-ink-500">
            Use your authorised Google account to continue.
          </p>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-medium text-ink-700 ring-1 ring-inset ring-ink-200 transition hover:bg-ink-50 disabled:opacity-60"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
            ) : (
              <GoogleIcon />
            )}
            {loading ? 'Signing in…' : 'Continue with Google'}
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Access is restricted to authorised IITM accounts.</span>
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-ink-400">
          <GraduationCap className="h-3.5 w-3.5" />
          Indian Institute of Technology Madras
        </p>
      </div>
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
