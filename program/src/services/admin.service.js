import { makeApiCall } from '../api/auth.api';

/**
 * Admin Service
 * Handles all admin-related API calls
 */

export const adminService = {
  /**
   * Get admin dashboard overview
   * Matches backend: GET /api/admin/dashboard
   * @returns {Promise}
   */
  async getOverview() {
    return await makeApiCall('/admin/dashboard', { method: 'GET' });
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
    const endpoint = queryString
      ? `/admin/support-tickets?${queryString}`
      : '/admin/support-tickets';
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
   * (If your backend exposes specific dashboard stats endpoints like
   * /api/admin/dashboard/branches, /users, /sales, /branches-list, you can
   * either use this method for a combined response or the dedicated helpers below.)
   * @returns {Promise}
   */
  async getSystemStatistics() {
    return await makeApiCall('/admin/statistics', { method: 'GET' });
  },

  /**
   * Dashboard helpers matching backend format:
   * GET /api/admin/dashboard/branches      - total branches count
   * GET /api/admin/dashboard/users         - total users count
   * GET /api/admin/dashboard/sales         - total sales count (no revenue)
   * GET /api/admin/dashboard/branches-list - branch list with employee counts
   */
  async getDashboardBranches() {
    return await makeApiCall('/admin/dashboard/branches', { method: 'GET' });
  },

  async getDashboardUsers() {
    return await makeApiCall('/admin/dashboard/users', { method: 'GET' });
  },

  async getDashboardSales() {
    return await makeApiCall('/admin/dashboard/sales', { method: 'GET' });
  },

  async getDashboardBranchesList() {
    return await makeApiCall('/admin/dashboard/branches-list', { method: 'GET' });
  },

  /**
   * Manager endpoints matching backend format:
   * GET  /api/admin/managers                     - All managers
   * GET  /api/admin/managers/pending             - Pending managers
   * GET  /api/admin/managers/activated           - Activated managers
   * GET  /api/admin/managers/branch/:branch_id   - Managers by branch
   * PUT  /api/admin/managers/:user_id/activate   - Activate manager
   * PUT  /api/admin/managers/:user_id/deactivate - Deactivate manager
   */
  async getManagers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/admin/managers?${queryString}` : '/admin/managers';
    return await makeApiCall(endpoint, { method: 'GET' });
  },

  async getPendingManagers() {
    return await makeApiCall('/admin/managers/pending', { method: 'GET' });
  },

  async getActivatedManagers() {
    return await makeApiCall('/admin/managers/activated', { method: 'GET' });
  },

  async getManagersByBranch(branchId) {
    return await makeApiCall(`/admin/managers/branch/${branchId}`, { method: 'GET' });
  },

  async activateManager(userId) {
    return await makeApiCall(`/admin/managers/${userId}/activate`, {
      method: 'PUT',
    });
  },

  async deactivateManager(userId) {
    return await makeApiCall(`/admin/managers/${userId}/deactivate`, {
      method: 'PUT',
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

  /**
   * Get platform settings
   * @returns {Promise}
   */
  async getPlatformSettings() {
    return await makeApiCall('/admin/platform-settings', { method: 'GET' });
  },

  /**
   * Update platform settings
   * @param {Object} settingsData - Updated settings data
   * @returns {Promise}
   */
  async updatePlatformSettings(settingsData) {
    return await makeApiCall('/admin/platform-settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  },

  /**
   * Assign subscription to user
   * @param {string} userId - User ID
   * @param {Object} subscriptionData - Subscription assignment data
   * @returns {Promise}
   */
  async assignUserSubscription(userId, subscriptionData) {
    return await makeApiCall(`/admin/users/${userId}/subscription`, {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    });
  },

  /**
   * Get user subscription details
   * @param {string} userId - User ID
   * @returns {Promise}
   */
  async getUserSubscription(userId) {
    return await makeApiCall(`/admin/users/${userId}/subscription`, {
      method: 'GET',
    });
  },
};

export default adminService;
