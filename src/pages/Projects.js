import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../services/api';
import CreateProjectModal from '../components/CreateProjectModal';
import './Projects.css';

function getInitials(user) {
  if (user.name) {
    return user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }
  return user.email.slice(0, 2).toUpperCase();
}

function ProjectCard({ project, onSelect }) {
  const totalTasks = project._count?.tasks || 0;
  const completedTasks = project.tasks
    ? project.tasks.filter((t) => t.status === 'DONE').length
    : 0;
  const progressPercent = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const team = [];
  if (project.owner) {
    team.push({ ...project.owner, role: 'Propriétaire' });
  }
  if (project.members) {
    project.members.forEach((m) => {
      const user = m.user || m;
      if (!team.find((t) => t.id === user.id)) {
        team.push(user);
      }
    });
  }

  return (
    <div className="project-card" onClick={() => onSelect(project.id)}>
      <h3 className="project-card-name">{project.name}</h3>
      <p className="project-card-desc">{project.description || 'Aucune description'}</p>

      <div className="project-card-progress">
        <div className="progress-header">
          <span className="progress-label">Progression</span>
          <span className="progress-percent">{progressPercent}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <span className="progress-detail">{completedTasks}/{totalTasks} tâches terminées</span>
      </div>

      <div className="project-card-team">
        <div className="team-header">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6" cy="5" r="2.5" stroke="#999" strokeWidth="1.2"/>
            <path d="M1 14C1 11.2386 3.23858 9 6 9" stroke="#999" strokeWidth="1.2"/>
            <circle cx="11" cy="5" r="2.5" stroke="#999" strokeWidth="1.2"/>
            <path d="M11 9C13.7614 9 16 11.2386 16 14" stroke="#999" strokeWidth="1.2"/>
          </svg>
          <span className="team-count">Équipe ({team.length})</span>
        </div>
        <div className="team-members">
          {team.filter((m) => m.role).map((member, idx) => (
            <React.Fragment key={idx}>
              <span className="team-avatar team-avatar--owner">{getInitials(member)}</span>
              <span className="team-role">{member.role}</span>
            </React.Fragment>
          ))}
          <div className="team-others">
            {team.filter((m) => !m.role).map((member, idx) => (
              <span key={idx} className="team-avatar">{getInitials(member)}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadProjects = () => {
    getProjects()
      .then((data) => setProjects(data.projects || []))
      .catch((err) => console.error('Projects error:', err));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSelectProject = (id) => {
    navigate(`/projects/${id}`);
  };

  return (
    <div className="projects">
      <div className="projects-header">
        <div>
          <h1 className="projects-title">Mes projets</h1>
          <p className="projects-subtitle">Gérez vos projets</p>
        </div>
        <button className="btn-create" onClick={() => setShowCreateModal(true)}>+ Créer un projet</button>
      </div>

      <div className="projects-grid">
        {projects.length === 0 && (
          <p className="projects-empty">Aucun projet pour le moment</p>
        )}
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={handleSelectProject}
          />
        ))}
      </div>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={loadProjects}
      />
    </div>
  );
}

export default Projects;
