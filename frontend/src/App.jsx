import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import WorkspacesPage from './pages/WorkspacesPage';
import ProjectsPage from './pages/ProjectsPage';
import KanbanBoard from './components/KanbanBoard';
import SettingsPage from './pages/SettingsPage';

const Layout = ({ children }) => (
  <div className="flex bg-slate-50 min-h-screen relative overflow-hidden">
    {/* Background decorative blob */}
    <div className="absolute top-[-20%] right-[-10%] w-[80rem] h-[80rem] bg-brand/5 rounded-full blur-[120px] -z-10 animate-pulse" />
    <div className="absolute bottom-[-20%] left-[10%] w-[60rem] h-[60rem] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

    <Sidebar />
    <main className="flex-1 ml-72 min-h-screen overflow-x-hidden relative">
      <div className="animate-in pb-20">
        {children}
      </div>
    </main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route path="/" element={
              <ProtectedRoute>
                <Layout><DashboardPage /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/workspaces" element={
              <ProtectedRoute>
                <Layout><WorkspacesPage /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/projects" element={
              <ProtectedRoute>
                <Layout><ProjectsPage /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout><SettingsPage /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/tasks" element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8 h-screen flex flex-col bg-white text-slate-900">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Mission Board</h2>
                        <p className="text-slate-500 font-medium italic mt-1 text-sm">"Strategy in motion."</p>
                      </div>
                    </div>
                    <KanbanBoard />
                  </div>
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
