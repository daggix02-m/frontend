import api from './api';

/**
 * Manager Service
 * Handles all manager-related API calls
 */

export const managerService = {
    /**
     * Get manager dashboard overview
     * @returns {Promise}
     */
    async getOverview() {
        return await api.get('/manager/overview');
    },

    // ============ Branch Management ============

    /**
     * Get all branches
     * @param {Object} params - Query parameters (search)
     * @returns {Promise}
     */
    async getBranches(params = {}) {
        return await api.get('/manager/branches', { params });
    },

    /**
     * Create new branch
     * @param {Object} branchData - Branch data (name, address, contact)
     * @returns {Promise}
     */
    async createBranch(branchData) {
        return await api.post('/manager/branches', branchData);
    },

    /**
     * Update branch
     * @param {string} id - Branch ID
     * @param {Object} branchData - Updated branch data
     * @returns {Promise}
     */
    async updateBranch(id, branchData) {
        return await api.put(`/manager/branches/${id}`, branchData);
    },

    /**
     * Delete branch
     * @param {string} id - Branch ID
     * @returns {Promise}
     */
    async deleteBranch(id) {
        return await api.delete(`/manager/branches/${id}`);
    },

    // ============ Staff Management ============

    /**
     * Get all staff members
     * @param {Object} params - Query parameters (search)
     * @returns {Promise}
     */
    async getStaff(params = {}) {
        return await api.get('/manager/staff', { params });
    },

    /**
     * Create new staff member
     * @param {Object} staffData - Staff data (name, email, role, branch)
     * @returns {Promise}
     */
    async createStaff(staffData) {
        return await api.post('/manager/staff', staffData);
    },

    /**
     * Update staff member
     * @param {string} id - Staff ID
     * @param {Object} staffData - Updated staff data
     * @returns {Promise}
     */
    async updateStaff(id, staffData) {
        return await api.put(`/manager/staff/${id}`, staffData);
    },

    /**
     * Delete staff member
     * @param {string} id - Staff ID
     * @returns {Promise}
     */
    async deleteStaff(id) {
        return await api.delete(`/manager/staff/${id}`);
    },

    // ============ Stock Transfer Approval ============

    /**
     * Get pending stock transfers
     * @returns {Promise}
     */
    async getStockTransfers() {
        return await api.get('/manager/stock-transfers');
    },

    /**
     * Approve stock transfer
     * @param {string} id - Transfer ID
     * @returns {Promise}
     */
    async approveStockTransfer(id) {
        return await api.patch(`/manager/stock-transfers/${id}/approve`);
    },

    /**
     * Reject stock transfer
     * @param {string} id - Transfer ID
     * @returns {Promise}
     */
    async rejectStockTransfer(id) {
        return await api.patch(`/manager/stock-transfers/${id}/reject`);
    },
};

export default managerService;
