import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import SingleProject from './pages/SingleProject';
import Account from './pages/Account';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleSignup = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleSelectProject = () => {
    setCurrentPage('single-project');
  };

  const handleBackToProjects = () => {
    setCurrentPage('projects');
  };

  if (!isLoggedIn && currentPage === 'signup') {
    return <Signup onSignup={handleSignup} onNavigate={handleNavigate} />;
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
  }

  return (
    <div className="App">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="main-content">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'projects' && <Projects onSelectProject={handleSelectProject} />}
        {currentPage === 'single-project' && <SingleProject onBack={handleBackToProjects} />}
        {currentPage === 'account' && <Account />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
