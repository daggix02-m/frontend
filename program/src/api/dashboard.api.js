import { apiClient, makeApiCall } from './apiClient';


// Admin Dashboard APIs
export const getAdminDashboard = async () => {
  return await makeApiCall('/admin/dashboard', {
    method: 'GET',
  });
};

export const getAdminManagers = async () => {
  return await makeApiCall('/admin/managers', {
    method: 'GET',
  });
};

// REMOVED ENDPOINTS (not supported by backend):
// - /admin/pharmacies
// - /admin/subscriptions
// - /admin/audit-logs
// - /admin/support-tickets
// - /admin/statistics

// Manager Dashboard APIs
export const getManagerDashboard = async () => {
  return await makeApiCall('/manager/dashboard', {
    method: 'GET',
  });
};

export const getManagerStaff = async () => {
  return await makeApiCall('/manager/staff', {
    method: 'GET',
  });
};

export const createManagerStaff = async (staffData) => {
  return await makeApiCall('/manager/staff', {
    method: 'POST',
    body: JSON.stringify(staffData),
  });
};

export const updateManagerStaff = async (staffId, staffData) => {
  return await makeApiCall(`/manager/staff/${staffId}`, {
    method: 'PUT',
    body: JSON.stringify(staffData),
  });
};

export const deleteManagerStaff = async (staffId) => {
  return await makeApiCall(`/manager/staff/${staffId}`, {
    method: 'DELETE',
  });
};

export const getManagerMedicines = async () => {
  return await makeApiCall('/manager/medicines', {
    method: 'GET',
  });
};

export const createManagerMedicine = async (medicineData) => {
  return await makeApiCall('/manager/medicines', {
    method: 'POST',
    body: JSON.stringify(medicineData),
  });
};

export const updateManagerMedicine = async (medicineId, medicineData) => {
  return await makeApiCall(`/manager/medicines/${medicineId}`, {
    method: 'PUT',
    body: JSON.stringify(medicineData),
  });
};

export const deleteManagerMedicine = async (medicineId) => {
  return await makeApiCall(`/manager/medicines/${medicineId}`, {
    method: 'DELETE',
  });
};

// REMOVED ENDPOINTS (not supported by backend):
// - /manager/branches
// - /manager/reports (general)

// Pharmacist Dashboard APIs
export const getPharmacistDashboard = async () => {
  return await makeApiCall('/pharmacist/dashboard', {
    method: 'GET',
  });
};

export const getPharmacistMedicines = async () => {
  return await makeApiCall('/pharmacist/medicines', {
    method: 'GET',
  });
};

export const getPharmacistSales = async () => {
  return await makeApiCall('/pharmacist/sales', {
    method: 'GET',
  });
};

export const getPharmacistReports = async () => {
  return await makeApiCall('/pharmacist/reports', {
    method: 'GET',
  });
};

// REMOVED ENDPOINTS (not supported by backend):
// - /pharmacist/stock-transfers
// - /pharmacist/prescriptions
// - /pharmacist/prescriptions/:id/validate
// - /pharmacist/prescriptions/:id/dispense

// Cashier Dashboard APIs
export const getCashierDashboard = async () => {
  return await makeApiCall('/cashier/dashboard', {
    method: 'GET',
  });
};

export const getCashierSales = async () => {
  return await makeApiCall('/cashier/sales', {
    method: 'GET',
  });
};

export const createCashierSale = async (saleData) => {
  return await makeApiCall('/cashier/sales', {
    method: 'POST',
    body: JSON.stringify(saleData),
  });
};

export const getCashierReceipts = async () => {
  return await makeApiCall('/cashier/receipts', {
    method: 'GET',
  });
};

export const getCashierProducts = async () => {
  return await makeApiCall('/cashier/products', {
    method: 'GET',
  });
};

export const processCashierReturn = async (returnData) => {
  return await makeApiCall('/cashier/returns', {
    method: 'POST',
    body: JSON.stringify(returnData),
  });
};

export const getCashierSessions = async () => {
  return await makeApiCall('/cashier/sessions', {
    method: 'GET',
  });
};

export const closeCashierSession = async (sessionData) => {
  return await makeApiCall('/cashier/sessions/close', {
    method: 'POST',
    body: JSON.stringify(sessionData),
  });
};
