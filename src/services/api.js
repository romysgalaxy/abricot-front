const AUTH_URL = '/auth';
const PROJECTS_URL = '/projects';

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
  const res = await fetch('/dashboard/assigned-tasks', {
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

// --- Tasks ---

export async function getTasks(projectId) {
  const res = await fetch(`${PROJECTS_URL}/${projectId}/tasks`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur de récupération des tâches');
  return data.data;
}

