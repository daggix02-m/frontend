import api from './api';

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
        return await api.get('/admin/overview');
    },

    /**
     * Get all pharmacies
     * @param {Object} params - Query parameters (search, status)
     * @returns {Promise}
     */
    async getPharmacies(params = {}) {
        return await api.get('/admin/pharmacies', { params });
    },

    /**
     * Approve pharmacy
     * @param {string} id - Pharmacy ID
     * @returns {Promise}
     */
    async approvePharmacy(id) {
        return await api.patch(`/admin/pharmacies/${id}/approve`);
    },

    /**
     * Reject pharmacy
     * @param {string} id - Pharmacy ID
     * @returns {Promise}
     */
    async rejectPharmacy(id) {
        return await api.patch(`/admin/pharmacies/${id}/reject`);
    },

    /**
     * Suspend pharmacy
     * @param {string} id - Pharmacy ID
     * @returns {Promise}
     */
    async suspendPharmacy(id) {
        return await api.patch(`/admin/pharmacies/${id}/suspend`);
    },

    /**
     * Reactivate pharmacy
     * @param {string} id - Pharmacy ID
     * @returns {Promise}
     */
    async reactivatePharmacy(id) {
        return await api.patch(`/admin/pharmacies/${id}/reactivate`);
    },
};

export default adminService;
