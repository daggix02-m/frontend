import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/ui';
import { Pill, FileText, AlertCircle, Clock } from 'lucide-react';
import { pharmacistService } from '@/services/pharmacist.service';
import { toast } from 'sonner';

export function PharmacistOverview() {
  const [metrics, setMetrics] = useState({
    pendingPrescriptions: 0,
    urgentPrescriptions: 0,
    lowStockAlerts: 0,
    prescriptionsProcessed: 0,
    avgProcessingTime: '0m',
    processingTimeChange: '0m'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all necessary data in parallel
      const [prescriptionsData, inventoryData, reportsData] = await Promise.allSettled([
        pharmacistService.getPrescriptions({ status: 'pending' }),
        pharmacistService.getInventory({ status: 'low' }),
        pharmacistService.getReports()
      ]);

      // Process prescriptions data
      if (prescriptionsData.status === 'fulfilled' && prescriptionsData.value.success) {
        const pendingPrescriptions = Array.isArray(prescriptionsData.value.data)
          ? prescriptionsData.value.data
          : (prescriptionsData.value.prescriptions || []);

        const urgentCount = pendingPrescriptions.filter(p => p.priority === 'urgent' || p.urgent).length;

        setMetrics(prev => ({
          ...prev,
          pendingPrescriptions: pendingPrescriptions.length,
          urgentPrescriptions: urgentCount
        }));
      }

      // Process inventory data for low stock alerts
      if (inventoryData.status === 'fulfilled' && inventoryData.value.success) {
        const lowStockItems = Array.isArray(inventoryData.value.data)
          ? inventoryData.value.data
          : (inventoryData.value.items || []);

        setMetrics(prev => ({
          ...prev,
          lowStockAlerts: lowStockItems.length
        }));
      }

      // Process reports data for processed prescriptions and avg time
      if (reportsData.status === 'fulfilled' && reportsData.value.success) {
        const reportData = reportsData.value.data || reportsData.value;

        setMetrics(prev => ({
          ...prev,
          prescriptionsProcessed: reportData.processedToday || reportData.prescriptionsProcessed || 0,
          avgProcessingTime: `${reportData.avgProcessingTime || 0}m`,
          processingTimeChange: `${reportData.processingTimeChange || 0}m`
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data. Using default values.');

      // Set default values in case of error
      setMetrics({
        pendingPrescriptions: 0,
        urgentPrescriptions: 0,
        lowStockAlerts: 0,
        prescriptionsProcessed: 0,
        avgProcessingTime: '0m',
        processingTimeChange: '0m'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
        <h2 className='text-3xl font-bold tracking-tight'>Pharmacist Dashboard</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
      <h2 className='text-3xl font-bold tracking-tight'>Pharmacist Dashboard</h2>
      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
            <CardTitle className='text-sm font-medium'>Pending Prescriptions</CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='text-2xl font-bold'>{metrics.pendingPrescriptions}</div>
            <p className='text-xs text-muted-foreground'>{metrics.urgentPrescriptions} urgent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
            <CardTitle className='text-sm font-medium'>Low Stock Alerts</CardTitle>
            <AlertCircle className='h-4 w-4 text-red-600' />
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='text-2xl font-bold'>{metrics.lowStockAlerts}</div>
            <p className='text-xs text-muted-foreground'>Items below threshold</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
            <CardTitle className='text-sm font-medium'>Prescriptions Processed</CardTitle>
            <Pill className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='text-2xl font-bold'>{metrics.prescriptionsProcessed}</div>
            <p className='text-xs text-muted-foreground'>Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
            <CardTitle className='text-sm font-medium'>Avg. Processing Time</CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <div className='text-2xl font-bold'>{metrics.avgProcessingTime}</div>
            <p className='text-xs text-muted-foreground'>{metrics.processingTimeChange} from yesterday</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
