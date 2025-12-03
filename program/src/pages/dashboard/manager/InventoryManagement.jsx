import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Input, Dialog, DialogContent, Badge } from '@/components/ui/ui';
import { Select } from '@/components/ui/select';
import { Plus, Search, Filter, Edit, Package } from 'lucide-react';
import { ProductForm } from './components/ProductForm';

export function InventoryManagement({ readOnly = false }) {
    const [products, setProducts] = useState([
        { id: 1, name: 'Paracetamol 500mg', category: 'Pain Relief', stock: 1200, price: 'ETB 5.00', status: 'In Stock' },
        { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotics', stock: 85, price: 'ETB 12.50', status: 'Low Stock' },
        { id: 3, name: 'Vitamin C 1000mg', category: 'Supplements', stock: 500, price: 'ETB 8.00', status: 'In Stock' },
    ]);

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

    const handleAddProduct = (data) => {
        const product = {
            id: products.length + 1,
            ...data,
            price: `ETB ${data.price}`
        };
        setProducts([...products, product]);
        setIsModalOpen(false);
    };

    const handleEditProduct = (data) => {
        setProducts(products.map(p =>
            p.id === editingProduct.id
                ? { ...data, id: p.id, price: `ETB ${data.price}` }
                : p
        ));
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterCategory === 'All' || product.category === filterCategory;
        return matchesSearch && matchesFilter;
    });

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
