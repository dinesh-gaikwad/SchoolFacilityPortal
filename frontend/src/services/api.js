import axios from 'axios';

// Get backend URL - Works for both localhost and Codespaces
const getBackendUrl = () => {
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // If running in Codespaces (app.github.dev)
  if (hostname.includes('app.github.dev')) {
    // Replace port with 5000 for backend
    return `https://${hostname.replace(port, '5000')}`;
  }
  
  // Local development
  return 'http://localhost:5000';
};

const API_URL = `${getBackendUrl()}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

export const issuesAPI = {
  create: (data) => api.post('/issues', data),
  getAll: () => api.get('/issues'),
  getStats: () => api.get('/issues/stats')
};

export const staffAPI = {
  getAll: () => api.get('/staff'),
  create: (data) => api.post('/staff', data)
};

export const facilitiesAPI = {
  getAll: () => api.get('/facilities'),
  getStats: () => api.get('/facilities/stats')
};

export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count')
};

export const reportsAPI = {
  getSummary: () => api.get('/reports/summary')
};

export default api;
