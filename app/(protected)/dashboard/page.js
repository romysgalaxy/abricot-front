'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAssignedTasks } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import CreateProjectModal from '../../../components/CreateProjectModal';
import styles from './Dashboard.module.css';

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
  return <span className={`${styles['status-badge']} ${styles[classMap[status]] || ''}`}>{label}</span>;
}

function TaskCardList({ task, onView }) {
  return (
    <div className={styles['task-card-list']}>
      <div className={styles['task-card-list-content']}>
        <div className={styles['task-card-list-info']}>
          <h3 className={styles['task-card-list-name']}>{task.title}</h3>
          <p className={styles['task-card-list-desc']}>{task.description || ''}</p>
          <div className={styles['task-card-list-meta']}>
            <span className={styles['meta-item']}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 4L1 13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V6C15 5.44772 14.5523 5 14 5H8L6.5 3H2C1.44772 3 1 3.44772 1 4Z" stroke="#999" strokeWidth="1.5"/></svg>
              {task.project?.name || ''}
            </span>
            {task.dueDate && (
              <>
                <span className={styles['meta-separator']}>|</span>
                <span className={styles['meta-item']}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1" stroke="#999" strokeWidth="1.5"/><path d="M2 6H14" stroke="#999" strokeWidth="1.5"/><path d="M5 1V4" stroke="#999" strokeWidth="1.5"/><path d="M11 1V4" stroke="#999" strokeWidth="1.5"/></svg>
                  {formatDate(task.dueDate)}
                </span>
              </>
            )}
            <span className={styles['meta-separator']}>|</span>
            <span className={styles['meta-item']}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 3C1 2.44772 1.44772 2 2 2H14C14.5523 2 15 2.44772 15 3V11C15 11.5523 14.5523 12 14 12H4L1 15V3Z" stroke="#999" strokeWidth="1.5"/></svg>
              {task.comments ? task.comments.length : 0}
            </span>
          </div>
        </div>
        <div className={styles['task-card-list-actions']}>
          <StatusBadge status={task.status} />
          <button className={styles['btn-voir']} onClick={() => onView(task)}>Voir</button>
        </div>
      </div>
    </div>
  );
}

function TaskCardKanban({ task, onView }) {
  return (
    <div className={styles['task-card-kanban']}>
      <div className={styles['task-card-kanban-header']}>
        <h3 className={styles['task-card-kanban-name']}>{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>
      <p className={styles['task-card-kanban-desc']}>{task.description || ''}</p>
      <div className={styles['task-card-kanban-meta']}>
        <span className={styles['meta-item']}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 4L1 13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V6C15 5.44772 14.5523 5 14 5H8L6.5 3H2C1.44772 3 1 3.44772 1 4Z" stroke="#999" strokeWidth="1.5"/></svg>
          {task.project?.name || ''}
        </span>
        {task.dueDate && (
          <>
            <span className={styles['meta-separator']}>|</span>
            <span className={styles['meta-item']}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1" stroke="#999" strokeWidth="1.5"/><path d="M2 6H14" stroke="#999" strokeWidth="1.5"/><path d="M5 1V4" stroke="#999" strokeWidth="1.5"/><path d="M11 1V4" stroke="#999" strokeWidth="1.5"/></svg>
              {formatDate(task.dueDate)}
            </span>
          </>
        )}
        <span className={styles['meta-separator']}>|</span>
        <span className={styles['meta-item']}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 3C1 2.44772 1.44772 2 2 2H14C14.5523 2 15 2.44772 15 3V11C15 11.5523 14.5523 12 14 12H4L1 15V3Z" stroke="#999" strokeWidth="1.5"/></svg>
          {task.comments ? task.comments.length : 0}
        </span>
      </div>
      <button className={styles['btn-voir']} onClick={() => onView(task)}>Voir</button>
    </div>
  );
}

export default function Dashboard() {
  const [view, setView] = useState('liste');
  const [search, setSearch] = useState('');
  const [tasks, setTasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

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

  const filteredTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const kanbanTasks = filteredTasks.filter((t) => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const kanbanColumns = {
    'À faire': kanbanTasks.filter((t) => t.status === 'TODO'),
    'En cours': kanbanTasks.filter((t) => t.status === 'IN_PROGRESS'),
    'Terminées': kanbanTasks.filter((t) => t.status === 'DONE'),
  };

  const handleViewTask = (task) => {
    if (task.project?.id) {
      router.push(`/projects/${task.project.id}`);
    }
  };

  return (
    <div className={styles['dashboard']}>
      <div className={styles['dashboard-header']}>
        <div>
          <h1 className={styles['dashboard-title']}>Tableau de bord</h1>
          <p className={styles['dashboard-subtitle']}>Bonjour {userName}, voici un aperçu de vos projets et tâches</p>
        </div>
        <button className={styles['btn-create']} onClick={() => setShowCreateModal(true)}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> Créer un projet</button>
      </div>

      <div className={styles['view-toggle']}>
        <button
          className={`${styles['view-toggle-btn']} ${view === 'liste' ? styles['view-toggle-btn--active'] : ''}`}
          onClick={() => setView('liste')}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4H14" stroke="currentColor" strokeWidth="1.5"/><path d="M2 8H14" stroke="currentColor" strokeWidth="1.5"/><path d="M2 12H14" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="3" width="2" height="2" rx="0.5" fill="currentColor"/><rect x="1" y="7" width="2" height="2" rx="0.5" fill="currentColor"/><rect x="1" y="11" width="2" height="2" rx="0.5" fill="currentColor"/></svg>
          Liste
        </button>
        <button
          className={`${styles['view-toggle-btn']} ${view === 'kanban' ? styles['view-toggle-btn--active'] : ''}`}
          onClick={() => setView('kanban')}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M2 6H14" stroke="currentColor" strokeWidth="1.5"/><path d="M5 1V4" stroke="currentColor" strokeWidth="1.5"/><path d="M11 1V4" stroke="currentColor" strokeWidth="1.5"/></svg>
          Kanban
        </button>
      </div>

      {view === 'liste' ? (
        <div className={styles['task-list-container']}>
          <div className={styles['task-list-header']}>
            <div>
              <h2 className={styles['task-list-title']}>Mes tâches assignées</h2>
              <p className={styles['task-list-subtitle']}>Par ordre de priorité</p>
            </div>
            <div className={styles['search-box']}>
              <input
                type="text"
                placeholder="Rechercher une tâche"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles['search-input']}
              />
              <svg className={styles['search-icon']} width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="#999" strokeWidth="1.5"/><path d="M11 11L14 14" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
          </div>
          <div className={styles['task-list']}>
            {filteredTasks.length === 0 && (
              <p className={styles['task-list-empty']}>Aucune tâche assignée</p>
            )}
            {filteredTasks.map((task) => (
              <TaskCardList key={task.id} task={task} onView={handleViewTask} />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p className={styles['kanban-month-label']}>
            {now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </p>
          <div className={styles['kanban-board']}>
          {Object.entries(kanbanColumns).map(([columnName, columnTasks]) => (
            <div key={columnName} className={styles['kanban-column']}>
              <div className={styles['kanban-column-header']}>
                <h2 className={styles['kanban-column-title']}>{columnName}</h2>
                <span className={styles['kanban-column-count']}>{columnTasks.length}</span>
              </div>
              <div className={styles['kanban-column-cards']}>
                {columnTasks.map((task) => (
                  <TaskCardKanban key={task.id} task={task} onView={handleViewTask} />
                ))}
              </div>
            </div>
          ))}
          </div>
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
