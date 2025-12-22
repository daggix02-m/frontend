import {
  getCashierDashboard,
  getCashierSales,
  createCashierSale,
  getCashierReceipts,
  getCashierProducts,
  processCashierReturn,
  getCashierSessions,
  closeCashierSession
} from '../api/dashboard.api';
import { makeApiCall } from '../api/apiClient';

/**
 * Cashier Service
 * Handles all cashier-related API calls for PharmaCare backend
 */

export const cashierService = {
  /**
   * Get cashier dashboard overview
   * @returns {Promise}
   */
  async getOverview() {
    return await getCashierDashboard();
  },

  /**
   * Get products for POS
   * @param {Object} params - Query parameters (search)
   * @returns {Promise}
   */
  async getProducts(params = {}) {
    return await getCashierProducts();
  },

  /**
   * Process sale/checkout
   * @param {Object} saleData - Sale data (items, subtotal, discount, total, paymentMethod)
   * @returns {Promise}
   */
  async processSale(saleData) {
    return await makeApiCall('/cashier/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  },

  /**
   * Get recent receipts
   * @returns {Promise}
   */
  async getReceipts() {
    return await getCashierReceipts();
  },

  /**
   * Get receipt details
   * @param {string} id - Receipt ID
   * @returns {Promise}
   */
  async getReceipt(id) {
    return await makeApiCall(`/cashier/receipts/${id}`, { method: 'GET' });
  },

  /**
   * Email receipt to customer
   * @param {string} id - Receipt ID
   * @param {string} email - Customer email
   * @returns {Promise}
   */
  async emailReceipt(id, email) {
    return await makeApiCall(`/cashier/receipts/${id}/email`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Get cash session history
   * @returns {Promise}
   */
  async getSessions() {
    return await getCashierSessions();
  },

  /**
   * Close current cash session
   * @param {number} closingCash - Closing cash amount
   * @returns {Promise}
   */
  async closeSession(closingCash) {
    return await closeCashierSession({ closingCash });
  },

  /**
   * Quick stock lookup
   * @param {Object} params - Query parameters (search)
   * @returns {Promise}
   */
  async checkStock(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/cashier/stock-check?${queryString}` : '/cashier/stock-check';
    return await makeApiCall(endpoint, { method: 'GET' });
  },

  /**
   * Hold current transaction
   * @param {Object} transactionData - Transaction data (items, subtotal)
   * @returns {Promise}
   */
  async holdTransaction(transactionData) {
    return await makeApiCall('/cashier/transactions/hold', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  },

  /**
   * Get held transactions
   * @returns {Promise}
   */
  async getHeldTransactions() {
    return await makeApiCall('/cashier/transactions/held', { method: 'GET' });
  },

  /**
   * Process product return
   * @param {Object} returnData - Return data (receiptId, items)
   * @returns {Promise}
   */
  async processReturn(returnData) {
    return await processCashierReturn(returnData);
  },
};

export default cashierService;
