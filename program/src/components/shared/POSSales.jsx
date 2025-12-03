import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge } from '@/components/ui/ui';
import { Search, Plus, Minus, Trash2, DollarSign, CreditCard, Banknote } from 'lucide-react';

export function POSSales({ role = 'cashier' }) {
    const [cart, setCart] = useState([
        { id: 1, name: 'Paracetamol 500mg', price: 5.99, quantity: 2, stock: 150 },
        { id: 2, name: 'Amoxicillin 250mg', price: 12.50, quantity: 1, stock: 80 },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cash');

    const products = [
        { id: 3, name: 'Ibuprofen 400mg', price: 8.99, stock: 200 },
        { id: 4, name: 'Aspirin 100mg', price: 4.50, stock: 300 },
        { id: 5, name: 'Vitamin C 1000mg', price: 15.99, stock: 120 },
    ];

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;

    const updateQuantity = (id, change) => {
        setCart(
            cart.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
            )
        );
    };

    const removeItem = (id) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    const addToCart = (product) => {
        const existing = cart.find((item) => item.id === product.id);
        if (existing) {
            updateQuantity(product.id, 1);
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;
        if (window.confirm(`Process payment of $${total.toFixed(2)} via ${paymentMethod}?`)) {

            alert('Sale processed successfully!');
            setCart([]);
            setDiscount(0);
            setPaymentMethod('cash');
        }
    };

    const handleHoldTransaction = () => {
        if (cart.length === 0) return;
        alert('Transaction held successfully.');
        setCart([]);
    };

    const handleRetrieveHeld = () => {
        alert('No held transactions found.');
    };

    const handleProcessReturn = () => {
        const receiptId = prompt('Enter Receipt ID for return:');
        if (receiptId) {
            alert(`Processing return for receipt: ${receiptId}`);
        }
    };

    const canApplyDiscount = role === 'manager' || discount <= 10;

    return (
        <div className='space-y-6 p-4 md:p-8'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>POS Sales</h1>
                <p className='text-muted-foreground mt-2'>Process sales transactions and manage checkout</p>
            </div>

            <div className='grid gap-6 lg:grid-cols-3'>
                {}
                <div className='lg:col-span-2 space-y-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Search</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='relative'>
                                <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                                <Input
                                    placeholder='Search products by name or barcode...'
                                    className='pl-10'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {}
                    <Card>
                        <CardHeader>
                            <CardTitle>Available Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='grid gap-3 md:grid-cols-2'>
                                {products
                                    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((product) => (
                                        <div
                                            key={product.id}
                                            className='flex items-center justify-between gap-3 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer'
                                            onClick={() => addToCart(product)}
                                        >
                                            <div className='flex-1 min-w-0'>
                                                <p className='font-medium truncate'>{product.name}</p>
                                                <p className='text-sm text-muted-foreground'>Stock: {product.stock}</p>
                                            </div>
                                            <div className='text-right flex-shrink-0 flex items-center gap-2'>
                                                <div>
                                                    <p className='font-bold whitespace-nowrap'>${product.price.toFixed(2)}</p>
                                                </div>
                                                <Button size='sm' variant='outline'>
                                                    <Plus className='h-3 w-3' />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>

                    {}
                    <Card>
                        <CardHeader>
                            <CardTitle>Shopping Cart</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {cart.length === 0 ? (
                                <p className='text-center text-muted-foreground py-8'>Cart is empty</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cart.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className='font-medium'>{item.name}</TableCell>
                                                <TableCell>${item.price.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <div className='flex items-center gap-2'>
                                                        <Button size='sm' variant='outline' onClick={() => updateQuantity(item.id, -1)}>
                                                            <Minus className='h-3 w-3' />
                                                        </Button>
                                                        <span className='w-8 text-center'>{item.quantity}</span>
                                                        <Button size='sm' variant='outline' onClick={() => updateQuantity(item.id, 1)}>
                                                            <Plus className='h-3 w-3' />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell className='font-bold'>${(item.price * item.quantity).toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Button size='sm' variant='outline' onClick={() => removeItem(item.id)}>
                                                        <Trash2 className='h-3 w-3' />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {}
                <div className='space-y-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Checkout</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='space-y-2'>
                                <div className='flex justify-between'>
                                    <span>Subtotal:</span>
                                    <span className='font-bold'>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>
                                        Discount % {!canApplyDiscount && '(Max 10%)'}
                                    </label>
                                    <Input
                                        type='number'
                                        value={discount}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value) || 0;
                                            setDiscount(canApplyDiscount ? val : Math.min(val, 10));
                                        }}
                                        max={canApplyDiscount ? 100 : 10}
                                    />
                                </div>
                                <div className='flex justify-between text-red-600'>
                                    <span>Discount:</span>
                                    <span>-${discountAmount.toFixed(2)}</span>
                                </div>
                                <div className='flex justify-between text-xl font-bold border-t pt-2'>
                                    <span>Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <p className='text-sm font-medium'>Payment Method</p>
                                <div className='grid grid-cols-2 gap-2'>
                                    <Button
                                        variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                                        className='h-20 flex-col'
                                        onClick={() => setPaymentMethod('cash')}
                                    >
                                        <Banknote className='h-6 w-6 mb-1' />
                                        Cash
                                    </Button>
                                    <Button
                                        variant={paymentMethod === 'card' ? 'default' : 'outline'}
                                        className='h-20 flex-col'
                                        onClick={() => setPaymentMethod('card')}
                                    >
                                        <CreditCard className='h-6 w-6 mb-1' />
                                        Card
                                    </Button>
                                </div>
                            </div>

                            <Button className='w-full' size='lg' onClick={handleCheckout} disabled={cart.length === 0}>
                                <DollarSign className='mr-2 h-4 w-4' />
                                Complete Sale
                            </Button>

                            {role === 'manager' && (
                                <Badge variant='secondary' className='w-full justify-center'>
                                    Manager Mode - Full Access
                                </Badge>
                            )}
                        </CardContent>
                    </Card>

                    {}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-2'>
                            <Button variant='outline' className='w-full' onClick={handleHoldTransaction}>
                                Hold Transaction
                            </Button>
                            <Button variant='outline' className='w-full' onClick={handleRetrieveHeld}>
                                Retrieve Held
                            </Button>
                            <Button variant='outline' className='w-full' onClick={handleProcessReturn}>
                                Process Return
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
