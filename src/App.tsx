import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RoleProvider } from './contexts/RoleContext';
import { ApplicationProvider } from './contexts/ApplicationContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';

import { LandingPage } from './pages/landing/LandingPage';
import { ApplicantDashboard } from './pages/applicant/ApplicantDashboard';
import { ApplicationWizard } from './pages/applicant/ApplicationWizard';
import { ApplicantWorkflow } from './pages/applicant/ApplicantWorkflow';
import { ApplicantActivities } from './pages/applicant/ApplicantActivities';
import { ApplicantAttendance } from './pages/applicant/ApplicantAttendance';
import { ApplicantDocuments } from './pages/applicant/ApplicantDocuments';
import { SupervisorDashboard } from './pages/supervisor/SupervisorDashboard';
import { SupervisorApplications } from './pages/supervisor/SupervisorApplications';
import { SupervisorReview } from './pages/supervisor/SupervisorReview';
import { ChairmanDashboard } from './pages/chairman/ChairmanDashboard';
import { ChairmanDocuments } from './pages/chairman/ChairmanDocuments';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminApplications } from './pages/admin/AdminApplications';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <RoleProvider>
      <ApplicationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* Applicant */}
            <Route element={<ProtectedRoute allow={['applicant']} />}>
              <Route element={<DashboardLayout role="applicant" />}>
                <Route path="/applicant" element={<ApplicantDashboard />} />
                <Route path="/applicant/application" element={<ApplicationWizard />} />
                <Route path="/applicant/workflow" element={<ApplicantWorkflow />} />
                <Route path="/applicant/activities" element={<ApplicantActivities />} />
                <Route path="/applicant/attendance" element={<ApplicantAttendance />} />
                <Route path="/applicant/documents" element={<ApplicantDocuments />} />
              </Route>
            </Route>

            {/* Supervisor */}
            <Route element={<ProtectedRoute allow={['supervisor']} />}>
              <Route element={<DashboardLayout role="supervisor" />}>
                <Route path="/supervisor" element={<SupervisorDashboard />} />
                <Route path="/supervisor/applications" element={<SupervisorApplications />} />
                <Route path="/supervisor/review/:id" element={<SupervisorReview />} />
              </Route>
            </Route>

            {/* Chairman */}
            <Route element={<ProtectedRoute allow={['chairman']} />}>
              <Route element={<DashboardLayout role="chairman" />}>
                <Route path="/chairman" element={<ChairmanDashboard />} />
                <Route path="/chairman/documents" element={<ChairmanDocuments />} />
              </Route>
            </Route>

            {/* Admin */}
            <Route element={<ProtectedRoute allow={['admin']} />}>
              <Route element={<DashboardLayout role="admin" />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/applications" element={<AdminApplications />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ApplicationProvider>
    </RoleProvider>
  );
}
