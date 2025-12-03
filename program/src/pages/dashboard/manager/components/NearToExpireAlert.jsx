import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';

export const NearToExpireAlert = () => {
    const navigate = useNavigate();

    const nearExpireItems = [
        { id: 1, name: 'Aspirin 100mg', expiryDate: '2025-12-15', daysLeft: 16, category: 'Pain Relief', stock: 45 },
        { id: 2, name: 'Cough Syrup', expiryDate: '2025-12-20', daysLeft: 21, category: 'Respiratory', stock: 12 },
        { id: 3, name: 'Antibiotic Cream', expiryDate: '2025-12-10', daysLeft: 11, category: 'Topical', stock: 8 },
        { id: 4, name: 'Eye Drops', expiryDate: '2025-12-25', daysLeft: 26, category: 'Ophthalmology', stock: 15 },
        { id: 5, name: 'Multivitamin', expiryDate: '2025-12-12', daysLeft: 13, category: 'Supplements', stock: 30 },
    ];

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
                        {nearExpireItems.length} Items Expiring Soon
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[200px] pr-4">
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
