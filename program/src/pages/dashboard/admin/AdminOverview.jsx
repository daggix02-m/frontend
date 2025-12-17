import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, CreditCard, Activity } from 'lucide-react';
import { LiveSalesDashboard } from '@/components/dashboard/LiveSalesDashboard';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';

export function AdminOverview() {
  const [metrics, setMetrics] = useState({
    totalPharmacies: 0,
    activeSubscriptions: 0,
    pendingApprovals: 0,
    systemHealth: 'Good',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getOverview();

      if (response.success) {
        const data = response.data || response;
        setMetrics({
          totalPharmacies: data.totalPharmacies || data.total_pharmacies || 0,
          activeSubscriptions: data.activeSubscriptions || data.active_subscriptions || 0,
          pendingApprovals: data.pendingApprovals || data.pending_approvals || 0,
          systemHealth: data.systemHealth || data.system_health || 'Good',
        });
      }
    } catch (error) {
      console.error('Error fetching admin overview:', error);
      toast.error('Failed to load overview data');
      setMetrics({
        totalPharmacies: 0,
        activeSubscriptions: 0,
        pendingApprovals: 0,
        systemHealth: 'Unknown',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
        <h2 className='text-3xl font-bold tracking-tight'>System Overview</h2>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 p-4 sm:p-6'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>System Overview</h2>
        <p className='text-muted-foreground'>Platform-wide metrics and system health</p>
      </div>

      {/* Metrics Cards */}
      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
            <CardTitle className='text-sm font-medium'>Total Pharmacies</CardTitle>
            <Building2 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='text-2xl font-bold'>{metrics.totalPharmacies}</div>
            <p className='text-xs text-muted-foreground'>Registered on platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
            <CardTitle className='text-sm font-medium'>Active Subscriptions</CardTitle>
            <CreditCard className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='text-2xl font-bold'>{metrics.activeSubscriptions}</div>
            <p className='text-xs text-muted-foreground'>Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
            <CardTitle className='text-sm font-medium'>Pending Approvals</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='text-2xl font-bold'>{metrics.pendingApprovals}</div>
            <p className='text-xs text-muted-foreground'>Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
            <CardTitle className='text-sm font-medium'>System Health</CardTitle>
            <Activity className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='text-2xl font-bold text-green-600'>{metrics.systemHealth}</div>
            <p className='text-xs text-muted-foreground'>Overall status</p>
          </CardContent>
        </Card>
      </div>

      {/* Live Sales Dashboard */}
      <LiveSalesDashboard />
    </div>
  );
}
