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

export const getAdminPharmacies = async () => {
  return await makeApiCall('/admin/pharmacies', {
    method: 'GET',
  });
};

export const approvePharmacy = async (pharmacyId) => {
  return await makeApiCall(`/admin/pharmacies/${pharmacyId}/approve`, {
    method: 'PATCH',
  });
};

export const getAdminSubscriptions = async () => {
  return await makeApiCall('/admin/subscriptions', {
    method: 'GET',
  });
};

export const getAdminAuditLogs = async () => {
  return await makeApiCall('/admin/audit-logs', {
    method: 'GET',
  });
};

export const getAdminSupportTickets = async () => {
  return await makeApiCall('/admin/support-tickets', {
    method: 'GET',
  });
};

export const getAdminSystemStatistics = async () => {
  return await makeApiCall('/admin/statistics', {
    method: 'GET',
  });
};

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

export const getManagerReports = async () => {
  return await makeApiCall('/manager/reports', {
    method: 'GET',
  });
};

export const getManagerBranches = async () => {
  return await makeApiCall('/manager/branches', {
    method: 'GET',
  });
};

export const createManagerBranch = async (branchData) => {
  return await makeApiCall('/manager/branches', {
    method: 'POST',
    body: JSON.stringify(branchData),
  });
};

export const updateManagerBranch = async (branchId, branchData) => {
  return await makeApiCall(`/manager/branches/${branchId}`, {
    method: 'PUT',
    body: JSON.stringify(branchData),
  });
};

export const deleteManagerBranch = async (branchId) => {
  return await makeApiCall(`/manager/branches/${branchId}`, {
    method: 'DELETE',
  });
};

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

export const getPharmacistPrescriptions = async () => {
  return await makeApiCall('/pharmacist/prescriptions', {
    method: 'GET',
  });
};

export const validatePrescription = async (prescriptionId) => {
  return await makeApiCall(`/pharmacist/prescriptions/${prescriptionId}/validate`, {
    method: 'PATCH',
  });
};

export const dispensePrescription = async (prescriptionId) => {
  return await makeApiCall(`/pharmacist/prescriptions/${prescriptionId}/dispense`, {
    method: 'PATCH',
  });
};

export const getPharmacistStockTransfers = async () => {
  return await makeApiCall('/pharmacist/stock-transfers', {
    method: 'GET',
  });
};

export const requestPharmacistStockTransfer = async (transferData) => {
  return await makeApiCall('/pharmacist/stock-transfers', {
    method: 'POST',
    body: JSON.stringify(transferData),
  });
};

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