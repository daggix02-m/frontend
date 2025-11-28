import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui/ui';
import { Printer, Mail, Download, FileText } from 'lucide-react';

export function Receipts() {
    const [recentReceipts] = useState([
        { id: 'RCP-001', customer: 'John Doe', amount: 45.50, items: 5, date: '2025-11-28 10:30 AM', method: 'Cash' },
        { id: 'RCP-002', customer: 'Jane Smith', amount: 78.90, items: 8, date: '2025-11-28 10:15 AM', method: 'Card' },
        { id: 'RCP-003', customer: 'Mike Johnson', amount: 23.40, items: 3, date: '2025-11-28 09:45 AM', method: 'Cash' },
        { id: 'RCP-004', customer: 'Sarah Williams', amount: 156.20, items: 12, date: '2025-11-28 09:20 AM', method: 'Card' },
    ]);

    const handlePrint = (receiptId) => {
        console.log('Printing receipt:', receiptId);
        // Backend integration needed
        alert(`Printing receipt ${receiptId}...`);
    };

    const handleEmail = (receiptId) => {
        console.log('Emailing receipt:', receiptId);
        // Backend integration needed
        const email = prompt('Enter customer email:');
        if (email) {
            alert(`Receipt ${receiptId} sent to ${email}`);
        }
    };

    const handleDownload = (receiptId) => {
        console.log('Downloading receipt:', receiptId);
        // Backend integration needed
        alert(`Downloading receipt ${receiptId} as PDF...`);
    };

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Receipts & Invoices</h1>
                <p className='text-muted-foreground mt-2'>Print, email, and manage customer receipts</p>
            </div>

            {/* Quick Stats */}
            <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                        <CardTitle className='text-sm font-medium'>Today's Receipts</CardTitle>
                        <FileText className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent className='px-6 pb-6'>
                        <div className='text-2xl font-bold'>45</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                        <CardTitle className='text-sm font-medium'>Printed</CardTitle>
                        <Printer className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent className='px-6 pb-6'>
                        <div className='text-2xl font-bold'>38</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                        <CardTitle className='text-sm font-medium'>Emailed</CardTitle>
                        <Mail className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent className='px-6 pb-6'>
                        <div className='text-2xl font-bold'>12</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                        <CardTitle className='text-sm font-medium'>Total Amount</CardTitle>
                        <Download className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent className='px-6 pb-6'>
                        <div className='text-2xl font-bold'>$2,345</div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Receipts */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Receipts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                        {recentReceipts.map((receipt) => (
                            <div key={receipt.id} className='border rounded-lg p-4'>
                                <div className='flex items-start justify-between mb-3'>
                                    <div>
                                        <p className='font-bold text-lg'>{receipt.id}</p>
                                        <p className='text-sm text-muted-foreground'>{receipt.customer}</p>
                                        <p className='text-xs text-muted-foreground'>{receipt.date}</p>
                                    </div>
                                    <div className='text-right'>
                                        <p className='font-bold text-xl'>${receipt.amount.toFixed(2)}</p>
                                        <p className='text-sm text-muted-foreground'>{receipt.items} items</p>
                                        <p className='text-xs text-muted-foreground'>{receipt.method}</p>
                                    </div>
                                </div>
                                <div className='flex gap-2'>
                                    <Button size='sm' variant='outline' onClick={() => handlePrint(receipt.id)}>
                                        <Printer className='mr-2 h-3 w-3' />
                                        Print
                                    </Button>
                                    <Button size='sm' variant='outline' onClick={() => handleEmail(receipt.id)}>
                                        <Mail className='mr-2 h-3 w-3' />
                                        Email
                                    </Button>
                                    <Button size='sm' variant='outline' onClick={() => handleDownload(receipt.id)}>
                                        <Download className='mr-2 h-3 w-3' />
                                        Download
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Receipt Preview */}
            <Card>
                <CardHeader>
                    <CardTitle>Receipt Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='border rounded-lg p-4 max-w-full mx-auto bg-white text-black'>
                        <div className='text-center mb-4'>
                            <h2 className='text-xl font-bold'>PharmaCare</h2>
                            <p className='text-sm'>Main Branch</p>
                            <p className='text-xs'>123 Health Street, Medical City</p>
                            <p className='text-xs'>Tel: (555) 123-4567</p>
                        </div>
                        <div className='border-t border-b py-2 my-3'>
                            <p className='text-xs'>Receipt #: RCP-001</p>
                            <p className='text-xs'>Date: 2025-11-28 10:30 AM</p>
                            <p className='text-xs'>Cashier: Current User</p>
                        </div>
                        <div className='space-y-1 mb-3'>
                            <div className='flex justify-between text-sm'>
                                <span>Paracetamol 500mg x2</span>
                                <span>$11.98</span>
                            </div>
                            <div className='flex justify-between text-sm'>
                                <span>Amoxicillin 250mg x1</span>
                                <span>$12.50</span>
                            </div>
                            <div className='flex justify-between text-sm'>
                                <span>Vitamin C 1000mg x1</span>
                                <span>$15.99</span>
                            </div>
                        </div>
                        <div className='border-t pt-2 space-y-1'>
                            <div className='flex justify-between text-sm'>
                                <span>Subtotal:</span>
                                <span>$40.47</span>
                            </div>
                            <div className='flex justify-between text-sm'>
                                <span>Discount (10%):</span>
                                <span>-$4.05</span>
                            </div>
                            <div className='flex justify-between font-bold'>
                                <span>Total:</span>
                                <span>$36.42</span>
                            </div>
                            <div className='flex justify-between text-sm'>
                                <span>Payment Method:</span>
                                <span>Cash</span>
                            </div>
                        </div>
                        <div className='text-center mt-4 text-xs'>
                            <p>Thank you for your purchase!</p>
                            <p>Please keep this receipt for your records</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
