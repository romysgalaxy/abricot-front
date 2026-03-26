import React, { useState, useEffect, useRef } from 'react';
import { createProject, searchUsers } from '../services/api';
import './CreateProjectModal.css';

function getInitials(user) {
  if (user.name) {
    return user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }
  return user.email.slice(0, 2).toUpperCase();
}

function CreateProjectModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedContributors, setSelectedContributors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchTimeout = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      searchUsers().then((data) => setAllUsers(data.users || [])).catch(() => {});
    } else {
      setName('');
      setDescription('');
      setSelectedContributors([]);
      setSearchQuery('');
      setAllUsers([]);
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

  useEffect(() => {
    if (searchQuery.length < 2) return;

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        const data = await searchUsers(searchQuery);
        setAllUsers(data.users || []);
        setShowDropdown(true);
      } catch {
        // keep existing allUsers
      }
    }, 300);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery]);

  const availableUsers = allUsers.filter(
    (u) => !selectedContributors.find((c) => c.id === u.id)
  );

  const handleToggleDropdown = async () => {
    if (showDropdown) {
      setShowDropdown(false);
      return;
    }
    try {
      const data = await searchUsers();
      setAllUsers(data.users || []);
      setShowDropdown(true);
    } catch {
      // ignore
    }
  };

  const handleAddContributor = (user) => {
    setSelectedContributors((prev) => [...prev, user]);
    setSearchQuery('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleRemoveContributor = (userId) => {
    setSelectedContributors((prev) => prev.filter((c) => c.id !== userId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !description.trim()) {
      setError('Le titre et la description sont obligatoires.');
      return;
    }

    setLoading(true);
    try {
      await createProject({
        name: name.trim(),
        description: description.trim(),
        contributors: selectedContributors.map((c) => c.email),
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
          <h2 className="modal-title">Créer un projet</h2>
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
              placeholder="Nom du projet"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Description *</label>
            <textarea
              className="modal-textarea"
              placeholder="Description du projet"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="modal-field" ref={dropdownRef}>
            <label className="modal-label">Collaborateurs</label>
            <div className="contributors-select">
              <div className="contributors-input-wrapper">
                {selectedContributors.map((c) => (
                  <span key={c.id} className="contributor-tag">
                    <span className="contributor-tag-avatar">{getInitials(c)}</span>
                    <span className="contributor-tag-name">{c.name || c.email}</span>
                    <button
                      type="button"
                      className="contributor-tag-remove"
                      onClick={() => handleRemoveContributor(c.id)}
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
                  placeholder={selectedContributors.length === 0 ? 'Rechercher un utilisateur...' : ''}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (availableUsers.length > 0) setShowDropdown(true);
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
            {showDropdown && availableUsers.length > 0 && (
              <div className="contributors-dropdown">
                {availableUsers.map((user) => (
                  <div
                    key={user.id}
                    className="contributors-dropdown-item"
                    onClick={() => handleAddContributor(user)}
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
            <button type="submit" className="btn-submit" disabled={loading || !name.trim() || !description.trim()}>
              {loading ? 'Création...' : 'Créer le projet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;
