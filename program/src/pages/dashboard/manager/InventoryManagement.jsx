import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Input } from '@/components/ui/ui';
import { Plus, Search, Filter } from 'lucide-react';

export function InventoryManagement({ readOnly = false }) {
    const products = [
        { id: 1, name: 'Paracetamol 500mg', category: 'Pain Relief', stock: 1200, price: '$5.00', status: 'In Stock' },
        { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotics', stock: 85, price: '$12.50', status: 'Low Stock' },
        { id: 3, name: 'Vitamin C 1000mg', category: 'Supplements', stock: 500, price: '$8.00', status: 'In Stock' },
    ];

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h2 className='text-3xl font-bold tracking-tight'>Inventory & Products</h2>
                    <p className='text-muted-foreground'>Manage your product catalog and stock levels.</p>
                </div>
                {!readOnly && (
                    <Button>
                        <Plus className='mr-2 h-4 w-4' /> Add Product
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                        <CardTitle>Product Catalog</CardTitle>
                        <div className='flex gap-2'>
                            <div className='relative w-full'>
                                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                                <Input placeholder='Search products...' className='pl-8' />
                            </div>
                            <Button variant='outline' size='icon'>
                                <Filter className='h-4 w-4' />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className='overflow-x-auto'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Stock Level</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className='text-right'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className='font-medium'>{product.name}</TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.status === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                } `}>
                                                {product.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            {!readOnly && <Button variant='ghost' size='sm'>Edit</Button>}
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
