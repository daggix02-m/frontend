import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/ui';
import { Building2, Users, DollarSign, TrendingUp, Activity, Globe } from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';

export function SystemStatistics() {
    const [statsData, setStatsData] = useState({
        totalPharmacies: 0,
        activeUsers: 0,
        monthlyRevenue: 0,
        growthRate: 0,
        uptime: 0,
        countries: 0,
        recentActivity: [],
        topPharmacies: [],
        platformStats: {
            totalTransactions: 0,
            productsManaged: 0,
            prescriptionsFilled: 0,
            supportTickets: 0
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await adminService.getSystemStatistics();

            if (response.success) {
                setStatsData(response.data || {
                    totalPharmacies: 0,
                    activeUsers: 0,
                    monthlyRevenue: 0,
                    growthRate: 0,
                    uptime: 0,
                    countries: 0,
                    recentActivity: [],
                    topPharmacies: [],
                    platformStats: {
                        totalTransactions: 0,
                        productsManaged: 0,
                        prescriptionsFilled: 0,
                        supportTickets: 0
                    }
                });
            } else {
                toast.error('Failed to load system statistics');
            }
        } catch (error) {
            console.error('Error fetching system statistics:', error);
            toast.error('Failed to load system statistics');
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { title: 'Total Pharmacies', value: statsData.totalPharmacies.toLocaleString(), icon: Building2, trend: '+12.5%', color: 'text-blue-600' },
        { title: 'Active Users', value: statsData.activeUsers.toLocaleString(), icon: Users, trend: '+8.2%', color: 'text-green-600' },
        { title: 'Monthly Revenue', value: `ETB ${statsData.monthlyRevenue.toLocaleString()}`, icon: DollarSign, trend: '+15.3%', color: 'text-purple-600' },
        { title: 'Growth Rate', value: `${statsData.growthRate}%`, icon: TrendingUp, trend: '+2.1%', color: 'text-orange-600' },
        { title: 'System Uptime', value: `${statsData.uptime}%`, icon: Activity, trend: '+0.02%', color: 'text-cyan-600' },
        { title: 'Countries', value: statsData.countries.toString(), icon: Globe, trend: '+3', color: 'text-pink-600' },
    ];

    if (loading) {
        return (
            <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
                <h1 className='text-3xl font-bold'>System Statistics</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>System Statistics</h1>
                <p className='text-muted-foreground mt-2'>Platform-wide metrics and analytics</p>
            </div>

            {}
            <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'>
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent className='px-6 pb-6'>
                            <div className='text-3xl font-bold'>{stat.value}</div>
                            <p className='text-xs text-muted-foreground mt-1'>
                                <span className='text-green-600 font-medium'>{stat.trend}</span> from last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className='grid gap-6 grid-cols-1 md:grid-cols-2'>
                {}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            {statsData.recentActivity && statsData.recentActivity.length > 0 ? (
                                statsData.recentActivity.map((activity, index) => (
                                    <div key={index} className='flex items-start justify-between border-b pb-3 last:border-0'>
                                        <div>
                                            <p className='font-medium'>{activity.action}</p>
                                            <p className='text-sm text-muted-foreground'>{activity.pharmacy}</p>
                                        </div>
                                        <p className='text-xs text-muted-foreground'>{activity.time}</p>
                                    </div>
                                ))
                            ) : (
                                <p className='text-sm text-muted-foreground'>No recent activity available</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Pharmacies</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            {statsData.topPharmacies && statsData.topPharmacies.length > 0 ? (
                                statsData.topPharmacies.map((pharmacy, index) => (
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
                                ))
                            ) : (
                                <p className='text-sm text-muted-foreground'>No top pharmacies data available</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {}
            <Card>
                <CardHeader>
                    <CardTitle>Platform Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold'>{statsData.platformStats?.totalTransactions?.toLocaleString() || '0'}</p>
                            <p className='text-sm text-muted-foreground mt-1'>Total Transactions</p>
                        </div>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold'>{statsData.platformStats?.productsManaged?.toLocaleString() || '0'}</p>
                            <p className='text-sm text-muted-foreground mt-1'>Products Managed</p>
                        </div>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold'>{statsData.platformStats?.prescriptionsFilled?.toLocaleString() || '0'}</p>
                            <p className='text-sm text-muted-foreground mt-1'>Prescriptions Filled</p>
                        </div>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold'>{statsData.platformStats?.supportTickets?.toLocaleString() || '0'}</p>
                            <p className='text-sm text-muted-foreground mt-1'>Support Tickets</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
