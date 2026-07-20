import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/RoleContext';
import { classNames, initials } from '../../utils/format';

export function Navbar({ onMenuClick, title }: { onMenuClick: () => void; title: string }) {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const onSignOut = async () => {
    setOpen(false);
    await signOut();
    navigate('/login', { replace: true });
  };

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
            {initials(user?.name ?? '')}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold leading-tight text-ink-900">{user?.name}</span>
            <span className="block text-[11px] capitalize leading-tight text-ink-400">{role}</span>
          </span>
          <ChevronDown className={classNames('h-4 w-4 text-ink-400 transition', open && 'rotate-180')} />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden />
            <div className="absolute right-0 z-40 mt-2 w-64 rounded-xl border border-ink-200 bg-white p-2 shadow-pop animate-scale-in">
              <div className="px-3 py-2">
                <p className="truncate text-sm font-semibold text-ink-900">{user?.name}</p>
                <p className="truncate text-xs text-ink-400">{user?.email}</p>
              </div>
              <div className="mt-1 border-t border-ink-100 pt-1">
                <button
                  type="button"
                  onClick={onSignOut}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
