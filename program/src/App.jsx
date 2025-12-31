import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/auth/login';
import { SignupPage } from './pages/auth/signup';
import { ForgotPasswordPage } from './pages/auth/forgot-password';
import { ResetPasswordPage } from './pages/auth/reset-password';
import { ChangePasswordPage } from './pages/auth/change-password';
import { VerifyEmailPage } from './pages/auth/verify-email';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Overview } from './pages/dashboard/manager/Overview';
import { StaffManagement } from './pages/dashboard/manager/StaffManagement';
import { ImportData } from './pages/dashboard/manager/ImportData';
import { InventoryManagement } from './pages/dashboard/manager/InventoryManagement';
import { Settings } from './pages/dashboard/manager/Settings';
import { Settings as PharmacistSettings } from './pages/dashboard/pharmacist/Settings';
import { Settings as CashierSettings } from './pages/dashboard/cashier/Settings';
import { AdminOverview } from './pages/dashboard/admin/AdminOverview';
import { AdminSettings } from './pages/dashboard/admin/AdminSettings';
import { PharmacistOverview } from './pages/dashboard/pharmacist/PharmacistOverview';
import { CashierOverview } from './pages/dashboard/cashier/CashierOverview';
import { StockCheck } from './pages/dashboard/cashier/StockCheck';
import { ManagerPOSSales } from './pages/dashboard/manager/POSSales';
import { InventoryManagement as PharmacistInventory } from './pages/dashboard/pharmacist/InventoryManagement';
import { BranchReports } from './pages/dashboard/pharmacist/BranchReports';
import { Receipts } from './pages/dashboard/cashier/Receipts';
import { Notifications } from './pages/dashboard/manager/Notifications';
import { AdminManagers } from './pages/dashboard/admin/AdminManagers';
import { AdminBranches } from './pages/dashboard/admin/AdminBranches';
import { Medicines } from './pages/dashboard/pharmacist/Medicines';
import { SaleCreation } from './pages/dashboard/pharmacist/SaleCreation';
import { Reports } from './pages/dashboard/pharmacist/Reports';
import { PendingPayments } from './pages/dashboard/cashier/PendingPayments';
import { Returns } from './pages/dashboard/cashier/Returns';
import { Transactions } from './pages/dashboard/cashier/Transactions';
import { POSOperations } from './pages/dashboard/cashier/POSOperations';
import { FinancialOperations } from './pages/dashboard/cashier/FinancialOperations';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to='/auth/login' replace />;
  }

  const userRole = user?.role;

  if (user?.must_change_password && window.location.pathname !== '/auth/change-password') {
    return <Navigate to='/auth/change-password' replace />;
  }

  const isAdmin = userRole === 'admin';

  const isAllowed =
    !allowedRoles ||
    allowedRoles.some((role) => {
      if (role === 'admin') {
        return isAdmin;
      }
      return userRole === role;
    });

  if (!isAllowed) {
    if (isAdmin) return <Navigate to='/admin/overview' replace />;
    if (userRole === 'manager') return <Navigate to='/manager/overview' replace />;
    if (userRole === 'pharmacist') return <Navigate to='/pharmacist/overview' replace />;
    if (userRole === 'cashier') return <Navigate to='/cashier/overview' replace />;
    return <Navigate to='/auth/login' replace />;
  }

  return children;
};

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/auth/login' element={<LoginPage />} />
      <Route path='/auth/signup' element={<SignupPage />} />
      <Route path='/auth/forgot-password' element={<ForgotPasswordPage />} />
      <Route path='/auth/reset-password' element={<ResetPasswordPage />} />
      <Route path='/auth/change-password' element={<ChangePasswordPage />} />
      <Route path='/auth/verify-email' element={<VerifyEmailPage />} />

      <Route
        path='/admin'
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<Navigate to='/admin/overview' replace />} />
        <Route path='overview' element={<AdminOverview />} />
        <Route path='settings' element={<AdminSettings />} />
        <Route path='managers' element={<AdminManagers />} />
        <Route path='branches' element={<AdminBranches />} />
      </Route>

      <Route
        path='/manager'
        element={
          <RoleProtectedRoute allowedRoles={['manager']}>
            <DashboardLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<Navigate to='/manager/overview' replace />} />
        <Route path='overview' element={<Overview />} />
        <Route path='staff' element={<StaffManagement />} />
        <Route path='inventory' element={<InventoryManagement />} />
        <Route path='settings' element={<Settings />} />
        <Route path='import' element={<ImportData />} />
        <Route path='notifications' element={<Notifications />} />
        <Route path='pos-sales' element={<ManagerPOSSales />} />
      </Route>

      <Route
        path='/pharmacist'
        element={
          <RoleProtectedRoute allowedRoles={['pharmacist']}>
            <DashboardLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<Navigate to='/pharmacist/overview' replace />} />
        <Route path='overview' element={<PharmacistOverview />} />
        <Route path='inventory' element={<PharmacistInventory />} />
        <Route path='reports' element={<BranchReports />} />
        <Route path='settings' element={<PharmacistSettings />} />
        <Route path='medicines' element={<Medicines />} />
        <Route path='sale' element={<SaleCreation />} />
        <Route path='medicines-reports' element={<Reports />} />
      </Route>

      <Route
        path='/cashier'
        element={
          <RoleProtectedRoute allowedRoles={['cashier']}>
            <DashboardLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<Navigate to='/cashier/overview' replace />} />
        <Route path='overview' element={<CashierOverview />} />
        <Route path='stock' element={<StockCheck />} />
        <Route path='receipts' element={<Receipts />} />
        <Route path='settings' element={<CashierSettings />} />
        <Route path='payments/pending' element={<PendingPayments />} />
        <Route path='returns' element={<Returns />} />
        <Route path='transactions' element={<Transactions />} />
        <Route path='pos' element={<POSOperations />} />
        <Route path='sales' element={<FinancialOperations />} />
      </Route>

      <Route path='*' element={<Navigate to='/auth/login' replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
