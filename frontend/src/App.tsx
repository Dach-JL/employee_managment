import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import DailyReportPage from './pages/DailyReportPage';
import AnonymousReportPage from './pages/AnonymousReportPage';
import ChatPage from './pages/ChatPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PrivateMessagingPage from './pages/PrivateMessagingPage';
import TasksPage from './pages/TasksPage';
import TaskDetailPage from './pages/TaskDetailPage';
import ManageUsersPage from './pages/ManageUsersPage';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ui/ToastProvider';

// Helper component for dynamic root routing based on role
const RoleBasedDashboard = () => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'admin' ? <Dashboard /> : <EmployeeDashboard />;
};

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<RoleBasedDashboard />} />
                <Route path="/admin-dashboard" element={<Dashboard />} />
                <Route path="/staff-dashboard" element={<EmployeeDashboard />} />

                <Route path="/reports/daily" element={<DailyReportPage />} />
                <Route path="/reports/anonymous" element={<AnonymousReportPage />} />

                <Route path="/chat" element={<ChatPage />} />
                <Route path="/announcements" element={<AnnouncementsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/messages" element={<PrivateMessagingPage />} />

                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/tasks/:id" element={<TaskDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Admin-only routes within layout */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/employees" element={<ManageUsersPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
