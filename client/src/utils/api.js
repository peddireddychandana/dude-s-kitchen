import axios from 'axios';

export const LOGO_URL = 'https://res.cloudinary.com/dpxv7ogz2/image/upload/q_auto,f_auto,w_400/v1779692588/dudes-kitchen/logos/logo.png';
export const LOGO_URL_MD = 'https://res.cloudinary.com/dpxv7ogz2/image/upload/q_auto,f_auto,w_200/v1779692588/dudes-kitchen/logos/logo.png';
export const LOGO_URL_SM = 'https://res.cloudinary.com/dpxv7ogz2/image/upload/q_auto,f_auto,w_96/v1779692588/dudes-kitchen/logos/logo.png';

const api = axios.create({
  baseURL: 'https://dude-s-kitchen-server.onrender.com/api',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let dataCache = null;
let cachePromise = null;

export function prefetchData() {
  if (cachePromise) return cachePromise;
  cachePromise = (async () => {
    try {
      const [categories, foods] = await Promise.all([getCategories(), getFoods()]);
      const result = { categories, foods: foods.filter((f) => f.available !== false) };
      dataCache = result;
      try {
        sessionStorage.setItem('menuCache', JSON.stringify(result));
      } catch {}
      return result;
    } catch {
      return null;
    }
  })();
  return cachePromise;
}

export function getCachedData() {
  if (dataCache) return dataCache;
  try {
    const stored = sessionStorage.getItem('menuCache');
    if (stored) {
      dataCache = JSON.parse(stored);
      return dataCache;
    }
  } catch {}
  return null;
}

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
