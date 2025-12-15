import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button, Input } from '@/components/ui/ui';
import { Package, AlertTriangle, TrendingDown, Search, Plus } from 'lucide-react';
import { pharmacistService } from '@/services/pharmacist.service';
import { toast } from 'sonner';

export function InventoryManagement() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStockItems: 0,
        expiringSoon: 0,
        outOfStock: 0
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await pharmacistService.getInventory();

            if (response.success) {
                const inventoryData = response.data || response.inventory || [];
                const formattedProducts = Array.isArray(inventoryData)
                    ? inventoryData.map(item => ({
                        id: item.id || item._id,
                        name: item.name || item.product_name || 'Unknown',
                        category: item.category || 'General',
                        stock: item.stock || item.quantity || 0,
                        minStock: item.minStock || item.min_stock || item.minimum_stock || 100,
                        expiryDate: item.expiryDate || item.expiry_date || item.expiration_date || '2026-12-31',
                        location: item.location || item.shelf_location || 'N/A'
                    }))
                    : [];

                setProducts(formattedProducts);

                // Calculate stats
                const lowStock = formattedProducts.filter(p => p.stock < p.minStock).length;
                const expiring = formattedProducts.filter(p => {
                    const daysUntilExpiry = Math.floor((new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                    return daysUntilExpiry < 90 && daysUntilExpiry >= 0;
                }).length;
                const outOfStock = formattedProducts.filter(p => p.stock === 0).length;

                setStats({
                    totalProducts: formattedProducts.length,
                    lowStockItems: lowStock,
                    expiringSoon: expiring,
                    outOfStock
                });
            } else {
                toast.error('Failed to load inventory');
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
            toast.error('Failed to load inventory');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStock = async (id) => {
        const newStock = prompt('Enter new stock level:');
        if (newStock && !isNaN(newStock)) {
            try {
                const response = await pharmacistService.updateStock(id, parseInt(newStock));
                if (response.success) {
                    toast.success('Stock updated successfully');
                    await fetchInventory();
                } else {
                    toast.error(response.message || 'Failed to update stock');
                }
            } catch (error) {
                console.error('Error updating stock:', error);
                toast.error('Failed to update stock');
            }
        }
    };

    const handleRequestStock = async (id) => {
        try {
            const response = await pharmacistService.requestReplenishment([id], [100]);
            if (response.success) {
                toast.success('Stock replenishment requested');
            } else {
                toast.error(response.message || 'Failed to request stock');
            }
        } catch (error) {
            console.error('Error requesting stock:', error);
            toast.error('Failed to request stock');
        }
    };

    const handleMarkReturn = async (id) => {
        if (window.confirm('Mark this item for return due to expiry?')) {
            try {
                const response = await pharmacistService.markForReturn(id, 'Expiry');
                if (response.success) {
                    toast.success('Item marked for return');
                    await fetchInventory();
                } else {
                    toast.error(response.message || 'Failed to mark for return');
                }
            } catch (error) {
                console.error('Error marking for return:', error);
                toast.error('Failed to mark for return');
            }
        }
    };

    const handleGlobalRequest = async () => {
        const lowStockProducts = products.filter(p => p.stock < p.minStock);
        if (lowStockProducts.length === 0) {
            toast.info('No low stock items to request');
            return;
        }

        try {
            const productIds = lowStockProducts.map(p => p.id);
            const quantities = lowStockProducts.map(p => p.minStock - p.stock);
            const response = await pharmacistService.requestReplenishment(productIds, quantities);

            if (response.success) {
                toast.success('Global replenishment request sent');
            } else {
                toast.error(response.message || 'Failed to send request');
            }
        } catch (error) {
            console.error('Error sending global request:', error);
            toast.error('Failed to send request');
        }
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

    const statsDisplay = [
        { title: 'Total Products', value: stats.totalProducts.toString(), icon: Package, color: 'text-blue-600' },
        { title: 'Low Stock Items', value: stats.lowStockItems.toString(), icon: TrendingDown, color: 'text-orange-600' },
        { title: 'Expiring Soon', value: stats.expiringSoon.toString(), icon: AlertTriangle, color: 'text-red-600' },
        { title: 'Out of Stock', value: stats.outOfStock.toString(), icon: AlertTriangle, color: 'text-red-600' },
    ];

    if (loading) {
        return (
            <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
                <h1 className='text-3xl font-bold tracking-tight'>Inventory Management</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

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

            {/* Stats Cards */}
            <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
                {statsDisplay.map((stat, index) => (
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

            { }
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

            { }
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

            { }
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
