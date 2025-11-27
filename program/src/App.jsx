import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/login';
import { SignupPage } from './pages/auth/signup';
import { ForgotPasswordPage } from './pages/auth/forgot-password';
import { ResetPasswordPage } from './pages/auth/reset-password';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Overview } from './pages/dashboard/manager/Overview';
import { BranchManagement } from './pages/dashboard/manager/BranchManagement';
import { StaffManagement } from './pages/dashboard/manager/StaffManagement';
import { AdminOverview } from './pages/dashboard/admin/AdminOverview';
import { PharmacistOverview } from './pages/dashboard/pharmacist/PharmacistOverview';
import { CashierOverview } from './pages/dashboard/cashier/CashierOverview';

// Role Protected Route component
const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('userRole'); // Assuming we store role in localStorage on login

    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on actual role
        if (userRole === 'admin') return <Navigate to="/admin/overview" replace />;
        if (userRole === 'manager') return <Navigate to="/manager/overview" replace />;
        if (userRole === 'pharmacist') return <Navigate to="/pharmacist/overview" replace />;
        if (userRole === 'cashier') return <Navigate to="/cashier/overview" replace />;
        return <Navigate to="/auth/login" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/signup" element={<SignupPage />} />
                <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <RoleProtectedRoute allowedRoles={['admin']}>
                            <DashboardLayout role="admin" />
                        </RoleProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/admin/overview" replace />} />
                    <Route path="overview" element={<AdminOverview />} />
                    {/* Add other admin routes here */}
                </Route>

                {/* Manager Routes */}
                <Route
                    path="/manager"
                    element={
                        <RoleProtectedRoute allowedRoles={['manager']}>
                            <DashboardLayout role="manager" />
                        </RoleProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/manager/overview" replace />} />
                    <Route path="overview" element={<Overview />} />
                    <Route path="branches" element={<BranchManagement />} />
                    <Route path="staff" element={<StaffManagement />} />
                </Route>

                {/* Pharmacist Routes */}
                <Route
                    path="/pharmacist"
                    element={
                        <RoleProtectedRoute allowedRoles={['pharmacist']}>
                            <DashboardLayout role="pharmacist" />
                        </RoleProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/pharmacist/overview" replace />} />
                    <Route path="overview" element={<PharmacistOverview />} />
                    {/* Add other pharmacist routes here */}
                </Route>

                {/* Cashier Routes */}
                <Route
                    path="/cashier"
                    element={
                        <RoleProtectedRoute allowedRoles={['cashier']}>
                            <DashboardLayout role="cashier" />
                        </RoleProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/cashier/overview" replace />} />
                    <Route path="overview" element={<CashierOverview />} />
                    {/* Add other cashier routes here */}
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/auth/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
