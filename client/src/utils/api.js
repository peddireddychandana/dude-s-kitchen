import axios from 'axios';

export const LOGO_URL = 'https://res.cloudinary.com/dpxv7ogz2/image/upload/q_auto,f_auto,w_400/v1779692588/dudes-kitchen/logos/logo.png';
export const LOGO_URL_MD = 'https://res.cloudinary.com/dpxv7ogz2/image/upload/q_auto,f_auto,w_200/v1779692588/dudes-kitchen/logos/logo.png';
export const LOGO_URL_SM = 'https://res.cloudinary.com/dpxv7ogz2/image/upload/q_auto,f_auto,w_96/v1779692588/dudes-kitchen/logos/logo.png';

const api = axios.create({
  baseURL: 'https://dude-s-kitchen-server.onrender.com/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const cache = {};
const inflight = {};

function cachedFetch(key, fetcher, ttl = 30000) {
  if (inflight[key]) return inflight[key];
  const cached = cache[key];
  if (cached && Date.now() - cached.ts < ttl) return Promise.resolve(cached.data);
  inflight[key] = fetcher().then((data) => {
    cache[key] = { data, ts: Date.now() };
    delete inflight[key];
    return data;
  }).catch((err) => {
    delete inflight[key];
    if (cached) return cached.data;
    throw err;
  });
  return inflight[key];
}

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
  return cachedFetch(`foods:${category || 'all'}`, () =>
    api.get('/foods', { params }).then((r) => r.data)
  , 30000);
};

export const getCategories = async () => {
  return cachedFetch('categories', () =>
    api.get('/categories').then((r) => r.data)
  , 30000);
};

export const getOffers = async () => {
  return cachedFetch('offers', () =>
    api.get('/offers').then((r) => r.data)
  , 60000);
};

export const getLogo = async () => {
  const response = await api.get('/logo');
  return response.data;
};

export default api;
