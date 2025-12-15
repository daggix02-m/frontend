import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui/ui';
import { Printer, Mail, Download, FileText, Eye } from 'lucide-react';
import { cashierService } from '@/services/cashier.service';
import { toast } from 'sonner';

export function Receipts() {
    const [recentReceipts, setRecentReceipts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [stats, setStats] = useState({
        todayReceipts: 0,
        printed: 0,
        emailed: 0,
        totalAmount: 0
    });

    useEffect(() => {
        fetchReceipts();
    }, []);

    const fetchReceipts = async () => {
        try {
            setLoading(true);
            const response = await cashierService.getReceipts();

            if (response.success) {
                const receiptsData = response.data || response.receipts || [];
                setRecentReceipts(Array.isArray(receiptsData) ? receiptsData : []);

                // Calculate stats
                const totalAmount = receiptsData.reduce((sum, r) => sum + (r.amount || 0), 0);
                setStats({
                    todayReceipts: receiptsData.length,
                    printed: receiptsData.filter(r => r.printed).length,
                    emailed: receiptsData.filter(r => r.emailed).length,
                    totalAmount
                });
            } else {
                toast.error('Failed to load receipts');
                setRecentReceipts([]);
            }
        } catch (error) {
            console.error('Error fetching receipts:', error);
            toast.error('Failed to load receipts');
            setRecentReceipts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectReceipt = async (receipt) => {
        try {
            setPreviewLoading(true);
            // If the receipt object already has items, use it directly
            if (receipt.items && Array.isArray(receipt.items)) {
                setSelectedReceipt(receipt);
            } else {
                // Otherwise fetch full details
                const response = await cashierService.getReceipt(receipt.id);
                if (response.success) {
                    setSelectedReceipt(response.data || response.receipt);
                } else {
                    toast.error('Failed to load receipt details');
                }
            }
        } catch (error) {
            console.error('Error fetching receipt details:', error);
            toast.error('Failed to load receipt details');
        } finally {
            setPreviewLoading(false);
        }
    };

    const handlePrint = async (receiptId) => {
        toast.info(`Printing receipt ${receiptId}...`);
        // Actual print logic would go here
    };

    const handleEmail = async (receiptId) => {
        const email = prompt('Enter customer email:');
        if (email) {
            try {
                const response = await cashierService.emailReceipt(receiptId, email);
                if (response.success) {
                    toast.success(`Receipt sent to ${email}`);
                    await fetchReceipts();
                } else {
                    toast.error(response.message || 'Failed to send email');
                }
            } catch (error) {
                console.error('Error emailing receipt:', error);
                toast.error('Failed to send email');
            }
        }
    };

    const handleDownload = async (receiptId) => {
        toast.info(`Downloading receipt ${receiptId} as PDF...`);
        // Actual download logic would go here
    };

    const filteredReceipts = recentReceipts.filter(receipt =>
        receipt.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.customer?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
                <h1 className='text-3xl font-bold tracking-tight'>Receipts & Invoices</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Receipts & Invoices</h1>
                <p className='text-muted-foreground mt-2'>Print, email, and manage customer receipts</p>
            </div>

            {/* Stats Cards */}
            <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                        <CardTitle className='text-sm font-medium'>Today's Receipts</CardTitle>
                        <FileText className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent className='px-6 pb-6'>
                        <div className='text-2xl font-bold'>{stats.todayReceipts}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                        <CardTitle className='text-sm font-medium'>Printed</CardTitle>
                        <Printer className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent className='px-6 pb-6'>
                        <div className='text-2xl font-bold'>{stats.printed}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                        <CardTitle className='text-sm font-medium'>Emailed</CardTitle>
                        <Mail className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent className='px-6 pb-6'>
                        <div className='text-2xl font-bold'>{stats.emailed}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                        <CardTitle className='text-sm font-medium'>Total Amount</CardTitle>
                        <Download className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent className='px-6 pb-6'>
                        <div className='text-2xl font-bold'>ETB {stats.totalAmount.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
                {/* Recent Receipts List */}
                <Card className="h-full">
                    <CardHeader>
                        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                            <CardTitle>Recent Receipts</CardTitle>
                            <Input
                                placeholder='Search receipts...'
                                className='max-w-sm'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4 max-h-[600px] overflow-y-auto pr-2'>
                            {filteredReceipts.length > 0 ? (
                                filteredReceipts.map((receipt) => (
                                    <div
                                        key={receipt.id}
                                        className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-muted/50 ${selectedReceipt?.id === receipt.id ? 'border-primary bg-muted/30' : ''}`}
                                        onClick={() => handleSelectReceipt(receipt)}
                                    >
                                        <div className='flex items-start justify-between mb-3'>
                                            <div>
                                                <p className='font-bold text-lg'>{receipt.id}</p>
                                                <p className='text-sm text-muted-foreground'>{receipt.customer || 'Walk-in Customer'}</p>
                                                <p className='text-xs text-muted-foreground'>{receipt.date}</p>
                                            </div>
                                            <div className='text-right'>
                                                <p className='font-bold text-xl'>ETB {receipt.amount?.toFixed(2)}</p>
                                                <p className='text-sm text-muted-foreground'>{receipt.items?.length || receipt.itemCount || 0} items</p>
                                                <p className='text-xs text-muted-foreground'>{receipt.method}</p>
                                            </div>
                                        </div>
                                        <div className='flex gap-2 justify-end'>
                                            <Button size='sm' variant='ghost' onClick={(e) => { e.stopPropagation(); handleSelectReceipt(receipt); }}>
                                                <Eye className='mr-2 h-3 w-3' />
                                                View
                                            </Button>
                                            <Button size='sm' variant='outline' onClick={(e) => { e.stopPropagation(); handlePrint(receipt.id); }}>
                                                <Printer className='mr-2 h-3 w-3' />
                                                Print
                                            </Button>
                                            <Button size='sm' variant='outline' onClick={(e) => { e.stopPropagation(); handleEmail(receipt.id); }}>
                                                <Mail className='mr-2 h-3 w-3' />
                                                Email
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className='text-center py-8 text-muted-foreground'>
                                    No receipts found matching "{searchTerm}"
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Receipt Preview */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Receipt Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {previewLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : selectedReceipt ? (
                            <div className='border rounded-lg p-6 max-w-md mx-auto bg-white text-black shadow-sm'>
                                <div className='text-center mb-6'>
                                    <h2 className='text-xl font-bold'>PharmaCare</h2>
                                    <p className='text-sm'>Main Branch</p>
                                    <p className='text-xs text-gray-500'>123 Health Street, Medical City</p>
                                    <p className='text-xs text-gray-500'>Tel: (555) 123-4567</p>
                                </div>
                                <div className='border-t border-b py-3 my-4 space-y-1'>
                                    <div className="flex justify-between">
                                        <span className='text-xs font-medium'>Receipt #:</span>
                                        <span className='text-xs'>{selectedReceipt.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className='text-xs font-medium'>Date:</span>
                                        <span className='text-xs'>{selectedReceipt.date}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className='text-xs font-medium'>Cashier:</span>
                                        <span className='text-xs'>{selectedReceipt.cashier || 'Current User'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className='text-xs font-medium'>Customer:</span>
                                        <span className='text-xs'>{selectedReceipt.customer || 'Walk-in'}</span>
                                    </div>
                                </div>

                                <div className='space-y-2 mb-4 min-h-[100px]'>
                                    <div className='flex justify-between text-xs font-bold border-b pb-1'>
                                        <span>Item</span>
                                        <span>Price</span>
                                    </div>
                                    {selectedReceipt.items && selectedReceipt.items.map((item, index) => (
                                        <div key={index} className='flex justify-between text-sm'>
                                            <span>{item.name} x{item.quantity}</span>
                                            <span>ETB {(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    {(!selectedReceipt.items || selectedReceipt.items.length === 0) && (
                                        <p className="text-center text-gray-400 text-sm py-4">No items details available</p>
                                    )}
                                </div>

                                <div className='border-t pt-3 space-y-1'>
                                    <div className='flex justify-between text-sm'>
                                        <span>Subtotal:</span>
                                        <span>ETB {(selectedReceipt.subtotal || selectedReceipt.amount).toFixed(2)}</span>
                                    </div>
                                    <div className='flex justify-between text-sm text-red-600'>
                                        <span>Discount:</span>
                                        <span>-ETB {(selectedReceipt.discount || 0).toFixed(2)}</span>
                                    </div>
                                    <div className='flex justify-between font-bold text-lg mt-2 pt-2 border-t border-dashed'>
                                        <span>Total:</span>
                                        <span>ETB {(selectedReceipt.total || selectedReceipt.amount).toFixed(2)}</span>
                                    </div>
                                    <div className='flex justify-between text-xs text-gray-500 mt-2'>
                                        <span>Payment Method:</span>
                                        <span className="capitalize">{selectedReceipt.method || selectedReceipt.paymentMethod}</span>
                                    </div>
                                </div>
                                <div className='text-center mt-6 text-xs text-gray-500'>
                                    <p>Thank you for your purchase!</p>
                                    <p>Please keep this receipt for your records</p>
                                </div>

                                <div className="mt-6 flex gap-2 justify-center print:hidden">
                                    <Button size="sm" onClick={() => handlePrint(selectedReceipt.id)}>
                                        <Printer className="h-4 w-4 mr-1" /> Print
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleDownload(selectedReceipt.id)}>
                                        <Download className="h-4 w-4 mr-1" /> PDF
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className='flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg'>
                                <FileText className="h-12 w-12 mb-2 opacity-20" />
                                <p>Select a receipt to view details</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
