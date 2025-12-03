import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Select } from '@/components/ui/ui';
import { BarChart3, TrendingUp, DollarSign, CreditCard, Download, FileSpreadsheet } from 'lucide-react';
import { exportToExcel, generateSalesReport, generateInventoryReport, generateStaffActivityReport } from '@/utils/exportUtils';
import { toast } from 'sonner';

export function Reports() {
    const [reportType, setReportType] = useState('sales');
    const [reportPeriod, setReportPeriod] = useState('monthly');

    const handleExport = () => {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];

        let data, filename, sheetName;

        if (reportType === 'sales') {
            data = generateSalesReport(reportPeriod);
            filename = `Sales_Report_${reportPeriod}_${dateStr}`;
            sheetName = `${reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)} Sales`;
        } else if (reportType === 'inventory') {
            data = generateInventoryReport();
            filename = `Inventory_Report_${dateStr}`;
            sheetName = 'Inventory';
        } else if (reportType === 'staff') {
            data = generateStaffActivityReport();
            filename = `Staff_Activity_Report_${dateStr}`;
            sheetName = 'Staff Activity';
        }

        try {
            exportToExcel(data, filename, sheetName);
            toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported successfully!`);
        } catch (error) {
            toast.error('Failed to export report');
        }
    };

    return (
        <div className='space-y-6 p-4 sm:p-6'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h2 className='text-3xl font-bold tracking-tight'>Reports & Analytics</h2>
                    <p className='text-muted-foreground'>View and export financial and performance reports.</p>
                </div>
            </div>

            {}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5" />
                        Export Reports
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Report Type</label>
                            <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                                <option value="sales">Sales Report</option>
                                <option value="inventory">Inventory Report</option>
                                <option value="staff">Staff Activity Report</option>
                            </Select>
                        </div>

                        {reportType === 'sales' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Period</label>
                                <Select value={reportPeriod} onChange={(e) => setReportPeriod(e.target.value)}>
                                    <option value="daily">Daily</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </Select>
                            </div>
                        )}

                        <div className="flex items-end">
                            <Button onClick={handleExport} className="w-full">
                                <Download className="mr-2 h-4 w-4" />
                                Export to Excel
                            </Button>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                            <strong>Selected:</strong> {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
                            {reportType === 'sales' && ` - ${reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)}`}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {}
            <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                        <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
                        <DollarSign className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent className='px-6 pb-6'>
                        <div className='text-2xl font-bold'>ETB 45,231.89</div>
                        <p className='text-xs text-muted-foreground'>+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                        <CardTitle className='text-sm font-medium'>Sales Count</CardTitle>
                        <CreditCard className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent className='px-6 pb-6'>
                        <div className='text-2xl font-bold'>+2350</div>
                        <p className='text-xs text-muted-foreground'>+180.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                        <CardTitle className='text-sm font-medium'>Average Order Value</CardTitle>
                        <TrendingUp className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent className='px-6 pb-6'>
                        <div className='text-2xl font-bold'>ETB 24.50</div>
                        <p className='text-xs text-muted-foreground'>+19% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                        <CardTitle className='text-sm font-medium'>Active Sessions</CardTitle>
                        <BarChart3 className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent className='px-6 pb-6'>
                        <div className='text-2xl font-bold'>+573</div>
                        <p className='text-xs text-muted-foreground'>+201 since last hour</p>
                    </CardContent>
                </Card>
            </div>

            <div className='grid gap-4 grid-cols-1 lg:grid-cols-7'>
                <Card className='col-span-1 lg:col-span-4'>
                    <CardHeader>
                        <CardTitle>Revenue Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className='pl-2'>
                        <div className='h-[200px] flex items-center justify-center text-muted-foreground'>
                            Chart Placeholder
                        </div>
                    </CardContent>
                </Card>
                <Card className='col-span-1 lg:col-span-3'>
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
