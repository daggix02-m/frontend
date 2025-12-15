import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/ui';
import { TrendingUp, Package, FileText, DollarSign, ShoppingCart, Users } from 'lucide-react';
import { pharmacistService } from '@/services/pharmacist.service';
import { toast } from 'sonner';

export function BranchReports() {
    const [reportData, setReportData] = useState({
        stats: [],
        topProducts: [],
        salesByCategory: [],
        inventorySummary: {},
        prescriptionStats: {}
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await pharmacistService.getReports();

            if (response.success) {
                setReportData(response.data || {
                    stats: [],
                    topProducts: [],
                    salesByCategory: [],
                    inventorySummary: {},
                    prescriptionStats: {}
                });
            } else {
                toast.error('Failed to load reports');
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
            toast.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    // Default empty values for when data is not loaded
    const stats = [
        { title: 'Daily Sales', value: reportData.stats?.dailySales || 'ETB 0', icon: DollarSign, trend: reportData.stats?.dailySalesTrend || '0%', color: 'text-green-600' },
        { title: 'Transactions', value: reportData.stats?.transactions || '0', icon: ShoppingCart, trend: reportData.stats?.transactionsTrend || '0%', color: 'text-blue-600' },
        { title: 'Prescriptions Filled', value: reportData.stats?.prescriptionsFilled || '0', icon: FileText, trend: reportData.stats?.prescriptionsTrend || '0%', color: 'text-purple-600' },
        { title: 'Products Sold', value: reportData.stats?.productsSold || '0', icon: Package, trend: reportData.stats?.productsTrend || '0%', color: 'text-orange-600' },
        { title: 'Customers Served', value: reportData.stats?.customersServed || '0', icon: Users, trend: reportData.stats?.customersTrend || '0%', color: 'text-cyan-600' },
        { title: 'Avg Transaction', value: reportData.stats?.avgTransaction || 'ETB 0', icon: TrendingUp, trend: reportData.stats?.avgTransactionTrend || '0%', color: 'text-pink-600' },
    ];

    const topProducts = reportData.topProducts || [];

    const salesByCategory = reportData.salesByCategory || [];

    if (loading) {
        return (
            <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
                <h1 className='text-3xl font-bold'>Branch Reports</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Branch Reports</h1>
                <p className='text-muted-foreground mt-2'>View branch-level sales and inventory reports</p>
            </div>

            {/* Stats Cards */}
            <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'>
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent className='px-6 pb-6'>
                            <div className='text-2xl font-bold'>{stat.value}</div>
                            <p className='text-xs text-muted-foreground mt-1'>
                                <span className='text-green-600 font-medium'>{stat.trend}</span> from yesterday
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className='grid gap-6 grid-cols-1 md:grid-cols-2'>
                {/* Top Selling Products */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Selling Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-3'>
                            {topProducts.length > 0 ? (
                                topProducts.map((product, index) => (
                                    <div key={index} className='flex items-center justify-between border-b pb-2 last:border-0'>
                                        <div>
                                            <p className='font-medium'>{product.name}</p>
                                            <p className='text-sm text-muted-foreground'>{product.sold} units sold</p>
                                        </div>
                                        <p className='font-bold'>{product.revenue}</p>
                                    </div>
                                ))
                            ) : (
                                <p className='text-sm text-muted-foreground'>No data available</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Sales by Category */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-3'>
                            {salesByCategory.length > 0 ? (
                                salesByCategory.map((item, index) => (
                                    <div key={index} className='space-y-1'>
                                        <div className='flex items-center justify-between'>
                                            <span className='text-sm font-medium'>{item.category}</span>
                                            <span className='text-sm font-bold'>{item.sales}</span>
                                        </div>
                                        <div className='w-full bg-gray-200 rounded-full h-2'>
                                            <div
                                                className='bg-blue-600 h-2 rounded-full'
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                        <p className='text-xs text-muted-foreground'>{item.percentage}% of total sales</p>
                                    </div>
                                ))
                            ) : (
                                <p className='text-sm text-muted-foreground'>No data available</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Inventory Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold'>{reportData.inventorySummary?.totalProducts || '0'}</p>
                            <p className='text-sm text-muted-foreground mt-1'>Total Products</p>
                        </div>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold text-orange-600'>{reportData.inventorySummary?.lowStock || '0'}</p>
                            <p className='text-sm text-muted-foreground mt-1'>Low Stock</p>
                        </div>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold text-red-600'>{reportData.inventorySummary?.expiringSoon || '0'}</p>
                            <p className='text-sm text-muted-foreground mt-1'>Expiring Soon</p>
                        </div>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold'>{reportData.inventorySummary?.inventoryValue || 'ETB 0'}</p>
                            <p className='text-sm text-muted-foreground mt-1'>Inventory Value</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Prescription Statistics */}
            <Card>
                <CardHeader>
                    <CardTitle>Prescription Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold'>{reportData.prescriptionStats?.filledToday || '0'}</p>
                            <p className='text-sm text-muted-foreground mt-1'>Filled Today</p>
                        </div>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold'>{reportData.prescriptionStats?.pendingValidation || '0'}</p>
                            <p className='text-sm text-muted-foreground mt-1'>Pending Validation</p>
                        </div>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold'>{reportData.prescriptionStats?.flaggedForReview || '0'}</p>
                            <p className='text-sm text-muted-foreground mt-1'>Flagged for Review</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
