import React, { useState, useEffect, useRef } from 'react';
import { createTask } from '../services/api';
import './CreateTaskModal.css';

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

function CreateTaskModal({ isOpen, onClose, onCreated, projectId, projectMembers }) {
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
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('');
      setSelectedAssignees([]);
      setSearchQuery('');
      setShowDropdown(false);
      setError('');
    }
  }, [isOpen]);

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

  const filteredMembers = searchQuery.length >= 2
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
      await createTask(projectId, {
        title: title.trim(),
        description: description.trim(),
        dueDate: new Date(dueDate).toISOString(),
        ...(status ? { status } : {}),
        assigneeIds: selectedAssignees.map((a) => a.id),
      });
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Créer une tâche</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="modal-error">{error}</div>}

          <div className="modal-field">
            <label className="modal-label">Titre *</label>
            <input
              type="text"
              className="modal-input"
              placeholder="Nom de la tâche"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Description *</label>
            <textarea
              className="modal-textarea"
              placeholder="Description de la tâche"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Échéance *</label>
            <input
              type="date"
              className="modal-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Statut</label>
            <div className="status-selector">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  className={`status-option ${s.className}${status === s.value ? ' status-option--selected' : ''}`}
                  onClick={() => setStatus(status === s.value ? '' : s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-field" ref={dropdownRef}>
            <label className="modal-label">Assigné à</label>
            <div className="contributors-select">
              <div className="contributors-input-wrapper">
                {selectedAssignees.map((c) => (
                  <span key={c.id} className="contributor-tag">
                    <span className="contributor-tag-avatar">{getInitials(c)}</span>
                    <span className="contributor-tag-name">{c.name || c.email}</span>
                    <button
                      type="button"
                      className="contributor-tag-remove"
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
                  className="contributors-search-input"
                  placeholder={selectedAssignees.length === 0 ? 'Rechercher un membre...' : ''}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => {
                    if (filteredMembers.length > 0) setShowDropdown(true);
                  }}
                />
              </div>
              <button
                type="button"
                className="contributors-toggle-btn"
                onClick={handleToggleDropdown}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={showDropdown ? 'arrow-rotated' : ''}>
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            {showDropdown && filteredMembers.length > 0 && (
              <div className="contributors-dropdown">
                {filteredMembers.map((user) => (
                  <div
                    key={user.id}
                    className="contributors-dropdown-item"
                    onClick={() => handleAddAssignee(user)}
                  >
                    <span className="contributors-dropdown-avatar">{getInitials(user)}</span>
                    <div className="contributors-dropdown-info">
                      <span className="contributors-dropdown-name">{user.name || 'Sans nom'}</span>
                      <span className="contributors-dropdown-email">{user.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-submit" disabled={loading || !isFormValid}>
              {loading ? 'Création...' : 'Créer la tâche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;
