import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/ui';
import { ShoppingCart, DollarSign, CreditCard, TrendingUp } from 'lucide-react';

export function CashierOverview() {
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
            <div className='text-2xl font-bold'>$1,245.50</div>
            <p className='text-xs text-muted-foreground'>Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
            <CardTitle className='text-sm font-medium'>Transactions</CardTitle>
            <ShoppingCart className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='text-2xl font-bold'>84</div>
            <p className='text-xs text-muted-foreground'>Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
            <CardTitle className='text-sm font-medium'>Card Payments</CardTitle>
            <CreditCard className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='text-2xl font-bold'>65%</div>
            <p className='text-xs text-muted-foreground'>Of total transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
            <CardTitle className='text-sm font-medium'>Avg. Transaction Value</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='text-2xl font-bold'>$14.82</div>
            <p className='text-xs text-muted-foreground'>+2% from last week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
