import { makeApiCall } from '../api/auth.api';

/**
 * Inventory Service
 * Handles all inventory-related API calls for various roles
 */

export const inventoryService = {
    /**
     * Get all inventory items
     * @param {Object} params - Query parameters (search, category, status)
     * @returns {Promise}
     */
    async getInventory(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/inventory?${queryString}` : '/inventory';
        return await makeApiCall(endpoint, { method: 'GET' });
    },

    /**
     * Get inventory item by ID
     * @param {string} id - Item ID
     * @returns {Promise}
     */
    async getInventoryItem(id) {
        return await makeApiCall(`/inventory/${id}`, { method: 'GET' });
    },

    /**
     * Create new inventory item
     * @param {Object} itemData - Item data (name, category, stock, price, etc.)
     * @returns {Promise}
     */
    async createItem(itemData) {
        return await makeApiCall('/inventory', {
            method: 'POST',
            body: JSON.stringify(itemData),
        });
    },

    /**
     * Update inventory item
     * @param {string} id - Item ID
     * @param {Object} itemData - Updated item data
     * @returns {Promise}
     */
    async updateItem(id, itemData) {
        return await makeApiCall(`/inventory/${id}`, {
            method: 'PUT',
            body: JSON.stringify(itemData),
        });
    },

    /**
     * Delete inventory item
     * @param {string} id - Item ID
     * @returns {Promise}
     */
    async deleteItem(id) {
        return await makeApiCall(`/inventory/${id}`, { method: 'DELETE' });
    },

    /**
     * Update stock level for an item
     * @param {string} id - Item ID
     * @param {number} stock - New stock level
     * @returns {Promise}
     */
    async updateStock(id, stock) {
        return await makeApiCall(`/inventory/${id}/stock`, {
            method: 'PUT',
            body: JSON.stringify({ stock }),
        });
    },

    /**
     * Get low stock items
     * @returns {Promise}
     */
    async getLowStockItems() {
        return await makeApiCall('/inventory/low-stock', { method: 'GET' });
    },

    /**
     * Get near expiration items
     * @returns {Promise}
     */
    async getNearExpirationItems() {
        return await makeApiCall('/inventory/near-expiration', { method: 'GET' });
    },
};

export default inventoryService;