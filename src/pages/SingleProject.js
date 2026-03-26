import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProject, getTasks } from '../services/api';
import CreateProjectModal from '../components/CreateProjectModal';
import CreateTaskModal from '../components/CreateTaskModal';
import './SingleProject.css';

const STATUS_MAP = {
  'TODO': 'À faire',
  'IN_PROGRESS': 'En cours',
  'DONE': 'Terminée',
  'CANCELLED': 'Annulée',
};

function getInitials(user) {
  if (user.name) {
    return user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }
  return user.email.slice(0, 2).toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
}

function StatusBadge({ status }) {
  const classMap = {
    'TODO': 'sp-status--todo',
    'IN_PROGRESS': 'sp-status--in-progress',
    'DONE': 'sp-status--done',
    'CANCELLED': 'sp-status--todo',
  };
  return <span className={`sp-status ${classMap[status] || ''}`}>{STATUS_MAP[status] || status}</span>;
}

function TaskItem({ task }) {
  return (
    <div className="sp-task-item">
      <div className="sp-task-top">
        <div className="sp-task-info">
          <div className="sp-task-name-row">
            <h3 className="sp-task-name">{task.title}</h3>
            <StatusBadge status={task.status} />
          </div>
          {task.description && <p className="sp-task-desc">{task.description}</p>}
          {task.dueDate && (
            <div className="sp-task-meta">
              <span className="sp-task-meta-item">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1" stroke="#999" strokeWidth="1.5"/><path d="M2 6H14" stroke="#999" strokeWidth="1.5"/><path d="M5 1V4" stroke="#999" strokeWidth="1.5"/><path d="M11 1V4" stroke="#999" strokeWidth="1.5"/></svg>
                Échéance : {formatDate(task.dueDate)}
              </span>
            </div>
          )}
          {task.assignees && task.assignees.length > 0 && (
            <div className="sp-task-assignees">
              <span className="sp-task-assignee-label">Assigné à :</span>
              {task.assignees.map((assignee, idx) => {
                const user = assignee.user || assignee;
                return (
                  <span key={idx} className="sp-task-assignee">
                    <span className="sp-task-assignee-avatar">{getInitials(user)}</span>
                    <span className="sp-task-assignee-name">{user.name || user.email}</span>
                  </span>
                );
              })}
            </div>
          )}
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
        <span>Commentaires ({task.comments ? task.comments.length : 0})</span>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M4 6L8 10L12 6" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}

function SingleProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('liste');
  const [search, setSearch] = useState('');
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const loadProject = useCallback(async () => {
    try {
      const data = await getProject(id);
      setProject(data.project);
      const allContributors = [];
      if (data.project.owner) {
        allContributors.push({ ...data.project.owner, role: 'Propriétaire' });
      }
      if (data.project.members) {
        data.project.members.forEach((m) => {
          const user = m.user || m;
          if (!allContributors.find((existing) => existing.id === user.id)) {
            allContributors.push(user);
          }
        });
      }
      setContributors(allContributors);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const loadTasks = useCallback(async () => {
    try {
      const data = await getTasks(id);
      setTasks(data.tasks || []);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  useEffect(() => {
    loadProject();
    loadTasks();
  }, [loadProject, loadTasks]);

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="single-project">
      <div className="sp-top-header">
        <div className="sp-title-row">
          <button className="sp-back-btn" onClick={() => navigate('/projects')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13 4L7 10L13 16" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="sp-title">{project?.name || 'Chargement...'}</h1>
          <button className="sp-edit-btn" onClick={() => setShowEditModal(true)}>Modifier</button>
        </div>
        <div className="sp-actions">
          <button className="btn-create-task" onClick={() => setShowTaskModal(true)}>Créer une tâche</button>
          <button className="btn-ia">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L9.5 6L15 8L9.5 10L8 15L6.5 10L1 8L6.5 6L8 1Z" fill="currentColor"/>
            </svg>
            IA
          </button>
        </div>
      </div>
      <p className="sp-description">{project?.description || ''}</p>

      <div className="sp-contributors">
        <div className="sp-contributors-header">
          <span className="sp-contributors-label">Contributeurs</span>
          <span className="sp-contributors-count">{contributors.length} personnes</span>
        </div>
        <div className="sp-contributors-list">
          {contributors.map((c, idx) => (
            <span key={idx} className="sp-contributor">
              <span className={`sp-contributor-avatar${c.role === 'Propriétaire' ? ' sp-contributor-avatar--owner' : ''}`}>
                {getInitials(c)}
              </span>
              {c.role === 'Propriétaire' && <span className="sp-contributor-role">{c.role}</span>}
              <span className="sp-contributor-name">{c.name || c.email}</span>
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
          {filteredTasks.length === 0 && (
            <p className="sp-no-tasks">Aucune tâche pour le moment</p>
          )}
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </div>

      <CreateProjectModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onCreated={() => { loadProject(); loadTasks(); }}
        project={project}
      />

      <CreateTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onCreated={loadTasks}
        projectId={id}
        projectMembers={contributors}
      />
    </div>
  );
}

export default SingleProject;
