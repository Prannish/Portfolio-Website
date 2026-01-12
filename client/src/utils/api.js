import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getFeatured: () => api.get('/projects/featured'),
  create: (data) => api.post('/projects', data),
};

export const skillsAPI = {
  getAll: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
};

export const contactAPI = {
  send: (data) => api.post('/contact', data),
};

export const certificationsAPI = {
  getAll: () => api.get('/certifications'),
  create: (data) => api.post('/certifications', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/certifications/${id}`),
};

export default api;