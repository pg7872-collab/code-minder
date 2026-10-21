import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

import { ProtectedRoute } from './components/common/ProtectedRoute.jsx';
import { AppLayout } from './components/layout/AppLayout.jsx';

// Pages
import { LandingPage } from './pages/LandingPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { QuestionsPage } from './pages/QuestionsPage.jsx';
import { ContestsPage } from './pages/ContestsPage.jsx';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage.jsx';
import { InterviewSetupPage } from './pages/InterviewSetupPage.jsx';
import { InterviewRoomPage } from './pages/InterviewRoomPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected App Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/questions" element={<QuestionsPage />} />
              <Route path="/contests" element={<ContestsPage />} />
              <Route path="/resume" element={<ResumeAnalyzerPage />} />
              <Route path="/interviews" element={<InterviewSetupPage />} />
              <Route path="/interviews/room/:id" element={<InterviewRoomPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
