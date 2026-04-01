// URLs de base pour les appels API (proxifiées via next.config.js vers localhost:8000)
const AUTH_URL = '/api/auth';
const PROJECTS_URL = '/api/projects';

// Construit les headers avec le token JWT stocké dans localStorage
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// --- Authentification ---

// Connecte un utilisateur et retourne ses données + token
export async function loginUser(email, password) {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur de connexion');
  return data.data;
}

// Inscrit un nouvel utilisateur
export async function registerUser(email, password) {
  const res = await fetch(`${AUTH_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur lors de l'inscription");
  return data.data;
}

// Récupère le profil de l'utilisateur connecté (utilisé au chargement pour valider le token)
export async function getProfile() {
  const res = await fetch(`${AUTH_URL}/profile`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur de récupération du profil');
  return data.data;
}

// Met à jour le nom et/ou l'email de l'utilisateur
export async function updateProfile(profileData) {
  const res = await fetch(`${AUTH_URL}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur de mise à jour du profil');
  return data.data;
}

// Change le mot de passe (nécessite l'ancien mot de passe pour vérification)
export async function updatePassword(currentPassword, newPassword) {
  const res = await fetch(`${AUTH_URL}/password`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur de mise à jour du mot de passe');
  return data.data;
}

// --- Dashboard ---

// Récupère toutes les tâches assignées à l'utilisateur connecté (pour le dashboard)
export async function getAssignedTasks() {
  const res = await fetch('/api/dashboard/assigned-tasks', {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur de récupération des tâches');
  return data.data;
}

// --- Projects ---

// Récupère tous les projets de l'utilisateur (owner ou contributeur)
export async function getProjects() {
  const res = await fetch(`${PROJECTS_URL}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur de récupération des projets');
  return data.data;
}

// Récupère un projet avec ses membres, son owner et le rôle de l'utilisateur (userRole)
export async function getProject(projectId) {
  const res = await fetch(`${PROJECTS_URL}/${projectId}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur de récupération du projet');
  return data.data;
}

// Crée un nouveau projet (l'utilisateur devient automatiquement owner/admin)
export async function createProject(projectData) {
  const res = await fetch(`${PROJECTS_URL}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(projectData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la création du projet');
  return data.data;
}

// Met à jour un projet (réservé aux admins)
export async function updateProject(projectId, projectData) {
  const res = await fetch(`${PROJECTS_URL}/${projectId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(projectData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la mise à jour du projet');
  return data.data;
}

// Supprime un projet et toutes ses tâches (réservé au owner)
export async function deleteProject(projectId) {
  const res = await fetch(`${PROJECTS_URL}/${projectId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la suppression du projet');
  return data.data;
}

// Ajoute un contributeur au projet par son email
export async function addContributor(projectId, email, role = 'CONTRIBUTOR') {
  const res = await fetch(`${PROJECTS_URL}/${projectId}/contributors`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur lors de l'ajout du contributeur");
  return data.data;
}

// Retire un contributeur du projet
export async function removeContributor(projectId, userId) {
  const res = await fetch(`${PROJECTS_URL}/${projectId}/contributors/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors du retrait du contributeur');
  return data.data;
}

// Recherche des utilisateurs par nom/email (pour ajouter des contributeurs)
export async function searchUsers(query = '') {
  const params = query ? `?query=${encodeURIComponent(query)}` : '';
  const res = await fetch(`/api/users/search${params}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la recherche');
  return data.data;
}

// --- Tasks ---

// Crée une tâche dans un projet (titre, description, échéance, statut, assignés)
export async function createTask(projectId, taskData) {
  const res = await fetch(`${PROJECTS_URL}/${projectId}/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la création de la tâche');
  return data.data;
}

// Met à jour une tâche existante
export async function updateTask(projectId, taskId, taskData) {
  const res = await fetch(`${PROJECTS_URL}/${projectId}/tasks/${taskId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la mise à jour de la tâche');
  return data.data;
}

// Supprime une tâche
export async function deleteTask(projectId, taskId) {
  const res = await fetch(`${PROJECTS_URL}/${projectId}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la suppression de la tâche');
  return data.data;
}

// Ajoute un commentaire sur une tâche (accessible à tous les membres du projet)
export async function createComment(projectId, taskId, content) {
  const res = await fetch(`${PROJECTS_URL}/${projectId}/tasks/${taskId}/comments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ content }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la création du commentaire');
  return data.data;
}

// Récupère toutes les tâches d'un projet avec leurs commentaires et assignés
export async function getTasks(projectId) {
  const res = await fetch(`${PROJECTS_URL}/${projectId}/tasks`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur de récupération des tâches');
  return data.data;
}
