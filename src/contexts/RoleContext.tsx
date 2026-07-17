import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Role, User } from '../types';
import { mockAdminUser, mockApplicantUser, mockChairmanUser, mockSupervisorUser } from '../mock-data/applications';

interface RoleContextValue {
  user: User;
  role: Role;
  switchRole: (role: Role) => void;
}

const roleUsers: Record<Role, User> = {
  applicant: mockApplicantUser,
  supervisor: mockSupervisorUser,
  chairman: mockChairmanUser,
  admin: mockAdminUser,
};

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('applicant');

  const switchRole = useCallback((next: Role) => setRole(next), []);
  const user = roleUsers[role];

  const value = useMemo<RoleContextValue>(() => ({ user, role, switchRole }), [user, role, switchRole]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
