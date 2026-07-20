import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Role, User } from '../types';

const SESSION_KEY = 'iitm_auth_user';

interface AuthContextValue {
  user: User | null;
  role: Role;
  loading: boolean;
  signInWithAccount: (account: { name: string; email: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

// Back-compat alias for components that still call useRole().
export { useAuth as useRole };

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function deriveRole(email: string): Role {
  const local = email.split('@')[0].toLowerCase();
  if (local.includes('admin')) return 'admin';
  if (local.includes('chairman')) return 'chairman';
  if (local.includes('supervisor') || local.includes('prof')) return 'supervisor';
  return 'applicant';
}

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readStoredUser());
    setLoading(false);
  }, []);

  const signInWithAccount = useCallback(async (account: { name: string; email: string }) => {
    const role = deriveRole(account.email);
    const newUser: User = {
      id: btoa(account.email),
      name: account.name,
      email: account.email,
      role,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    setUser(newUser);
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const role = user?.role ?? 'applicant';

  const value = useMemo<AuthContextValue>(
    () => ({ user, role, loading, signInWithAccount, signOut }),
    [user, role, loading, signInWithAccount, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
