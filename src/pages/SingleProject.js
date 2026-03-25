import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SingleProject.css';

const contributors = [
  { initials: 'AD', name: 'Alice Dupont', role: 'Propriétaire' },
  { initials: 'BD', name: 'Bertrand Dupont', role: null },
  { initials: 'AD', name: 'Anne Dupont', role: null },
];

const projectTasks = [
  {
    id: 1,
    name: 'Authentification JWT',
    description: "Implémenter le système d'authentification avec tokens JWT",
    status: 'À faire',
    dueDate: '9 mars',
    assignees: [
      { initials: 'BD', name: 'Bertrand Dupont' },
      { initials: 'AD', name: 'Anne Dupont' },
    ],
    commentsCount: 1,
  },
  {
    id: 2,
    name: 'Authentification JWT',
    description: "Implémenter le système d'authentification avec tokens JWT",
    status: 'En cours',
    dueDate: '9 mars',
    assignees: [
      { initials: 'BD', name: 'Bertrand Dupont' },
      { initials: 'AD', name: 'Anne Dupont' },
    ],
    commentsCount: 1,
  },
  {
    id: 3,
    name: 'Authentification JWT',
    description: "Implémenter le système d'authentification avec tokens JWT",
    status: 'Terminée',
    dueDate: '9 mars',
    assignees: [
      { initials: 'BD', name: 'Bertrand Dupont' },
      { initials: 'AD', name: 'Anne Dupont' },
    ],
    commentsCount: 1,
  },
  {
    id: 4,
    name: 'Authentification JWT',
    description: "Implémenter le système d'authentification avec tokens JWT",
    status: 'À faire',
    dueDate: '9 mars',
    assignees: [
      { initials: 'BD', name: 'Bertrand Dupont' },
      { initials: 'AD', name: 'Anne Dupont' },
    ],
    commentsCount: 1,
  },
];

function StatusBadge({ status }) {
  const classMap = {
    'À faire': 'sp-status--todo',
    'En cours': 'sp-status--in-progress',
    'Terminée': 'sp-status--done',
  };
  return <span className={`sp-status ${classMap[status] || ''}`}>{status}</span>;
}

function TaskItem({ task }) {
  return (
    <div className="sp-task-item">
      <div className="sp-task-top">
        <div className="sp-task-info">
          <div className="sp-task-name-row">
            <h3 className="sp-task-name">{task.name}</h3>
            <StatusBadge status={task.status} />
          </div>
          <p className="sp-task-desc">{task.description}</p>
          <div className="sp-task-meta">
            <span className="sp-task-meta-item">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1" stroke="#999" strokeWidth="1.5"/><path d="M2 6H14" stroke="#999" strokeWidth="1.5"/><path d="M5 1V4" stroke="#999" strokeWidth="1.5"/><path d="M11 1V4" stroke="#999" strokeWidth="1.5"/></svg>
              Échéance : {task.dueDate}
            </span>
          </div>
          <div className="sp-task-assignees">
            <span className="sp-task-assignee-label">Assigné à :</span>
            {task.assignees.map((assignee, idx) => (
              <span key={idx} className="sp-task-assignee">
                <span className="sp-task-assignee-avatar">{assignee.initials}</span>
                <span className="sp-task-assignee-name">{assignee.name}</span>
              </span>
            ))}
          </div>
        </div>
        <button className="sp-task-menu">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="5" r="1.5" fill="#999"/>
            <circle cx="10" cy="10" r="1.5" fill="#999"/>
            <circle cx="10" cy="15" r="1.5" fill="#999"/>
          </svg>
        </button>
      </div>
      <div className="sp-task-comments">
        <span>Commentaires ({task.commentsCount})</span>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M4 6L8 10L12 6" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}

function SingleProject() {
  const [viewMode, setViewMode] = useState('liste');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  return (
    <div className="single-project">
      <div className="sp-top-header">
        <div className="sp-title-row">
          <button className="sp-back-btn" onClick={() => navigate('/projects')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13 4L7 10L13 16" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="sp-title">Nom du projet</h1>
          <button className="sp-edit-btn">Modifier</button>
        </div>
        <div className="sp-actions">
          <button className="btn-create-task">Créer une tâche</button>
          <button className="btn-ia">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L9.5 6L15 8L9.5 10L8 15L6.5 10L1 8L6.5 6L8 1Z" fill="currentColor"/>
            </svg>
            IA
          </button>
        </div>
      </div>
      <p className="sp-description">Développement de la nouvelle version de l'API REST avec authentification JWT</p>

      <div className="sp-contributors">
        <div className="sp-contributors-header">
          <span className="sp-contributors-label">Contributeurs</span>
          <span className="sp-contributors-count">{contributors.length} personnes</span>
        </div>
        <div className="sp-contributors-list">
          {contributors.map((c, idx) => (
            <span key={idx} className="sp-contributor">
              <span className={`sp-contributor-avatar${c.role ? ' sp-contributor-avatar--owner' : ''}`}>{c.initials}</span>
              {c.role && <span className="sp-contributor-role">{c.role}</span>}
              <span className="sp-contributor-name">{c.name}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="sp-tasks-section">
        <div className="sp-tasks-header">
          <div>
            <h2 className="sp-tasks-title">Tâches</h2>
            <p className="sp-tasks-subtitle">Par ordre de priorité</p>
          </div>
          <div className="sp-tasks-controls">
            <div className="sp-view-toggle">
              <button
                className={`sp-view-btn ${viewMode === 'liste' ? 'sp-view-btn--active' : ''}`}
                onClick={() => setViewMode('liste')}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4H14" stroke="currentColor" strokeWidth="1.5"/><path d="M2 8H14" stroke="currentColor" strokeWidth="1.5"/><path d="M2 12H14" stroke="currentColor" strokeWidth="1.5"/></svg>
                Liste
              </button>
              <button
                className={`sp-view-btn ${viewMode === 'calendrier' ? 'sp-view-btn--active' : ''}`}
                onClick={() => setViewMode('calendrier')}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M2 6H14" stroke="currentColor" strokeWidth="1.5"/><path d="M5 1V4" stroke="currentColor" strokeWidth="1.5"/><path d="M11 1V4" stroke="currentColor" strokeWidth="1.5"/></svg>
                Calendrier
              </button>
            </div>
            <div className="sp-filter-status">
              <span>Statut</span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="search-box">
              <input
                type="text"
                placeholder="Rechercher une tâche"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="#999" strokeWidth="1.5"/><path d="M11 11L14 14" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
          </div>
        </div>

        <div className="sp-tasks-list">
          {projectTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SingleProject;
