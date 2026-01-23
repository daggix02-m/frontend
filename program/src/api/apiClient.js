// Base URL for backend API
// Prefer environment variable; fall back to hosted production API so deployed
// builds don't accidentally try to call a localhost backend.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://pharmacare-api.onrender.com/api';

// Check if localStorage is available and working
const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

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

  // Check if storage is available before accessing tokens
  const storageAvailable = isStorageAvailable();
  const currentToken = storageAvailable ? localStorage.getItem('auth_token') : null;

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

    // Check for CORS error - when the request fails at the network level
    if (!response.ok && response.status === 0) {
      throw new Error('CORS error: The API may not be configured to accept requests from this domain. Contact the administrator to ensure proper CORS configuration.');
    }

    // Handle 401 Unauthorized - clear token and redirect to login
    if (response.status === 401) {
      // If this is a login attempt, don't redirect - just throw the error
      // so the login form can handle "Invalid credentials"
      if (endpoint === '/auth/login' || endpoint.includes('/login')) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid credentials');
      }

      // Clear all auth tokens
      if (storageAvailable) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('roleId');
      }

      // Redirect to login page
      if (typeof window !== 'undefined') {
        // Only redirect if we're not already on the login page to avoid loops
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        // Not JSON
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Browser aborted the request (timeout or manual abort)
    if (error.name === 'AbortError') {
      throw new Error(
        'Request to the server took too long and was cancelled. Please check that the backend is reachable at ' +
        API_BASE_URL +
        ' and try again.'
      );
    }

    // CORS or network error
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
        throw new Error('CORS error: The API may not be configured to accept requests from this domain. Contact the administrator to ensure proper CORS configuration.');
      }
      throw new Error('Network error. Please check your internet connection or backend URL.');
    }

    // Re-throw everything else so callers can show the message
    throw error;
  }
};

/**
 * Generic API call wrapper with consistent error handling
 * @param {string} endpoint - The API endpoint to call
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Response object with success status and data
 */
export const makeApiCall = async (endpoint, options = {}) => {
  try {
    const response = await apiClient(endpoint, options);

    // Handle array responses by wrapping them
    if (Array.isArray(response)) {
      return {
        success: true,
        data: response,
      };
    }

    return {
      success: true,
      ...response,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'An error occurred during the API call',
    };
  }
};

export const getAccessToken = () => {
  if (isStorageAvailable()) {
    return localStorage.getItem('auth_token');
  }
  return null;
};

export const isAuthenticated = () => {
  if (isStorageAvailable()) {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    return true;
  }
  return false;
};

export const setToken = (key, value) => {
  if (isStorageAvailable()) {
    localStorage.setItem(key, value);
  } else {
    // Fallback to sessionStorage if localStorage is blocked
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      console.error('Storage is not available:', e);
    }
  }
};

export const getToken = (key) => {
  if (isStorageAvailable()) {
    return localStorage.getItem(key);
  } else {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      console.error('Storage is not available:', e);
      return null;
    }
  }
};

export const removeToken = (key) => {
  if (isStorageAvailable()) {
    localStorage.removeItem(key);
  } else {
    try {
      sessionStorage.removeItem(key);
    } catch (e) {
      console.error('Storage is not available:', e);
    }
  }
};
