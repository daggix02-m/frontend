import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { pharmacistService } from '@/services/pharmacist.service';
import { toast } from 'sonner';
import {
  FileText,
  AlertTriangle,
  Clock,
  Package,
  Loader2,
  Download,
} from 'lucide-react';

export function Reports() {
  const [activeTab, setActiveTab] = useState('low-stock');
  const [lowStockReport, setLowStockReport] = useState([]);
  const [expiryReport, setExpiryReport] = useState([]);
  const [inventorySummary, setInventorySummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [activeTab]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      switch (activeTab) {
        case 'low-stock':
          const response = await pharmacistService.getLowStockReport();
          if (response.success) {
            setLowStockReport(response.data || response.medicines || []);
          } else {
            toast.error(response.message || 'Failed to fetch low stock report');
          }
          break;
          
        case 'expiry':
          const expiryResponse = await pharmacistService.getExpiryReport();
          if (expiryResponse.success) {
            setExpiryReport(expiryResponse.data || response.medicines || []);
          } else {
            toast.error(expiryResponse.message || 'Failed to fetch expiry report');
          }
          break;
          
        case 'inventory':
          const summaryResponse = await pharmacistService.getInventorySummaryReport();
          if (summaryResponse.success) {
            setInventorySummary(summaryResponse.data || response.summary || {});
          } else {
            toast.error(summaryResponse.message || 'Failed to fetch inventory summary');
          }
          break;
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (reportType) => {
    // Export functionality can be implemented based on requirements
    toast.info(`Exporting ${reportType} report...`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          View inventory reports and summaries
        </p>
      </div>

      {/* Report Tabs */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveTab('low-stock')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'low-stock'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Low Stock
            </button>
            <button
              onClick={() => setActiveTab('expiry')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'expiry'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Clock className="h-4 w-4 mr-2" />
              Expiry
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'inventory'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Package className="h-4 w-4 mr-2" />
              Inventory Summary
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Report */}
      {activeTab === 'low-stock' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Low Stock Report</CardTitle>
            <Button variant="outline" onClick={() => handleExport('low-stock')}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            {lowStockReport.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No low stock items found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Stock</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockReport.map((medicine) => (
                      <tr key={medicine.medicine_id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{medicine.name}</td>
                        <td className="py-3 px-4 text-sm">{medicine.category_name || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className="text-red-600 font-medium">{medicine.quantity_in_stock}</span>
                        </td>
                        <td className="py-3 px-4 text-sm">ETB {medicine.price?.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                            Low Stock
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Expiry Report */}
      {activeTab === 'expiry' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Expiry Report</CardTitle>
            <Button variant="outline" onClick={() => handleExport('expiry')}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            {expiryReport.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No expiring medicines found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Stock</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Expiry Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Days Until Expiry</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiryReport.map((medicine) => {
                      const expiryDate = new Date(medicine.expiry_date);
                      const today = new Date();
                      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <tr key={medicine.medicine_id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{medicine.name}</td>
                          <td className="py-3 px-4 text-sm">{medicine.category_name || 'N/A'}</td>
                          <td className="py-3 px-4 text-sm">{medicine.quantity_in_stock}</td>
                          <td className="py-3 px-4 text-sm">ETB {medicine.price?.toFixed(2)}</td>
                          <td className="py-3 px-4 text-sm">
                            {new Date(medicine.expiry_date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-medium ${
                              daysUntilExpiry <= 7 ? 'text-red-600' :
                              daysUntilExpiry <= 30 ? 'text-orange-600' :
                              'text-green-600'
                            }`}>
                              {daysUntilExpiry} days
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Inventory Summary */}
      {activeTab === 'inventory' && inventorySummary && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Inventory Summary</CardTitle>
            <Button variant="outline" onClick={() => handleExport('inventory')}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Medicines */}
              <div className="p-6 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="h-8 w-8 text-primary" />
                  <span className="text-sm text-muted-foreground">Total Medicines</span>
                </div>
                <p className="text-3xl font-bold">{inventorySummary.total_medicines || 0}</p>
              </div>

              {/* Total Quantity */}
              <div className="p-6 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-8 w-8 text-primary" />
                  <span className="text-sm text-muted-foreground">Total Quantity</span>
                </div>
                <p className="text-3xl font-bold">{inventorySummary.total_quantity || 0}</p>
              </div>

              {/* Total Value */}
              <div className="p-6 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-8 w-8 text-green-600" />
                  <span className="text-sm text-muted-foreground">Total Value</span>
                </div>
                <p className="text-3xl font-bold text-green-600">
                  ETB {(inventorySummary.total_value || 0).toFixed(2)}
                </p>
              </div>

              {/* Low Stock Count */}
              <div className="p-6 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <span className="text-sm text-muted-foreground">Low Stock Items</span>
                </div>
                <p className="text-3xl font-bold text-red-600">{inventorySummary.low_stock_count || 0}</p>
              </div>

              {/* Expiring Soon Count */}
              <div className="p-6 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <span className="text-sm text-muted-foreground">Expiring Soon (30 days)</span>
                </div>
                <p className="text-3xl font-bold text-orange-600">{inventorySummary.expiring_soon_count || 0}</p>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
              {inventorySummary.category_breakdown && Object.keys(inventorySummary.category_breakdown).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Count</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Quantity</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(inventorySummary.category_breakdown).map(([category, data]) => (
                        <tr key={category} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{category}</td>
                          <td className="py-3 px-4 text-sm">{data.count || 0}</td>
                          <td className="py-3 px-4 text-sm">{data.quantity || 0}</td>
                          <td className="py-3 px-4 text-sm">ETB {(data.value || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No category breakdown data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
