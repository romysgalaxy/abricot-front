import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import SingleProject from './pages/SingleProject';
import Account from './pages/Account';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleSelectProject = () => {
    setCurrentPage('single-project');
  };

  const handleBackToProjects = () => {
    setCurrentPage('projects');
  };

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
