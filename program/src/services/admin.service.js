import { makeApiCall } from '../api/auth.api';

/**
 * Admin Service
 * Handles all admin-related API calls
 */

export const adminService = {
    /**
     * Get admin dashboard overview
     * @returns {Promise}
     */
    async getOverview() {
        return await makeApiCall('/admin/overview', { method: 'GET' });
    },

    /**
     * Get all pharmacies
     * @param {Object} params - Query parameters (search, status)
     * @returns {Promise}
     */
    async getPharmacies(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/admin/pharmacies?${queryString}` : '/admin/pharmacies';
        return await makeApiCall(endpoint, { method: 'GET' });
    },

    /**
     * Approve pharmacy
     * @param {string} id - Pharmacy ID
     * @returns {Promise}
     */
    async approvePharmacy(id) {
        return await makeApiCall(`/admin/pharmacies/${id}/approve`, { method: 'PATCH' });
    },

    /**
     * Reject pharmacy
     * @param {string} id - Pharmacy ID
     * @returns {Promise}
     */
    async rejectPharmacy(id) {
        return await makeApiCall(`/admin/pharmacies/${id}/reject`, { method: 'PATCH' });
    },

    /**
     * Suspend pharmacy
     * @param {string} id - Pharmacy ID
     * @returns {Promise}
     */
    async suspendPharmacy(id) {
        return await makeApiCall(`/admin/pharmacies/${id}/suspend`, { method: 'PATCH' });
    },

    /**
     * Reactivate pharmacy
     * @param {string} id - Pharmacy ID
     * @returns {Promise}
     */
    async reactivatePharmacy(id) {
        return await makeApiCall(`/admin/pharmacies/${id}/reactivate`, { method: 'PATCH' });
    },
};

export default adminService;
