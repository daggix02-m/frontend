import { makeApiCall } from '../api/auth.api';

/**
 * Pharmacist Service
 * Handles all pharmacist-related API calls
 */

export const pharmacistService = {

    /**
     * Get branch inventory
     * @param {Object} params - Query parameters (search, category, status)
     * @returns {Promise}
     */
    async getInventory(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/pharmacist/inventory?${queryString}` : '/pharmacist/inventory';
        return await makeApiCall(endpoint, { method: 'GET' });
    },

    /**
     * Update product stock level
     * @param {string} id - Product ID
     * @param {number} stock - New stock level
     * @returns {Promise}
     */
    async updateStock(id, stock) {
        return await makeApiCall(`/pharmacist/inventory/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ stock }),
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
     * Get prescriptions
     * @param {Object} params - Query parameters (status)
     * @returns {Promise}
     */
    async getPrescriptions(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/pharmacist/prescriptions?${queryString}` : '/pharmacist/prescriptions';
        return await makeApiCall(endpoint, { method: 'GET' });
    },

    /**
     * Validate prescription
     * @param {string} id - Prescription ID
     * @returns {Promise}
     */
    async validatePrescription(id) {
        return await makeApiCall(`/pharmacist/prescriptions/${id}/validate`, { method: 'PATCH' });
    },

    /**
     * Dispense prescription
     * @param {string} id - Prescription ID
     * @returns {Promise}
     */
    async dispensePrescription(id) {
        return await makeApiCall(`/pharmacist/prescriptions/${id}/dispense`, { method: 'PATCH' });
    },

    /**
     * Get expected deliveries
     * @returns {Promise}
     */
    async getDeliveries() {
        return await makeApiCall('/pharmacist/deliveries', { method: 'GET' });
    },

    /**
     * Mark delivery as received
     * @param {string} id - Delivery ID
     * @returns {Promise}
     */
    async receiveDelivery(id) {
        return await makeApiCall(`/pharmacist/deliveries/${id}/receive`, { method: 'PATCH' });
    },

    /**
     * Request stock transfer
     * @param {Object} transferData - Transfer data (fromBranch, toBranch, items)
     * @returns {Promise}
     */
    async requestStockTransfer(transferData) {
        return await makeApiCall('/pharmacist/stock-transfers', {
            method: 'POST',
            body: JSON.stringify(transferData),
        });
    },

    /**
     * Get stock transfer history
     * @returns {Promise}
     */
    async getStockTransfers() {
        return await makeApiCall('/pharmacist/stock-transfers', { method: 'GET' });
    },

    /**
     * Get branch reports
     * @returns {Promise}
     */
    async getReports() {
        return await makeApiCall('/pharmacist/reports', { method: 'GET' });
    },

    /**
     * Get drug interaction alerts
     * @returns {Promise}
     */
    async getAlerts() {
        return await makeApiCall('/pharmacist/alerts', { method: 'GET' });
    },

    /**
     * Get receipts
     * @returns {Promise}
     */
    async getReceipts() {
        return await makeApiCall('/pharmacist/receipts', { method: 'GET' });
    },

    /**
     * Get delivery items
     * @param {string} id - Delivery ID
     * @returns {Promise}
     */
    async getDeliveryItems(id) {
        return await makeApiCall(`/pharmacist/deliveries/${id}/items`, { method: 'GET' });
    },
};

export default pharmacistService;
