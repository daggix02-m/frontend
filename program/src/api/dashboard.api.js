import { apiClient, makeApiCall } from './apiClient';


// Admin Dashboard APIs
export const getAdminDashboard = async () => {
  return await makeApiCall('/admin/dashboard', {
    method: 'GET',
  });
};

export const getAdminDashboardBranches = async () => {
  return await makeApiCall('/admin/dashboard/branches', {
    method: 'GET',
  });
};

export const getAdminDashboardUsers = async () => {
  return await makeApiCall('/admin/dashboard/users', {
    method: 'GET',
  });
};

export const getAdminDashboardSales = async () => {
  return await makeApiCall('/admin/dashboard/sales', {
    method: 'GET',
  });
};

export const getAdminDashboardBranchesList = async () => {
  return await makeApiCall('/admin/dashboard/branches-list', {
    method: 'GET',
  });
};

export const getAdminManagers = async () => {
  return await makeApiCall('/admin/managers', {
    method: 'GET',
  });
};

export const getAdminManagersPending = async () => {
  return await makeApiCall('/admin/managers/pending', {
    method: 'GET',
  });
};

export const getAdminManagersActivated = async () => {
  return await makeApiCall('/admin/managers/activated', {
    method: 'GET',
  });
};

export const getAdminManagersByBranch = async (branchId) => {
  return await makeApiCall(`/admin/managers/branch/${branchId}`, {
    method: 'GET',
  });
};

export const activateAdminManager = async (userId) => {
  return await makeApiCall(`/admin/managers/${userId}/activate`, {
    method: 'PUT',
  });
};

export const deactivateAdminManager = async (userId) => {
  return await makeApiCall(`/admin/managers/${userId}/deactivate`, {
    method: 'PUT',
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

export const getManagerDashboardBranch = async () => {
  return await makeApiCall('/manager/dashboard/branch', {
    method: 'GET',
  });
};

export const getManagerDashboardInventory = async () => {
  return await makeApiCall('/manager/dashboard/inventory', {
    method: 'GET',
  });
};

export const getManagerDashboardSales = async () => {
  return await makeApiCall('/manager/dashboard/sales', {
    method: 'GET',
  });
};

export const getManagerDashboardNotifications = async () => {
  return await makeApiCall('/manager/dashboard/notifications', {
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

export const resetManagerStaffPassword = async (userId) => {
  return await makeApiCall(`/manager/staff/${userId}/reset-password`, {
    method: 'POST',
  });
};

export const verifyManagerStuff = async (data) => {
  return await makeApiCall('/manager/verifystuff', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getManagerMedicines = async () => {
  return await makeApiCall('/manager/medicines', {
    method: 'GET',
  });
};

export const getManagerMedicineDetails = async (medicineId) => {
  return await makeApiCall(`/manager/medicines/${medicineId}`, {
    method: 'GET',
  });
};

export const createManagerMedicine = async (medicineData) => {
  return await makeApiCall('/manager/medicines', {
    method: 'POST',
    body: JSON.stringify(medicineData),
  });
};

export const updateManagerMedicineStock = async (medicineId, stockData) => {
  return await makeApiCall(`/manager/medicines/${medicineId}/stock`, {
    method: 'PUT',
    body: JSON.stringify(stockData),
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

export const searchPharmacistMedicines = async (query) => {
  return await makeApiCall(`/pharmacist/medicines/search?query=${encodeURIComponent(query)}`, {
    method: 'GET',
  });
};

export const getPharmacistMedicinesByCategory = async (categoryId) => {
  return await makeApiCall(`/pharmacist/medicines/category/${categoryId}`, {
    method: 'GET',
  });
};

export const getPharmacistMedicineDetails = async (medicineId) => {
  return await makeApiCall(`/pharmacist/medicines/${medicineId}`, {
    method: 'GET',
  });
};

export const createPharmacistMedicine = async (medicineData) => {
  return await makeApiCall('/pharmacist/medicines', {
    method: 'POST',
    body: JSON.stringify(medicineData),
  });
};

export const updatePharmacistMedicineStock = async (medicineId, stockData) => {
  return await makeApiCall(`/pharmacist/medicines/${medicineId}/stock`, {
    method: 'PUT',
    body: JSON.stringify(stockData),
  });
};

export const deletePharmacistMedicine = async (medicineId) => {
  return await makeApiCall(`/pharmacist/medicines/${medicineId}`, {
    method: 'DELETE',
  });
};

export const requestPharmacistRestock = async (restockData) => {
  return await makeApiCall('/pharmacist/inventory/request-restock', {
    method: 'POST',
    body: JSON.stringify(restockData),
  });
};

export const markPharmacistLowStock = async (itemData) => {
  return await makeApiCall('/pharmacist/inventory/mark-low-stock', {
    method: 'POST',
    body: JSON.stringify(itemData),
  });
};

export const getPharmacistStockHistory = async () => {
  return await makeApiCall('/pharmacist/inventory/stock-history', {
    method: 'GET',
  });
};

export const createPharmacistSale = async (saleData) => {
  return await makeApiCall('/pharmacist/sales', {
    method: 'POST',
    body: JSON.stringify(saleData),
  });
};

export const getPharmacistSaleReceipt = async (saleId) => {
  return await makeApiCall(`/pharmacist/sales/${saleId}`, {
    method: 'GET',
  });
};

export const getPharmacistLowStockReport = async () => {
  return await makeApiCall('/pharmacist/reports/low-stock', {
    method: 'GET',
  });
};

export const getPharmacistExpiryReport = async () => {
  return await makeApiCall('/pharmacist/reports/expiry', {
    method: 'GET',
  });
};

export const getPharmacistInventorySummary = async () => {
  return await makeApiCall('/pharmacist/reports/inventory-summary', {
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

export const processCashierPayment = async (paymentData) => {
  return await makeApiCall('/cashier/payments/process', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });
};

export const getCashierPaymentHistory = async () => {
  return await makeApiCall('/cashier/payments/history', {
    method: 'GET',
  });
};

export const processCashierRefund = async (refundData) => {
  return await makeApiCall('/cashier/payments/refund', {
    method: 'POST',
    body: JSON.stringify(refundData),
  });
};

export const getCashierPaymentDetail = async (id) => {
  return await makeApiCall(`/cashier/payments/${id}`, {
    method: 'GET',
  });
};

export const acceptCashierPayment = async (id, data) => {
  return await makeApiCall(`/cashier/payments/${id}/accept`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getCashierReceipt = async (id) => {
  return await makeApiCall(`/cashier/receipt/${id}`, {
    method: 'GET',
  });
};

export const getCashierReportSoldMedicines = async () => {
  return await makeApiCall('/cashier/report/sold-medicines', {
    method: 'GET',
  });
};

export const getCashierReturnsReceipts = async () => {
  return await makeApiCall('/cashier/returns/receipts', {
    method: 'GET',
  });
};

export const getCashierReportsReturns = async () => {
  return await makeApiCall('/cashier/reports/returns', {
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
  return await makeApiCall('/cashier/receipt', {
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

export const getCashierNotifications = async () => {
  return await makeApiCall('/cashier/notifications', {
    method: 'GET',
  });
};

export const getCashierTransactions = async () => {
  return await makeApiCall('/cashier/transactions', {
    method: 'GET',
  });
};

export const getCashierTransactionDetails = async (transactionId) => {
  return await makeApiCall(`/cashier/transactions/${transactionId}`, {
    method: 'GET',
  });
};

export const completeCashierTransaction = async (transactionData) => {
  return await makeApiCall('/cashier/transactions/complete', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });
};

export const addCashierPosItem = async (itemData) => {
  return await makeApiCall('/cashier/pos/add-item', {
    method: 'POST',
    body: JSON.stringify(itemData),
  });
};

export const applyCashierPosDiscount = async (discountData) => {
  return await makeApiCall('/cashier/pos/apply-discount', {
    method: 'POST',
    body: JSON.stringify(discountData),
  });
};

export const checkoutCashierPos = async (checkoutData) => {
  return await makeApiCall('/cashier/pos/checkout', {
    method: 'POST',
    body: JSON.stringify(checkoutData),
  });
};

export const getCashierDailySales = async () => {
  return await makeApiCall('/cashier/sales/daily', {
    method: 'GET',
  });
};

export const getCashierSalesSummary = async () => {
  return await makeApiCall('/cashier/sales/summary', {
    method: 'GET',
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
