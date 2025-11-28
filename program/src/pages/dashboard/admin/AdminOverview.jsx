import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/ui';
import { Users, Building2, Activity, AlertTriangle } from 'lucide-react';

export function AdminOverview() {
  return (
    <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
      <h2 className='text-3xl font-bold tracking-tight'>System Administration</h2>
      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='text-2xl font-bold'>1,234</div>
            <p className='text-xs text-muted-foreground'>+180 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Pharmacies</CardTitle>
            <Building2 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>56</div>
            <p className='text-xs text-muted-foreground'>+4 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>System Health</CardTitle>
            <Activity className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>99.9%</div>
            <p className='text-xs text-muted-foreground'>Uptime</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Pending Approvals</CardTitle>
            <AlertTriangle className='h-4 w-4 text-yellow-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>12</div>
            <p className='text-xs text-muted-foreground'>Requires attention</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
