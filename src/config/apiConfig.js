export const API_BASE_URL = 'https://vote.digitgroup.site/api';
export const STORAGE_BASE_URL = 'https://vote.digitgroup.site/storage';

export const ENDPOINTS = {
  login: `${API_BASE_URL}/login`,
  register: `${API_BASE_URL}/register`,
  logout: `${API_BASE_URL}/logout`,
  profile: `${API_BASE_URL}/profile`,
  candidats: `${API_BASE_URL}/candidats`,
  vote: `${API_BASE_URL}/vote`,
  voteStats: `${API_BASE_URL}/votes/statistiques`,
};

export const defaultHeaders = {
  'Content-Type': 'application/json',
};

export const getAuthHeaders = (token) => ({
  ...defaultHeaders,
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const getImageUrl = (path = '') =>
  path ? `${STORAGE_BASE_URL}/${path}` : '';

export const getPdfUrl = (path = '') =>
  path ? `${STORAGE_BASE_URL}/${path}` : '';

