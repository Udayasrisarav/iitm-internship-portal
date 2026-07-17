import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useRole } from '../../contexts/RoleContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { switchRole, setUser } = useRole();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const role = email.includes('chairman') ? 'chairman'
        : email.includes('supervisor') ? 'supervisor'
        : email.includes('admin') ? 'admin'
        : 'applicant';
      switchRole(role);
      setUser({ name: role === 'applicant' ? 'Priya Nair' : role.charAt(0).toUpperCase() + role.slice(1) + ' User', email: email || `${role}@iitm.ac.in` });
      setSubmitting(false);
      navigate('/applications');
    }, 800);
  };

  const quickLogin = (role: 'applicant' | 'supervisor' | 'chairman' | 'admin') => {
    setSubmitting(true);
    const names = { applicant: 'Priya Nair', supervisor: 'Prof. V. Mahesh', chairman: 'Dr. Chairman', admin: 'Admin User' };
    setTimeout(() => {
      switchRole(role);
      setUser({ name: names[role], email: `${role}@iitm.ac.in` });
      setSubmitting(false);
      navigate('/applications');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-50 via-white to-brand-50/30">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Brand panel */}
        <div className="relative flex flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 p-8 text-white lg:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-white/5" />

          <button
            type="button"
            onClick={() => navigate('/')}
            className="relative z-10 inline-flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </button>

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 font-display text-sm font-bold backdrop-blur">IITM</span>
              <div>
                <p className="font-display text-lg font-bold">IIT Madras</p>
                <p className="text-xs text-white/60">Internship Portal</p>
              </div>
            </div>
            <h1 className="mt-8 max-w-md font-display text-3xl font-bold leading-tight lg:text-4xl">
              Internship Management System
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
              A single workflow for applicants, supervisors, and chairman — from application to certificate.
            </p>
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-3 text-sm text-white/70">
              <GraduationCap className="h-5 w-5 text-white/50" />
              <span>Indian Institute of Technology Madras</span>
            </div>
          </div>
        </div>

        {/* Login panel */}
        <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <h2 className="font-display text-2xl font-bold text-ink-900">Sign in</h2>
            <p className="mt-1 text-sm text-ink-500">Enter your credentials to access the portal.</p>

            <form onSubmit={submit} className="mt-8 space-y-5">
              <div>
                <label className="label">Email address</label>
                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    type="email"
                    className="input pl-10"
                    placeholder="you@iitm.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative mt-1.5">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    type="password"
                    className="input pl-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                {submitting ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-ink-200" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-3 text-xs font-medium text-ink-400">Quick demo login</span></div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {(['applicant', 'supervisor', 'chairman', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => quickLogin(r)}
                    disabled={submitting}
                    className="rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm font-medium capitalize text-ink-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-50"
                  >
                    {r === 'admin' ? 'Super Admin' : r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
