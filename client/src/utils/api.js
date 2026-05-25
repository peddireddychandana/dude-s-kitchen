import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dude-s-kitchen-server.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getFoods = async (category) => {
  const params = category ? { category } : {};
  const response = await api.get('/foods', { params });
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const getOffers = async () => {
  const response = await api.get('/offers');
  return response.data;
};

export const getLogo = async () => {
  const response = await api.get('/logo');
  return response.data;
};

export default api;
