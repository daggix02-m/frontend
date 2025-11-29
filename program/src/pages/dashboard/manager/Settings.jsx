import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input } from '@/components/ui/ui';

export function Settings() {
    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div>
                <h2 className='text-3xl font-bold tracking-tight'>Settings</h2>
                <p className='text-muted-foreground'>Manage pharmacy configuration and subscription.</p>
            </div>

            <div className='grid gap-6 grid-cols-1'>
                <Card>
                    <CardHeader>
                        <CardTitle>Pharmacy Profile</CardTitle>
                        <CardDescription>Update your pharmacy details.</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='grid gap-2'>
                            <label className='text-sm font-medium'>Pharmacy Name</label>
                            <Input defaultValue='My Pharmacy' />
                        </div>
                        <div className='grid gap-2'>
                            <label className='text-sm font-medium'>Contact Email</label>
                            <Input defaultValue='contact@mypharmacy.com' />
                        </div>
                        <Button>Save Changes</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Subscription</CardTitle>
                        <CardDescription>Manage your current plan.</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='flex items-center justify-between p-4 border rounded-lg'>
                            <div>
                                <p className='font-medium'>Pro Plan</p>
                                <p className='text-sm text-muted-foreground'>ETB 79/month</p>
                            </div>
                            <Button variant='outline'>Upgrade</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Refunds & Discounts</CardTitle>
                        <CardDescription>Configure policies for returns and discounts.</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='flex items-center gap-2'>
                            <input type='checkbox' id='allow-refunds' className='rounded border-gray-300' defaultChecked />
                            <label htmlFor='allow-refunds' className='text-sm font-medium'>Allow Cashiers to process refunds</label>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type='checkbox' id='allow-discounts' className='rounded border-gray-300' />
                            <label htmlFor='allow-discounts' className='text-sm font-medium'>Allow Cashiers to apply discounts</label>
                        </div>
                        <Button variant='secondary'>Update Policies</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
