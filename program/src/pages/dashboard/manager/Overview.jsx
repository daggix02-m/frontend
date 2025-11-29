import React from 'react';
import { LiveSalesDashboard } from '@/components/dashboard/LiveSalesDashboard';
import { LowStockAlert } from './components/LowStockAlert';

export function Overview() {
  return (
    <div className="space-y-6 p-4 md:p-8">
      <LowStockAlert />
      <LiveSalesDashboard />
    </div>
  );
}
