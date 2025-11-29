import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui/ui';
import { Clock, DollarSign } from 'lucide-react';

export function Sessions() {
    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div>
                <h2 className='text-3xl font-bold tracking-tight'>Cash Sessions</h2>
                <p className='text-muted-foreground'>Open and close your daily cash sessions.</p>
            </div>

            <div className='grid gap-6 grid-cols-1 md:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <CardTitle>Current Session</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg'>
                            <div className='p-2 bg-green-100 dark:bg-green-800 rounded-full'>
                                <Clock className='h-6 w-6 text-green-600 dark:text-green-200' />
                            </div>
                            <div>
                                <p className='font-medium text-green-800 dark:text-green-200'>Session Active</p>
                                <p className='text-sm text-green-600 dark:text-green-300'>Started at 08:00 AM</p>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <label className='text-sm font-medium'>Closing Cash Amount</label>
                            <div className='relative'>
                                <DollarSign className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                                <Input placeholder='0.00' className='pl-8' />
                            </div>
                        </div>

                        <Button
                            className='w-full'
                            variant='destructive'
                            onClick={() => {
                                if (window.confirm('Are you sure you want to close the current session?')) {
                                    alert('Session closed successfully. Report generated.');
                                }
                            }}
                        >
                            Close Session
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Session History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            <div className='flex justify-between items-center border-b pb-2'>
                                <div>
                                    <p className='font-medium'>Yesterday</p>
                                    <p className='text-xs text-muted-foreground'>08:00 AM - 05:00 PM</p>
                                </div>
                                <div className='text-right'>
                                    <p className='font-medium'>ETB 1,245.50</p>
                                    <p className='text-xs text-green-600'>Balanced</p>
                                </div>
                            </div>
                            <div className='flex justify-between items-center border-b pb-2'>
                                <div>
                                    <p className='font-medium'>Oct 26, 2023</p>
                                    <p className='text-xs text-muted-foreground'>08:00 AM - 05:00 PM</p>
                                </div>
                                <div className='text-right'>
                                    <p className='font-medium'>ETB 980.00</p>
                                    <p className='text-xs text-green-600'>Balanced</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
