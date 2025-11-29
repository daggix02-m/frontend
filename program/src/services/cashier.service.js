import api from './api';

/**
 * Cashier Service
 * Handles all cashier-related API calls
 */

export const cashierService = {
    // ============ POS Sales ============

    /**
     * Get products for POS
     * @param {Object} params - Query parameters (search)
     * @returns {Promise}
     */
    async getProducts(params = {}) {
        return await api.get('/cashier/products', { params });
    },

    /**
     * Process sale/checkout
     * @param {Object} saleData - Sale data (items, subtotal, discount, total, paymentMethod)
     * @returns {Promise}
     */
    async processSale(saleData) {
        return await api.post('/cashier/sales', saleData);
    },

    // ============ Receipts ============

    /**
     * Get recent receipts
     * @returns {Promise}
     */
    async getReceipts() {
        return await api.get('/cashier/receipts');
    },

    /**
     * Get receipt details
     * @param {string} id - Receipt ID
     * @returns {Promise}
     */
    async getReceipt(id) {
        return await api.get(`/cashier/receipts/${id}`);
    },

    /**
     * Email receipt to customer
     * @param {string} id - Receipt ID
     * @param {string} email - Customer email
     * @returns {Promise}
     */
    async emailReceipt(id, email) {
        return await api.post(`/cashier/receipts/${id}/email`, { email });
    },

    // ============ Sessions ============

    /**
     * Get cash session history
     * @returns {Promise}
     */
    async getSessions() {
        return await api.get('/cashier/sessions');
    },

    /**
     * Close current cash session
     * @param {number} closingCash - Closing cash amount
     * @returns {Promise}
     */
    async closeSession(closingCash) {
        return await api.post('/cashier/sessions/close', { closingCash });
    },

    // ============ Stock Check ============

    /**
     * Quick stock lookup
     * @param {Object} params - Query parameters (search)
     * @returns {Promise}
     */
    async checkStock(params = {}) {
        return await api.get('/cashier/stock-check', { params });
    },

    // ============ Transactions ============

    /**
     * Hold current transaction
     * @param {Object} transactionData - Transaction data (items, subtotal)
     * @returns {Promise}
     */
    async holdTransaction(transactionData) {
        return await api.post('/cashier/transactions/hold', transactionData);
    },

    /**
     * Get held transactions
     * @returns {Promise}
     */
    async getHeldTransactions() {
        return await api.get('/cashier/transactions/held');
    },

    /**
     * Process product return
     * @param {Object} returnData - Return data (receiptId, items)
     * @returns {Promise}
     */
    async processReturn(returnData) {
        return await api.post('/cashier/returns', returnData);
    },
};

export default cashierService;
