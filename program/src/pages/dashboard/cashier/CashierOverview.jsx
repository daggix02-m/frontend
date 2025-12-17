import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/ui';
import { ShoppingCart, DollarSign, CreditCard, TrendingUp } from 'lucide-react';
import { cashierService } from '@/services/cashier.service';
import { toast } from 'sonner';

export function CashierOverview() {
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    transactions: 0,
    cardPaymentPercentage: 0,
    avgTransactionValue: 0,
    transactionValueChange: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch receipts data which likely contains sales information
      const receiptsResponse = await cashierService.getReceipts();

      if (receiptsResponse.success) {
        const receipts = Array.isArray(receiptsResponse.data)
          ? receiptsResponse.data
          : receiptsResponse.receipts || [];

        // Calculate metrics from the receipts data
        const todayReceipts = receipts.filter((receipt) => {
          // Assuming receipts have a date field - adjust as needed based on actual API response
          const receiptDate = new Date(receipt.created_at || receipt.createdAt || receipt.date);
          const today = new Date();
          return receiptDate.toDateString() === today.toDateString();
        });

        const totalSales = todayReceipts.reduce(
          (sum, receipt) => sum + (receipt.total || receipt.amount || 0),
          0
        );
        const transactions = todayReceipts.length;
        const cardPayments = todayReceipts.filter(
          (receipt) => receipt.payment_method === 'card' || receipt.paymentMethod === 'card'
        ).length;
        const cardPaymentPercentage =
          transactions > 0 ? Math.round((cardPayments / transactions) * 100) : 0;
        const avgTransactionValue = transactions > 0 ? totalSales / transactions : 0;

        setMetrics({
          totalSales,
          transactions,
          cardPaymentPercentage,
          avgTransactionValue: avgTransactionValue,
          transactionValueChange: 0, // TODO: Calculate from previous period data when backend supports historical data
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data. Using default values.');

      // Set default values in case of error
      setMetrics({
        totalSales: 0,
        transactions: 0,
        cardPaymentPercentage: 0,
        avgTransactionValue: 0,
        transactionValueChange: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
        <h2 className='text-3xl font-bold tracking-tight'>Cashier Dashboard</h2>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
      <h2 className='text-3xl font-bold tracking-tight'>Cashier Dashboard</h2>
      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
            <CardTitle className='text-sm font-medium'>Total Sales</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='text-2xl font-bold'>
              ETB{' '}
              {metrics.totalSales.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className='text-xs text-muted-foreground'>Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
            <CardTitle className='text-sm font-medium'>Transactions</CardTitle>
            <ShoppingCart className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='text-2xl font-bold'>{metrics.transactions}</div>
            <p className='text-xs text-muted-foreground'>Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
            <CardTitle className='text-sm font-medium'>Card Payments</CardTitle>
            <CreditCard className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='text-2xl font-bold'>{metrics.cardPaymentPercentage}%</div>
            <p className='text-xs text-muted-foreground'>Of total transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
            <CardTitle className='text-sm font-medium'>Avg. Transaction Value</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='text-2xl font-bold'>
              ETB{' '}
              {metrics.avgTransactionValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className='text-xs text-muted-foreground'>
              +{metrics.transactionValueChange}% from last week
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
