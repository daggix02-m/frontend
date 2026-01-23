import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Building2,
  DollarSign,
  Activity,
} from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';

// Helper to guarantee numbers only
const getNumber = (value) => (typeof value === 'number' ? value : 0);

export function AdminOverview() {
  const [metrics, setMetrics] = useState({
    totalBranches: 0,
    totalUsers: 0,
    totalSales: 0,
    pendingManagers: 0,
    activatedManagers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          branchesResponse,
          usersResponse,
          salesResponse,
          pendingManagersResponse,
          activatedManagersResponse,
        ] = await Promise.all([
          adminService.getDashboardBranches(),
          adminService.getDashboardUsers(),
          adminService.getDashboardSales(),
          adminService.getPendingManagers(),
          adminService.getActivatedManagers(),
        ]);

        setMetrics({
          totalBranches: getNumber(branchesResponse?.data?.count),
          totalUsers: getNumber(usersResponse?.data?.count),

          // ✅ FIX: explicitly extract numeric value
          totalSales: getNumber(
            salesResponse?.data?.totalSales ??
            salesResponse?.data?.count
          ),

          pendingManagers: Array.isArray(pendingManagersResponse?.data)
            ? pendingManagersResponse.data.length
            : 0,

          activatedManagers: Array.isArray(activatedManagersResponse?.data)
            ? activatedManagersResponse.data.length
            : 0,
        });
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
        setError('Failed to load dashboard data');
        toast.error('Failed to load dashboard data');

        setMetrics({
          totalBranches: 0,
          totalUsers: 0,
          totalSales: 0,
          pendingManagers: 0,
          activatedManagers: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const metricCards = [
    {
      title: 'Total Branches',
      value: metrics.totalBranches,
      icon: Building2,
      color: 'text-blue-600',
    },
    {
      title: 'Total Users',
      value: metrics.totalUsers,
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Total Sales',
      value: metrics.totalSales,
      icon: DollarSign,
      color: 'text-purple-600',
    },
    {
      title: 'Pending Managers',
      value: metrics.pendingManagers,
      icon: Users,
      color: 'text-yellow-600',
    },
    {
      title: 'Activated Managers',
      value: metrics.activatedManagers,
      icon: Activity,
      color: 'text-green-600',
    },
  ];

  if (error) {
    return (
      <div className="space-y-6 p-4 md:p-8">
        <h2 className="text-3xl font-bold text-red-600">
          Error Loading Dashboard
        </h2>
        <p className="text-muted-foreground">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Admin Dashboard
        </h2>
        <p className="text-muted-foreground">
          System-wide overview and management
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {metricCards.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {metric.title}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${metric.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Number(metric.value) || 0}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Backend API connected successfully
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Manage managers and branches from the sidebar
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
