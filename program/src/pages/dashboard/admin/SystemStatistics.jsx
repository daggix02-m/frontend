import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/ui';
import { Building2, Users, DollarSign, TrendingUp, Activity, Globe } from 'lucide-react';

export function SystemStatistics() {
    const stats = [
        { title: 'Total Pharmacies', value: '1,234', icon: Building2, trend: '+12.5%', color: 'text-blue-600' },
        { title: 'Active Users', value: '8,456', icon: Users, trend: '+8.2%', color: 'text-green-600' },
        { title: 'Monthly Revenue', value: '$368,940', icon: DollarSign, trend: '+15.3%', color: 'text-purple-600' },
        { title: 'Growth Rate', value: '23.5%', icon: TrendingUp, trend: '+2.1%', color: 'text-orange-600' },
        { title: 'System Uptime', value: '99.98%', icon: Activity, trend: '+0.02%', color: 'text-cyan-600' },
        { title: 'Countries', value: '45', icon: Globe, trend: '+3', color: 'text-pink-600' },
    ];

    const recentActivity = [
        { action: 'New pharmacy registered', pharmacy: 'Green Valley Pharmacy', time: '5 minutes ago' },
        { action: 'Subscription upgraded', pharmacy: 'City Health Pharmacy', time: '15 minutes ago' },
        { action: 'New user created', pharmacy: 'MediCare Plus', time: '1 hour ago' },
        { action: 'Payment received', pharmacy: 'Wellness Pharmacy', time: '2 hours ago' },
        { action: 'Support ticket resolved', pharmacy: 'HealthFirst Pharmacy', time: '3 hours ago' },
    ];

    const topPharmacies = [
        { name: 'Green Valley Pharmacy', revenue: '$12,450', users: 45, growth: '+18%' },
        { name: 'City Health Pharmacy', revenue: '$10,230', users: 38, growth: '+15%' },
        { name: 'MediCare Plus', revenue: '$9,870', users: 32, growth: '+22%' },
        { name: 'Wellness Pharmacy', revenue: '$8,560', users: 28, growth: '+12%' },
        { name: 'HealthFirst Pharmacy', revenue: '$7,890', users: 25, growth: '+10%' },
    ];

    return (
        <div className='space-y-6 p-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>System Statistics</h1>
                <p className='text-muted-foreground mt-2'>Platform-wide metrics and analytics</p>
            </div>

            {/* Main Stats Grid */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className='text-3xl font-bold'>{stat.value}</div>
                            <p className='text-xs text-muted-foreground mt-1'>
                                <span className='text-green-600 font-medium'>{stat.trend}</span> from last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            {recentActivity.map((activity, index) => (
                                <div key={index} className='flex items-start justify-between border-b pb-3 last:border-0'>
                                    <div>
                                        <p className='font-medium'>{activity.action}</p>
                                        <p className='text-sm text-muted-foreground'>{activity.pharmacy}</p>
                                    </div>
                                    <p className='text-xs text-muted-foreground'>{activity.time}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Performing Pharmacies */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Pharmacies</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            {topPharmacies.map((pharmacy, index) => (
                                <div key={index} className='flex items-center justify-between border-b pb-3 last:border-0'>
                                    <div>
                                        <p className='font-medium'>{pharmacy.name}</p>
                                        <p className='text-sm text-muted-foreground'>{pharmacy.users} active users</p>
                                    </div>
                                    <div className='text-right'>
                                        <p className='font-bold'>{pharmacy.revenue}</p>
                                        <p className='text-xs text-green-600'>{pharmacy.growth}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Usage Statistics */}
            <Card>
                <CardHeader>
                    <CardTitle>Platform Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid gap-4 md:grid-cols-4'>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold'>45,678</p>
                            <p className='text-sm text-muted-foreground mt-1'>Total Transactions</p>
                        </div>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold'>12,345</p>
                            <p className='text-sm text-muted-foreground mt-1'>Products Managed</p>
                        </div>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold'>8,901</p>
                            <p className='text-sm text-muted-foreground mt-1'>Prescriptions Filled</p>
                        </div>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold'>234</p>
                            <p className='text-sm text-muted-foreground mt-1'>Support Tickets</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
