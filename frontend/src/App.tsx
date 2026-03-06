import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
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

          {/* Placeholder routes for Phase 1 completion */}
          <Route element={<Layout children={<div>Tasks Page</div>} />}>
            <Route path="/tasks" element={<div>Tasks Page</div>} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<Layout children={<div>Employees Page</div>} />}>
              <Route path="/employees" element={<div>Employees Page</div>} />
            </Route>
          </Route>

          <Route element={<Layout children={<div>Announcements Page</div>} />}>
            <Route path="/announcements" element={<div>Announcements Page</div>} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
