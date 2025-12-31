import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pill,
  ShoppingCart,
  FileText,
  TrendingUp,
  PackagePlus,
  AlertTriangle,
  Clock,
  Users
} from 'lucide-react';
import { pharmacistService } from '@/services/pharmacist.service';
import { toast } from 'sonner';

export function PharmacistOverview() {
  const [metrics, setMetrics] = useState({
    totalMedicines: 0,
    lowStockItems: 0,
    expiredItems: 0,
    todaySales: 0,
    weekSales: 0,
    monthSales: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch pharmacist dashboard data
        const response = await pharmacistService.getOverview();

        if (response.success) {
          const data = response.data || response;
          
          setMetrics({
            totalMedicines: data.totalMedicines || 0,
            lowStockItems: data.lowStockItems || 0,
            expiredItems: data.expiredItems || 0,
            todaySales: data.todaySales || 0,
            weekSales: data.weekSales || 0,
            monthSales: data.monthSales || 0,
          });
        } else {
          // Set defaults for failed response
          setMetrics({
            totalMedicines: 0,
            lowStockItems: 0,
            expiredItems: 0,
            todaySales: 0,
            weekSales: 0,
            monthSales: 0,
          });
          setError(response.message || 'Failed to load dashboard data');
          toast.error(response.message || 'Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Error fetching pharmacist dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
        
        // Set default values on error
        setMetrics({
          totalMedicines: 0,
          lowStockItems: 0,
          expiredItems: 0,
          todaySales: 0,
          weekSales: 0,
          monthSales: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const metricCards = [
    {
      title: "Total Medicines",
      value: metrics.totalMedicines,
      icon: Pill,
      color: "text-blue-600"
    },
    {
      title: "Low Stock Items",
      value: metrics.lowStockItems,
      icon: AlertTriangle,
      color: "text-yellow-600"
    },
    {
      title: "Near Expiry",
      value: metrics.expiredItems,
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Today's Sales",
      value: metrics.todaySales,
      icon: ShoppingCart,
      color: "text-green-600"
    },
    {
      title: "This Week's Sales",
      value: metrics.weekSales,
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      title: "This Month's Sales",
      value: metrics.monthSales,
      icon: PackagePlus,
      color: "text-purple-600"
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
        <h2 className='text-3xl font-bold tracking-tight'>Pharmacist Dashboard</h2>
        <p className='text-muted-foreground'>
          Inventory management and sales processing
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

          {/* Quick Actions */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <button 
                    onClick={() => window.location.href = '/pharmacist/medicines'}
                    className='w-full flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200'
                  >
                    <PackagePlus className='h-5 w-5' />
                    <span className='font-medium'>View All Medicines</span>
                  </button>
                  <button 
                    onClick={() => window.location.href = '/pharmacist/sales/new'}
                    className='w-full flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 border border-green-200'
                  >
                    <ShoppingCart className='h-5 w-5' />
                    <span className='font-medium'>Create New Sale</span>
                  </button>
                  <button 
                    onClick={() => window.location.href = '/pharmacist/reports'}
                    className='w-full flex items-center gap-3 p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 border border-purple-200'
                  >
                    <FileText className='h-5 w-5' />
                    <span className='font-medium'>View Reports</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <div className='h-3 w-3 rounded-full bg-green-500'></div>
                    <span className='text-sm text-muted-foreground'>API Connected</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Users className='h-4 w-4 text-blue-600' />
                    <span className='text-sm text-muted-foreground'>Backend Online</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
