'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createTask } from '../services/api';
import modalStyles from './CreateProjectModal.module.css';
import styles from './GenerateTasksModal.module.css';

// Modal de génération de tâches par IA avec interface de chat
// L'utilisateur saisit un prompt décrivant les tâches souhaitées,
// l'IA (Mistral) génère des tâches que l'utilisateur peut modifier/supprimer avant de les ajouter au projet
function GenerateTasksModal({ isOpen, onClose, onCreated, projectId, projectName, projectDescription }) {
  const [prompt, setPrompt] = useState('');            // Texte saisi par l'utilisateur dans la barre de chat
  const [messages, setMessages] = useState([]);         // Historique des messages du chat (user + assistant)
  const [loading, setLoading] = useState(false);        // État de chargement pendant l'appel à l'API Mistral
  const [saving, setSaving] = useState(false);          // État de chargement pendant la sauvegarde des tâches dans le backend
  const [error, setError] = useState('');               // Message d'erreur éventuel
  const [generatedTasks, setGeneratedTasks] = useState([]); // Tâches générées par l'IA
  const [editingIndex, setEditingIndex] = useState(null);    // Index de la tâche en cours d'édition (null = aucune)
  const [editForm, setEditForm] = useState({ title: '', description: '' }); // Formulaire d'édition d'une tâche
  const messagesEndRef = useRef(null);  // Ref pour le scroll automatique vers le bas du chat
  const inputRef = useRef(null);         // Ref pour focus automatique sur l'input

  // Scroll automatique vers le bas du chat à chaque nouveau message ou tâche générée
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, generatedTasks]);

  // Focus automatique sur l'input quand le modal s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Envoi du prompt à l'API de génération de tâches
  const handleSend = async (e) => {
    e.preventDefault();
    const text = prompt.trim();
    if (!text || loading) return;

    // Ajout du message utilisateur dans le chat
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setPrompt('');
    setLoading(true);  // Active l'état de chargement (affiche l'animation de typing)
    setError('');
    setGeneratedTasks([]);

    try {
      // Appel à notre route API serveur Next.js (/api/generate-tasks)
      // qui elle-même appelle Mistral de manière sécurisée (clé API côté serveur)
      const response = await fetch('/api/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          projectName: projectName || '',
          projectDescription: projectDescription || '',
        }),
      });

      // Gestion des erreurs HTTP (API indisponible, quota dépassé, etc.)
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Erreur lors de la génération');
      }

      const data = await response.json();
      const tasks = data.data || [];

      // Ajout du message de l'assistant avec le nombre de tâches générées
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `${tasks.length} tâche${tasks.length > 1 ? 's' : ''} générée${tasks.length > 1 ? 's' : ''}. Vous pouvez les modifier, supprimer ou valider.` },
      ]);
      setGeneratedTasks(tasks);
    } catch (err) {
      // En cas d'erreur, on affiche le message dans le chat sous forme de bulle rouge
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Erreur : ${err.message}`, isError: true },
      ]);
    } finally {
      setLoading(false); // Désactive l'état de chargement dans tous les cas
    }
  };

  // Suppression d'une tâche générée de la liste (avant sauvegarde)
  const handleDeleteTask = (index) => {
    setGeneratedTasks((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  // Passage en mode édition pour une tâche : on pré-remplit le formulaire
  const handleStartEdit = (index) => {
    const task = generatedTasks[index];
    setEditForm({ title: task.title, description: task.description });
    setEditingIndex(index);
  };

  // Sauvegarde de la modification d'une tâche dans le state local
  const handleSaveEdit = (index) => {
    setGeneratedTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, ...editForm } : t))
    );
    setEditingIndex(null);
  };

  // Annulation de l'édition en cours
  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  // Sauvegarde de toutes les tâches générées dans le backend via l'API projet
  // Chaque tâche est créée individuellement avec createTask()
  const handleSaveAll = async () => {
    if (generatedTasks.length === 0) return;

    setSaving(true);
    setError('');

    try {
      for (const task of generatedTasks) {
        await createTask(projectId, {
          title: task.title,
          description: task.description,
          status: task.status || 'TODO',
          // Date d'échéance par défaut : +7 jours à partir d'aujourd'hui
          // Choix pratique car l'IA ne génère pas de dates, et cela donne
          // une échéance raisonnable que l'utilisateur peut modifier ensuite
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
      onCreated(); // Rafraîchit la liste des tâches dans la page projet
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Fermeture du modal : réinitialisation complète de tous les états
  const handleClose = () => {
    setPrompt('');
    setMessages([]);
    setGeneratedTasks([]);
    setEditingIndex(null);
    setError('');
    setLoading(false);
    setSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={modalStyles['modal-overlay']} onClick={handleClose}>
      <div className={`${modalStyles['modal']} ${styles['chat-modal']}`} onClick={(e) => e.stopPropagation()}>
        {/* En-tête du modal : titre dynamique selon l'état */}
        <div className={modalStyles['modal-header']}>
          <h2 className={modalStyles['modal-title']}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" style={{ marginRight: 8, verticalAlign: 'middle' }}>
              <path d="M8 1L9.5 6L15 8L9.5 10L8 15L6.5 10L1 8L6.5 6L8 1Z" fill="#e87a3a"/>
            </svg>
            {/* Le titre change selon que des tâches ont été générées ou non */}
            {generatedTasks.length > 0 ? 'Vos tâches' : 'Créer une tâche'}
          </h2>
          <button className={modalStyles['modal-close']} onClick={handleClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className={styles['chat-body']}>
          {/* Zone de messages du chat */}
          <div className={styles['chat-messages']}>

            {/* Affichage des messages du chat (utilisateur et assistant) */}
            {messages.map((msg, i) => (
              <div key={i} className={`${styles['chat-message']} ${styles[`chat-message--${msg.role}`]}${msg.isError ? ` ${styles['chat-message--error']}` : ''}`}>
                {/* Avatar IA affiché uniquement pour les messages de l'assistant */}
                {msg.role === 'assistant' && (
                  <div className={styles['chat-avatar']}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1L9.5 6L15 8L9.5 10L8 15L6.5 10L1 8L6.5 6L8 1Z" fill="#e87a3a"/>
                    </svg>
                  </div>
                )}
                <div className={styles['chat-bubble']}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Animation de chargement (3 points qui rebondissent) pendant l'appel à Mistral */}
            {loading && (
              <div className={`${styles['chat-message']} ${styles['chat-message--assistant']}`}>
                <div className={styles['chat-avatar']}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1L9.5 6L15 8L9.5 10L8 15L6.5 10L1 8L6.5 6L8 1Z" fill="#e87a3a"/>
                  </svg>
                </div>
                <div className={styles['chat-bubble']}>
                  <span className={styles['typing-dots']}>
                    <span></span><span></span><span></span>
                  </span>
                </div>
              </div>
            )}

            {/* Liste des tâches générées par l'IA */}
            {generatedTasks.length > 0 && (
              <div className={styles['tasks-container']}>
                {generatedTasks.map((task, index) => (
                  <div key={index} className={styles['task-card']}>
                    {/* Mode édition : formulaire inline pour modifier titre et description */}
                    {editingIndex === index ? (
                      <div className={styles['task-edit']}>
                        <input
                          className={styles['task-edit-input']}
                          value={editForm.title}
                          onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                          placeholder="Titre"
                        />
                        <textarea
                          className={styles['task-edit-textarea']}
                          value={editForm.description}
                          onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                          placeholder="Description"
                          rows={2}
                        />
                        <div className={styles['task-edit-actions']}>
                          <button className={styles['btn-cancel-edit']} onClick={handleCancelEdit}>Annuler</button>
                          <button className={styles['btn-save-edit']} onClick={() => handleSaveEdit(index)}>OK</button>
                        </div>
                      </div>
                    ) : (
                      /* Mode lecture : affichage de la tâche avec boutons modifier/supprimer */
                      <>
                        <div className={styles['task-content']}>
                          <h4 className={styles['task-title']}>{task.title}</h4>
                          <p className={styles['task-description']}>{task.description}</p>
                        </div>
                        <div className={styles['task-actions']}>
                          <button className={styles['task-action-btn']} onClick={() => handleStartEdit(index)} title="Modifier">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                              <path d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button className={`${styles['task-action-btn']} ${styles['task-action-btn--danger']}`} onClick={() => handleDeleteTask(index)} title="Supprimer">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {/* Bouton de validation : ajoute toutes les tâches au projet via l'API backend */}
                <div className={styles['tasks-footer']}>
                  <button
                    className={styles['btn-save']}
                    onClick={handleSaveAll}
                    disabled={saving || generatedTasks.length === 0}
                  >
                    {saving ? 'Ajout en cours...' : `Ajouter ${generatedTasks.length} tâche${generatedTasks.length > 1 ? 's' : ''} au projet`}
                  </button>
                </div>
              </div>
            )}

            {/* Élément invisible pour le scroll automatique vers le bas */}
            <div ref={messagesEndRef} />
          </div>

          {/* Barre de saisie du prompt (en bas du modal, style chat) */}
          <form className={styles['chat-input-form']} onSubmit={handleSend}>
            <input
              ref={inputRef}
              type="text"
              className={styles['chat-input']}
              placeholder="Décrivez les tâches que vous souhaitez ajouter..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading || saving} // Désactivé pendant le chargement ou la sauvegarde
            />
            <button
              type="submit"
              className={styles['chat-send-btn']}
              disabled={!prompt.trim() || loading || saving}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M3 10L17 3L10 17L9 11L3 10Z" fill="currentColor"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default GenerateTasksModal;
