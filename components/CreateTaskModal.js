'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createTask, updateTask } from '../services/api';
import modalStyles from './CreateProjectModal.module.css';
import styles from './CreateTaskModal.module.css';

function getInitials(user) {
  if (user.name) {
    return user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }
  return user.email.slice(0, 2).toUpperCase();
}

const STATUSES = [
  { value: 'TODO', label: 'À faire', className: 'status-option--todo' },
  { value: 'IN_PROGRESS', label: 'En cours', className: 'status-option--in-progress' },
  { value: 'DONE', label: 'Terminée', className: 'status-option--done' },
];

function CreateTaskModal({ isOpen, onClose, onCreated, projectId, projectMembers, task }) {
  const isEditMode = !!task;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('');
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '');
        setStatus(task.status || '');
        const assignees = (task.assignees || []).map((a) => a.user || a);
        setSelectedAssignees(assignees);
      } else {
        setTitle('');
        setDescription('');
        setDueDate('');
        setStatus('');
        setSelectedAssignees([]);
      }
      setSearchQuery('');
      setShowDropdown(false);
      setError('');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('');
      setSelectedAssignees([]);
      setSearchQuery('');
      setShowDropdown(false);
      setError('');
    }
  }, [isOpen, isEditMode, task]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const members = projectMembers || [];

  const availableMembers = members.filter(
    (u) => !selectedAssignees.find((c) => c.id === u.id)
  );

  const filteredMembers = searchQuery.trim()
    ? availableMembers.filter((u) => {
        const q = searchQuery.toLowerCase();
        return (u.name && u.name.toLowerCase().includes(q)) || u.email.toLowerCase().includes(q);
      })
    : availableMembers;

  const handleToggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleAddAssignee = (user) => {
    setSelectedAssignees((prev) => [...prev, user]);
    setSearchQuery('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleRemoveAssignee = (userId) => {
    setSelectedAssignees((prev) => prev.filter((c) => c.id !== userId));
  };

  const isFormValid = title.trim() && description.trim() && dueDate;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) return;

    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        dueDate: new Date(dueDate).toISOString(),
        ...(status ? { status } : {}),
        assigneeIds: selectedAssignees.map((a) => a.id),
      };

      if (isEditMode) {
        await updateTask(projectId, task.id, payload);
      } else {
        await createTask(projectId, payload);
      }
      onCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={modalStyles['modal-overlay']} onClick={onClose}>
      <div className={modalStyles['modal']} onClick={(e) => e.stopPropagation()}>
        <div className={modalStyles['modal-header']}>
          <h2 className={modalStyles['modal-title']}>{isEditMode ? 'Modifier la tâche' : 'Créer une tâche'}</h2>
          <button className={modalStyles['modal-close']} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className={modalStyles['modal-error']}>{error}</div>}

          <div className={modalStyles['modal-field']}>
            <label className={modalStyles['modal-label']}>Titre *</label>
            <input
              type="text"
              className={modalStyles['modal-input']}
              placeholder="Nom de la tâche"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={modalStyles['modal-field']}>
            <label className={modalStyles['modal-label']}>Description *</label>
            <textarea
              className={modalStyles['modal-textarea']}
              placeholder="Description de la tâche"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className={modalStyles['modal-field']}>
            <label className={modalStyles['modal-label']}>Échéance *</label>
            <input
              type="date"
              className={modalStyles['modal-input']}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className={modalStyles['modal-field']}>
            <label className={modalStyles['modal-label']}>Statut</label>
            <div className={styles['status-selector']}>
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  className={`${styles['status-option']} ${styles[s.className]}${status === s.value ? ` ${styles['status-option--selected']}` : ''}`}
                  onClick={() => setStatus(status === s.value ? '' : s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className={modalStyles['modal-field']} ref={dropdownRef}>
            <label className={modalStyles['modal-label']}>Assigné à</label>
            <div className={modalStyles['contributors-select']}>
              <div className={modalStyles['contributors-input-wrapper']}>
                {selectedAssignees.map((c) => (
                  <span key={c.id} className={modalStyles['contributor-tag']}>
                    <span className={modalStyles['contributor-tag-avatar']}>{getInitials(c)}</span>
                    <span className={modalStyles['contributor-tag-name']}>{c.name || c.email}</span>
                    <button
                      type="button"
                      className={modalStyles['contributor-tag-remove']}
                      onClick={() => handleRemoveAssignee(c.id)}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </span>
                ))}
                <input
                  ref={inputRef}
                  type="text"
                  className={modalStyles['contributors-search-input']}
                  placeholder={selectedAssignees.length === 0 ? 'Rechercher un membre...' : ''}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                />
              </div>
              <button
                type="button"
                className={modalStyles['contributors-toggle-btn']}
                onClick={handleToggleDropdown}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={showDropdown ? modalStyles['arrow-rotated'] : ''}>
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            {showDropdown && (
              <div className={modalStyles['contributors-dropdown']}>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((user) => (
                    <div
                      key={user.id}
                      className={modalStyles['contributors-dropdown-item']}
                      onClick={() => handleAddAssignee(user)}
                    >
                      <span className={modalStyles['contributors-dropdown-avatar']}>{getInitials(user)}</span>
                      <div className={modalStyles['contributors-dropdown-info']}>
                        <span className={modalStyles['contributors-dropdown-name']}>{user.name || 'Sans nom'}</span>
                        <span className={modalStyles['contributors-dropdown-email']}>{user.email}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={modalStyles['contributors-dropdown-hint']}>
                    Aucun membre trouvé
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={modalStyles['modal-actions']}>
            <button type="submit" className={modalStyles['btn-submit']} disabled={loading || !isFormValid}>
              {loading
                ? (isEditMode ? 'Modification...' : 'Création...')
                : (isEditMode ? 'Modifier la tâche' : 'Créer la tâche')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;
