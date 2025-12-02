import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DollarSign,
  Users,
  ClipboardCheck,
  TrendingUp,
  FileText,
  PackageCheck,
  Store
} from 'lucide-react';
import { LiveSalesDashboard } from '@/components/dashboard/LiveSalesDashboard';
import { LowStockAlert } from './components/LowStockAlert';
import { NearToExpireAlert } from './components/NearToExpireAlert';
import { QuickActionsCard } from './components/QuickActionsCard';
import { BranchPerformanceCard } from './components/BranchPerformanceCard';

export function Overview() {
  const navigate = useNavigate();

  // Mock data - will be replaced with API calls
  const metrics = {
    todayRevenue: 45230.50,
    revenueChange: 12.5,
    activeStaff: 24,
    pendingApprovals: 7,
    branchHealth: 'Good'
  };

  const pendingStockTransfers = [
    {
      id: 1,
      title: 'Amoxicillin 500mg - 200 units',
      subtitle: 'From Main Branch to Branch A',
      badge: 'Urgent',
      badgeVariant: 'destructive'
    },
    {
      id: 2,
      title: 'Paracetamol Syrup - 150 units',
      subtitle: 'From Main Branch to Branch B',
      badge: 'Pending',
      badgeVariant: 'secondary'
    },
    {
      id: 3,
      title: 'Vitamin C 1000mg - 300 units',
      subtitle: 'From Branch A to Branch B',
      badge: 'Pending',
      badgeVariant: 'secondary'
    }
  ];

  const recentRefunds = [
    {
      id: 1,
      title: 'Refund Request - ETB 450.00',
      subtitle: 'Customer: Abebe Kebede - Expired product',
      badge: 'New',
      badgeVariant: 'default'
    },
    {
      id: 2,
      title: 'Discount Request - 15%',
      subtitle: 'Staff: Tigist Alemu - Bulk purchase',
      badge: 'Review',
      badgeVariant: 'secondary'
    }
  ];

  const branches = [
    {
      id: 1,
      branchName: 'Main Branch',
      location: 'Bole, Addis Ababa',
      revenue: 25430.50,
      salesCount: 156,
      inventoryStatus: 'healthy',
      revenueChange: 8.5
    },
    {
      id: 2,
      branchName: 'Branch A',
      location: 'Piazza, Addis Ababa',
      revenue: 12800.00,
      salesCount: 89,
      inventoryStatus: 'warning',
      revenueChange: -3.2
    },
    {
      id: 3,
      branchName: 'Branch B',
      location: 'Merkato, Addis Ababa',
      revenue: 7000.00,
      salesCount: 45,
      inventoryStatus: 'healthy',
      revenueChange: 15.3
    }
  ];

  const handleStockTransferClick = (item) => {
    navigate('/manager/stock-transfer-approval');
  };

  const handleRefundClick = (item) => {
    navigate('/manager/refunds-discounts');
  };

  const handleBranchClick = (branch) => {
    navigate('/manager/branch-management');
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manager Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your pharmacy operations and key metrics
        </p>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold">ETB {metrics.todayRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+{metrics.revenueChange}%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold">{metrics.activeStaff}</div>
            <p className="text-xs text-muted-foreground">Currently on duty</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold">{metrics.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Require your attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
            <CardTitle className="text-sm font-medium">Branch Health</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold text-green-600">{metrics.branchHealth}</div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActionsCard
          title="Pending Stock Transfers"
          icon={PackageCheck}
          items={pendingStockTransfers}
          emptyMessage="No pending stock transfers"
          onItemClick={handleStockTransferClick}
          onViewAll={() => navigate('/manager/stock-transfer-approval')}
          viewAllText="View All Transfers"
          badgeColor="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
          iconColor="text-blue-700 dark:text-blue-500"
        />

        <QuickActionsCard
          title="Recent Refund Requests"
          icon={FileText}
          items={recentRefunds}
          emptyMessage="No refund requests"
          onItemClick={handleRefundClick}
          onViewAll={() => navigate('/manager/refunds-discounts')}
          viewAllText="View All Requests"
          badgeColor="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
          iconColor="text-purple-700 dark:text-purple-500"
        />
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockAlert />
        <NearToExpireAlert />
      </div>

      {/* Branch Performance Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Branch Performance</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map((branch) => (
            <BranchPerformanceCard
              key={branch.id}
              branchName={branch.branchName}
              location={branch.location}
              revenue={branch.revenue}
              salesCount={branch.salesCount}
              inventoryStatus={branch.inventoryStatus}
              revenueChange={branch.revenueChange}
              onClick={() => handleBranchClick(branch)}
            />
          ))}
        </div>
      </div>

      {/* Live Sales Dashboard */}
      <LiveSalesDashboard />
    </div>
  );
}
