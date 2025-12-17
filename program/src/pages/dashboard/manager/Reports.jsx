import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Select } from '@/components/ui/ui';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  CreditCard,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import { exportToExcel } from '@/utils/exportUtils';
import managerService from '@/services/manager.service';
import { toast } from 'sonner';

export function Reports() {
  const [reportType, setReportType] = useState('sales');
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const [isExporting, setIsExporting] = useState(false);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    salesCount: 0,
    avgOrderValue: 0,
    activeSessions: 0,
    revenueChange: 0,
    salesChange: 0,
    avgOrderChange: 0,
    sessionsChange: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      // Try to get metrics from reports API, fallback to overview if needed
      const reportsResponse = await managerService.getReports({ type: 'summary' });

      if (reportsResponse.success && reportsResponse.data) {
        const data = reportsResponse.data;
        setMetrics({
          totalRevenue: data.totalRevenue || data.total_revenue || 0,
          salesCount: data.salesCount || data.sales_count || 0,
          avgOrderValue: data.avgOrderValue || data.avg_order_value || 0,
          activeSessions: data.activeSessions || data.active_sessions || 0,
          revenueChange: data.revenueChange || data.revenue_change || 0,
          salesChange: data.salesChange || data.sales_change || 0,
          avgOrderChange: data.avgOrderChange || data.avg_order_change || 0,
          sessionsChange: data.sessionsChange || data.sessions_change || 0,
        });
      } else {
        // Fallback: try to get from overview
        const overviewResponse = await managerService.getOverview();
        if (overviewResponse.success && overviewResponse.data) {
          const data = overviewResponse.data;
          setMetrics({
            totalRevenue: data.totalRevenue || data.total_revenue || 0,
            salesCount: data.totalSales || data.total_sales || 0,
            avgOrderValue: data.avgOrderValue || data.avg_order_value || 0,
            activeSessions: data.activeSessions || data.active_sessions || 0,
            revenueChange: data.revenueChange || data.revenue_change || 0,
            salesChange: data.salesChange || data.sales_change || 0,
            avgOrderChange: data.avgOrderChange || data.avg_order_change || 0,
            sessionsChange: data.sessionsChange || data.sessions_change || 0,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      // Keep default values (0) on error
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    let filename, sheetName;
    setIsExporting(true);

    try {
      let data;
      if (reportType === 'sales') {
        filename = `Sales_Report_${reportPeriod}_${dateStr}`;
        sheetName = `${reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)} Sales`;
        const response = await managerService.getSalesReport(reportPeriod);
        if (response.success) data = response.data;
      } else if (reportType === 'inventory') {
        filename = `Inventory_Report_${dateStr}`;
        sheetName = 'Inventory';
        const response = await managerService.getInventoryReport();
        if (response.success) data = response.data;
      } else if (reportType === 'staff') {
        filename = `Staff_Activity_Report_${dateStr}`;
        sheetName = 'Staff Activity';
        const response = await managerService.getStaffActivityReport();
        if (response.success) data = response.data;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        exportToExcel(data, filename, sheetName);
        toast.success(
          `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported successfully!`
        );
      } else {
        toast.error('No data available to export or failed to fetch data.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className='space-y-6 p-4 sm:p-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Reports & Analytics</h2>
          <p className='text-muted-foreground'>
            View and export financial and performance reports.
          </p>
        </div>
      </div>

      {}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <FileSpreadsheet className='h-5 w-5' />
            Export Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-3'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Report Type</label>
              <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <option value='sales'>Sales Report</option>
                <option value='inventory'>Inventory Report</option>
                <option value='staff'>Staff Activity Report</option>
              </Select>
            </div>

            {reportType === 'sales' && (
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Period</label>
                <Select value={reportPeriod} onChange={(e) => setReportPeriod(e.target.value)}>
                  <option value='daily'>Daily</option>
                  <option value='monthly'>Monthly</option>
                  <option value='yearly'>Yearly</option>
                </Select>
              </div>
            )}

            <div className='flex items-end'>
              <Button onClick={handleExport} className='w-full' disabled={isExporting}>
                {isExporting ? (
                  'Exporting...'
                ) : (
                  <>
                    <Download className='mr-2 h-4 w-4' />
                    Export to Excel
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className='mt-4 p-4 bg-muted/50 rounded-lg'>
            <p className='text-sm text-muted-foreground'>
              <strong>Selected:</strong> {reportType.charAt(0).toUpperCase() + reportType.slice(1)}{' '}
              Report
              {reportType === 'sales' &&
                ` - ${reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)}`}
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
            <div className='text-2xl font-bold'>
              {loading ? '...' : `ETB ${metrics.totalRevenue.toLocaleString()}`}
            </div>
            <p className='text-xs text-muted-foreground'>
              {loading
                ? '...'
                : `${metrics.revenueChange >= 0 ? '+' : ''}${metrics.revenueChange}% from last month`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
            <CardTitle className='text-sm font-medium'>Sales Count</CardTitle>
            <CreditCard className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='text-2xl font-bold'>
              {loading ? '...' : metrics.salesCount.toLocaleString()}
            </div>
            <p className='text-xs text-muted-foreground'>
              {loading
                ? '...'
                : `${metrics.salesChange >= 0 ? '+' : ''}${metrics.salesChange}% from last month`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
            <CardTitle className='text-sm font-medium'>Average Order Value</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='text-2xl font-bold'>
              {loading ? '...' : `ETB ${metrics.avgOrderValue.toFixed(2)}`}
            </div>
            <p className='text-xs text-muted-foreground'>
              {loading
                ? '...'
                : `${metrics.avgOrderChange >= 0 ? '+' : ''}${metrics.avgOrderChange}% from last month`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
            <CardTitle className='text-sm font-medium'>Active Sessions</CardTitle>
            <BarChart3 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='text-2xl font-bold'>
              {loading ? '...' : metrics.activeSessions.toLocaleString()}
            </div>
            <p className='text-xs text-muted-foreground'>
              {loading
                ? '...'
                : `${metrics.sessionsChange >= 0 ? '+' : ''}${metrics.sessionsChange} since last hour`}
            </p>
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
              <div className='text-center'>
                <BarChart3 className='h-12 w-12 mx-auto mb-2 opacity-50' />
                <p>Chart data will be available when backend supports time-series analytics</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className='col-span-1 lg:col-span-3'>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[200px] flex items-center justify-center text-muted-foreground'>
              <div className='text-center'>
                <TrendingUp className='h-12 w-12 mx-auto mb-2 opacity-50' />
                <p>
                  Category breakdown will be available when backend supports sales categorization
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
