import React, { useState } from 'react';
import './Dashboard.css';

const tasks = [
  { id: 1, name: 'Nom de la tâche', description: 'Description de la tâche', project: 'Nom du projet', date: '9 mars', comments: 2, status: 'À faire' },
  { id: 2, name: 'Nom de la tâche', description: 'Description de la tâche', project: 'Nom du projet', date: '9 mars', comments: 2, status: 'En cours' },
  { id: 3, name: 'Nom de la tâche', description: 'Description de la tâche', project: 'Nom du projet', date: '9 mars', comments: 2, status: 'À faire' },
  { id: 4, name: 'Nom de la tâche', description: 'Description de la tâche', project: 'Nom du projet', date: '9 mars', comments: 2, status: 'À faire' },
  { id: 5, name: 'Nom de la tâche', description: 'Description de la tâche', project: 'Nom du projet', date: '9 mars', comments: 2, status: 'À faire' },
  { id: 6, name: 'Nom de la tâche', description: 'Description de la tâche', project: 'Nom du projet', date: '9 mars', comments: 2, status: 'À faire' },
];

const kanbanTasks = {
  'À faire': [
    { id: 1, name: 'Nom de la tâche', description: 'Description de la tâche', project: 'Nom du projet', date: '9 mars', comments: 2, status: 'À faire' },
    { id: 2, name: 'Nom de la tâche', description: 'Description de la tâche', project: 'Nom du projet', date: '9 mars', comments: 2, status: 'À faire' },
    { id: 3, name: 'Nom de la tâche', description: 'Description de la tâche', project: 'Nom du projet', date: '9 mars', comments: 2, status: 'À faire' },
    { id: 4, name: 'Nom de la tâche', description: 'Description de la tâche', project: 'Nom du projet', date: '9 mars', comments: 2, status: 'À faire' },
  ],
  'En cours': [
    { id: 5, name: 'Nom de la tâche', description: 'Description de la tâche', project: 'Nom du projet', date: '9 mars', comments: 2, status: 'En cours' },
    { id: 6, name: 'Nom de la tâche', description: 'Description de la tâche', project: 'Nom du projet', date: '9 mars', comments: 2, status: 'En cours' },
    { id: 7, name: 'Nom de la tâche', description: 'Description de la tâche', project: 'Nom du projet', date: '9 mars', comments: 2, status: 'En cours' },
    { id: 8, name: 'Nom de la tâche', description: 'Description de la tâche', project: 'Nom du projet', date: '9 mars', comments: 2, status: 'En cours' },
  ],
  'Terminées': [
    { id: 9, name: 'Nom de la tâche', description: 'Description de la tâche', project: 'Nom du projet', date: '9 mars', comments: 2, status: 'Terminée' },
    { id: 10, name: 'Nom de la tâche', description: 'Description de la tâche', project: 'Nom du projet', date: '9 mars', comments: 2, status: 'Terminée' },
    { id: 11, name: 'Nom de la tâche', description: 'Description de la tâche', project: 'Nom du projet', date: '9 mars', comments: 2, status: 'Terminée' },
    { id: 12, name: 'Nom de la tâche', description: 'Description de la tâche', project: 'Nom du projet', date: '9 mars', comments: 2, status: 'Terminée' },
  ],
};

function StatusBadge({ status }) {
  const classMap = {
    'À faire': 'status-badge--todo',
    'En cours': 'status-badge--in-progress',
    'Terminée': 'status-badge--done',
  };
  return <span className={`status-badge ${classMap[status] || ''}`}>{status}</span>;
}

function TaskCardList({ task }) {
  return (
    <div className="task-card-list">
      <div className="task-card-list-content">
        <div className="task-card-list-info">
          <h3 className="task-card-list-name">{task.name}</h3>
          <p className="task-card-list-desc">{task.description}</p>
          <div className="task-card-list-meta">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 4L1 13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V6C15 5.44772 14.5523 5 14 5H8L6.5 3H2C1.44772 3 1 3.44772 1 4Z" stroke="#999" strokeWidth="1.5"/></svg>
              {task.project}
            </span>
            <span className="meta-separator">|</span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1" stroke="#999" strokeWidth="1.5"/><path d="M2 6H14" stroke="#999" strokeWidth="1.5"/><path d="M5 1V4" stroke="#999" strokeWidth="1.5"/><path d="M11 1V4" stroke="#999" strokeWidth="1.5"/></svg>
              {task.date}
            </span>
            <span className="meta-separator">|</span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 3C1 2.44772 1.44772 2 2 2H14C14.5523 2 15 2.44772 15 3V11C15 11.5523 14.5523 12 14 12H4L1 15V3Z" stroke="#999" strokeWidth="1.5"/></svg>
              {task.comments}
            </span>
          </div>
        </div>
        <div className="task-card-list-actions">
          <StatusBadge status={task.status} />
          <button className="btn-voir">Voir</button>
        </div>
      </div>
    </div>
  );
}

function TaskCardKanban({ task }) {
  return (
    <div className="task-card-kanban">
      <div className="task-card-kanban-header">
        <h3 className="task-card-kanban-name">{task.name}</h3>
        <StatusBadge status={task.status} />
      </div>
      <p className="task-card-kanban-desc">{task.description}</p>
      <div className="task-card-kanban-meta">
        <span className="meta-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 4L1 13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V6C15 5.44772 14.5523 5 14 5H8L6.5 3H2C1.44772 3 1 3.44772 1 4Z" stroke="#999" strokeWidth="1.5"/></svg>
          {task.project}
        </span>
        <span className="meta-separator">|</span>
        <span className="meta-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1" stroke="#999" strokeWidth="1.5"/><path d="M2 6H14" stroke="#999" strokeWidth="1.5"/><path d="M5 1V4" stroke="#999" strokeWidth="1.5"/><path d="M11 1V4" stroke="#999" strokeWidth="1.5"/></svg>
          {task.date}
        </span>
        <span className="meta-separator">|</span>
        <span className="meta-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 3C1 2.44772 1.44772 2 2 2H14C14.5523 2 15 2.44772 15 3V11C15 11.5523 14.5523 12 14 12H4L1 15V3Z" stroke="#999" strokeWidth="1.5"/></svg>
          {task.comments}
        </span>
      </div>
      <button className="btn-voir">Voir</button>
    </div>
  );
}

function Dashboard() {
  const [view, setView] = useState('liste');
  const [search, setSearch] = useState('');

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Tableau de bord</h1>
          <p className="dashboard-subtitle">Bonjour Alice Dupont, voici un aperçu de vos projets et tâches</p>
        </div>
        <button className="btn-create">+ Créer un projet</button>
      </div>

      <div className="view-toggle">
        <button
          className={`view-toggle-btn ${view === 'liste' ? 'view-toggle-btn--active' : ''}`}
          onClick={() => setView('liste')}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4H14" stroke="currentColor" strokeWidth="1.5"/><path d="M2 8H14" stroke="currentColor" strokeWidth="1.5"/><path d="M2 12H14" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="3" width="2" height="2" rx="0.5" fill="currentColor"/><rect x="1" y="7" width="2" height="2" rx="0.5" fill="currentColor"/><rect x="1" y="11" width="2" height="2" rx="0.5" fill="currentColor"/></svg>
          Liste
        </button>
        <button
          className={`view-toggle-btn ${view === 'kanban' ? 'view-toggle-btn--active' : ''}`}
          onClick={() => setView('kanban')}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M2 6H14" stroke="currentColor" strokeWidth="1.5"/><path d="M5 1V4" stroke="currentColor" strokeWidth="1.5"/><path d="M11 1V4" stroke="currentColor" strokeWidth="1.5"/></svg>
          Kanban
        </button>
      </div>

      {view === 'liste' ? (
        <div className="task-list-container">
          <div className="task-list-header">
            <div>
              <h2 className="task-list-title">Mes tâches assignées</h2>
              <p className="task-list-subtitle">Par ordre de priorité</p>
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
          <div className="task-list">
            {tasks.map(task => (
              <TaskCardList key={task.id} task={task} />
            ))}
          </div>
        </div>
      ) : (
        <div className="kanban-board">
          {Object.entries(kanbanTasks).map(([columnName, columnTasks]) => (
            <div key={columnName} className="kanban-column">
              <div className="kanban-column-header">
                <h2 className="kanban-column-title">{columnName}</h2>
                <span className="kanban-column-count">{columnTasks.length}</span>
              </div>
              <div className="kanban-column-cards">
                {columnTasks.map(task => (
                  <TaskCardKanban key={task.id} task={task} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
