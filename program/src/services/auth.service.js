import api from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

export const authService = {
    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} User data and token
     */
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });

        // Store token and user role in localStorage
        if (response.success && response.data) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userRole', response.data.user.role);
            localStorage.setItem('userName', response.data.user.name);
            localStorage.setItem('userEmail', response.data.user.email);
        }

        return response;
    },

    /**
     * Logout user
     * @returns {Promise}
     */
    async logout() {
        try {
            await api.post('/auth/logout');
        } finally {
            // Clear local storage regardless of API response
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
        }
    },

    /**
     * Get current user from localStorage
     * @returns {Object|null} User object or null if not logged in
     */
    getCurrentUser() {
        const token = localStorage.getItem('token');
        if (!token) return null;

        return {
            role: localStorage.getItem('userRole'),
            name: localStorage.getItem('userName'),
            email: localStorage.getItem('userEmail'),
        };
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    /**
     * Get user role
     * @returns {string|null}
     */
    getUserRole() {
        return localStorage.getItem('userRole');
    },
};

export default authService;
