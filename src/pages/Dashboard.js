import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssignedTasks } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CreateProjectModal from '../components/CreateProjectModal';
import './Dashboard.css';

const STATUS_MAP = {
  'TODO': 'À faire',
  'IN_PROGRESS': 'En cours',
  'DONE': 'Terminée',
  'CANCELLED': 'Annulée',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
}

function StatusBadge({ status }) {
  const classMap = {
    'TODO': 'status-badge--todo',
    'IN_PROGRESS': 'status-badge--in-progress',
    'DONE': 'status-badge--done',
    'CANCELLED': 'status-badge--todo',
  };
  const label = STATUS_MAP[status] || status;
  return <span className={`status-badge ${classMap[status] || ''}`}>{label}</span>;
}

function TaskCardList({ task, onView }) {
  return (
    <div className="task-card-list">
      <div className="task-card-list-content">
        <div className="task-card-list-info">
          <h3 className="task-card-list-name">{task.title}</h3>
          <p className="task-card-list-desc">{task.description || ''}</p>
          <div className="task-card-list-meta">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 4L1 13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V6C15 5.44772 14.5523 5 14 5H8L6.5 3H2C1.44772 3 1 3.44772 1 4Z" stroke="#999" strokeWidth="1.5"/></svg>
              {task.project?.name || ''}
            </span>
            {task.dueDate && (
              <>
                <span className="meta-separator">|</span>
                <span className="meta-item">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1" stroke="#999" strokeWidth="1.5"/><path d="M2 6H14" stroke="#999" strokeWidth="1.5"/><path d="M5 1V4" stroke="#999" strokeWidth="1.5"/><path d="M11 1V4" stroke="#999" strokeWidth="1.5"/></svg>
                  {formatDate(task.dueDate)}
                </span>
              </>
            )}
            <span className="meta-separator">|</span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 3C1 2.44772 1.44772 2 2 2H14C14.5523 2 15 2.44772 15 3V11C15 11.5523 14.5523 12 14 12H4L1 15V3Z" stroke="#999" strokeWidth="1.5"/></svg>
              {task.comments ? task.comments.length : 0}
            </span>
          </div>
        </div>
        <div className="task-card-list-actions">
          <StatusBadge status={task.status} />
          <button className="btn-voir" onClick={() => onView(task)}>Voir</button>
        </div>
      </div>
    </div>
  );
}

function TaskCardKanban({ task, onView }) {
  return (
    <div className="task-card-kanban">
      <div className="task-card-kanban-header">
        <h3 className="task-card-kanban-name">{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>
      <p className="task-card-kanban-desc">{task.description || ''}</p>
      <div className="task-card-kanban-meta">
        <span className="meta-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 4L1 13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V6C15 5.44772 14.5523 5 14 5H8L6.5 3H2C1.44772 3 1 3.44772 1 4Z" stroke="#999" strokeWidth="1.5"/></svg>
          {task.project?.name || ''}
        </span>
        {task.dueDate && (
          <>
            <span className="meta-separator">|</span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1" stroke="#999" strokeWidth="1.5"/><path d="M2 6H14" stroke="#999" strokeWidth="1.5"/><path d="M5 1V4" stroke="#999" strokeWidth="1.5"/><path d="M11 1V4" stroke="#999" strokeWidth="1.5"/></svg>
              {formatDate(task.dueDate)}
            </span>
          </>
        )}
        <span className="meta-separator">|</span>
        <span className="meta-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 3C1 2.44772 1.44772 2 2 2H14C14.5523 2 15 2.44772 15 3V11C15 11.5523 14.5523 12 14 12H4L1 15V3Z" stroke="#999" strokeWidth="1.5"/></svg>
          {task.comments ? task.comments.length : 0}
        </span>
      </div>
      <button className="btn-voir" onClick={() => onView(task)}>Voir</button>
    </div>
  );
}

function Dashboard() {
  const [view, setView] = useState('liste');
  const [search, setSearch] = useState('');
  const [tasks, setTasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadTasks = () => {
    getAssignedTasks()
      .then((data) => {
        setTasks(data.tasks || []);
      })
      .catch((err) => console.error('Dashboard error:', err));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const userName = user?.name || user?.email || '';

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const kanbanColumns = {
    'À faire': filteredTasks.filter((t) => t.status === 'TODO'),
    'En cours': filteredTasks.filter((t) => t.status === 'IN_PROGRESS'),
    'Terminées': filteredTasks.filter((t) => t.status === 'DONE'),
  };

  const handleViewTask = (task) => {
    if (task.project?.id) {
      navigate(`/projects/${task.project.id}`);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Tableau de bord</h1>
          <p className="dashboard-subtitle">Bonjour {userName}, voici un aperçu de vos projets et tâches</p>
        </div>
        <button className="btn-create" onClick={() => setShowCreateModal(true)}>+ Créer un projet</button>
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
            {filteredTasks.length === 0 && (
              <p className="task-list-empty">Aucune tâche assignée</p>
            )}
            {filteredTasks.map((task) => (
              <TaskCardList key={task.id} task={task} onView={handleViewTask} />
            ))}
          </div>
        </div>
      ) : (
        <div className="kanban-board">
          {Object.entries(kanbanColumns).map(([columnName, columnTasks]) => (
            <div key={columnName} className="kanban-column">
              <div className="kanban-column-header">
                <h2 className="kanban-column-title">{columnName}</h2>
                <span className="kanban-column-count">{columnTasks.length}</span>
              </div>
              <div className="kanban-column-cards">
                {columnTasks.map((task) => (
                  <TaskCardKanban key={task.id} task={task} onView={handleViewTask} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={loadTasks}
      />
    </div>
  );
}

export default Dashboard;
