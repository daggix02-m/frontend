import {
  getPharmacistDashboard,
  getPharmacistMedicines,
  getPharmacistSales,
  getPharmacistReports,
} from '../api/dashboard.api';
import { makeApiCall } from '../api/apiClient';

/**
 * Pharmacist Service
 * Handles all pharmacist-related API calls for PharmaCare backend
 */

export const pharmacistService = {
  /**
   * Get pharmacist dashboard overview
   * @returns {Promise}
   */
  async getOverview() {
    return await getPharmacistDashboard();
  },

  /**
   * Get branch inventory
   * @param {Object} params - Query parameters (search, category, status)
   * @returns {Promise}
   */
  async getInventory(params = {}) {
    return await getPharmacistMedicines();
  },

  /**
   * Search medicines
   * Matches backend: GET /api/pharmacist/medicines/search
   * @param {string} query - Search query
   * @returns {Promise}
   */
  async searchMedicines(query) {
    return await makeApiCall(`/pharmacist/medicines/search?q=${encodeURIComponent(query)}`, { method: 'GET' });
  },

  /**
   * Get medicines by category
   * Matches backend: GET /api/pharmacist/medicines/category/:category_id
   * @param {string} categoryId - Category ID
   * @returns {Promise}
   */
  async getMedicinesByCategory(categoryId) {
    return await makeApiCall(`/pharmacist/medicines/category/${categoryId}`, { method: 'GET' });
  },

  /**
   * Get medicine by ID
   * Matches backend: GET /api/pharmacist/medicines/:medicine_id
   * @param {string} medicineId - Medicine ID
   * @returns {Promise}
   */
  async getMedicineById(medicineId) {
    return await makeApiCall(`/pharmacist/medicines/${medicineId}`, { method: 'GET' });
  },

  /**
   * Request restock
   * Matches backend: POST /api/pharmacist/inventory/request-restock
   * @param {Object} restockData - Restock data { medicine_id, quantity, notes }
   * @returns {Promise}
   */
  async requestRestock(restockData) {
    return await makeApiCall('/pharmacist/inventory/request-restock', {
      method: 'POST',
      body: JSON.stringify(restockData),
    });
  },

  /**
   * Mark low stock
   * Matches backend: POST /api/pharmacist/inventory/mark-low-stock
   * @param {Object} lowStockData - Low stock data { medicine_id, threshold, notes }
   * @returns {Promise}
   */
  async markLowStock(lowStockData) {
    return await makeApiCall('/pharmacist/inventory/mark-low-stock', {
      method: 'POST',
      body: JSON.stringify(lowStockData),
    });
  },

  /**
   * Get stock history
   * Matches backend: GET /api/pharmacist/inventory/stock-history
   * @returns {Promise}
   */
  async getStockHistory() {
    return await makeApiCall('/pharmacist/inventory/stock-history', { method: 'GET' });
  },

  /**
   * Update medicine stock
   * Matches backend: PUT /api/pharmacist/medicines/:medicine_id/stock
   * @param {string} medicineId - Medicine ID
   * @param {Object} stockData - Stock data { action, quantity_change }
   * @returns {Promise}
   */
  async updateMedicineStock(medicineId, stockData) {
    return await makeApiCall(`/pharmacist/medicines/${medicineId}/stock`, {
      method: 'PUT',
      body: JSON.stringify(stockData),
    });
  },

  /**
   * Delete medicine
   * Matches backend: DELETE /api/pharmacist/medicines/:medicine_id
   * @param {string} medicineId - Medicine ID
   * @returns {Promise}
   */
  async deleteMedicine(medicineId) {
    return await makeApiCall(`/pharmacist/medicines/${medicineId}`, { method: 'DELETE' });
  },

  /**
   * Create sale
   * Matches backend: POST /api/pharmacist/sales
   * @param {Object} saleData - Sale data { items, subtotal, discount, total, payment_method }
   * @returns {Promise}
   */
  async createSale(saleData) {
    return await makeApiCall('/pharmacist/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  },

  /**
   * Get sale by ID
   * Matches backend: GET /api/pharmacist/sales/:sale_id
   * @param {string} saleId - Sale ID
   * @returns {Promise}
   */
  async getSaleById(saleId) {
    return await makeApiCall(`/pharmacist/sales/${saleId}`, { method: 'GET' });
  },

  /**
   * Get low stock report
   * Matches backend: GET /api/pharmacist/reports/low-stock
   * @returns {Promise}
   */
  async getLowStockReport() {
    return await makeApiCall('/pharmacist/reports/low-stock', { method: 'GET' });
  },

  /**
   * Get expiry report
   * Matches backend: GET /api/pharmacist/reports/expiry
   * @returns {Promise}
   */
  async getExpiryReport() {
    return await makeApiCall('/pharmacist/reports/expiry', { method: 'GET' });
  },

  /**
   * Get inventory summary report
   * Matches backend: GET /api/pharmacist/reports/inventory-summary
   * @returns {Promise}
   */
  async getInventorySummaryReport() {
    return await makeApiCall('/pharmacist/reports/inventory-summary', { method: 'GET' });
  },

  /**
   * Update product stock level
   * Matches backend: PUT /api/pharmacist/inventory/:id
   * @param {string} id - Product ID
   * @param {number} quantityInStock - New stock level
   * @returns {Promise}
   */
  async updateStock(id, quantityInStock) {
    return await makeApiCall(`/pharmacist/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity_in_stock: quantityInStock }),
    });
  },

  /**
   * Request stock replenishment
   * @param {Array} productIds - Array of product IDs
   * @param {Array} quantities - Array of quantities
   * @returns {Promise}
   */
  async requestReplenishment(productIds, quantities) {
    return await makeApiCall('/pharmacist/inventory/request-replenishment', {
      method: 'POST',
      body: JSON.stringify({
        productIds,
        quantities,
      }),
    });
  },

  /**
   * Mark product for return (expiry)
   * @param {string} productId - Product ID
   * @param {string} reason - Return reason
   * @returns {Promise}
   */
  async markForReturn(productId, reason) {
    return await makeApiCall('/pharmacist/inventory/mark-return', {
      method: 'POST',
      body: JSON.stringify({
        productId,
        reason,
      }),
    });
  },

  /**
   * Process a sale transaction
   * Matches backend: POST /api/pharmacist/sales
   * @param {Object} saleData - Sale data (items, subtotal, discount, total, payment_method)
   * @returns {Promise}
   */
  async processSale(saleData) {
    return await makeApiCall('/pharmacist/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  },

  /**
   * Get sales data
   * @returns {Promise}
   */
  async getSales() {
    return await getPharmacistSales();
  },

  /**
   * Get branch reports
   * @returns {Promise}
   */
  async getReports() {
    return await getPharmacistReports();
  },

  // REMOVED ENDPOINTS (not supported by backend):
  // - /pharmacist/prescriptions
  // - /pharmacist/deliveries
  // - /pharmacist/alerts
  // - /pharmacist/receipts
};

export default pharmacistService;
