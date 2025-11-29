import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
    (response) => {
        // Return just the data portion of the response
        return response.data;
    },
    (error) => {
        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('userRole');
                    window.location.href = '/login';
                    break;
                case 403:
                    // Forbidden - insufficient permissions
                    console.error('Access forbidden:', data?.error?.message);
                    break;
                case 404:
                    // Not found
                    console.error('Resource not found:', data?.error?.message);
                    break;
                case 500:
                    // Server error
                    console.error('Server error:', data?.error?.message);
                    break;
                default:
                    console.error('API error:', data?.error?.message || 'Unknown error');
            }

            return Promise.reject(data?.error || { message: 'An error occurred' });
        } else if (error.request) {
            // Request made but no response received
            console.error('Network error: No response from server');
            return Promise.reject({ message: 'Network error. Please check your connection.' });
        } else {
            // Something else happened
            console.error('Request error:', error.message);
            return Promise.reject({ message: error.message });
        }
    }
);

export default api;
