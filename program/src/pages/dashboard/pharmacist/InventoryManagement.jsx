import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button, Input } from '@/components/ui/ui';
import { Package, AlertTriangle, TrendingDown, Search, Plus } from 'lucide-react';

export function InventoryManagement() {
    const [products, setProducts] = useState([
        { id: 1, name: 'Paracetamol 500mg', category: 'Pain Relief', stock: 450, minStock: 200, expiryDate: '2026-06-15', location: 'A1-B2' },
        { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotics', stock: 180, minStock: 150, expiryDate: '2025-12-20', location: 'A2-C3' },
        { id: 3, name: 'Ibuprofen 400mg', category: 'Pain Relief', stock: 85, minStock: 100, expiryDate: '2026-03-10', location: 'A1-B3' },
        { id: 4, name: 'Aspirin 100mg', category: 'Cardiovascular', stock: 320, minStock: 150, expiryDate: '2025-12-05', location: 'A3-D1' },
        { id: 5, name: 'Vitamin C 1000mg', category: 'Supplements', stock: 25, minStock: 50, expiryDate: '2026-08-30', location: 'B1-A2' },
    ]);

    const handleUpdateStock = (id) => {
        const newStock = prompt('Enter new stock level:');
        if (newStock && !isNaN(newStock)) {
            setProducts(products.map(p =>
                p.id === id ? { ...p, stock: parseInt(newStock) } : p
            ));
        }
    };

    const handleRequestStock = (id) => {
        alert(`Stock replenishment requested for product ID: ${id}`);
    };

    const handleMarkReturn = (id) => {
        if (window.confirm('Mark this item for return due to expiry?')) {
            alert(`Product ID: ${id} marked for return.`);
        }
    };

    const handleGlobalRequest = () => {
        alert('Global replenishment request sent for all low stock items.');
    };

    const getStockStatus = (stock, minStock) => {
        if (stock < minStock * 0.5) return { label: 'Critical', variant: 'destructive' };
        if (stock < minStock) return { label: 'Low', variant: 'default' };
        return { label: 'Good', variant: 'secondary' };
    };

    const getExpiryStatus = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const daysUntilExpiry = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry < 0) return { label: 'Expired', variant: 'destructive' };
        if (daysUntilExpiry < 30) return { label: 'Expiring Soon', variant: 'destructive' };
        if (daysUntilExpiry < 90) return { label: 'Near Expiry', variant: 'default' };
        return { label: 'Good', variant: 'secondary' };
    };

    const stats = [
        { title: 'Total Products', value: '234', icon: Package, color: 'text-blue-600' },
        { title: 'Low Stock Items', value: '12', icon: TrendingDown, color: 'text-orange-600' },
        { title: 'Expiring Soon', value: '8', icon: AlertTriangle, color: 'text-red-600' },
        { title: 'Out of Stock', value: '3', icon: AlertTriangle, color: 'text-red-600' },
    ];

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Inventory Management</h1>
                    <p className='text-muted-foreground mt-2'>Track and manage branch inventory</p>
                </div>
                <Button onClick={handleGlobalRequest}>
                    <Plus className='mr-2 h-4 w-4' />
                    Request Replenishment
                </Button>
            </div>

            {}
            <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
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

            {}
            <Card>
                <CardContent className='pt-6'>
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <div className='relative w-full md:max-w-md'>
                            <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                            <Input placeholder='Search products...' className='pl-10' />
                        </div>
                        <Button variant='outline'>Filter by Category</Button>
                        <Button variant='outline'>Filter by Status</Button>
                    </div>
                </CardContent>
            </Card>

            {}
            <Card>
                <CardHeader>
                    <CardTitle>Branch Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='overflow-x-auto'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Stock Level</TableHead>
                                    <TableHead>Min Stock</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Expiry Date</TableHead>
                                    <TableHead>Stock Status</TableHead>
                                    <TableHead>Expiry Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => {
                                    const stockStatus = getStockStatus(product.stock, product.minStock);
                                    const expiryStatus = getExpiryStatus(product.expiryDate);
                                    return (
                                        <TableRow key={product.id}>
                                            <TableCell className='font-medium'>{product.name}</TableCell>
                                            <TableCell>{product.category}</TableCell>
                                            <TableCell>{product.stock}</TableCell>
                                            <TableCell>{product.minStock}</TableCell>
                                            <TableCell>{product.location}</TableCell>
                                            <TableCell>{product.expiryDate}</TableCell>
                                            <TableCell>
                                                <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={expiryStatus.variant}>{expiryStatus.label}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button size='sm' variant='outline' onClick={() => handleUpdateStock(product.id)}>
                                                    Update
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {}
            <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <AlertTriangle className='h-5 w-5 text-red-600' />
                            Expiring Products
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-2'>
                            {products
                                .filter((p) => getExpiryStatus(p.expiryDate).label !== 'Good')
                                .map((product) => (
                                    <div key={product.id} className='flex items-center justify-between border-b pb-2'>
                                        <div>
                                            <p className='font-medium'>{product.name}</p>
                                            <p className='text-sm text-muted-foreground'>Expires: {product.expiryDate}</p>
                                        </div>
                                        <Button size='sm' variant='outline' onClick={() => handleMarkReturn(product.id)}>
                                            Mark for Return
                                        </Button>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <TrendingDown className='h-5 w-5 text-orange-600' />
                            Low Stock Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-2'>
                            {products
                                .filter((p) => p.stock < p.minStock)
                                .map((product) => (
                                    <div key={product.id} className='flex items-center justify-between border-b pb-2'>
                                        <div>
                                            <p className='font-medium'>{product.name}</p>
                                            <p className='text-sm text-muted-foreground'>
                                                Stock: {product.stock} / Min: {product.minStock}
                                            </p>
                                        </div>
                                        <Button size='sm' variant='outline' onClick={() => handleRequestStock(product.id)}>
                                            Request Stock
                                        </Button>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
