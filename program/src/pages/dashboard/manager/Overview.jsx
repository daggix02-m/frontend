import React, { useState, useEffect } from 'react';
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
import { managerService } from '@/services/manager.service';
import { toast } from 'sonner';

import { LiveSalesDashboard } from '@/components/dashboard/LiveSalesDashboard';
import { LowStockAlert } from './components/LowStockAlert';
import { NearToExpireAlert } from './components/NearToExpireAlert';
import { QuickActionsCard } from './components/QuickActionsCard';
import { BranchPerformanceCard } from './components/BranchPerformanceCard';
import PendingStockTransfersCard from '@/components/dashboard/PendingStockTransfersCard';

export function Overview() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    todayRevenue: 0,
    revenueChange: 0,
    activeStaff: 0,
    pendingApprovals: 0,
    branchHealth: 'Loading...'
  });
  const [pendingStockTransfers, setPendingStockTransfers] = useState([]);
  const [recentRefunds, setRecentRefunds] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all necessary data in parallel
        const [overviewData, stockTransfersData, branchesData] = await Promise.allSettled([
          managerService.getOverview(),
          managerService.getStockTransfers(),
          managerService.getBranches()
        ]);

        if (overviewData.status === 'fulfilled' && overviewData.value.success) {
          setMetrics({
            todayRevenue: overviewData.value.revenue || overviewData.value.todayRevenue || 0,
            revenueChange: overviewData.value.revenueChange || 0,
            activeStaff: overviewData.value.activeStaff || 0,
            pendingApprovals: overviewData.value.pendingApprovals || 0,
            branchHealth: overviewData.value.branchHealth || 'Good'
          });
        } else {
          // Set defaults for failed response
          setMetrics({
            todayRevenue: 0,
            revenueChange: 0,
            activeStaff: 0,
            pendingApprovals: 0,
            branchHealth: 'Good'
          });
        }

        if (stockTransfersData.status === 'fulfilled' && stockTransfersData.value.success) {
          // Format stock transfers data to match the expected structure
          const transfers = stockTransfersData.value.data || stockTransfersData.value;

          const formattedTransfers = Array.isArray(transfers)
            ? transfers.map(transfer => ({
              id: transfer.id || transfer._id,
              title: `${transfer.productName || transfer.name || ''} - ${transfer.quantity || 0} units`,
              subtitle: `From ${transfer.sourceBranch || 'Unknown'} to ${transfer.destinationBranch || 'Unknown'}`,
              badge: transfer.status === 'urgent' ? 'Urgent' : transfer.status || 'Pending',
              badgeVariant: transfer.status === 'urgent' ? 'destructive' : 'secondary'
            })).slice(0, 3) // Limit to 3 for the dashboard
            : [];

          setPendingStockTransfers(formattedTransfers);
        }

        if (branchesData.status === 'fulfilled' && branchesData.value.success) {
          // Format branches data to match the expected structure
          const branchesList = branchesData.value.data || branchesData.value;

          const formattedBranches = Array.isArray(branchesList)
            ? branchesList.map(branch => ({
              id: branch.id || branch._id,
              branchName: branch.name || branch.branchName || 'Unknown',
              location: branch.address || branch.location || 'Unknown',
              revenue: branch.revenue || 0,
              salesCount: branch.salesCount || branch.saleCount || 0,
              inventoryStatus: branch.inventoryStatus || 'healthy',
              revenueChange: branch.revenueChange || 0
            })).slice(0, 3) // Limit to 3 for the dashboard
            : [];

          setBranches(formattedBranches);
        }

        // Fetch refunds data
        const refundsResponse = await managerService.getRefunds({ limit: 2 });
        if (refundsResponse && refundsResponse.success) {
          const refunds = refundsResponse.data || refundsResponse.refunds || [];
          const formattedRefunds = Array.isArray(refunds)
            ? refunds.map(refund => ({
              id: refund.id || refund._id,
              title: `${refund.type === 'refund' ? 'Refund' : 'Discount'} Request - ETB ${refund.amount || 0}`,
              subtitle: `${refund.customer || 'Customer'} - ${refund.reason || 'No reason'}`,
              badge: refund.status || 'New',
              badgeVariant: refund.status === 'new' ? 'default' : 'secondary'
            })).slice(0, 2)
            : [];
          setRecentRefunds(formattedRefunds);
        } else {
          setRecentRefunds([]);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data.');

        // Set default values in case of error
        setMetrics({
          todayRevenue: 0,
          revenueChange: 0,
          activeStaff: 0,
          pendingApprovals: 0,
          branchHealth: 'Good'
        });
        setPendingStockTransfers([]);
        setBranches([]);
        setRecentRefunds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      { }
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manager Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your pharmacy operations and key metrics
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          { }
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
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

            {/* Pending Stock Transfers Card */}
            <PendingStockTransfersCard />
          </div>

          { }
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

          { }
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LowStockAlert />
            <NearToExpireAlert />
          </div>

          { }
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

          { }
          <LiveSalesDashboard />
        </>
      )}
    </div>
  );
}
