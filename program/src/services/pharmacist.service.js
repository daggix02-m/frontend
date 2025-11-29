import api from './api';

/**
 * Pharmacist Service
 * Handles all pharmacist-related API calls
 */

export const pharmacistService = {
    // ============ Inventory Management ============

    /**
     * Get branch inventory
     * @param {Object} params - Query parameters (search, category, status)
     * @returns {Promise}
     */
    async getInventory(params = {}) {
        return await api.get('/pharmacist/inventory', { params });
    },

    /**
     * Update product stock level
     * @param {string} id - Product ID
     * @param {number} stock - New stock level
     * @returns {Promise}
     */
    async updateStock(id, stock) {
        return await api.put(`/pharmacist/inventory/${id}`, { stock });
    },

    /**
     * Request stock replenishment
     * @param {Array} productIds - Array of product IDs
     * @param {Array} quantities - Array of quantities
     * @returns {Promise}
     */
    async requestReplenishment(productIds, quantities) {
        return await api.post('/pharmacist/inventory/request-replenishment', {
            productIds,
            quantities,
        });
    },

    /**
     * Mark product for return (expiry)
     * @param {string} productId - Product ID
     * @param {string} reason - Return reason
     * @returns {Promise}
     */
    async markForReturn(productId, reason) {
        return await api.post('/pharmacist/inventory/mark-return', {
            productId,
            reason,
        });
    },

    // ============ Prescription Management ============

    /**
     * Get prescriptions
     * @param {Object} params - Query parameters (status)
     * @returns {Promise}
     */
    async getPrescriptions(params = {}) {
        return await api.get('/pharmacist/prescriptions', { params });
    },

    /**
     * Validate prescription
     * @param {string} id - Prescription ID
     * @returns {Promise}
     */
    async validatePrescription(id) {
        return await api.patch(`/pharmacist/prescriptions/${id}/validate`);
    },

    /**
     * Dispense prescription
     * @param {string} id - Prescription ID
     * @returns {Promise}
     */
    async dispensePrescription(id) {
        return await api.patch(`/pharmacist/prescriptions/${id}/dispense`);
    },

    // ============ Stock Receiving ============

    /**
     * Get expected deliveries
     * @returns {Promise}
     */
    async getDeliveries() {
        return await api.get('/pharmacist/deliveries');
    },

    /**
     * Mark delivery as received
     * @param {string} id - Delivery ID
     * @returns {Promise}
     */
    async receiveDelivery(id) {
        return await api.patch(`/pharmacist/deliveries/${id}/receive`);
    },

    // ============ Stock Transfers ============

    /**
     * Request stock transfer
     * @param {Object} transferData - Transfer data (fromBranch, toBranch, items)
     * @returns {Promise}
     */
    async requestStockTransfer(transferData) {
        return await api.post('/pharmacist/stock-transfers', transferData);
    },

    /**
     * Get stock transfer history
     * @returns {Promise}
     */
    async getStockTransfers() {
        return await api.get('/pharmacist/stock-transfers');
    },

    // ============ Reports ============

    /**
     * Get branch reports
     * @returns {Promise}
     */
    async getReports() {
        return await api.get('/pharmacist/reports');
    },
};

export default pharmacistService;
