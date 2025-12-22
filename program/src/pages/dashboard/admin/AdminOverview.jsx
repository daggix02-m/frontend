import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Building2,
  DollarSign,
  FileText,
  TrendingUp,
  Activity,
  CreditCard,
  LifeBuoy
} from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';

export function AdminOverview() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalPharmacies: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    pendingManagers: 0,
    supportTickets: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch admin dashboard data
        const response = await adminService.getOverview();

        if (response.success) {
          setMetrics({
            totalUsers: response.totalUsers || 0,
            totalPharmacies: response.totalPharmacies || 0,
            totalRevenue: response.totalRevenue || 0,
            activeSubscriptions: response.activeSubscriptions || 0,
            pendingManagers: response.pendingManagers || 0,
            supportTickets: response.supportTickets || 0
          });
        } else {
          // Set default values if API call fails
          setMetrics({
            totalUsers: 0,
            totalPharmacies: 0,
            totalRevenue: 0,
            activeSubscriptions: 0,
            pendingManagers: 0,
            supportTickets: 0
          });
          toast.error(response.message || 'Failed to load dashboard data');
        }
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        toast.error('Failed to load dashboard data');
        setMetrics({
          totalUsers: 0,
          totalPharmacies: 0,
          totalRevenue: 0,
          activeSubscriptions: 0,
          pendingManagers: 0,
          supportTickets: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const metricCards = [
    {
      title: "Total Users",
      value: metrics.totalUsers,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Total Pharmacies",
      value: metrics.totalPharmacies,
      icon: Building2,
      color: "text-green-600"
    },
    {
      title: "Total Revenue",
      value: `ETB ${metrics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Active Subscriptions",
      value: metrics.activeSubscriptions,
      icon: CreditCard,
      color: "text-orange-600"
    },
    {
      title: "Pending Managers",
      value: metrics.pendingManagers,
      icon: Users,
      color: "text-yellow-600"
    },
    {
      title: "Support Tickets",
      value: metrics.supportTickets,
      icon: LifeBuoy,
      color: "text-red-600"
    }
  ];

  return (
    <div className='space-y-6 p-4 md:p-8'>
      <div className='space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Admin Dashboard</h2>
        <p className='text-muted-foreground'>
          System-wide overview and management
        </p>
      </div>

      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
            {metricCards.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index}>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                    <CardTitle className='text-sm font-medium'>{metric.title}</CardTitle>
                    <Icon className={`h-4 w-4 ${metric.color}`} />
                  </CardHeader>
                  <CardContent className='px-6 pb-6'>
                    <div className='text-2xl font-bold'>{metric.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional sections would go here */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>Recent system activity will be displayed here.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>System health metrics will be displayed here.</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}