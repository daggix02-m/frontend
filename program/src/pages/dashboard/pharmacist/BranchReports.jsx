import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/ui';
import { TrendingUp, Package, FileText, DollarSign, ShoppingCart, Users } from 'lucide-react';

export function BranchReports() {
    const stats = [
        { title: 'Daily Sales', value: 'ETB 2,450', icon: DollarSign, trend: '+12.5%', color: 'text-green-600' },
        { title: 'Transactions', value: '145', icon: ShoppingCart, trend: '+8.2%', color: 'text-blue-600' },
        { title: 'Prescriptions Filled', value: '89', icon: FileText, trend: '+15.3%', color: 'text-purple-600' },
        { title: 'Products Sold', value: '456', icon: Package, trend: '+10.1%', color: 'text-orange-600' },
        { title: 'Customers Served', value: '132', icon: Users, trend: '+7.8%', color: 'text-cyan-600' },
        { title: 'Avg Transaction', value: 'ETB 16.90', icon: TrendingUp, trend: '+3.2%', color: 'text-pink-600' },
    ];

    const topProducts = [
        { name: 'Paracetamol 500mg', sold: 145, revenue: 'ETB 869.55' },
        { name: 'Amoxicillin 250mg', sold: 89, revenue: 'ETB 1,112.50' },
        { name: 'Ibuprofen 400mg', sold: 76, revenue: 'ETB 683.24' },
        { name: 'Vitamin C 1000mg', sold: 54, revenue: 'ETB 863.46' },
        { name: 'Aspirin 100mg', sold: 48, revenue: 'ETB 216.00' },
    ];

    const salesByCategory = [
        { category: 'Pain Relief', sales: 'ETB 1,245', percentage: 28 },
        { category: 'Antibiotics', sales: 'ETB 1,112', percentage: 25 },
        { category: 'Supplements', sales: 'ETB 863', percentage: 19 },
        { category: 'Cardiovascular', sales: 'ETB 654', percentage: 15 },
        { category: 'Other', sales: 'ETB 576', percentage: 13 },
    ];

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Branch Reports</h1>
                <p className='text-muted-foreground mt-2'>View branch-level sales and inventory reports</p>
            </div>

            {/* Main Stats Grid */}
            <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'>
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                            <stat.icon className={`h - 5 w - 5 ${stat.color} `} />
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
                            {topProducts.map((product, index) => (
                                <div key={index} className='flex items-center justify-between border-b pb-2 last:border-0'>
                                    <div>
                                        <p className='font-medium'>{product.name}</p>
                                        <p className='text-sm text-muted-foreground'>{product.sold} units sold</p>
                                    </div>
                                    <p className='font-bold'>{product.revenue}</p>
                                </div>
                            ))}
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
                            {salesByCategory.map((item, index) => (
                                <div key={index} className='space-y-1'>
                                    <div className='flex items-center justify-between'>
                                        <span className='text-sm font-medium'>{item.category}</span>
                                        <span className='text-sm font-bold'>{item.sales}</span>
                                    </div>
                                    <div className='w-full bg-gray-200 rounded-full h-2'>
                                        <div
                                            className='bg-blue-600 h-2 rounded-full'
                                            style={{ width: `${item.percentage}% ` }}
                                        />
                                    </div>
                                    <p className='text-xs text-muted-foreground'>{item.percentage}% of total sales</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Report */}
            <Card>
                <CardHeader>
                    <CardTitle>Inventory Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold'>234</p>
                            <p className='text-sm text-muted-foreground mt-1'>Total Products</p>
                        </div>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold text-orange-600'>12</p>
                            <p className='text-sm text-muted-foreground mt-1'>Low Stock</p>
                        </div>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold text-red-600'>8</p>
                            <p className='text-sm text-muted-foreground mt-1'>Expiring Soon</p>
                        </div>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold'>ETB 45,678</p>
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
                            <p className='text-2xl font-bold'>89</p>
                            <p className='text-sm text-muted-foreground mt-1'>Filled Today</p>
                        </div>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold'>12</p>
                            <p className='text-sm text-muted-foreground mt-1'>Pending Validation</p>
                        </div>
                        <div className='text-center p-4 border rounded-lg'>
                            <p className='text-2xl font-bold'>3</p>
                            <p className='text-sm text-muted-foreground mt-1'>Flagged for Review</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
