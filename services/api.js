const AUTH_URL = '/api/auth';
const PROJECTS_URL = '/api/projects';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

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

export async function getProfile() {
  const res = await fetch(`${AUTH_URL}/profile`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur de récupération du profil');
  return data.data;
}

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

export async function getAssignedTasks() {
  const res = await fetch('/api/dashboard/assigned-tasks', {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur de récupération des tâches');
  return data.data;
}

// --- Projects ---

export async function getProjects() {
  const res = await fetch(`${PROJECTS_URL}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur de récupération des projets');
  return data.data;
}

export async function getProject(projectId) {
  const res = await fetch(`${PROJECTS_URL}/${projectId}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur de récupération du projet');
  return data.data;
}

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

export async function removeContributor(projectId, userId) {
  const res = await fetch(`${PROJECTS_URL}/${projectId}/contributors/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors du retrait du contributeur');
  return data.data;
}

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

export async function getTasks(projectId) {
  const res = await fetch(`${PROJECTS_URL}/${projectId}/tasks`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur de récupération des tâches');
  return data.data;
}
