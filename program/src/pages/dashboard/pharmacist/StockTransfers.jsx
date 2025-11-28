import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Badge } from '@/components/ui/ui';
import { Plus } from 'lucide-react';

export function StockTransfers() {
    const transfers = [
        { id: 1, from: 'Main Branch', to: 'Downtown Branch', items: 'Paracetamol (50)', status: 'Pending', date: '2023-10-27' },
        { id: 2, from: 'Main Branch', to: 'Westside Branch', items: 'Amoxicillin (20)', status: 'Completed', date: '2023-10-26' },
    ];

    const handleNewTransfer = () => {
        alert('Opening new transfer request form...');
    };

    const handleViewTransfer = (id) => {
        alert(`Viewing details for transfer #${id}`);
    };

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h2 className='text-3xl font-bold tracking-tight'>Stock Transfers</h2>
                    <p className='text-muted-foreground'>Request and manage stock transfers between branches.</p>
                </div>
                <Button onClick={handleNewTransfer}>
                    <Plus className='mr-2 h-4 w-4' /> New Transfer
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transfer History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='overflow-x-auto'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>From</TableHead>
                                    <TableHead>To</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className='text-right'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transfers.map((transfer) => (
                                    <TableRow key={transfer.id}>
                                        <TableCell>{transfer.from}</TableCell>
                                        <TableCell>{transfer.to}</TableCell>
                                        <TableCell>{transfer.items}</TableCell>
                                        <TableCell>{transfer.date}</TableCell>
                                        <TableCell>
                                            <Badge variant={transfer.status === 'Completed' ? 'default' : 'secondary'}>
                                                {transfer.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            <Button variant='ghost' size='sm' onClick={() => handleViewTransfer(transfer.id)}>View</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
