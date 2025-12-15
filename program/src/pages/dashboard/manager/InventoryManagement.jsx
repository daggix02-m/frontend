import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Input, Dialog, DialogContent, Badge } from '@/components/ui/ui';
import { Select } from '@/components/ui/select';
import { Plus, Search, Filter, Edit, Package } from 'lucide-react';
import { ProductForm } from './components/ProductForm';
import { pharmacistService } from '@/services/pharmacist.service';
import { apiClient } from '@/api/apiClient';
import { toast } from 'sonner';

export function InventoryManagement({ readOnly = false }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Pain Relief',
        stock: '',
        price: '',
        status: 'In Stock'
    });

    // Fetch inventory data from backend
    useEffect(() => {
        fetchInventory();
    }, [searchTerm, filterCategory]); // Add dependencies for search and filtering

    const fetchInventory = async (params = {}) => {
        try {
            setLoading(true);

            // Include search and filter parameters in the API call
            const queryParams = {
                ...params,
                search: searchTerm || undefined,
                category: filterCategory !== 'All' ? filterCategory : undefined
            };

            const response = await pharmacistService.getInventory(queryParams);

            if (response.success) {
                // Format the response to match the expected structure
                const formattedProducts = Array.isArray(response.data)
                    ? response.data.map(item => ({
                        id: item.id || item._id,
                        name: item.name || item.product_name || item.productName || 'Unknown',
                        category: item.category || item.category_name || 'General',
                        stock: item.stock || item.quantity || 0,
                        price: `ETB ${(item.price || item.unit_price || item.unitPrice || 0).toFixed(2)}`,
                        status: calculateStatus(item.stock || item.quantity || 0)
                    }))
                    : [];

                setProducts(formattedProducts);
            } else {
                // Fallback to empty array if response is not successful
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
            toast.error('Failed to load inventory data');
            setProducts([]); // Set to empty array as fallback
        } finally {
            setLoading(false);
        }
    };

    const calculateStatus = (stock) => {
        if (stock === 0) return 'Out of Stock';
        if (stock <= 50) return 'Low Stock';
        return 'In Stock';
    };

    const handleAddProduct = async (data) => {
        try {
            // Format the product data for API
            const productData = {
                name: data.name,
                category: data.category,
                stock: parseInt(data.stock),
                price: parseFloat(data.price),
                unit: data.unit || 'tablet' // Add unit if available
            };

            const response = await apiClient('/inventory', {
                method: 'POST',
                body: JSON.stringify(productData)
            });

            if (response.success) {
                toast.success('Product added successfully');
                setIsModalOpen(false);
                fetchInventory(); // Refresh the inventory list
            } else {
                toast.error(response.message || 'Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Failed to add product');
        }
    };

    const handleEditProduct = async (data) => {
        try {
            if (!editingProduct) return;

            // Format the product data for API
            const productData = {
                name: data.name,
                category: data.category,
                stock: parseInt(data.stock),
                price: parseFloat(data.price),
                unit: data.unit || 'tablet' // Add unit if available
            };

            const response = await apiClient(`/inventory/${editingProduct.id}`, {
                method: 'PUT',
                body: JSON.stringify(productData)
            });

            if (response.success) {
                toast.success('Product updated successfully');
                setIsModalOpen(false);
                setEditingProduct(null);
                fetchInventory(); // Refresh the inventory list
            } else {
                toast.error(response.message || 'Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Failed to update product');
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    // Use the products from the API directly since filtering is handled server-side
    const filteredProducts = products;

    // Extract unique categories for the filter dropdown
    const categories = ['All', ...new Set(products.map(p => p.category))];

    return (
        <div className='space-y-4 sm:space-y-6'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4'>
                <div>
                    <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Inventory & Products</h2>
                    <p className='text-sm text-muted-foreground mt-1'>Manage your product catalog and stock levels.</p>
                </div>
                {!readOnly && (
                    <Button onClick={openAddModal} className="w-full sm:w-auto">
                        <Plus className='mr-2 h-4 w-4' /> Add Product
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader className="space-y-4">
                    <CardTitle className="text-lg sm:text-xl">Product Catalog</CardTitle>
                    <div className='flex flex-col sm:flex-row gap-3'>
                        <div className='relative flex-1'>
                            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                            <Input
                                placeholder='Search products...'
                                className='pl-9'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full sm:w-[180px]">
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {}
                    <div className='md:hidden space-y-3 p-4'>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <Card key={product.id} className="overflow-hidden">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Package className="h-4 w-4 text-muted-foreground" />
                                                    <h3 className="font-semibold text-base">{product.name}</h3>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{product.category}</p>
                                            </div>
                                            <Badge className={`${product.status === 'In Stock' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'}`}>
                                                {product.status}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Stock Level</p>
                                                <p className="font-medium">{product.stock}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Price</p>
                                                <p className="font-medium">{product.price}</p>
                                            </div>
                                        </div>

                                        {!readOnly && (
                                            <Button
                                                variant='outline'
                                                size='sm'
                                                className="w-full"
                                                onClick={() => openEditModal(product)}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit Product
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className='text-center py-12 text-muted-foreground'>
                                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No products found matching "{searchTerm}"</p>
                            </div>
                        )}
                    </div>

                    {}
                    <div className='hidden md:block overflow-x-auto'>
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
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
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
                                                {!readOnly && (
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                        onClick={() => openEditModal(product)}
                                                    >
                                                        Edit
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>
                                            No products found matching "{searchTerm}"
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="p-0 bg-transparent border-none shadow-none w-full max-w-lg">
                    <ProductForm
                        initialData={editingProduct}
                        onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
                        onCancel={() => {
                            setIsModalOpen(false);
                            setEditingProduct(null);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
