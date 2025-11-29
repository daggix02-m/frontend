import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Input, Dialog, DialogContent } from '@/components/ui/ui';
import { Select } from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';
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
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h2 className='text-3xl font-bold tracking-tight'>Inventory & Products</h2>
                    <p className='text-muted-foreground'>Manage your product catalog and stock levels.</p>
                </div>
                {!readOnly && (
                    <Button onClick={openAddModal}>
                        <Plus className='mr-2 h-4 w-4' /> Add Product
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                        <CardTitle>Product Catalog</CardTitle>
                        <div className='flex gap-2'>
                            <div className='relative w-full md:w-64'>
                                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                                <Input
                                    placeholder='Search products...'
                                    className='pl-8'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </Select>
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

            {/* Add/Edit Product Modal */}
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
