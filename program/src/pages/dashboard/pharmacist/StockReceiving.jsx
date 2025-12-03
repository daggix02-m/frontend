import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button, Input } from '@/components/ui/ui';
import { Package, CheckCircle, Clock, Truck } from 'lucide-react';
import { toast } from 'sonner';

export function StockReceiving() {
    const [deliveries, setDeliveries] = useState([
        { id: 'DEL-001', supplier: 'MedSupply Co.', poNumber: 'PO-12345', items: 15, status: 'pending', expectedDate: '2025-11-28', value: 'ETB 2,450' },
        { id: 'DEL-002', supplier: 'PharmaDirect', poNumber: 'PO-12346', items: 8, status: 'in-transit', expectedDate: '2025-11-29', value: 'ETB 1,230' },
        { id: 'DEL-003', supplier: 'HealthWholesale', poNumber: 'PO-12347', items: 22, status: 'received', expectedDate: '2025-11-27', value: 'ETB 3,890' },
    ]);

    const [receivingItems] = useState([
        { id: 1, product: 'Paracetamol 500mg', ordered: 500, received: 0, batchNo: '', expiryDate: '' },
        { id: 2, product: 'Amoxicillin 250mg', ordered: 200, received: 0, batchNo: '', expiryDate: '' },
        { id: 3, product: 'Ibuprofen 400mg', ordered: 300, received: 0, batchNo: '', expiryDate: '' },
    ]);

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
        { title: 'Total Value', value: 'ETB 7,570', icon: Package, color: 'text-purple-600' },
    ];

    const handleReceiveDelivery = (id) => {
        if (window.confirm('Start receiving process for this delivery?')) {
            setDeliveries(deliveries.map(d =>
                d.id === id ? { ...d, status: 'received' } : d
            ));
            toast.success('Delivery marked as received!');
        }
    };

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Stock Receiving</h1>
                <p className='text-muted-foreground mt-2'>Receive deliveries and update stock quantities</p>
            </div>

            {}
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

            {}
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

            {}
            <Card>
                <CardHeader>
                    <CardTitle>Receive Delivery: DEL-001</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                        <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
                            <div>
                                <p className='text-sm font-medium'>Supplier: MedSupply Co.</p>
                                <p className='text-sm text-muted-foreground'>PO Number: PO-12345</p>
                            </div>
                            <div>
                                <p className='text-sm font-medium'>Expected Date: 2025-11-28</p>
                                <p className='text-sm text-muted-foreground'>Total Items: 15</p>
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
                                    {receivingItems.map((item) => (
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
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className='flex gap-2'>
                            <Button onClick={() => toast.success('Receiving completed!')}>Complete Receiving</Button>
                            <Button variant='outline' onClick={() => toast.info('Saved as draft')}>Save as Draft</Button>
                            <Button variant='outline' onClick={() => toast.info('Printing report...')}>Print Receiving Report</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Receipts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-3'>
                        {[
                            { id: 'DEL-003', supplier: 'HealthWholesale', items: 22, date: '2025-11-27', value: 'ETB 3,890' },
                            { id: 'DEL-002', supplier: 'PharmaDirect', items: 18, date: '2025-11-26', value: 'ETB 2,340' },
                            { id: 'DEL-001', supplier: 'MedSupply Co.', items: 15, date: '2025-11-25', value: 'ETB 1,890' },
                        ].map((receipt, index) => (
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
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
