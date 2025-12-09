import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/ui';
import { DollarSign, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';

export function BillingManagement() {
    const [billingIssues] = useState([
        {
            id: 1,
            pharmacy: 'Green Valley Pharmacy',
            issue: 'Payment Failed',
            amount: 'ETB 299.00',
            status: 'pending',
            date: '2025-11-25',
            description: 'Credit card payment failed due to insufficient funds. Customer notified via email.',
            transactionId: 'TXN-2025-001',
            contactEmail: 'billing@greenvalley.com',
            lastAttempt: '2025-11-25 14:30'
        },
        {
            id: 2,
            pharmacy: 'City Health Pharmacy',
            issue: 'Refund Request',
            amount: 'ETB 149.00',
            status: 'in-progress',
            date: '2025-11-24',
            description: 'Customer requested refund for double billing. Finance team reviewing.',
            transactionId: 'TXN-2025-002',
            contactEmail: 'admin@cityhealth.com',
            lastAttempt: '2025-11-24 10:15'
        },
        {
            id: 3,
            pharmacy: 'MediCare Plus',
            issue: 'Billing Dispute',
            amount: 'ETB 499.00',
            status: 'resolved',
            date: '2025-11-23',
            description: 'Dispute regarding subscription tier resolved. Upgraded to Enterprise plan.',
            transactionId: 'TXN-2025-003',
            contactEmail: 'support@medicareplus.com',
            lastAttempt: '2025-11-23 16:45'
        },
        {
            id: 4,
            pharmacy: 'Wellness Pharmacy',
            issue: 'Card Declined',
            amount: 'ETB 299.00',
            status: 'pending',
            date: '2025-11-22',
            description: 'Payment card declined multiple times. Customer needs to update payment method.',
            transactionId: 'TXN-2025-004',
            contactEmail: 'finance@wellnesspharm.com',
            lastAttempt: '2025-11-22 09:20'
        },
    ]);

    const [selectedIssue, setSelectedIssue] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const handleViewDetails = (issue) => {
        setSelectedIssue(issue);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsModalOpen(false);
        setSelectedIssue(null);
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'destructive',
            'in-progress': 'default',
            resolved: 'secondary',
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    const stats = [
        { title: 'Total Revenue', value: 'ETB 45,231', icon: DollarSign, trend: '+12.5%' },
        { title: 'Pending Issues', value: '8', icon: AlertCircle, trend: '-3' },
        { title: 'Resolved Today', value: '12', icon: CheckCircle, trend: '+5' },
        { title: 'Avg Resolution Time', value: '2.3 hrs', icon: Clock, trend: '-0.5 hrs' },
    ];

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Billing Management</h1>
                <p className='text-muted-foreground mt-2'>Handle billing issues and payment disputes</p>
            </div>

            { }
            <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                            <stat.icon className='h-4 w-4 text-muted-foreground' />
                        </CardHeader>
                        <CardContent className='px-6 pb-6'>
                            <div className='text-2xl font-bold'>{stat.value}</div>
                            <p className='text-xs text-muted-foreground mt-1'>{stat.trend} from last month</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            { }
            <Card>
                <CardHeader>
                    <CardTitle>Recent Billing Issues</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='overflow-x-auto'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Pharmacy</TableHead>
                                    <TableHead>Issue Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {billingIssues.map((issue) => (
                                    <TableRow key={issue.id}>
                                        <TableCell className='font-medium'>{issue.pharmacy}</TableCell>
                                        <TableCell>{issue.issue}</TableCell>
                                        <TableCell>{issue.amount}</TableCell>
                                        <TableCell>{issue.date}</TableCell>
                                        <TableCell>{getStatusBadge(issue.status)}</TableCell>
                                        <TableCell>
                                            <Button
                                                size='sm'
                                                variant='outline'
                                                onClick={() => handleViewDetails(issue)}
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            { }
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className='flex items-center justify-between border-b pb-3'>
                                <div>
                                    <p className='font-medium'>Payment from Pharmacy #{i}</p>
                                    <p className='text-sm text-muted-foreground'>Subscription - Pro Plan</p>
                                </div>
                                <div className='text-right'>
                                    <p className='font-bold text-green-600'>+ETB 299.00</p>
                                    <p className='text-xs text-muted-foreground'>Nov {28 - i}, 2025</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            { }
            <Dialog open={isDetailsModalOpen} onOpenChange={handleCloseDetails}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Billing Issue Details</DialogTitle>
                    </DialogHeader>

                    {selectedIssue && (
                        <div className='space-y-6 p-4'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div>
                                    <p className='text-sm font-medium text-muted-foreground'>Pharmacy Name</p>
                                    <p className='text-base font-semibold mt-1'>{selectedIssue.pharmacy}</p>
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-muted-foreground'>Issue Type</p>
                                    <p className='text-base font-semibold mt-1'>{selectedIssue.issue}</p>
                                </div>
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div>
                                    <p className='text-sm font-medium text-muted-foreground'>Amount</p>
                                    <p className='text-base font-semibold mt-1'>{selectedIssue.amount}</p>
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-muted-foreground'>Status</p>
                                    <div className='mt-1'>{getStatusBadge(selectedIssue.status)}</div>
                                </div>
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div>
                                    <p className='text-sm font-medium text-muted-foreground'>Date Reported</p>
                                    <p className='text-base font-semibold mt-1'>{selectedIssue.date}</p>
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-muted-foreground'>Transaction ID</p>
                                    <p className='text-base font-semibold mt-1'>{selectedIssue.transactionId}</p>
                                </div>
                            </div>

                            <div>
                                <p className='text-sm font-medium text-muted-foreground'>Contact Email</p>
                                <p className='text-base font-semibold mt-1'>{selectedIssue.contactEmail}</p>
                            </div>

                            <div>
                                <p className='text-sm font-medium text-muted-foreground'>Last Payment Attempt</p>
                                <p className='text-base font-semibold mt-1'>{selectedIssue.lastAttempt}</p>
                            </div>

                            <div>
                                <p className='text-sm font-medium text-muted-foreground'>Description</p>
                                <p className='text-base mt-1 text-gray-700 dark:text-gray-300'>{selectedIssue.description}</p>
                            </div>

                            <div className='flex gap-3 justify-end pt-4 border-t'>
                                <Button variant='outline' onClick={handleCloseDetails}>
                                    Close
                                </Button>
                                <Button>
                                    Take Action
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
