import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/current')
};

// Issues API
export const issuesAPI = {
  create: (data) => api.post('/issues', data),
  getAll: (status) => api.get('/issues', { params: { status } }),
  getByUser: () => api.get('/issues/user'),
  getById: (id) => api.get(`/issues/${id}`),
  update: (id, data) => api.put(`/issues/${id}`, data),
  delete: (id) => api.delete(`/issues/${id}`),
  getStats: () => api.get('/issues/stats')
};

// Staff API
export const staffAPI = {
  getAll: () => api.get('/staff'),
  create: (data) => api.post('/staff', data),
  getById: (id) => api.get(`/staff/${id}`),
  update: (id, data) => api.put(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`)
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all'),
  delete: (id) => api.delete(`/notifications/${id}`)
};

// Reports API
export const reportsAPI = {
  getSummary: () => api.get('/reports/summary'),
  getByCategory: (category) => api.get('/reports/by-category', { params: { category } }),
  getByPriority: (priority) => api.get('/reports/by-priority', { params: { priority } }),
  getMonthly: (month) => api.get('/reports/monthly', { params: { month } })
};

// Facilities API
export const facilitiesAPI = {
  getAll: () => api.get('/facilities'),
  create: (data) => api.post('/facilities', data),
  getById: (id) => api.get(`/facilities/${id}`),
  update: (id, data) => api.put(`/facilities/${id}`, data),
  delete: (id) => api.delete(`/facilities/${id}`),
  getStats: () => api.get('/facilities/stats')
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  updateProfile: (data) => api.put('/users/profile', data),
  updatePassword: (data) => api.put('/users/password', data),
  delete: (id) => api.delete(`/users/${id}`)
};

export default api;
