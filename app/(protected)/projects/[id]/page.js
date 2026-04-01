'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getProject, getTasks, deleteProject, deleteTask, createComment } from '../../../../services/api';
import { useAuth } from '../../../../context/AuthContext';
import CreateProjectModal from '../../../../components/CreateProjectModal';
import CreateTaskModal from '../../../../components/CreateTaskModal';
import styles from './SingleProject.module.css';

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
  return <span className={`${styles['sp-status']} ${styles[classMap[status]] || ''}`}>{STATUS_MAP[status] || status}</span>;
}

function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function TaskItem({ task, projectId, userRole, onEdit, onDelete, onCommentAdded }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const menuRef = React.useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const comments = task.comments || [];

  return (
    <div className={styles['sp-task-item']}>
      <div className={styles['sp-task-top']}>
        <div className={styles['sp-task-info']}>
          <div className={styles['sp-task-name-row']}>
            <h3 className={styles['sp-task-name']}>{task.title}</h3>
            <StatusBadge status={task.status} />
          </div>
          {task.description && <p className={styles['sp-task-desc']}>{task.description}</p>}
          {task.dueDate && (
            <div className={styles['sp-task-meta']}>
              <span className={styles['sp-task-meta-item']}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1" stroke="#999" strokeWidth="1.5"/><path d="M2 6H14" stroke="#999" strokeWidth="1.5"/><path d="M5 1V4" stroke="#999" strokeWidth="1.5"/><path d="M11 1V4" stroke="#999" strokeWidth="1.5"/></svg>
                Échéance : {formatDate(task.dueDate)}
              </span>
            </div>
          )}
          {task.assignees && task.assignees.length > 0 && (
            <div className={styles['sp-task-assignees']}>
              <span className={styles['sp-task-assignee-label']}>Assigné à :</span>
              {task.assignees.map((assignee, idx) => {
                const user = assignee.user || assignee;
                return (
                  <span key={idx} className={styles['sp-task-assignee']}>
                    <span className={styles['sp-task-assignee-avatar']}>{getInitials(user)}</span>
                    <span className={styles['sp-task-assignee-name']}>{user.name || user.email}</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>
        <div className={styles['sp-task-menu-wrapper']} ref={menuRef}>
          <button className={styles['sp-task-menu']} onClick={() => setMenuOpen((prev) => !prev)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="5" r="1.5" fill="#999"/>
              <circle cx="10" cy="10" r="1.5" fill="#999"/>
              <circle cx="10" cy="15" r="1.5" fill="#999"/>
            </svg>
          </button>
          {menuOpen && (
            <div className={styles['sp-task-dropdown']}>
              <button
                className={styles['sp-task-dropdown-item']}
                onClick={() => { setMenuOpen(false); setShowCommentForm(true); setCommentsOpen(true); }}
              >
                Commenter
              </button>
              <button
                className={styles['sp-task-dropdown-item']}
                onClick={() => { setMenuOpen(false); onEdit(task); }}
              >
                Modifier
              </button>
              <button
                className={`${styles['sp-task-dropdown-item']} ${styles['sp-task-dropdown-item--danger']}`}
                onClick={() => { setMenuOpen(false); setShowDeleteConfirm(true); }}
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        className={`${styles['sp-task-comments']}${commentsOpen ? ` ${styles['sp-task-comments--open']}` : ''}`}
        onClick={() => setCommentsOpen((prev) => !prev)}
      >
        <span>Commentaires ({comments.length})</span>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={commentsOpen ? styles['sp-comments-arrow--open'] : ''}>
          <path d="M4 6L8 10L12 6" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      {commentsOpen && (
        <div className={styles['sp-comments-list']}>
          {comments.length === 0 && !showCommentForm ? (
            <p className={styles['sp-comments-empty']}>Aucun commentaire</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className={styles['sp-comment']}>
                <div className={styles['sp-comment-header']}>
                  <span className={styles['sp-comment-avatar']}>{getInitials(comment.author)}</span>
                  <span className={styles['sp-comment-author']}>{comment.author.name || comment.author.email}</span>
                  <span className={styles['sp-comment-date']}>{formatDateTime(comment.createdAt)}</span>
                </div>
                <p className={styles['sp-comment-content']}>{comment.content}</p>
              </div>
            ))
          )}
          {showCommentForm && (
            <form
              className={styles['sp-comment-form']}
              onSubmit={async (e) => {
                e.preventDefault();
                if (!commentContent.trim()) return;
                setSubmittingComment(true);
                try {
                  await createComment(projectId, task.id, commentContent.trim());
                  setCommentContent('');
                  setShowCommentForm(false);
                  if (onCommentAdded) onCommentAdded();
                } catch (err) {
                  console.error(err);
                } finally {
                  setSubmittingComment(false);
                }
              }}
            >
              <textarea
                className={styles['sp-comment-input']}
                placeholder="Écrire un commentaire..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                rows={3}
                maxLength={2000}
                autoFocus
              />
              <div className={styles['sp-comment-form-actions']}>
                <button
                  type="button"
                  className={styles['sp-comment-cancel']}
                  onClick={() => { setShowCommentForm(false); setCommentContent(''); }}
                  disabled={submittingComment}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={styles['sp-comment-submit']}
                  disabled={submittingComment || !commentContent.trim()}
                >
                  {submittingComment ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {showDeleteConfirm && (
        <div className={styles['delete-overlay']} onClick={() => setShowDeleteConfirm(false)}>
          <div className={styles['delete-dialog']} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles['delete-dialog-title']}>Supprimer la tâche</h3>
            <p className={styles['delete-dialog-text']}>
              Êtes-vous sûr de vouloir supprimer <strong>{task.title}</strong> ? Cette action est irréversible.
            </p>
            <div className={styles['delete-dialog-actions']}>
              <button className={styles['delete-dialog-cancel']} onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>
                Annuler
              </button>
              <button
                className={styles['delete-dialog-confirm']}
                disabled={deleting}
                onClick={async () => {
                  setDeleting(true);
                  try {
                    await onDelete(task.id);
                  } catch {
                    setDeleting(false);
                    setShowDeleteConfirm(false);
                  }
                }}
              >
                {deleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SingleProject() {
  const { id } = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [viewMode, setViewMode] = useState('liste');
  const [search, setSearch] = useState('');
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [taskAssignableMembers, setTaskAssignableMembers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const statusFilterRef = React.useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (statusFilterRef.current && !statusFilterRef.current.contains(e.target)) {
        setStatusDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      const membersOnly = (data.project.members || []).map((m) => m.user || m);
      setTaskAssignableMembers(membersOnly);
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

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isOwner = project?.owner?.id === currentUser?.id;
  const userRole = project?.userRole || null;
  const isAdmin = userRole === 'ADMIN';

  const handleDeleteProject = async () => {
    setDeleting(true);
    try {
      await deleteProject(id);
      router.push('/projects');
    } catch (err) {
      console.error(err);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className={styles['single-project']}>
      <div className={styles['sp-top-header']}>
        <div className={styles['sp-title-row']}>
          <button className={styles['sp-back-btn']} onClick={() => router.push('/projects')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13 4L7 10L13 16" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className={styles['sp-title']}>{project?.name || 'Chargement...'}</h1>
          {isAdmin && (
            <button className={styles['sp-edit-btn']} onClick={() => setShowEditModal(true)}>Modifier</button>
          )}
          {isOwner && (
            <button className={styles['sp-delete-btn']} onClick={() => setShowDeleteConfirm(true)}>Supprimer</button>
          )}
        </div>
        <div className={styles['sp-actions']}>
          <button className={styles['btn-create-task']} onClick={() => { setEditingTask(null); setShowTaskModal(true); }}>Créer une tâche</button>
          <button className={styles['btn-ia']}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L9.5 6L15 8L9.5 10L8 15L6.5 10L1 8L6.5 6L8 1Z" fill="currentColor"/>
            </svg>
            IA
          </button>
        </div>
      </div>
      <p className={styles['sp-description']}>{project?.description || ''}</p>

      <div className={styles['sp-contributors']}>
        <div className={styles['sp-contributors-header']}>
          <span className={styles['sp-contributors-label']}>Contributeurs</span>
          <span className={styles['sp-contributors-count']}>{contributors.length} personnes</span>
        </div>
        <div className={styles['sp-contributors-list']}>
          {contributors.map((c, idx) => (
            <span key={idx} className={styles['sp-contributor']}>
              <span className={`${styles['sp-contributor-avatar']}${c.role === 'Propriétaire' ? ` ${styles['sp-contributor-avatar--owner']}` : ''}`}>
                {getInitials(c)}
              </span>
              {c.role === 'Propriétaire' && <span className={styles['sp-contributor-role']}>{c.role}</span>}
              <span className={styles['sp-contributor-name']}>{c.name || c.email}</span>
            </span>
          ))}
        </div>
      </div>

      <div className={styles['sp-tasks-section']}>
        <div className={styles['sp-tasks-header']}>
          <div>
            <h2 className={styles['sp-tasks-title']}>Tâches</h2>
            <p className={styles['sp-tasks-subtitle']}>Par ordre de priorité</p>
          </div>
          <div className={styles['sp-tasks-controls']}>
            <div className={styles['sp-view-toggle']}>
              <button
                className={`${styles['sp-view-btn']} ${viewMode === 'liste' ? styles['sp-view-btn--active'] : ''}`}
                onClick={() => setViewMode('liste')}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4H14" stroke="currentColor" strokeWidth="1.5"/><path d="M2 8H14" stroke="currentColor" strokeWidth="1.5"/><path d="M2 12H14" stroke="currentColor" strokeWidth="1.5"/></svg>
                Liste
              </button>
              <button
                className={`${styles['sp-view-btn']} ${viewMode === 'calendrier' ? styles['sp-view-btn--active'] : ''}`}
                onClick={() => setViewMode('calendrier')}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M2 6H14" stroke="currentColor" strokeWidth="1.5"/><path d="M5 1V4" stroke="currentColor" strokeWidth="1.5"/><path d="M11 1V4" stroke="currentColor" strokeWidth="1.5"/></svg>
                Calendrier
              </button>
            </div>
            <div className={styles['sp-filter-status-wrapper']} ref={statusFilterRef}>
              <div
                className={`${styles['sp-filter-status']}${statusFilter !== 'ALL' ? ` ${styles['sp-filter-status--active']}` : ''}`}
                onClick={() => setStatusDropdownOpen((prev) => !prev)}
              >
                <span>{statusFilter === 'ALL' ? 'Statut' : STATUS_MAP[statusFilter]}</span>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className={statusDropdownOpen ? styles['sp-comments-arrow--open'] : ''}>
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              {statusDropdownOpen && (
                <div className={styles['sp-filter-dropdown']}>
                  {[{ value: 'ALL', label: 'Tous' }, { value: 'TODO', label: 'À faire' }, { value: 'IN_PROGRESS', label: 'En cours' }, { value: 'DONE', label: 'Terminée' }, { value: 'CANCELLED', label: 'Annulée' }].map((opt) => (
                    <button
                      key={opt.value}
                      className={`${styles['sp-filter-dropdown-item']}${statusFilter === opt.value ? ` ${styles['sp-filter-dropdown-item--active']}` : ''}`}
                      onClick={() => { setStatusFilter(opt.value); setStatusDropdownOpen(false); }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
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
        </div>

        <div className={styles['sp-tasks-list']}>
          {filteredTasks.length === 0 && (
            <p className={styles['sp-no-tasks']}>Aucune tâche pour le moment</p>
          )}
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              projectId={id}
              userRole={userRole}
              onEdit={(t) => { setEditingTask(t); setShowTaskModal(true); }}
              onDelete={async (taskId) => { await deleteTask(id, taskId); loadTasks(); }}
              onCommentAdded={loadTasks}
            />
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
        onClose={() => { setShowTaskModal(false); setEditingTask(null); }}
        onCreated={loadTasks}
        projectId={id}
        projectMembers={taskAssignableMembers}
        task={editingTask}
      />

      {showDeleteConfirm && (
        <div className={styles['delete-overlay']} onClick={() => setShowDeleteConfirm(false)}>
          <div className={styles['delete-dialog']} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles['delete-dialog-title']}>Supprimer le projet</h3>
            <p className={styles['delete-dialog-text']}>
              Êtes-vous sûr de vouloir supprimer <strong>{project?.name}</strong> ? Toutes les tâches associées seront également supprimées. Cette action est irréversible.
            </p>
            <div className={styles['delete-dialog-actions']}>
              <button className={styles['delete-dialog-cancel']} onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>
                Annuler
              </button>
              <button className={styles['delete-dialog-confirm']} onClick={handleDeleteProject} disabled={deleting}>
                {deleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
