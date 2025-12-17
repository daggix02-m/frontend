import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '@/services/inventory.service';
import { toast } from 'sonner';

export const LowStockAlert = () => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLowStockItems();
  }, []);

  const fetchLowStockItems = async () => {
    try {
      const response = await inventoryService.getLowStockItems();

      if (response.success) {
        const items = Array.isArray(response.data) ? response.data : response.items || [];

        // Format the items to match the expected structure
        const formattedItems = items.map((item) => ({
          id: item.id || item._id,
          name: item.name || item.product_name || 'Unknown Product',
          currentStock: item.stock || item.quantity || 0,
          minStock: item.min_stock || item.minimum_stock || 0,
          category: item.category || 'General',
        }));

        setLowStockItems(formattedItems);
      } else {
        // Set to empty array as fallback
        setLowStockItems([]);
      }
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      toast.error('Failed to load low stock items');
      setLowStockItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInventory = () => {
    navigate('/manager/inventory');
  };

  const handleViewItem = (itemId) => {
    navigate(`/manager/inventory?item=${itemId}`);
  };

  return (
    <Card className='border-l-4 border-l-yellow-500 shadow-sm'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2 text-lg font-semibold text-yellow-700 dark:text-yellow-500'>
            <AlertTriangle className='h-5 w-5' />
            Low Stock Alerts
          </CardTitle>
          <Badge
            variant='outline'
            className='bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
          >
            {loading ? '...' : `${lowStockItems.length} Items Critical`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[200px] pr-4'>
          {loading ? (
            <div className='flex items-center justify-center h-[200px]'>
              <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
            </div>
          ) : lowStockItems.length === 0 ? (
            <div className='flex items-center justify-center h-[200px] text-muted-foreground'>
              <p>No low stock items</p>
            </div>
          ) : (
            <div className='space-y-4'>
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className='flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0'
                >
                  <div className='space-y-1'>
                    <p className='text-sm font-medium leading-none'>{item.name}</p>
                    <p className='text-xs text-muted-foreground'>{item.category}</p>
                  </div>
                  <div className='flex items-center gap-4'>
                    <div className='text-right'>
                      <p className='text-sm font-bold text-destructive'>{item.currentStock} left</p>
                      <p className='text-[10px] text-muted-foreground'>Min: {item.minStock}</p>
                    </div>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-muted-foreground hover:text-primary'
                      onClick={() => handleViewItem(item.id)}
                    >
                      <ArrowRight className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className='mt-4 pt-4 border-t border-border'>
          <Button
            variant='outline'
            className='w-full text-yellow-700 border-yellow-200 hover:bg-yellow-50 dark:text-yellow-400 dark:border-yellow-800 dark:hover:bg-yellow-900/20'
            onClick={handleViewInventory}
          >
            View All Inventory
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
