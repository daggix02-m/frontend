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
  User
} from 'lucide-react';
import { cashierService } from '@/services/cashier.service';
import { toast } from 'sonner';

export function CashierOverview() {
  const [metrics, setMetrics] = useState({
    todaySales: 0,
    totalTransactions: 0,
    avgTransactionValue: 0,
    activeSessions: 0,
    pendingReceipts: 0,
    cashPayments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch cashier dashboard data
        const response = await cashierService.getOverview();

        if (response.success) {
          setMetrics({
            todaySales: response.todaySales || 0,
            totalTransactions: response.totalTransactions || 0,
            avgTransactionValue: response.avgTransactionValue || 0,
            activeSessions: response.activeSessions || 0,
            pendingReceipts: response.pendingReceipts || 0,
            cashPayments: response.cashPayments || 0
          });
        } else {
          // Set default values if API call fails
          setMetrics({
            todaySales: 0,
            totalTransactions: 0,
            avgTransactionValue: 0,
            activeSessions: 0,
            pendingReceipts: 0,
            cashPayments: 0
          });
          toast.error(response.message || 'Failed to load dashboard data');
        }
      } catch (error) {
        console.error('Error fetching cashier dashboard data:', error);
        toast.error('Failed to load dashboard data');
        setMetrics({
          todaySales: 0,
          totalTransactions: 0,
          avgTransactionValue: 0,
          activeSessions: 0,
          pendingReceipts: 0,
          cashPayments: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const metricCards = [
    {
      title: "Today's Sales",
      value: `ETB ${metrics.todaySales.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Total Transactions",
      value: metrics.totalTransactions,
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "Avg. Transaction",
      value: `ETB ${metrics.avgTransactionValue}`,
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Active Sessions",
      value: metrics.activeSessions,
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Cash Payments",
      value: metrics.cashPayments,
      icon: DollarSign,
      color: "text-yellow-600"
    },
    {
      title: "Pending Receipts",
      value: metrics.pendingReceipts,
      icon: Search,
      color: "text-red-600"
    }
  ];

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

          {/* Additional sections would go here */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>Recent transactions will be displayed here.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>Quick action buttons will be displayed here.</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}