import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ShoppingCart,
  DollarSign,
  Clock,
  Search,
  TrendingUp,
  Package,
  CreditCard,
} from 'lucide-react';
import { cashierService } from '@/services/cashier.service';
import { toast } from 'sonner';

export function CashierOverview() {
  const [metrics, setMetrics] = useState({
    todaySales: 0,
    totalPayments: 0,
    totalReturns: 0,
    avgTransactionValue: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch cashier dashboard data
        const response = await cashierService.getOverview();

        if (response.success) {
          const data = response.data || response;
          
          setMetrics({
            todaySales: data.todaySales || 0,
            totalPayments: data.totalPayments || 0,
            totalReturns: data.totalReturns || 0,
            avgTransactionValue: data.avgTransactionValue || 0,
            pendingPayments: data.pendingPayments || 0,
          });
        } else {
          // Set defaults for failed response
          setMetrics({
            todaySales: 0,
            totalPayments: 0,
            totalReturns: 0,
            avgTransactionValue: 0,
            pendingPayments: 0,
          });
          setError(response.message || 'Failed to load dashboard data');
          toast.error(response.message || 'Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Error fetching cashier dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
        
        // Set default values on error
        setMetrics({
          todaySales: 0,
          totalPayments: 0,
          totalReturns: 0,
          avgTransactionValue: 0,
          pendingPayments: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handlePaymentsClick = () => {
    window.location.href = '/cashier/payments';
  };

  const handleReceiptsClick = () => {
    window.location.href = '/cashier/receipts';
  };

  const handleReturnsClick = () => {
    window.location.href = '/cashier/returns';
  };

  const metricCards = [
    {
      title: "Today's Sales",
      value: `ETB ${metrics.todaySales.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Total Payments",
      value: metrics.totalPayments,
      icon: CreditCard,
      color: "text-blue-600"
    },
    {
      title: "Total Returns",
      value: metrics.totalReturns,
      icon: Package,
      color: "text-orange-600"
    },
    {
      title: "Avg. Transaction",
      value: `ETB ${metrics.avgTransactionValue.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Pending Payments",
      value: metrics.pendingPayments,
      icon: Clock,
      color: "text-yellow-600"
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
        <h2 className='text-3xl font-bold tracking-tight'>Cashier Dashboard</h2>
        <p className='text-muted-foreground'>
          Sales processing and transaction management
        </p>
      </div>

      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
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
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-4'>
            <button 
              onClick={handlePaymentsClick}
              className='flex flex-col items-center gap-3 p-6 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200'
            >
              <CreditCard className='h-8 w-8' />
              <span className='font-medium'>Process Payments</span>
              <span className='text-sm text-blue-600'>{metrics.pendingPayments} pending</span>
            </button>
            <button 
              onClick={handleReceiptsClick}
              className='flex flex-col items-center gap-3 p-6 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 border border-green-200'
            >
              <Search className='h-8 w-8' />
              <span className='font-medium'>View Receipts</span>
            </button>
            <button 
              onClick={handleReturnsClick}
              className='flex flex-col items-center gap-3 p-6 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 border border-orange-200'
            >
              <Package className='h-8 w-8' />
              <span className='font-medium'>Process Returns</span>
            </button>
          </div>

          {/* System Status */}
          <Card className='mt-4'>
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
                  <ShoppingCart className='h-4 w-4 text-blue-600' />
                  <span className='text-sm text-muted-foreground'>Backend Online</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
