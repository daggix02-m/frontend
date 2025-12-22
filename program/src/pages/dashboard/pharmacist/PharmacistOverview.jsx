import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pill,
  ShoppingCart,
  FileText,
  TrendingUp,
  PackagePlus,
  AlertTriangle,
  Clock,
  Users
} from 'lucide-react';
import { pharmacistService } from '@/services/pharmacist.service';
import { toast } from 'sonner';

export function PharmacistOverview() {
  const [metrics, setMetrics] = useState({
    totalMedicines: 0,
    lowStockItems: 0,
    expiredItems: 0,
    totalSales: 0,
    pendingPrescriptions: 0,
    nearExpiryItems: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch pharmacist dashboard data
        const response = await pharmacistService.getOverview();

        if (response.success) {
          setMetrics({
            totalMedicines: response.totalMedicines || 0,
            lowStockItems: response.lowStockItems || 0,
            expiredItems: response.expiredItems || 0,
            totalSales: response.totalSales || 0,
            pendingPrescriptions: response.pendingPrescriptions || 0,
            nearExpiryItems: response.nearExpiryItems || 0
          });
        } else {
          // Set default values if API call fails
          setMetrics({
            totalMedicines: 0,
            lowStockItems: 0,
            expiredItems: 0,
            totalSales: 0,
            pendingPrescriptions: 0,
            nearExpiryItems: 0
          });
          toast.error(response.message || 'Failed to load dashboard data');
        }
      } catch (error) {
        console.error('Error fetching pharmacist dashboard data:', error);
        toast.error('Failed to load dashboard data');
        setMetrics({
          totalMedicines: 0,
          lowStockItems: 0,
          expiredItems: 0,
          totalSales: 0,
          pendingPrescriptions: 0,
          nearExpiryItems: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const metricCards = [
    {
      title: "Total Medicines",
      value: metrics.totalMedicines,
      icon: Pill,
      color: "text-blue-600"
    },
    {
      title: "Low Stock Items",
      value: metrics.lowStockItems,
      icon: AlertTriangle,
      color: "text-yellow-600"
    },
    {
      title: "Near Expiry",
      value: metrics.nearExpiryItems,
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Total Sales",
      value: metrics.totalSales,
      icon: ShoppingCart,
      color: "text-green-600"
    },
    {
      title: "Pending Prescriptions",
      value: metrics.pendingPrescriptions,
      icon: FileText,
      color: "text-purple-600"
    },
    {
      title: "Expired Items",
      value: metrics.expiredItems,
      icon: PackagePlus,
      color: "text-red-600"
    }
  ];

  return (
    <div className='space-y-6 p-4 md:p-8'>
      <div className='space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Pharmacist Dashboard</h2>
        <p className='text-muted-foreground'>
          Inventory management and prescription processing
        </p>
      </div>

      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
            {metricCards.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index}>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                    <CardTitle className='text-sm font-medium'>{metric.title}</CardTitle>
                    <Icon className={`h-4 w-4 ${metric.color}`} />
                  </CardHeader>
                  <CardContent className='px-6 pb-6'>
                    <div className='text-2xl font-bold'>{metric.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional sections would go here */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>Recent sales activity will be displayed here.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Inventory Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>Inventory alerts and notifications will be displayed here.</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}