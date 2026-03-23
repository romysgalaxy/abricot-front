import React from 'react';
import './Projects.css';

const projects = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  name: 'Nom du projet',
  description: "Développement de la nouvelle version de l'API REST avec authentification JWT",
  progress: 0,
  totalTasks: 2,
  completedTasks: 0,
  team: [
    { initials: 'AD', role: 'Propriétaire' },
    { initials: 'BD', role: null },
    { initials: 'CV', role: null },
  ],
}));

function ProjectCard({ project, onSelect }) {
  const progressPercent = project.totalTasks > 0
    ? Math.round((project.completedTasks / project.totalTasks) * 100)
    : 0;

  return (
    <div className="project-card" onClick={() => onSelect(project.id)}>
      <h3 className="project-card-name">{project.name}</h3>
      <p className="project-card-desc">{project.description}</p>

      <div className="project-card-progress">
        <div className="progress-header">
          <span className="progress-label">Progression</span>
          <span className="progress-percent">{progressPercent}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <span className="progress-detail">{project.completedTasks}/{project.totalTasks} tâches terminées</span>
      </div>

      <div className="project-card-team">
        <div className="team-header">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6" cy="5" r="2.5" stroke="#999" strokeWidth="1.2"/>
            <path d="M1 14C1 11.2386 3.23858 9 6 9" stroke="#999" strokeWidth="1.2"/>
            <circle cx="11" cy="5" r="2.5" stroke="#999" strokeWidth="1.2"/>
            <path d="M11 9C13.7614 9 16 11.2386 16 14" stroke="#999" strokeWidth="1.2"/>
          </svg>
          <span className="team-count">Équipe ({project.team.length})</span>
        </div>
        <div className="team-members">
          {project.team.filter(m => m.role).map((member, idx) => (
            <React.Fragment key={idx}>
              <span className="team-avatar team-avatar--owner">{member.initials}</span>
              <span className="team-role">{member.role}</span>
            </React.Fragment>
          ))}
          <div className="team-others">
            {project.team.filter(m => !m.role).map((member, idx) => (
              <span key={idx} className="team-avatar">{member.initials}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Projects({ onSelectProject }) {
  return (
    <div className="projects">
      <div className="projects-header">
        <div>
          <h1 className="projects-title">Mes projets</h1>
          <p className="projects-subtitle">Gérez vos projets</p>
        </div>
        <button className="btn-create">+ Créer un projet</button>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={onSelectProject}
          />
        ))}
      </div>
    </div>
  );
}

export default Projects;
