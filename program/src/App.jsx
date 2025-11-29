import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/login';
import { SignupPage } from './pages/auth/signup';
import { ForgotPasswordPage } from './pages/auth/forgot-password';
import { ResetPasswordPage } from './pages/auth/reset-password';
import { ChangePasswordPage } from './pages/auth/change-password';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Overview } from './pages/dashboard/manager/Overview';
import { BranchManagement } from './pages/dashboard/manager/BranchManagement';
import { StaffManagement } from './pages/dashboard/manager/StaffManagement';
import { ImportData } from './pages/dashboard/manager/ImportData';
import { InventoryManagement } from './pages/dashboard/manager/InventoryManagement';
import { Reports } from './pages/dashboard/manager/Reports';
import { Settings } from './pages/dashboard/manager/Settings';
import { Settings as PharmacistSettings } from './pages/dashboard/pharmacist/Settings';
import { Settings as CashierSettings } from './pages/dashboard/cashier/Settings';
import { AdminOverview } from './pages/dashboard/admin/AdminOverview';
import { PharmacyManagement } from './pages/dashboard/admin/PharmacyManagement';
import { SubscriptionManagement } from './pages/dashboard/admin/SubscriptionManagement';
import { AuditLogs } from './pages/dashboard/admin/AuditLogs';
import { AdminSettings } from './pages/dashboard/admin/AdminSettings';
import { PharmacistOverview } from './pages/dashboard/pharmacist/PharmacistOverview';
import { StockTransfers } from './pages/dashboard/pharmacist/StockTransfers';
import { CashierOverview } from './pages/dashboard/cashier/CashierOverview';
import { Sessions } from './pages/dashboard/cashier/Sessions';
import { StockCheck } from './pages/dashboard/cashier/StockCheck';
import { BillingManagement } from './pages/dashboard/admin/BillingManagement';
import { SupportTickets } from './pages/dashboard/admin/SupportTickets';
import { SystemStatistics } from './pages/dashboard/admin/SystemStatistics';
import { PlatformUsers } from './pages/dashboard/admin/PlatformUsers';
import { StockTransferApproval } from './pages/dashboard/manager/StockTransferApproval';
import { RefundsDiscounts } from './pages/dashboard/manager/RefundsDiscounts';
import { ManagerPOSSales } from './pages/dashboard/manager/POSSales';
import { Prescriptions } from './pages/dashboard/pharmacist/Prescriptions';
import { InventoryManagement as PharmacistInventory } from './pages/dashboard/pharmacist/InventoryManagement';
import { BranchReports } from './pages/dashboard/pharmacist/BranchReports';
import { StockReceiving } from './pages/dashboard/pharmacist/StockReceiving';
import { CashierPOSSales } from './pages/dashboard/cashier/POSSales';
import { Receipts } from './pages/dashboard/cashier/Receipts';
import { Notifications } from './pages/dashboard/manager/Notifications';

// Role Protected Route component
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to='/auth/login' replace />;
  }

  const normalizedUserRole = userRole ? userRole.toLowerCase() : '';

  if (allowedRoles && !allowedRoles.includes(normalizedUserRole)) {
    // Redirect to appropriate dashboard based on actual role
    if (normalizedUserRole === 'admin') return <Navigate to='/admin/overview' replace />;
    if (normalizedUserRole === 'manager') return <Navigate to='/manager/overview' replace />;
    if (normalizedUserRole === 'pharmacist') return <Navigate to='/pharmacist/overview' replace />;
    if (normalizedUserRole === 'cashier') return <Navigate to='/cashier/overview' replace />;
    return <Navigate to='/auth/login' replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<LoginPage />} />
        <Route path='/auth/login' element={<LoginPage />} />
        <Route path='/auth/signup' element={<SignupPage />} />
        <Route path='/auth/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/auth/reset-password' element={<ResetPasswordPage />} />
        <Route path='/auth/change-password' element={<ChangePasswordPage />} />

        {/* Admin Routes */}
        <Route
          path='/admin'
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout role='admin' />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Navigate to='/admin/overview' replace />} />
          <Route path='overview' element={<AdminOverview />} />
          <Route path='pharmacies' element={<PharmacyManagement />} />
          <Route path='subscriptions' element={<SubscriptionManagement />} />
          <Route path='audit-logs' element={<AuditLogs />} />
          <Route path='settings' element={<AdminSettings />} />
          <Route path='billing' element={<BillingManagement />} />
          <Route path='support-tickets' element={<SupportTickets />} />
          <Route path='statistics' element={<SystemStatistics />} />
          <Route path='platform-users' element={<PlatformUsers />} />
        </Route>

        {/* Manager Routes */}
        <Route
          path='/manager'
          element={
            <RoleProtectedRoute allowedRoles={['manager']}>
              <DashboardLayout role='manager' />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Navigate to='/manager/overview' replace />} />
          <Route path='overview' element={<Overview />} />
          <Route path='branches' element={<BranchManagement />} />
          <Route path='staff' element={<StaffManagement />} />
          <Route path='inventory' element={<InventoryManagement />} />
          <Route path='reports' element={<Reports />} />
          <Route path='settings' element={<Settings />} />
          <Route path='import' element={<ImportData />} />
          <Route path='stock-transfers' element={<StockTransferApproval />} />
          <Route path='refunds-discounts' element={<RefundsDiscounts />} />
          <Route path='notifications' element={<Notifications />} />
          <Route path='pos-sales' element={<ManagerPOSSales />} />
        </Route>

        {/* Pharmacist Routes */}
        <Route
          path='/pharmacist'
          element={
            <RoleProtectedRoute allowedRoles={['pharmacist']}>
              <DashboardLayout role='pharmacist' />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Navigate to='/pharmacist/overview' replace />} />
          <Route path='overview' element={<PharmacistOverview />} />
          <Route path='inventory' element={<PharmacistInventory />} />
          <Route path='transfers' element={<StockTransfers />} />
          <Route path='prescriptions' element={<Prescriptions />} />
          <Route path='reports' element={<BranchReports />} />
          <Route path='stock-receiving' element={<StockReceiving />} />
          <Route path='settings' element={<PharmacistSettings />} />
        </Route>

        {/* Cashier Routes */}
        <Route
          path='/cashier'
          element={
            <RoleProtectedRoute allowedRoles={['cashier']}>
              <DashboardLayout role='cashier' />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Navigate to='/cashier/overview' replace />} />
          <Route path='overview' element={<CashierOverview />} />
          <Route path='sessions' element={<Sessions />} />
          <Route path='stock' element={<StockCheck />} />
          <Route path='pos-sales' element={<CashierPOSSales />} />
          <Route path='receipts' element={<Receipts />} />
          <Route path='settings' element={<CashierSettings />} />
        </Route>

        {/* Fallback */}
        <Route path='*' element={<Navigate to='/auth/login' replace />} />
      </Routes>
    </Router>
  );
}

export default App;
