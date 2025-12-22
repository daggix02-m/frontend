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
      return transfers.filter((t) => t.status === 'pending').length;
    }
    // If API returns { data: [...] }
    if (transfers && Array.isArray(transfers.data)) {
      return transfers.data.filter((t) => t.status === 'pending').length;
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
   * Get low stock items
   * @returns {Promise}
   */
  async getLowStockItems() {
    return await makeApiCall('/manager/inventory/low-stock', { method: 'GET' });
  },

  /**
   * Get items near expiry
   * @returns {Promise}
   */
  async getNearExpiryItems() {
    return await makeApiCall('/manager/inventory/near-expiry', { method: 'GET' });
  },

  /**
   * Get reports
   * @param {Object} params - Query parameters (type, period, startDate, endDate)
   * @returns {Promise}
   */
  async getReports(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/manager/reports?${queryString}` : '/manager/reports';
    return await makeApiCall(endpoint, { method: 'GET' });
  },

  /**
   * Get pharmacy profile
   * @returns {Promise}
   */
  async getPharmacyProfile() {
    return await makeApiCall('/manager/pharmacy-profile', { method: 'GET' });
  },

  /**
   * Update pharmacy profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise}
   */
  async updatePharmacyProfile(profileData) {
    return await makeApiCall('/manager/pharmacy-profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  /**
   * Get subscription information
   * @returns {Promise}
   */
  async getSubscription() {
    return await makeApiCall('/manager/subscription', { method: 'GET' });
  },

  /**
   * Get refunds
   * @param {Object} params - Query parameters (status, search)
   * @returns {Promise}
   */
  async getRefunds(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/manager/refunds?${queryString}` : '/manager/refunds';
    return await makeApiCall(endpoint, { method: 'GET' });
  },

  /**
   * Get refund policy
   * @returns {Promise}
   */
  async getRefundPolicy() {
    return await makeApiCall('/manager/refunds/policy', { method: 'GET' });
  },

  /**
   * Update refund policy
   * @param {Object} policyData - Policy data
   * @returns {Promise}
   */
  async updateRefundPolicy(policyData) {
    return await makeApiCall('/manager/refunds/policy', {
      method: 'PUT',
      body: JSON.stringify(policyData),
    });
  },

  /**
   * Get discount rules
   * @returns {Promise}
   */
  async getDiscountRules() {
    return await makeApiCall('/manager/discounts', { method: 'GET' });
  },

  /**
   * Create discount rule
   * @param {Object} discountData - Discount data
   * @returns {Promise}
   */
  async createDiscountRule(discountData) {
    return await makeApiCall('/manager/discounts', {
      method: 'POST',
      body: JSON.stringify(discountData),
    });
  },

  /**
   * Delete discount rule
   * @param {string} id - Discount ID
   * @returns {Promise}
   */
  async deleteDiscountRule(id) {
    return await makeApiCall(`/manager/discounts/${id}`, { method: 'DELETE' });
  },

  /**
   * Get discount statistics
   * @returns {Promise}
   */
  async getDiscountStats() {
    return await makeApiCall('/manager/discounts/stats', { method: 'GET' });
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
};

export default managerService;
