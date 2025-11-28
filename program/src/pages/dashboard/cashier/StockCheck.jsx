import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Input } from '@/components/ui/ui';
import { Search } from 'lucide-react';

export function StockCheck() {
    const [searchTerm, setSearchTerm] = useState('');
    const products = [
        { id: 1, name: 'Paracetamol 500mg', stock: 1200, price: '$5.00', location: 'Shelf A1' },
        { id: 2, name: 'Amoxicillin 250mg', stock: 85, price: '$12.50', location: 'Shelf B3' },
        { id: 3, name: 'Vitamin C 1000mg', stock: 500, price: '$8.00', location: 'Aisle 2' },
    ];

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div>
                <h2 className='text-3xl font-bold tracking-tight'>Stock Check</h2>
                <p className='text-muted-foreground'>Quickly check product availability and price.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className='flex items-center gap-4'>
                        <div className='relative w-full md:max-w-md'>
                            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                            <Input
                                placeholder='Search for a product...'
                                className='pl-8'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className='overflow-x-auto'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Location</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className='font-medium'>{product.name}</TableCell>
                                            <TableCell>
                                                <span className={product.stock < 100 ? 'text-red-600 font-medium' : 'text-green-600'}>
                                                    {product.stock} units
                                                </span>
                                            </TableCell>
                                            <TableCell>{product.price}</TableCell>
                                            <TableCell>{product.location}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className='text-center py-4 text-muted-foreground'>
                                            No products found matching "{searchTerm}"
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
