// Base URL for backend API
// Prefer environment variable; fall back to hosted production API so deployed
// builds don't accidentally try to call a localhost backend.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://pharmacare-api.onrender.com/api';

// Generic helper to add a timeout to fetch calls so the UI
// doesn't stay in a loading state forever if the backend
// is unreachable or very slow.
// We use a relatively generous timeout to avoid aborting
// healthy but slightly slow requests.
const fetchWithTimeout = (url, options = {}, timeoutMs = 30000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(id));
};

export const apiClient = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const currentToken = localStorage.getItem('accessToken');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(currentToken && { Authorization: `Bearer ${currentToken}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    let response = await fetchWithTimeout(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);

    // Browser aborted the request (timeout or manual abort)
    if (error.name === 'AbortError') {
      throw new Error(
        'Request to the server took too long and was cancelled. Please check that the backend is reachable at ' +
          API_BASE_URL +
          ' and try again.'
      );
    }

    // Generic network failure
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection or backend URL.');
    }

    // Re-throw everything else so callers can show the message
    throw error;
  }
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;

  return true;
};
