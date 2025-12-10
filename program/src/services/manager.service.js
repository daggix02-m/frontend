import { makeApiCall } from '../api/auth.api';

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
        return await makeApiCall('/manager/overview', { method: 'GET' });
    },

    /**
     * Get all branches
     * @param {Object} params - Query parameters (search)
     * @returns {Promise}
     */
    async getBranches(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/manager/branches?${queryString}` : '/manager/branches';
        return await makeApiCall(endpoint, { method: 'GET' });
    },

    /**
     * Create new branch
     * @param {Object} branchData - Branch data (name, address, contact)
     * @returns {Promise}
     */
    async createBranch(branchData) {
        return await makeApiCall('/manager/branches', {
            method: 'POST',
            body: JSON.stringify(branchData),
        });
    },

    /**
     * Update branch
     * @param {string} id - Branch ID
     * @param {Object} branchData - Updated branch data
     * @returns {Promise}
     */
    async updateBranch(id, branchData) {
        return await makeApiCall(`/manager/branches/${id}`, {
            method: 'PUT',
            body: JSON.stringify(branchData),
        });
    },

    /**
     * Delete branch
     * @param {string} id - Branch ID
     * @returns {Promise}
     */
    async deleteBranch(id) {
        return await makeApiCall(`/manager/branches/${id}`, { method: 'DELETE' });
    },

    /**
     * Get all staff members
     * @param {Object} params - Query parameters (search)
     * @returns {Promise}
     */
    async getStaff(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/manager/staff?${queryString}` : '/manager/staff';
        return await makeApiCall(endpoint, { method: 'GET' });
    },

    /**
     * Create new staff member
     * @param {Object} staffData - Staff data (name, email, role, branch)
     * @returns {Promise}
     */
    async createStaff(staffData) {
        return await makeApiCall('/manager/staff', {
            method: 'POST',
            body: JSON.stringify(staffData),
        });
    },

    /**
     * Update staff member
     * @param {string} id - Staff ID
     * @param {Object} staffData - Updated staff data
     * @returns {Promise}
     */
    async updateStaff(id, staffData) {
        return await makeApiCall(`/manager/staff/${id}`, {
            method: 'PUT',
            body: JSON.stringify(staffData),
        });
    },

    /**
     * Delete staff member
     * @param {string} id - Staff ID
     * @returns {Promise}
     */
    async deleteStaff(id) {
        return await makeApiCall(`/manager/staff/${id}`, { method: 'DELETE' });
    },


    /**
     * Get pending stock transfers
     * @returns {Promise}
     */
    async getStockTransfers() {
        return await makeApiCall('/manager/stock-transfers', { method: 'GET' });
    },

    /**
     * Get count of pending stock transfers
     * @returns {Promise<number>}
     */
    async getPendingStockTransfersCount() {
        // Assumes getStockTransfers returns an array of transfers with a 'status' property
        const transfers = await this.getStockTransfers();
        if (Array.isArray(transfers)) {
            return transfers.filter(t => t.status === 'pending').length;
        }
        // If API returns { data: [...] }
        if (transfers && Array.isArray(transfers.data)) {
            return transfers.data.filter(t => t.status === 'pending').length;
        }
        return 0;
    },

    /**
     * Approve stock transfer
     * @param {string} id - Transfer ID
     * @returns {Promise}
     */
    async approveStockTransfer(id) {
        return await makeApiCall(`/manager/stock-transfers/${id}/approve`, { method: 'PATCH' });
    },

    /**
     * Reject stock transfer
     * @param {string} id - Transfer ID
     * @returns {Promise}
     */
    async rejectStockTransfer(id) {
        return await makeApiCall(`/manager/stock-transfers/${id}/reject`, { method: 'PATCH' });
    },
};

export default managerService;
