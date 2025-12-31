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
  Store,
} from 'lucide-react';
import { managerService } from '@/services/manager.service';
import { toast } from 'sonner';

import { LiveSalesDashboard } from '@/components/dashboard/LiveSalesDashboard';
import { QuickActionsCard } from './components/QuickActionsCard';

export function Overview() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    todayRevenue: 0,
    revenueChange: 0,
    totalStaff: 0,
    activeStaff: 0,
    inactiveStaff: 0,
    totalMedicines: 0,
    lowStockCount: 0,
    expiredCount: 0,
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch manager dashboard data
        const response = await managerService.getOverview();

        if (response.success) {
          const data = response.data || response;
          
          setMetrics({
            todayRevenue: data.todayRevenue || data.revenue || 0,
            revenueChange: data.revenueChange || 0,
            totalStaff: data.totalStaff || 0,
            activeStaff: data.activeStaff || 0,
            inactiveStaff: data.inactiveStaff || 0,
            totalMedicines: data.totalMedicines || 0,
            lowStockCount: data.lowStockCount || 0,
            expiredCount: data.expiredCount || 0,
          });

          // Fetch notifications separately
          const notificationsResponse = await managerService.getNotifications();
          if (notificationsResponse.success) {
            const notificationsList = notificationsResponse.data || notificationsResponse.notifications || [];
            setNotifications(Array.isArray(notificationsList) ? notificationsList.slice(0, 5) : []);
          }
        } else {
          // Set defaults for failed response
          setMetrics({
            todayRevenue: 0,
            revenueChange: 0,
            totalStaff: 0,
            activeStaff: 0,
            inactiveStaff: 0,
            totalMedicines: 0,
            lowStockCount: 0,
            expiredCount: 0,
          });
          setError(response.message || 'Failed to load dashboard data');
          toast.error(response.message || 'Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Error fetching manager dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
        
        // Set default values on error
        setMetrics({
          todayRevenue: 0,
          revenueChange: 0,
          totalStaff: 0,
          activeStaff: 0,
          inactiveStaff: 0,
          totalMedicines: 0,
          lowStockCount: 0,
          expiredCount: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleStaffClick = () => {
    navigate('/manager/staff-management');
  };

  const handleMedicinesClick = () => {
    navigate('/manager/inventory-management');
  };

  const handleNotificationsClick = () => {
    navigate('/manager/notifications');
  };

  const metricCards = [
    {
      title: "Today's Revenue",
      value: `ETB ${metrics.todayRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Revenue Change",
      value: `${metrics.revenueChange > 0 ? '+' : ''}${metrics.revenueChange}%`,
      icon: TrendingUp,
      color: metrics.revenueChange >= 0 ? "text-green-600" : "text-red-600"
    },
    {
      title: "Total Staff",
      value: metrics.totalStaff,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Staff",
      value: metrics.activeStaff,
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Total Medicines",
      value: metrics.totalMedicines,
      icon: PackageCheck,
      color: "text-purple-600"
    },
    {
      title: "Low Stock Items",
      value: metrics.lowStockCount,
      icon: FileText,
      color: "text-yellow-600"
    },
    {
      title: "Expired Items",
      value: metrics.expiredCount,
      icon: FileText,
      color: "text-red-600"
    },
  ];

  if (error) {
    return (
      <div className='space-y-6 p-4 md:p-8'>
        <div className='space-y-2'>
          <h2 className='text-3xl font-bold tracking-tight text-red-600'>Error Loading Dashboard</h2>
          <p className='text-muted-foreground'>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 p-4 md:p-8'>
      <div className='space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Manager Dashboard</h2>
        <p className='text-muted-foreground'>
          Overview of your pharmacy operations and key metrics
        </p>
      </div>

      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
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

          {/* Notifications */}
          {notifications.length > 0 && (
            <Card className='mt-4'>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {notifications.map((notification, index) => (
                    <div key={index} className='flex items-start gap-3 p-3 border-b last:border-0'>
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                        notification.type === 'error' ? 'bg-red-100' :
                        notification.type === 'warning' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}></div>
                      <div className='flex-1'>
                        <p className='text-sm font-medium'>{notification.title}</p>
                        <p className='text-xs text-muted-foreground'>{notification.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <QuickActionsCard
            title='Quick Actions'
            actions={[
              {
                label: 'Manage Staff',
                icon: Users,
                onClick: handleStaffClick,
                color: 'bg-blue-50 text-blue-700 border-blue-200'
              },
              {
                label: 'Manage Medicines',
                icon: PackageCheck,
                onClick: handleMedicinesClick,
                color: 'bg-purple-50 text-purple-700 border-purple-200'
              },
              {
                label: 'View Notifications',
                icon: ClipboardCheck,
                onClick: handleNotificationsClick,
                color: notifications.length > 0 ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-gray-50 text-gray-700 border-gray-200'
              },
            ]}
          />

          {/* Live Sales Dashboard */}
          <LiveSalesDashboard />
        </>
      )}
    </div>
  );
}
