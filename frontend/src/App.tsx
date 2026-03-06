import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import DailyReportPage from './pages/DailyReportPage';
import AnonymousReportPage from './pages/AnonymousReportPage';
import ChatPage from './pages/ChatPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PrivateMessagingPage from './pages/PrivateMessagingPage';
import TasksPage from './pages/TasksPage';
import ManageUsersPage from './pages/ManageUsersPage';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout children={<Dashboard />} />}>
            <Route path="/" element={<Dashboard />} />
          </Route>

          <Route element={<Layout children={<DailyReportPage />} />}>
            <Route path="/reports/daily" element={<DailyReportPage />} />
          </Route>

          <Route element={<Layout children={<AnonymousReportPage />} />}>
            <Route path="/reports/anonymous" element={<AnonymousReportPage />} />
          </Route>

          <Route element={<Layout children={<ChatPage />} />}>
            <Route path="/chat" element={<ChatPage />} />
          </Route>

          <Route element={<Layout children={<AnnouncementsPage />} />}>
            <Route path="/announcements" element={<AnnouncementsPage />} />
          </Route>

          <Route element={<Layout children={<AnalyticsPage />} />}>
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>

          <Route element={<Layout children={<PrivateMessagingPage />} />}>
            <Route path="/messages" element={<PrivateMessagingPage />} />
          </Route>

          <Route element={<Layout children={<TasksPage />} />}>
            <Route path="/tasks" element={<TasksPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<Layout children={<ManageUsersPage />} />}>
              <Route path="/employees" element={<ManageUsersPage />} />
            </Route>
          </Route>

          <Route element={<Layout children={<ProfilePage />} />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
