import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/ui';
import { Building2, Users, DollarSign, Activity } from 'lucide-react';

export function Overview() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1% from last month',
      icon: DollarSign,
    },
    {
      title: 'Active Branches',
      value: '3',
      change: '+1 from last month',
      icon: Building2,
    },
    {
      title: 'Total Staff',
      value: '12',
      change: '+2 from last month',
      icon: Users,
    },
    {
      title: 'Active Now',
      value: '5',
      change: '+2 since last hour',
      icon: Activity,
    },
  ];

  return (
    <div className='space-y-6'>
      <h2 className='text-3xl font-bold tracking-tight'>Dashboard Overview</h2>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                <Icon className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stat.value}</div>
                <p className='text-xs text-muted-foreground'>{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-8'>
              <div className='flex items-center'>
                <div className='ml-4 space-y-1'>
                  <p className='text-sm font-medium leading-none'>Olivia Martin</p>
                  <p className='text-sm text-muted-foreground'>olivia.martin@email.com</p>
                </div>
                <div className='ml-auto font-medium'>+$1,999.00</div>
              </div>
              <div className='flex items-center'>
                <div className='ml-4 space-y-1'>
                  <p className='text-sm font-medium leading-none'>Jackson Lee</p>
                  <p className='text-sm text-muted-foreground'>jackson.lee@email.com</p>
                </div>
                <div className='ml-auto font-medium'>+$39.00</div>
              </div>
              <div className='flex items-center'>
                <div className='ml-4 space-y-1'>
                  <p className='text-sm font-medium leading-none'>Isabella Nguyen</p>
                  <p className='text-sm text-muted-foreground'>isabella.nguyen@email.com</p>
                </div>
                <div className='ml-auto font-medium'>+$299.00</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-8'>
              <div className='flex items-center'>
                <div className='ml-4 space-y-1'>
                  <p className='text-sm font-medium leading-none'>Paracetamol 500mg</p>
                  <p className='text-sm text-muted-foreground'>120 units sold</p>
                </div>
                <div className='ml-auto font-medium'>$600.00</div>
              </div>
              <div className='flex items-center'>
                <div className='ml-4 space-y-1'>
                  <p className='text-sm font-medium leading-none'>Amoxicillin 250mg</p>
                  <p className='text-sm text-muted-foreground'>85 units sold</p>
                </div>
                <div className='ml-auto font-medium'>$425.00</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
