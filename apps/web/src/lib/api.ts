const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  guestLogin: () => fetchAPI('/auth/guest', { method: 'POST' }),
  getMe: () => fetchAPI('/auth/me'),
  logout: () => fetchAPI('/auth/logout', { method: 'POST' }),

  // Users
  updateProfile: (data: any) => fetchAPI('/users/me', { method: 'PATCH', body: JSON.stringify(data) }),
  getWorkspaceMembers: () => fetchAPI('/users/workspace-members'),

  // Preferences
  getPreferences: () => fetchAPI('/preferences'),
  updatePreferences: (data: any) => fetchAPI('/preferences', { method: 'PATCH', body: JSON.stringify(data) }),

  // Tasks
  getTasks: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchAPI(`/tasks${query}`);
  },
  getTask: (id: string) => fetchAPI(`/tasks/${id}`),
  createTask: (data: any) => fetchAPI('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id: string, data: any) => fetchAPI(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTask: (id: string) => fetchAPI(`/tasks/${id}`, { method: 'DELETE' }),

  // Projects
  getProjects: () => fetchAPI('/projects'),
  getProject: (id: string) => fetchAPI(`/projects/${id}`),
  createProject: (data: any) => fetchAPI('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: string, data: any) => fetchAPI(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProject: (id: string) => fetchAPI(`/projects/${id}`, { method: 'DELETE' }),

  // Subtasks
  getSubtasks: (taskId: string) => fetchAPI(`/tasks/${taskId}/subtasks`),
  createSubtask: (taskId: string, data: any) => fetchAPI(`/tasks/${taskId}/subtasks`, { method: 'POST', body: JSON.stringify(data) }),
  updateSubtask: (id: string, data: any) => fetchAPI(`/subtasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteSubtask: (id: string) => fetchAPI(`/subtasks/${id}`, { method: 'DELETE' }),

  // Comments
  getComments: (taskId: string) => fetchAPI(`/tasks/${taskId}/comments`),
  createComment: (taskId: string, content: string) => fetchAPI(`/tasks/${taskId}/comments`, { method: 'POST', body: JSON.stringify({ content }) }),

  // Labels
  getLabels: () => fetchAPI('/labels'),
  createLabel: (data: any) => fetchAPI('/labels', { method: 'POST', body: JSON.stringify(data) }),

  // Teams
  getTeams: () => fetchAPI('/teams'),
  createTeam: (name: string) => fetchAPI('/teams', { method: 'POST', body: JSON.stringify({ name }) }),

  // Workspaces
  leaveWorkspace: (id: string) => fetchAPI(`/workspaces/${id}/leave`, { method: 'DELETE' }),
};
