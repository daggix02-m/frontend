import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Badge, Input, Dialog, DialogContent, DialogTrigger } from '@/components/ui/ui';
import { Select } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { StockTransferForm } from './components/StockTransferForm';

export function StockTransfers() {
    const [transfers, setTransfers] = useState([
        { id: 1, from: 'Main Branch', to: 'Downtown Branch', items: 'Paracetamol (50)', status: 'Pending', date: '2023-10-27' },
        { id: 2, from: 'Main Branch', to: 'Westside Branch', items: 'Amoxicillin (20)', status: 'Completed', date: '2023-10-26' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleNewTransfer = () => {
        setIsModalOpen(true);
    };

    const handleCreateTransfer = (data) => {
        const transfer = {
            id: transfers.length + 1,
            from: 'Main Branch',
            to: data.to,
            items: data.items,
            status: 'Pending',
            date: new Date().toISOString().split('T')[0]
        };
        setTransfers([transfer, ...transfers]);
        setIsModalOpen(false);
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

            {}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="p-0 bg-transparent border-none shadow-none w-full max-w-lg">
                    <StockTransferForm
                        onSubmit={handleCreateTransfer}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
