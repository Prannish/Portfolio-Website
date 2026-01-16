import axios from 'axios';

// client/src/api.js
const API_BASE_URL = 'https://portfolio-website-2jvr.onrender.com/api';



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

export const resumeAPI = {
  // Download resume as a blob
  download: () => api.get('/resume/download', { responseType: 'blob' }),
};


export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getFeatured: () => api.get('/projects/featured'),
  create: (data) => api.post('/projects', data),
};

export const skillsAPI = {
  getAll: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
};

export const experiencesAPI = {       // ✅ Add this
  getAll: () => api.get('/experiences'),
  create: (data) => api.post('/experiences', data),
  update: (id, data) => api.put(`/experiences/${id}`, data),
  delete: (id) => api.delete(`/experiences/${id}`)
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