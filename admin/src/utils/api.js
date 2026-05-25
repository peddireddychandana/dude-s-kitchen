import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dude-s-kitchen-server.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export function login(email, password) {
  return api.post('/auth/login', { email, password });
}

export function getFoods() {
  return api.get('/foods');
}

export function createFood(data) {
  return api.post('/foods', data);
}

export function updateFood(id, data) {
  return api.put(`/foods/${id}`, data);
}

export function deleteFood(id) {
  return api.delete(`/foods/${id}`);
}

export function getCategories() {
  return api.get('/categories');
}

export function createCategory(data) {
  return api.post('/categories', data);
}

export function deleteCategory(id) {
  return api.delete(`/categories/${id}`);
}

export function getOffers() {
  return api.get('/offers');
}

export function createOffer(data) {
  return api.post('/offers', data);
}

export function updateOffer(id, data) {
  return api.put(`/offers/${id}`, data);
}

export function deleteOffer(id) {
  return api.delete(`/offers/${id}`);
}

export function getLogo() {
  return api.get('/logo');
}

export function uploadLogo(formData) {
  return api.post('/logo', formData);
}

export function uploadImage(formData) {
  return api.post('/upload', formData);
}

export default api;
