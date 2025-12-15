import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '@/services/inventory.service';
import { toast } from 'sonner';

export const NearToExpireAlert = () => {
    const [nearExpireItems, setNearExpireItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNearExpireItems();
    }, []);

    const fetchNearExpireItems = async () => {
        try {
            const response = await inventoryService.getNearExpirationItems();

            if (response.success) {
                const items = Array.isArray(response.data)
                    ? response.data
                    : (response.items || []);

                // Format the items to match the expected structure
                const formattedItems = items.map(item => ({
                    id: item.id || item._id,
                    name: item.name || item.product_name || 'Unknown Product',
                    expiryDate: item.expiry_date || item.expiryDate || item.expiration_date || 'N/A',
                    daysLeft: item.days_left || item.daysLeft || 0,
                    category: item.category || 'General',
                    stock: item.stock || item.quantity || 0
                }));

                setNearExpireItems(formattedItems);
            } else {
                // Set to empty array as fallback
                setNearExpireItems([]);
            }
        } catch (error) {
            console.error('Error fetching near expire items:', error);
            toast.error('Failed to load near expiration items');
            setNearExpireItems([]);
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
        <Card className="border-l-4 border-l-orange-500 shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-orange-700 dark:text-orange-500">
                        <Clock className="h-5 w-5" />
                        Near to Expire Alerts
                    </CardTitle>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
                        {loading ? '...' : `${nearExpireItems.length} Items Expiring Soon`}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[200px] pr-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-[200px]">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : nearExpireItems.length === 0 ? (
                        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                            <p>No near expiration items</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {nearExpireItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{item.category}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{item.daysLeft} days</p>
                                            <p className="text-[10px] text-muted-foreground">Exp: {item.expiryDate}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                                            onClick={() => handleViewItem(item.id)}
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <div className="mt-4 pt-4 border-t border-border">
                    <Button
                        variant="outline"
                        className="w-full text-orange-700 border-orange-200 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/20"
                        onClick={handleViewInventory}
                    >
                        View All Inventory
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
