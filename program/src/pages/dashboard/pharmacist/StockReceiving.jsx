import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button, Input } from '@/components/ui/ui';
import { Package, CheckCircle, Clock, Truck } from 'lucide-react';
import { pharmacistService } from '@/services/pharmacist.service';
import { toast } from 'sonner';

export function StockReceiving() {
    const [deliveries, setDeliveries] = useState([]);
    const [receipts, setReceipts] = useState([]);
    const [receivingItems, setReceivingItems] = useState([]);
    const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeliveries();
        fetchReceipts();
    }, []);

    useEffect(() => {
        if (selectedDeliveryId) {
            fetchDeliveryItems(selectedDeliveryId);
        } else if (deliveries.length > 0) {
            // Default to first pending delivery if available
            const firstPending = deliveries.find(d => d.status === 'pending');
            if (firstPending) {
                setSelectedDeliveryId(firstPending.id);
            } else if (deliveries.length > 0) {
                setSelectedDeliveryId(deliveries[0].id);
            }
        }
    }, [selectedDeliveryId, deliveries]);

    const fetchDeliveries = async () => {
        try {
            setLoading(true);
            const response = await pharmacistService.getDeliveries();

            if (response.success) {
                const deliveriesData = response.data || response.deliveries || [];
                setDeliveries(Array.isArray(deliveriesData) ? deliveriesData : []);
            } else {
                toast.error('Failed to load deliveries');
                setDeliveries([]);
            }
        } catch (error) {
            console.error('Error fetching deliveries:', error);
            toast.error('Failed to load deliveries');
            setDeliveries([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchReceipts = async () => {
        try {
            const response = await pharmacistService.getReceipts();
            if (response.success) {
                setReceipts(response.data || response.receipts || []);
            }
        } catch (error) {
            console.error('Error fetching receipts:', error);
        }
    };

    const fetchDeliveryItems = async (id) => {
        try {
            const response = await pharmacistService.getDeliveryItems(id);
            if (response.success) {
                setReceivingItems(response.data || response.items || []);
            }
        } catch (error) {
            console.error('Error fetching delivery items:', error);
        }
    };

    const handleReceiveDelivery = async (id) => {
        if (window.confirm('Start receiving process for this delivery?')) {
            setSelectedDeliveryId(id);
        }
    };

    const handleCompleteReceiving = async () => {
        if (!selectedDeliveryId) return;
        try {
            const response = await pharmacistService.receiveDelivery(selectedDeliveryId);
            if (response.success) {
                toast.success('Delivery marked as received!');
                await fetchDeliveries();
                await fetchReceipts();
                setReceivingItems([]);
                setSelectedDeliveryId(null);
            } else {
                toast.error(response.message || 'Failed to receive delivery');
            }
        } catch (error) {
            console.error('Error receiving delivery:', error);
            toast.error('Failed to receive delivery');
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'default',
            'in-transit': 'default',
            received: 'secondary',
        };
        const icons = {
            pending: Clock,
            'in-transit': Truck,
            received: CheckCircle,
        };
        const Icon = icons[status] || Clock;
        return (
            <Badge variant={variants[status] || 'default'} className='flex items-center gap-1 w-fit'>
                <Icon className='h-3 w-3' />
                {status}
            </Badge>
        );
    };

    const stats = [
        { title: 'Pending Deliveries', value: deliveries.filter(d => d.status === 'pending').length, icon: Clock, color: 'text-orange-600' },
        { title: 'In Transit', value: deliveries.filter(d => d.status === 'in-transit').length, icon: Truck, color: 'text-blue-600' },
        { title: 'Received Today', value: deliveries.filter(d => d.status === 'received').length, icon: CheckCircle, color: 'text-green-600' },
        { title: 'Total Value', value: 'ETB ' + deliveries.reduce((acc, curr) => acc + (curr.value || 0), 0).toLocaleString(), icon: Package, color: 'text-purple-600' },
    ];

    const selectedDelivery = deliveries.find(d => d.id === selectedDeliveryId);

    if (loading) {
        return (
            <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
                <h1 className='text-3xl font-bold'>Stock Receiving</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Stock Receiving</h1>
                <p className='text-muted-foreground mt-2'>Receive deliveries and update stock quantities</p>
            </div>

            {/* Stats Cards */}
            <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent className='px-6 pb-6'>
                            <div className='text-2xl font-bold'>{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Expected Deliveries */}
            <Card>
                <CardHeader>
                    <CardTitle>Expected Deliveries</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='overflow-x-auto'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Delivery ID</TableHead>
                                    <TableHead>Supplier</TableHead>
                                    <TableHead>PO Number</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Expected Date</TableHead>
                                    <TableHead>Value</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {deliveries.map((delivery) => (
                                    <TableRow key={delivery.id}>
                                        <TableCell className='font-medium'>{delivery.id}</TableCell>
                                        <TableCell>{delivery.supplier}</TableCell>
                                        <TableCell>{delivery.poNumber}</TableCell>
                                        <TableCell>{delivery.items}</TableCell>
                                        <TableCell>{delivery.expectedDate}</TableCell>
                                        <TableCell>{delivery.value}</TableCell>
                                        <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                                        <TableCell>
                                            {delivery.status === 'pending' ? (
                                                <Button size='sm' variant='outline' onClick={() => handleReceiveDelivery(delivery.id)}>
                                                    Receive
                                                </Button>
                                            ) : (
                                                <Button size='sm' variant='outline'>
                                                    View
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Receive Delivery Section */}
            {selectedDelivery && (
                <Card>
                    <CardHeader>
                        <CardTitle>Receive Delivery: {selectedDelivery.id}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
                                <div>
                                    <p className='text-sm font-medium'>Supplier: {selectedDelivery.supplier}</p>
                                    <p className='text-sm text-muted-foreground'>PO Number: {selectedDelivery.poNumber}</p>
                                </div>
                                <div>
                                    <p className='text-sm font-medium'>Expected Date: {selectedDelivery.expectedDate}</p>
                                    <p className='text-sm text-muted-foreground'>Total Items: {selectedDelivery.items}</p>
                                </div>
                            </div>

                            <div className='overflow-x-auto'>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Ordered Qty</TableHead>
                                            <TableHead>Received Qty</TableHead>
                                            <TableHead>Batch Number</TableHead>
                                            <TableHead>Expiry Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {receivingItems.length > 0 ? (
                                            receivingItems.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className='font-medium'>{item.product}</TableCell>
                                                    <TableCell>{item.ordered}</TableCell>
                                                    <TableCell>
                                                        <Input type='number' placeholder='0' className='w-24' max={item.ordered} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input placeholder='Batch #' className='w-32' />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input type='date' className='w-40' />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                                    No items to receive for this delivery
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className='flex gap-2'>
                                <Button onClick={handleCompleteReceiving}>Complete Receiving</Button>
                                <Button variant='outline' onClick={() => toast.info('Saved as draft')}>Save as Draft</Button>
                                <Button variant='outline' onClick={() => toast.info('Printing report...')}>Print Receiving Report</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recent Receipts */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Receipts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-3'>
                        {receipts.length > 0 ? (
                            receipts.map((receipt, index) => (
                                <div key={index} className='flex items-center justify-between border-b pb-2 last:border-0'>
                                    <div>
                                        <p className='font-medium'>{receipt.id} - {receipt.supplier}</p>
                                        <p className='text-sm text-muted-foreground'>{receipt.items} items • {receipt.date}</p>
                                    </div>
                                    <div className='text-right'>
                                        <p className='font-bold'>{receipt.value}</p>
                                        <Button size='sm' variant='outline'>
                                            View Receipt
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No recent receipts.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
