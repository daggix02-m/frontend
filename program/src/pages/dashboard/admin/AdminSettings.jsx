import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input } from '@/components/ui/ui';

export function AdminSettings() {
    return (
        <div className='space-y-6'>
            <div>
                <h2 className='text-3xl font-bold tracking-tight'>Global Settings</h2>
                <p className='text-muted-foreground'>Manage system-wide configurations.</p>
            </div>

            <div className='grid gap-6'>
                <Card>
                    <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                        <CardDescription>Platform details and defaults.</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='grid gap-2'>
                            <label className='text-sm font-medium'>Platform Name</label>
                            <Input defaultValue='PharmaCare SaaS' />
                        </div>
                        <div className='grid gap-2'>
                            <label className='text-sm font-medium'>Support Email</label>
                            <Input defaultValue='support@pharmacare.com' />
                        </div>
                        <Button>Save Changes</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>Password policies and session settings.</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='flex items-center gap-2'>
                            <input type='checkbox' id='mfa' className='rounded border-gray-300' defaultChecked />
                            <label htmlFor='mfa' className='text-sm font-medium'>Enforce MFA for Admins</label>
                        </div>
                        <Button variant='secondary'>Update Security</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
