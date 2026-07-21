import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/RoleContext';
import { ApplicationProvider } from './contexts/ApplicationContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';

import { LoginPage } from './pages/auth/LoginPage';
import { ApplicationsDashboard } from './pages/applications/ApplicationsDashboard';
import { ApplicationDetails } from './pages/applications/ApplicationDetails';
import { ApplicationWizard } from './pages/applicant/ApplicationWizard';
import { ApplicantActivities } from './pages/applicant/ApplicantActivities';
import { ApplicantAttendance } from './pages/applicant/ApplicantAttendance';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <ApplicationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Unified routes — shared by all roles. Role controls permissions,
                not navigation. DashboardLayout derives role from auth context. */}
            <Route element={<ProtectedRoute allow={['applicant', 'supervisor', 'chairman', 'admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/applications" element={<ApplicationsDashboard />} />
                <Route path="/applications/new" element={<ApplicationWizard />} />
                <Route path="/applications/my" element={<Navigate to="/applications" replace />} />
                <Route path="/applications/:id" element={<ApplicationDetails />} />
                <Route path="/applications/:id/workflow" element={<ApplicationDetails />} />
                <Route path="/applications/:id/security-form" element={<ApplicationDetails />} />
                <Route path="/applications/:id/documents" element={<ApplicationDetails />} />
                <Route path="/applications/:id/activities" element={<ApplicantActivities />} />
                <Route path="/applications/:id/attendance" element={<ApplicantAttendance />} />
                <Route path="/applications/:id/certificates" element={<ApplicationDetails />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
              </Route>
            </Route>

            {/* Legacy role routes redirect to unified applications page */}
            <Route path="/applicant" element={<Navigate to="/applications" replace />} />
            <Route path="/applicant/*" element={<Navigate to="/applications" replace />} />
            <Route path="/supervisor" element={<Navigate to="/applications" replace />} />
            <Route path="/supervisor/*" element={<Navigate to="/applications" replace />} />
            <Route path="/chairman" element={<Navigate to="/applications" replace />} />
            <Route path="/chairman/*" element={<Navigate to="/applications" replace />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/applications" element={<Navigate to="/applications" replace />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ApplicationProvider>
    </AuthProvider>
  );
}
