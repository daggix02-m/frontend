import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/ui';
import { BarChart3, TrendingUp, DollarSign, CreditCard } from 'lucide-react';

export function Reports() {
    return (
        <div className='space-y-6'>
            <div>
                <h2 className='text-3xl font-bold tracking-tight'>Reports & Analytics</h2>
                <p className='text-muted-foreground'>View financial and POS performance reports.</p>
            </div>

            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
                        <DollarSign className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>$45,231.89</div>
                        <p className='text-xs text-muted-foreground'>+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Sales Count</CardTitle>
                        <CreditCard className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>+2350</div>
                        <p className='text-xs text-muted-foreground'>+180.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Average Order Value</CardTitle>
                        <TrendingUp className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>$24.50</div>
                        <p className='text-xs text-muted-foreground'>+19% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Active Sessions</CardTitle>
                        <BarChart3 className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>+573</div>
                        <p className='text-xs text-muted-foreground'>+201 since last hour</p>
                    </CardContent>
                </Card>
            </div>

            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
                <Card className='col-span-4'>
                    <CardHeader>
                        <CardTitle>Revenue Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className='pl-2'>
                        <div className='h-[200px] flex items-center justify-center text-muted-foreground'>
                            Chart Placeholder
                        </div>
                    </CardContent>
                </Card>
                <Card className='col-span-3'>
                    <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='h-[200px] flex items-center justify-center text-muted-foreground'>
                            Pie Chart Placeholder
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
