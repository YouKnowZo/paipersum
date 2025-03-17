import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Corrected path
import ProtectedRoute from './components/ProtectedRoute'; // Corrected path

// Layouts
import MainLayout from './layouts/MainLayout'; // Corrected path

// Pages
import HomePage from './pages/HomePage'; // Corrected path
import DashboardPage from './pages/Dashboard'; // Corrected path
import LoginPage from './pages/LoginPage'; // Corrected path
import SignUpPage from './pages/SignUpPage'; // Corrected path
import DocumentViewPage from './pages/DocumentViewPage'; // Corrected path
import UploadPage from './pages/UploadPage'; // Corrected path
import SettingsPage from './pages/SettingsPage'; // Corrected path
import NotFoundPage from './pages/NotFoundPage'; // Corrected path

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
          <Route path="/signup" element={<MainLayout><SignUpPage /></MainLayout>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout><DashboardPage /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/document/:id"
            element={
              <ProtectedRoute>
                <MainLayout><DocumentViewPage /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <MainLayout><UploadPage /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <MainLayout><SettingsPage /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
