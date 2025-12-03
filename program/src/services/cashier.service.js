import { makeApiCall } from '../api/auth.api';

/**
 * Cashier Service
 * Handles all cashier-related API calls
 */

export const cashierService = {

    /**
     * Get products for POS
     * @param {Object} params - Query parameters (search)
     * @returns {Promise}
     */
    async getProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/cashier/products?${queryString}` : '/cashier/products';
        return await makeApiCall(endpoint, { method: 'GET' });
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
        return await makeApiCall('/cashier/receipts', { method: 'GET' });
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
        return await makeApiCall('/cashier/sessions', { method: 'GET' });
    },

    /**
     * Close current cash session
     * @param {number} closingCash - Closing cash amount
     * @returns {Promise}
     */
    async closeSession(closingCash) {
        return await makeApiCall('/cashier/sessions/close', {
            method: 'POST',
            body: JSON.stringify({ closingCash }),
        });
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
        return await makeApiCall('/cashier/returns', {
            method: 'POST',
            body: JSON.stringify(returnData),
        });
    },
};

export default cashierService;
