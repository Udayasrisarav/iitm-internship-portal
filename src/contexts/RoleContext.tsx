import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Role, User } from '../types';
import { supabase } from '../lib/supabaseClient';

interface AuthContextValue {
  user: User | null;
  role: Role;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function deriveRole(email: string | undefined | null): Role {
  if (!email) return 'applicant';
  const local = email.split('@')[0].toLowerCase();
  if (local.includes('admin')) return 'admin';
  if (local.includes('chairman')) return 'chairman';
  if (local.includes('supervisor') || local.includes('prof')) return 'supervisor';
  return 'applicant';
}

function mapSessionUser(sessionUser: {
  id: string;
  email?: string;
  user_metadata?: { full_name?: string; name?: string; avatar_url?: string; picture?: string };
}): User {
  const email = sessionUser.email ?? '';
  const name =
    sessionUser.user_metadata?.full_name ||
    sessionUser.user_metadata?.name ||
    (email ? email.split('@')[0] : 'User');
  const avatarUrl = sessionUser.user_metadata?.avatar_url || sessionUser.user_metadata?.picture;
  return {
    id: sessionUser.id,
    name,
    email,
    role: deriveRole(email),
    avatarUrl,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session?.user) setUser(mapSessionUser(data.session.user));
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(mapSessionUser(session.user));
      else setUser(null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/applications` },
    });
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const role = user?.role ?? 'applicant';

  const value = useMemo<AuthContextValue>(
    () => ({ user, role, loading, signInWithGoogle, signOut }),
    [user, role, loading, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Back-compat alias for components that still call useRole().
export const useRole = useAuth;
