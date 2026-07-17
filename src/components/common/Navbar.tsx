import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, GraduationCap, User2, ShieldCheck, Briefcase, SlidersHorizontal } from 'lucide-react';
import type { Role } from '../../types';
import { useRole } from '../../contexts/RoleContext';
import { classNames, initials } from '../../utils/format';

const roleOptions: { role: Role; label: string; icon: typeof User2; desc: string }[] = [
  { role: 'applicant', label: 'Applicant', icon: User2, desc: 'Apply for internships' },
  { role: 'supervisor', label: 'Supervisor', icon: Briefcase, desc: 'Review applications' },
  { role: 'chairman', label: 'Chairman', icon: ShieldCheck, desc: 'Approve documents' },
  { role: 'admin', label: 'Super Admin', icon: SlidersHorizontal, desc: 'Manage platform' },
];

export function Navbar({ onMenuClick, title }: { onMenuClick: () => void; title: string }) {
  const { role, switchRole, user } = useRole();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-ink-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-ink-600 hover:bg-ink-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-base font-bold text-ink-900 sm:text-lg">{title}</h1>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2.5 rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 transition hover:bg-ink-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
            {initials(user.name)}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold leading-tight text-ink-900">{user.name}</span>
            <span className="block text-[11px] capitalize leading-tight text-ink-400">{role} view</span>
          </span>
          <ChevronDown className={classNames('h-4 w-4 text-ink-400 transition', open && 'rotate-180')} />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden />
            <div className="absolute right-0 z-40 mt-2 w-72 rounded-xl border border-ink-200 bg-white p-2 shadow-pop animate-scale-in">
              <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                Switch role (dev)
              </p>
              {roleOptions.map((opt) => {
                const Icon = opt.icon;
                const active = opt.role === role;
                return (
                  <button
                    key={opt.role}
                    type="button"
                    onClick={() => {
                      switchRole(opt.role);
                      setOpen(false);
                      navigate(`/${opt.role === 'admin' ? 'admin/dashboard' : opt.role}`);
                    }}
                    className={classNames(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition',
                      active ? 'bg-brand-50 ring-1 ring-brand-200' : 'hover:bg-ink-50',
                    )}
                  >
                    <span
                      className={classNames(
                        'flex h-9 w-9 items-center justify-center rounded-lg',
                        active ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500',
                      )}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-ink-900">{opt.label}</span>
                      <span className="block text-xs text-ink-400">{opt.desc}</span>
                    </span>
                    {active && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                  </button>
                );
              })}
              <div className="mt-1 border-t border-ink-100 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate('/');
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
                >
                  <GraduationCap className="h-4 w-4" /> Back to landing page
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
