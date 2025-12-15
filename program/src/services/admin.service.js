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

    /**
     * Get all subscriptions
     * @param {Object} params - Query parameters (search, status)
     * @returns {Promise}
     */
    async getSubscriptions(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/admin/subscriptions?${queryString}` : '/admin/subscriptions';
        return await makeApiCall(endpoint, { method: 'GET' });
    },

    /**
     * Update subscription
     * @param {string} id - Subscription ID
     * @param {Object} data - Subscription data
     * @returns {Promise}
     */
    async updateSubscription(id, data) {
        return await makeApiCall(`/admin/subscriptions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * Get billing issues
     * @param {Object} params - Query parameters (status, search)
     * @returns {Promise}
     */
    async getBillingIssues(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/admin/billing?${queryString}` : '/admin/billing';
        return await makeApiCall(endpoint, { method: 'GET' });
    },

    /**
     * Resolve billing issue
     * @param {string} id - Issue ID
     * @returns {Promise}
     */
    async resolveBillingIssue(id) {
        return await makeApiCall(`/admin/billing/${id}/resolve`, { method: 'PATCH' });
    },

    /**
     * Get support tickets
     * @param {Object} params - Query parameters (status, priority, search)
     * @returns {Promise}
     */
    async getSupportTickets(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/admin/support-tickets?${queryString}` : '/admin/support-tickets';
        return await makeApiCall(endpoint, { method: 'GET' });
    },

    /**
     * Update support ticket
     * @param {string} id - Ticket ID
     * @param {Object} data - Ticket data (status, response, etc.)
     * @returns {Promise}
     */
    async updateSupportTicket(id, data) {
        return await makeApiCall(`/admin/support-tickets/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * Get system statistics
     * @returns {Promise}
     */
    async getSystemStatistics() {
        return await makeApiCall('/admin/statistics', { method: 'GET' });
    },

    /**
     * Get platform users
     * @param {Object} params - Query parameters (search, role, status)
     * @returns {Promise}
     */
    async getPlatformUsers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/admin/users?${queryString}` : '/admin/users';
        return await makeApiCall(endpoint, { method: 'GET' });
    },

    /**
     * Update user status
     * @param {string} id - User ID
     * @param {string} status - New status (active, suspended, etc.)
     * @returns {Promise}
     */
    async updateUserStatus(id, status) {
        return await makeApiCall(`/admin/users/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    },

    /**
     * Get audit logs
     * @param {Object} params - Query parameters (search, action, user, dateFrom, dateTo)
     * @returns {Promise}
     */
    async getAuditLogs(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/admin/audit-logs?${queryString}` : '/admin/audit-logs';
        return await makeApiCall(endpoint, { method: 'GET' });
    },

    /**
     * Get sales data for live dashboard
     * @returns {Promise}
     */
    async getSalesData() {
        return await makeApiCall('/admin/sales-data', { method: 'GET' });
    },

    /**
     * Get transactions
     * @param {Object} params - Query parameters (limit, page)
     * @returns {Promise}
     */
    async getTransactions(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/admin/transactions?${queryString}` : '/admin/transactions';
        return await makeApiCall(endpoint, { method: 'GET' });
    },
};

export default adminService;

