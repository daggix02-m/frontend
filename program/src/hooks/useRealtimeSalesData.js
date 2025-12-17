import { useState, useEffect } from 'react';
import { apiClient } from '@/api/apiClient';

export const useRealtimeSalesData = () => {
  const [data, setData] = useState({
    totalRevenue: 0,
    salesCount: 0,
    averageSale: 0,
    salesChartData: [],
    cumulativeRevenueData: [],
    latestPayments: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchSalesData = async () => {
    try {
      // Fetch real sales data from the backend
      const response = await apiClient('/admin/sales-data', { method: 'GET' });

      if (response.success) {
        const salesData = response.data || response;

        // Update state with real data
        setData({
          totalRevenue: salesData.totalRevenue || salesData.total_revenue || 0,
          salesCount: salesData.salesCount || salesData.sales_count || 0,
          averageSale: salesData.averageSale || salesData.average_sale || 0,
          salesChartData: salesData.salesChartData || salesData.sales_chart_data || [],
          cumulativeRevenueData:
            salesData.cumulativeRevenueData || salesData.cumulative_revenue_data || [],
          latestPayments: salesData.latestPayments || salesData.latest_payments || [],
        });
      } else {
        console.error('Failed to fetch sales data:', response.message);
      }
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  useEffect(() => {
    // Initial data fetch
    fetchSalesData().then(() => setLoading(false));

    // Set up periodic refresh
    const interval = setInterval(fetchSalesData, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Return loading state indicator if needed by the component
  return { ...data, loading };
};
