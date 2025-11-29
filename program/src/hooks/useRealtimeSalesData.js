import { useState, useEffect } from 'react';

export const useRealtimeSalesData = () => {
    const [data, setData] = useState({
        totalRevenue: 12500.50,
        salesCount: 142,
        averageSale: 88.03,
        salesChartData: [],
        cumulativeRevenueData: [],
        latestPayments: [],
    });

    useEffect(() => {
        // Simulate real-time data updates
        const interval = setInterval(() => {
            const now = new Date();
            const timeString = now.toLocaleTimeString();

            const newSaleAmount = Math.random() * 100 + 20; // Random sale between 20 and 120

            setData(prev => {
                const newTotalRevenue = prev.totalRevenue + newSaleAmount;
                const newSalesCount = prev.salesCount + 1;

                const newChartPoint = {
                    time: timeString,
                    sales: newSaleAmount,
                };

                const newRevenuePoint = {
                    time: timeString,
                    sales: newTotalRevenue,
                };

                const newPayment = {
                    id: Date.now(),
                    amount: newSaleAmount,
                    product: 'Product ' + Math.floor(Math.random() * 100),
                    customer: 'Customer ' + Math.floor(Math.random() * 100),
                    time: timeString,
                };

                return {
                    totalRevenue: newTotalRevenue,
                    salesCount: newSalesCount,
                    averageSale: newTotalRevenue / newSalesCount,
                    salesChartData: [...prev.salesChartData.slice(-19), newChartPoint], // Keep last 20 points
                    cumulativeRevenueData: [...prev.cumulativeRevenueData.slice(-19), newRevenuePoint],
                    latestPayments: [newPayment, ...prev.latestPayments].slice(0, 10), // Keep last 10 payments
                };
            });
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return data;
};
