import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input } from '@/components/ui/ui';
import { Select } from '@/components/ui/select';
import { Percent, DollarSign, Tag, Settings } from 'lucide-react';

export function RefundsDiscounts() {
    const [refundPolicy, setRefundPolicy] = useState({
        enabled: true,
        maxDays: 30,
        requireReceipt: true,
        requireApproval: true,
    });

    const [discountRules] = useState([
        { id: 1, name: 'Senior Citizen Discount', type: 'percentage', value: 10, active: true },
        { id: 2, name: 'Bulk Purchase (10+ items)', type: 'percentage', value: 5, active: true },
        { id: 3, name: 'Loyalty Program', type: 'percentage', value: 15, active: true },
        { id: 4, name: 'Seasonal Promotion', type: 'fixed', value: 50, active: false },
    ]);

    const stats = [
        { title: 'Active Discounts', value: '12', icon: Tag, color: 'text-blue-600' },
        { title: 'Total Savings', value: '$8,450', icon: DollarSign, color: 'text-green-600' },
        { title: 'Avg Discount', value: '8.5%', icon: Percent, color: 'text-purple-600' },
        { title: 'Refunds This Month', value: '23', icon: Settings, color: 'text-orange-600' },
    ];

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Refunds & Discounts</h1>
                <p className='text-muted-foreground mt-2'>Configure refund policies and discount rules</p>
            </div>

            {/* Stats Grid */}
            <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent className='px-6 pb-6'>
                            <div className='text-2xl font-bold'>{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className='grid gap-6 grid-cols-1 md:grid-cols-2'>
                {/* Refund Policy */}
                <Card>
                    <CardHeader>
                        <CardTitle>Refund Policy Settings</CardTitle>
                        <CardDescription>Configure your pharmacy's refund policy</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <label className='text-sm font-medium'>Enable Refunds</label>
                            <input
                                type='checkbox'
                                checked={refundPolicy.enabled}
                                onChange={(e) => setRefundPolicy({ ...refundPolicy, enabled: e.target.checked })}
                                className='h-4 w-4'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium'>Refund Window (Days)</label>
                            <Input
                                type='number'
                                value={refundPolicy.maxDays}
                                onChange={(e) => setRefundPolicy({ ...refundPolicy, maxDays: e.target.value })}
                            />
                        </div>
                        <div className='flex items-center justify-between'>
                            <label className='text-sm font-medium'>Require Receipt</label>
                            <input
                                type='checkbox'
                                checked={refundPolicy.requireReceipt}
                                onChange={(e) => setRefundPolicy({ ...refundPolicy, requireReceipt: e.target.checked })}
                                className='h-4 w-4'
                            />
                        </div>
                        <div className='flex items-center justify-between'>
                            <label className='text-sm font-medium'>Require Manager Approval</label>
                            <input
                                type='checkbox'
                                checked={refundPolicy.requireApproval}
                                onChange={(e) => setRefundPolicy({ ...refundPolicy, requireApproval: e.target.checked })}
                                className='h-4 w-4'
                            />
                        </div>
                        <Button className='w-full'>Save Refund Policy</Button>
                    </CardContent>
                </Card>

                {/* Create Discount */}
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Discount</CardTitle>
                        <CardDescription>Add a new discount rule</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium'>Discount Name</label>
                            <Input placeholder='e.g., Student Discount' />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium'>Discount Type</label>
                            <Select>
                                <option value='percentage'>Percentage</option>
                                <option value='fixed'>Fixed Amount</option>
                            </Select>
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium'>Discount Value</label>
                            <Input type='number' placeholder='10' />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium'>Applies To</label>
                            <Select>
                                <option value='all'>All Products</option>
                                <option value='category'>Specific Category</option>
                                <option value='product'>Specific Product</option>
                            </Select>
                        </div>
                        <Button className='w-full'>Create Discount</Button>
                    </CardContent>
                </Card>
            </div>

            {/* Active Discount Rules */}
            <Card>
                <CardHeader>
                    <CardTitle>Active Discount Rules</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-3'>
                        {discountRules.map((rule) => (
                            <div key={rule.id} className='flex items-center justify-between border-b pb-3 last:border-0'>
                                <div>
                                    <p className='font-medium'>{rule.name}</p>
                                    <p className='text-sm text-muted-foreground'>
                                        {rule.type === 'percentage' ? `${rule.value}% off` : `$${rule.value} off`}
                                    </p>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <span className={`text-sm ${rule.active ? 'text-green-600' : 'text-gray-400'}`}>
                                        {rule.active ? 'Active' : 'Inactive'}
                                    </span>
                                    <Button size='sm' variant='outline'>
                                        Edit
                                    </Button>
                                    <Button size='sm' variant='outline'>
                                        {rule.active ? 'Deactivate' : 'Activate'}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Approval Thresholds */}
            <Card>
                <CardHeader>
                    <CardTitle>Approval Thresholds</CardTitle>
                    <CardDescription>Set limits for automatic approval</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium'>Max Refund Amount (Auto-Approve)</label>
                            <Input type='number' placeholder='100' />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium'>Max Discount % (Auto-Apply)</label>
                            <Input type='number' placeholder='20' />
                        </div>
                    </div>
                    <Button>Update Thresholds</Button>
                </CardContent>
            </Card>
        </div>
    );
}
