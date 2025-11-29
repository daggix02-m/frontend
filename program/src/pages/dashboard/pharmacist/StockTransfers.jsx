import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Badge, Input } from '@/components/ui/ui';
import { Select } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

export function StockTransfers() {
    const [transfers, setTransfers] = useState([
        { id: 1, from: 'Main Branch', to: 'Downtown Branch', items: 'Paracetamol (50)', status: 'Pending', date: '2023-10-27' },
        { id: 2, from: 'Main Branch', to: 'Westside Branch', items: 'Amoxicillin (20)', status: 'Completed', date: '2023-10-26' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTransfer, setNewTransfer] = useState({
        to: '',
        items: '',
        priority: 'Normal'
    });

    const handleNewTransfer = () => {
        setIsModalOpen(true);
    };

    const handleCreateTransfer = (e) => {
        e.preventDefault();
        const transfer = {
            id: transfers.length + 1,
            from: 'Main Branch', // Assuming current user is at Main Branch
            to: newTransfer.to,
            items: newTransfer.items,
            status: 'Pending',
            date: new Date().toISOString().split('T')[0]
        };
        setTransfers([transfer, ...transfers]);
        setIsModalOpen(false);
        setNewTransfer({ to: '', items: '', priority: 'Normal' });
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

            {/* New Transfer Modal */}
            {isModalOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
                    <Card className='w-full max-w-md relative'>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <CardHeader>
                            <CardTitle>New Stock Transfer Request</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateTransfer} className='space-y-4'>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>Target Branch</label>
                                    <Select
                                        value={newTransfer.to}
                                        onChange={(e) => setNewTransfer({ ...newTransfer, to: e.target.value })}
                                        required
                                    >
                                        <option value=''>Select Branch</option>
                                        <option value='Downtown Branch'>Downtown Branch</option>
                                        <option value='Westside Branch'>Westside Branch</option>
                                    </Select>
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>Items (Name & Quantity)</label>
                                    <Input
                                        placeholder='e.g., Paracetamol (100), Amoxicillin (50)'
                                        value={newTransfer.items}
                                        onChange={(e) => setNewTransfer({ ...newTransfer, items: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>Priority</label>
                                    <Select
                                        value={newTransfer.priority}
                                        onChange={(e) => setNewTransfer({ ...newTransfer, priority: e.target.value })}
                                    >
                                        <option value='Normal'>Normal</option>
                                        <option value='Urgent'>Urgent</option>
                                    </Select>
                                </div>
                                <div className='flex justify-end gap-2 pt-4'>
                                    <Button type='button' variant='outline' onClick={() => setIsModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type='submit'>Submit Request</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
