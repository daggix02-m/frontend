import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export const LowStockAlert = () => {
    // Mock data for low stock items
    const lowStockItems = [
        { id: 1, name: 'Amoxicillin 500mg', currentStock: 15, minStock: 50, category: 'Antibiotics' },
        { id: 2, name: 'Paracetamol Syrup', currentStock: 8, minStock: 30, category: 'Pain Relief' },
        { id: 3, name: 'Omeprazole 20mg', currentStock: 12, minStock: 40, category: 'Gastrointestinal' },
        { id: 4, name: 'Vitamin C 1000mg', currentStock: 5, minStock: 25, category: 'Supplements' },
        { id: 5, name: 'Ibuprofen 400mg', currentStock: 20, minStock: 60, category: 'Pain Relief' },
    ];

    return (
        <Card className="border-l-4 border-l-yellow-500 shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-yellow-700 dark:text-yellow-500">
                        <AlertTriangle className="h-5 w-5" />
                        Low Stock Alerts
                    </CardTitle>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
                        {lowStockItems.length} Items Critical
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[200px] pr-4">
                    <div className="space-y-4">
                        {lowStockItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.category}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-destructive">{item.currentStock} left</p>
                                        <p className="text-[10px] text-muted-foreground">Min: {item.minStock}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="mt-4 pt-4 border-t border-border">
                    <Button variant="outline" className="w-full text-yellow-700 border-yellow-200 hover:bg-yellow-50 dark:text-yellow-400 dark:border-yellow-800 dark:hover:bg-yellow-900/20">
                        View All Inventory
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
