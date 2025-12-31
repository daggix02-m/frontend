import {
  getManagerDashboard,
  getManagerStaff,
  createManagerStaff,
  updateManagerStaff,
  deleteManagerStaff,
  getManagerMedicines,
  createManagerMedicine,
  updateManagerMedicine,
  deleteManagerMedicine,
  createCashierSale
} from '../api/dashboard.api';
import { makeApiCall } from '../api/apiClient';

/**
 * Manager Service
 * Handles all manager-related API calls for PharmaCare backend
 */

export const managerService = {
  /**
   * Get manager dashboard overview
   * @returns {Promise}
   */
  async getOverview() {
    return await getManagerDashboard();
  },

  /**
   * Process a sale transaction
   * @param {Object} saleData - Sale data (items, subtotal, discount, total, payment_method)
   * @returns {Promise}
   */
  async processSale(saleData) {
    return await createCashierSale(saleData);
  },

  /**
   * Get all staff members
   * @param {Object} params - Query parameters (search)
   * @returns {Promise}
   */
  async getStaff(params = {}) {
    return await getManagerStaff();
  },

  /**
   * Create new staff member
   * @param {Object} staffData - Staff data (name, email, role, branch)
   * @returns {Promise}
   */
  async createStaff(staffData) {
    return await createManagerStaff(staffData);
  },

  /**
   * Update staff member
   * @param {string} id - Staff ID
   * @param {Object} staffData - Updated staff data
   * @returns {Promise}
   */
  async updateStaff(id, staffData) {
    return await updateManagerStaff(id, staffData);
  },

  /**
   * Delete staff member
   * @param {string} id - Staff ID
   * @returns {Promise}
   */
  async deleteStaff(id) {
    return await deleteManagerStaff(id);
  },

  /**
   * Verify staff member
   * Matches backend: POST /api/manager/staff/verify
   * @param {string} email - Staff email
   * @returns {Promise}
   */
  async verifyStaff(email) {
    return await makeApiCall('/manager/staff/verify', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Get dashboard branch overview
   * Matches backend: GET /api/manager/dashboard/branch
   * @returns {Promise}
   */
  async getDashboardBranch() {
    return await makeApiCall('/manager/dashboard/branch', { method: 'GET' });
  },

  /**
   * Get dashboard inventory summary
   * Matches backend: GET /api/manager/dashboard/inventory
   * @returns {Promise}
   */
  async getDashboardInventory() {
    return await makeApiCall('/manager/dashboard/inventory', { method: 'GET' });
  },

  /**
   * Get dashboard sales summary
   * Matches backend: GET /api/manager/dashboard/sales
   * @returns {Promise}
   */
  async getDashboardSales() {
    return await makeApiCall('/manager/dashboard/sales', { method: 'GET' });
  },

  /**
   * Get dashboard notifications
   * Matches backend: GET /api/manager/dashboard/notifications
   * @returns {Promise}
   */
  async getDashboardNotifications() {
    return await makeApiCall('/manager/dashboard/notifications', { method: 'GET' });
  },

  /**
   * Get medicine by ID
   * Matches backend: GET /api/manager/medicines/:medicine_id
   * @param {string} medicineId - Medicine ID
   * @returns {Promise}
   */
  async getMedicineById(medicineId) {
    return await makeApiCall(`/manager/medicines/${medicineId}`, { method: 'GET' });
  },

  /**
   * Update medicine stock
   * Matches backend: PUT /api/manager/medicines/:medicine_id/stock
   * @param {string} medicineId - Medicine ID
   * @param {Object} stockData - Stock data { action, quantity_change }
   * @returns {Promise}
   */
  async updateMedicineStock(medicineId, stockData) {
    return await makeApiCall(`/manager/medicines/${medicineId}/stock`, {
      method: 'PUT',
      body: JSON.stringify(stockData),
    });
  },

  /**
   * Reset staff password
   * Matches backend: POST /api/manager/staff/:user_id/reset-password
   * @param {string} userId - Staff user ID
   * @param {string} newPassword - New password
   * @returns {Promise}
   */
  async resetStaffPassword(userId, newPassword) {
    return await makeApiCall(`/manager/staff/${userId}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ new_password: newPassword }),
    });
  },

  /**
   * Get all medicines/inventory
   * @param {Object} params - Query parameters (search, category, status)
   * @returns {Promise}
   */
  async getProducts(params = {}) {
    return await getManagerMedicines();
  },

  /**
   * Get inventory (alias for getProducts)
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getInventory(params = {}) {
    return await this.getProducts();
  },

  /**
   * Create new medicine
   * @param {Object} medicineData - Medicine data
   * @returns {Promise}
   */
  async createProduct(medicineData) {
    return await createManagerMedicine(medicineData);
  },

  /**
   * Update medicine
   * @param {string} id - Medicine ID
   * @param {Object} medicineData - Updated medicine data
   * @returns {Promise}
   */
  async updateProduct(id, medicineData) {
    return await updateManagerMedicine(id, medicineData);
  },

  /**
   * Delete medicine
   * @param {string} id - Medicine ID
   * @returns {Promise}
   */
  async deleteProduct(id) {
    return await deleteManagerMedicine(id);
  },

  /**
   * Get notifications
   * @param {Object} params - Query parameters (category, status)
   * @returns {Promise}
   */
  async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `/manager/notifications?${queryString}`
      : '/manager/notifications';
    return await makeApiCall(endpoint, { method: 'GET' });
  },

  /**
   * Mark notification as read
   * @param {string} id - Notification ID
   * @returns {Promise}
   */
  async markNotificationRead(id) {
    return await makeApiCall(`/manager/notifications/${id}/read`, { method: 'PATCH' });
  },

  /**
   * Get sales report
   * @param {string} period - 'daily', 'monthly', 'yearly'
   * @returns {Promise}
   */
  async getSalesReport(period) {
    return await makeApiCall(`/manager/reports/sales?period=${period}`, { method: 'GET' });
  },

  /**
   * Get inventory report
   * @returns {Promise}
   */
  async getInventoryReport() {
    return await makeApiCall('/manager/reports/inventory', { method: 'GET' });
  },

  /**
   * Get staff activity report
   * @returns {Promise}
   */
  async getStaffActivityReport() {
    return await makeApiCall('/manager/reports/staff-activity', { method: 'GET' });
  },

  /**
   * Get staff activity logs
   * @param {string} staffId - Staff ID
   * @returns {Promise}
   */
  async getStaffActivityLogs(staffId) {
    return await makeApiCall(`/manager/staff/${staffId}/activity-logs`, { method: 'GET' });
  },

  // REMOVED ENDPOINTS (not supported by backend):
  // - /manager/branches
  // - /manager/inventory/low-stock
  // - /manager/inventory/near-expiry
  // - /manager/reports (general)
  // - /manager/pharmacy-profile
  // - /manager/subscription
  // - /manager/refunds
  // - /manager/discounts
};

export default managerService;
