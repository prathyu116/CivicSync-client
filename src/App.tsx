import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AlertTriangle } from 'lucide-react';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReportIssuePage from './pages/ReportIssuePage';
import MyIssuesPage from './pages/MyIssuesPage';
import IssueDetailsPage from './pages/IssueDetailsPage';
import MapPage from './pages/MapPage';
import EditIssuePage from './pages/EditIssuePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/issue/:id" element={<IssueDetailsPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/report" 
                element={
                  <ProtectedRoute>
                    <ReportIssuePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-issues" 
                element={
                  <ProtectedRoute>
                    <MyIssuesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/issue/:id/edit" 
                element={
                  <ProtectedRoute>
                    <EditIssuePage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="bg-teal-800 text-white py-6">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center mb-4 md:mb-0">
                  <AlertTriangle className="h-6 w-6 text-amber-300 mr-2" />
                  <span className="font-bold text-lg">CivicSync</span>
                </div>
                <div className="text-sm text-teal-100">
                  © {new Date().getFullYear()} CivicSync. All rights reserved. Built by Prathyu Prasad.
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;