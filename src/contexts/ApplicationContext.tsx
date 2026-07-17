import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { InternshipApplication } from '../types';
import { applicationService } from '../services/applicationService';

interface ApplicationContextValue {
  applications: InternshipApplication[];
  loading: boolean;
  error: string | null;
  currentApplication: InternshipApplication | null;
  currentLoading: boolean;
  refresh: () => Promise<void>;
  loadById: (id: string) => Promise<void>;
  clearCurrent: () => void;
}

const ApplicationContext = createContext<ApplicationContextValue | undefined>(undefined);

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentApplication, setCurrentApplication] = useState<InternshipApplication | null>(null);
  const [currentLoading, setCurrentLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await applicationService.list();
      setApplications(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadById = useCallback(async (id: string) => {
    setCurrentLoading(true);
    try {
      const app = await applicationService.getById(id);
      setCurrentApplication(app ?? null);
    } finally {
      setCurrentLoading(false);
    }
  }, []);

  const clearCurrent = useCallback(() => setCurrentApplication(null), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo<ApplicationContextValue>(
    () => ({
      applications,
      loading,
      error,
      currentApplication,
      currentLoading,
      refresh,
      loadById,
      clearCurrent,
    }),
    [applications, loading, error, currentApplication, currentLoading, refresh, loadById, clearCurrent],
  );

  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
}

export function useApplications(): ApplicationContextValue {
  const ctx = useContext(ApplicationContext);
  if (!ctx) throw new Error('useApplications must be used within ApplicationProvider');
  return ctx;
}
