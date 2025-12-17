import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, MapPin, Package, DollarSign, ShoppingCart } from 'lucide-react';

export const BranchPerformanceCard = ({
  branchName,
  location,
  revenue,
  salesCount,
  inventoryStatus = 'healthy',
  revenueChange,
  onClick,
}) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'healthy':
        return {
          variant: 'default',
          className:
            'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
          label: 'Healthy',
        };
      case 'warning':
        return {
          variant: 'outline',
          className:
            'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
          label: 'Attention Needed',
        };
      case 'critical':
        return {
          variant: 'destructive',
          className:
            'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
          label: 'Critical',
        };
      default:
        return {
          variant: 'secondary',
          className: '',
          label: 'Unknown',
        };
    }
  };

  const statusConfig = getStatusConfig(inventoryStatus);
  const isPositiveChange = revenueChange >= 0;

  return (
    <Card className='shadow-sm hover:shadow-md transition-shadow cursor-pointer' onClick={onClick}>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='space-y-1'>
            <CardTitle className='text-lg font-semibold'>{branchName}</CardTitle>
            <p className='text-xs text-muted-foreground flex items-center gap-1'>
              <MapPin className='h-3 w-3' />
              {location}
            </p>
          </div>
          <Badge variant={statusConfig.variant} className={statusConfig.className}>
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-1'>
            <div className='flex items-center gap-1 text-muted-foreground'>
              <DollarSign className='h-3 w-3' />
              <p className='text-xs'>Revenue</p>
            </div>
            <p className='text-lg font-bold'>ETB {revenue.toLocaleString()}</p>
            {revenueChange !== undefined && (
              <div
                className={`flex items-center gap-1 text-xs ${isPositiveChange ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
              >
                {isPositiveChange ? (
                  <TrendingUp className='h-3 w-3' />
                ) : (
                  <TrendingDown className='h-3 w-3' />
                )}
                <span>{Math.abs(revenueChange)}% vs yesterday</span>
              </div>
            )}
          </div>
          <div className='space-y-1'>
            <div className='flex items-center gap-1 text-muted-foreground'>
              <ShoppingCart className='h-3 w-3' />
              <p className='text-xs'>Sales</p>
            </div>
            <p className='text-lg font-bold'>{salesCount}</p>
            <p className='text-xs text-muted-foreground'>Transactions</p>
          </div>
        </div>
        <div className='mt-4 pt-4 border-t border-border'>
          <div className='flex items-center justify-between text-xs'>
            <div className='flex items-center gap-1 text-muted-foreground'>
              <Package className='h-3 w-3' />
              <span>Inventory Status</span>
            </div>
            <span
              className={`font-medium ${
                inventoryStatus === 'healthy'
                  ? 'text-green-600 dark:text-green-400'
                  : inventoryStatus === 'warning'
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-red-600 dark:text-red-400'
              }`}
            >
              {statusConfig.label}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
