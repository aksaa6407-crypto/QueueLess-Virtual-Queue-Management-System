import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('queueless_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      if (localStorage.getItem('queueless_token')) {
        localStorage.removeItem('queueless_token');
        localStorage.removeItem('queueless_user');
        // Optional redirect if needed
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

// Location endpoints
export const locationApi = {
  getAll: (all = false) => api.get(`/locations${all ? '?all=true' : ''}`),
  getById: (id) => api.get(`/locations/${id}`),
  create: (data) => api.post('/locations', data),
  update: (id, data) => api.put(`/locations/${id}`, data),
  delete: (id) => api.delete(`/locations/${id}`),
};

// Service endpoints
export const serviceApi = {
  getAll: (locationId = null, all = false) => {
    const params = new URLSearchParams();
    if (locationId) params.append('locationId', locationId);
    if (all) params.append('all', 'true');
    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get(`/services${query}`);
  },
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

// Queue endpoints
export const queueApi = {
  join: (data) => api.post('/queue/join', data),
  getMyActive: () => api.get('/queue/my-active'),
  getMyHistory: () => api.get('/queue/my-history'),
  track: (identifier) => api.get(`/queue/track/${identifier}`),
  cancel: (id, reason = '') => api.put(`/queue/${id}/cancel`, { reason }),
  getServiceQueue: (serviceId) => api.get(`/queue/service/${serviceId}`),
  callNext: (serviceId) => api.post(`/queue/service/${serviceId}/call-next`),
  updateStatus: (id, status, notes = '') => api.put(`/queue/${id}/status`, { status, notes }),
};

// Admin endpoints
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getStaff: () => api.get('/admin/staff'),
  createStaff: (data) => api.post('/admin/staff', data),
  updateStaff: (id, data) => api.put(`/admin/staff/${id}`, data),
  deleteStaff: (id) => api.delete(`/admin/staff/${id}`),
};

// System Health
export const getHealth = () => api.get('/health');

export default api;
