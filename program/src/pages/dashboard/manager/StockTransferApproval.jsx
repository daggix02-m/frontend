import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button } from '@/components/ui/ui';
import { Package, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

export function StockTransferApproval() {
    const [transfers] = useState([
        { id: 'ST-001', from: 'Main Branch', to: 'Downtown Branch', product: 'Paracetamol 500mg', quantity: 500, requestedBy: 'John Pharmacist', status: 'pending', date: '2025-11-28' },
        { id: 'ST-002', from: 'Downtown Branch', to: 'Westside Branch', product: 'Amoxicillin 250mg', quantity: 200, requestedBy: 'Sarah Pharmacist', status: 'pending', date: '2025-11-27' },
        { id: 'ST-003', from: 'Main Branch', to: 'Eastside Branch', product: 'Ibuprofen 400mg', quantity: 300, requestedBy: 'Mike Pharmacist', status: 'approved', date: '2025-11-26' },
        { id: 'ST-004', from: 'Westside Branch', to: 'Main Branch', product: 'Aspirin 100mg', quantity: 150, requestedBy: 'Jane Pharmacist', status: 'rejected', date: '2025-11-25' },
    ]);

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'default',
            approved: 'secondary',
            rejected: 'destructive',
        };
        const icons = {
            pending: Clock,
            approved: CheckCircle,
            rejected: XCircle,
        };
        const Icon = icons[status];
        return (
            <Badge variant={variants[status]} className='flex items-center gap-1 w-fit'>
                <Icon className='h-3 w-3' />
                {status}
            </Badge>
        );
    };

    const stats = [
        { title: 'Pending Approvals', value: '8', icon: Clock, color: 'text-orange-600' },
        { title: 'Approved Today', value: '12', icon: CheckCircle, color: 'text-green-600' },
        { title: 'Rejected', value: '2', icon: XCircle, color: 'text-red-600' },
        { title: 'Total This Month', value: '145', icon: TrendingUp, color: 'text-blue-600' },
    ];

    const handleApprove = (id) => {
        console.log('Approving transfer:', id);
        // Backend integration needed
    };

    const handleReject = (id) => {
        console.log('Rejecting transfer:', id);
        // Backend integration needed
    };

    return (
        <div className='space-y-6 p-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Stock Transfer Approval</h1>
                <p className='text-muted-foreground mt-2'>Review and approve stock transfers between branches</p>
            </div>

            {/* Stats Grid */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Transfer Requests Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Transfer Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Transfer ID</TableHead>
                                <TableHead>From Branch</TableHead>
                                <TableHead>To Branch</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Requested By</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transfers.map((transfer) => (
                                <TableRow key={transfer.id}>
                                    <TableCell className='font-medium'>{transfer.id}</TableCell>
                                    <TableCell>{transfer.from}</TableCell>
                                    <TableCell>{transfer.to}</TableCell>
                                    <TableCell>{transfer.product}</TableCell>
                                    <TableCell>{transfer.quantity}</TableCell>
                                    <TableCell>{transfer.requestedBy}</TableCell>
                                    <TableCell>{transfer.date}</TableCell>
                                    <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                                    <TableCell>
                                        {transfer.status === 'pending' ? (
                                            <div className='flex gap-2'>
                                                <Button size='sm' variant='outline' onClick={() => handleApprove(transfer.id)}>
                                                    Approve
                                                </Button>
                                                <Button size='sm' variant='outline' onClick={() => handleReject(transfer.id)}>
                                                    Reject
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button size='sm' variant='outline'>
                                                View Details
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Recent Transfer History */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transfer History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-3'>
                        {[
                            { product: 'Paracetamol 500mg', from: 'Main', to: 'Downtown', qty: 500, status: 'completed' },
                            { product: 'Amoxicillin 250mg', from: 'Downtown', to: 'Westside', qty: 200, status: 'in-transit' },
                            { product: 'Ibuprofen 400mg', from: 'Main', to: 'Eastside', qty: 300, status: 'completed' },
                        ].map((item, index) => (
                            <div key={index} className='flex items-center justify-between border-b pb-2 last:border-0'>
                                <div>
                                    <p className='font-medium'>{item.product}</p>
                                    <p className='text-sm text-muted-foreground'>
                                        {item.from} → {item.to} • Qty: {item.qty}
                                    </p>
                                </div>
                                <Badge variant={item.status === 'completed' ? 'secondary' : 'default'}>{item.status}</Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
