import React from 'react';
import { LiveSalesDashboard } from '@/components/dashboard/LiveSalesDashboard';
import { LowStockAlert } from './components/LowStockAlert';
import { NearToExpireAlert } from './components/NearToExpireAlert';

export function Overview() {
  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockAlert />
        <NearToExpireAlert />
      </div>
      <LiveSalesDashboard />
    </div>
  );
}
