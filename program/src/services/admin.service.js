import { getAdminDashboard, getAdminManagers } from '../api/dashboard.api';
import { makeApiCall } from '../api/apiClient';

/**
 * Admin Service
 * Normalizes backend responses so UI always receives clean data
 */

const extractNumber = (data) => {
  if (typeof data === 'number') return data;
  if (typeof data === 'object' && data !== null) {
    return (
      data.count ??
      data.total ??
      data.totalSales ??
      0
    );
  }
  return 0;
};

export const adminService = {
  async getOverview() {
    return await getAdminDashboard();
  },

  async getDashboardBranches() {
    const res = await makeApiCall('/admin/dashboard/branches', { method: 'GET' });
    return {
      ...res,
      data: extractNumber(res?.data),
    };
  },

  async getDashboardUsers() {
    const res = await makeApiCall('/admin/dashboard/users', { method: 'GET' });
    return {
      ...res,
      data: extractNumber(res?.data),
    };
  },

  async getDashboardSales() {
    const res = await makeApiCall('/admin/dashboard/sales', { method: 'GET' });
    return {
      ...res,
      data: extractNumber(res?.data),
    };
  },

  async getDashboardBranchesList() {
    return await makeApiCall('/admin/dashboard/branches-list', { method: 'GET' });
  },

  async getManagers() {
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

  async getSalesData() {
    return await makeApiCall('/admin/sales-data', { method: 'GET' });
  },
};

export default adminService;
