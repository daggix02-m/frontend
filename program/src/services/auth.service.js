import { login, logout } from '../api/auth.api';

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
        const response = await login(email, password);

        if (response.success) {
            // The login function from auth.api already handles token storage
            // but we'll ensure the role is properly stored
            if (response.role) {
                localStorage.setItem('userRole', response.role);
            }
        }

        return response;
    },

    /**
     * Logout user
     * @returns {Promise}
     */
    async logout() {
        return await logout();
    },

    /**
     * Get current user from localStorage
     * @returns {Object|null} User object or null if not logged in
     */
    getCurrentUser() {
        const token = localStorage.getItem('accessToken'); // Using the new token storage key
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
        return !!localStorage.getItem('accessToken'); // Using the new token storage key
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
