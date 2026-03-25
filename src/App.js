import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import SingleProject from './pages/SingleProject';
import Account from './pages/Account';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

function Layout({ children }) {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return null;
  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return null;
  return !token ? children : <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
      <Route path="/projects" element={<PrivateRoute><Layout><Projects /></Layout></PrivateRoute>} />
      <Route path="/projects/:id" element={<PrivateRoute><Layout><SingleProject /></Layout></PrivateRoute>} />
      <Route path="/account" element={<PrivateRoute><Layout><Account /></Layout></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
