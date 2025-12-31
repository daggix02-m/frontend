import { getAdminDashboard, getAdminManagers } from '../api/dashboard.api';
import { makeApiCall } from '../api/apiClient';

/**
 * Admin Service
 * Handles all admin-related API calls for PharmaCare backend
 */

export const adminService = {
  /**
   * Get admin dashboard overview
   * Matches backend: GET /api/admin/dashboard
   * @returns {Promise}
   */
  async getOverview() {
    return await getAdminDashboard();
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
    return await getAdminManagers();
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
   * Get sales data for live dashboard
   * @returns {Promise}
   */
  async getSalesData() {
    return await makeApiCall('/admin/sales-data', { method: 'GET' });
  },

  // REMOVED ENDPOINTS (not supported by backend):
  // - /admin/pharmacies
  // - /admin/subscriptions
  // - /admin/billing
  // - /admin/support-tickets
  // - /admin/statistics
  // - /admin/transactions
  // - /admin/platform-settings
  // - /admin/audit-logs
};

export default adminService;
