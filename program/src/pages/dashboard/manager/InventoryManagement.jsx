import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Input } from '@/components/ui/ui';
import { Select } from '@/components/ui/select';
import { Plus, Search, Filter, X } from 'lucide-react';

export function InventoryManagement({ readOnly = false }) {
    const [products, setProducts] = useState([
        { id: 1, name: 'Paracetamol 500mg', category: 'Pain Relief', stock: 1200, price: 'ETB 5.00', status: 'In Stock' },
        { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotics', stock: 85, price: 'ETB 12.50', status: 'Low Stock' },
        { id: 3, name: 'Vitamin C 1000mg', category: 'Supplements', stock: 500, price: 'ETB 8.00', status: 'In Stock' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Pain Relief',
        stock: '',
        price: '',
        status: 'In Stock'
    });

    const handleAddProduct = (e) => {
        e.preventDefault();
        const product = {
            id: products.length + 1,
            ...newProduct,
            price: `ETB ${newProduct.price}`
        };
        setProducts([...products, product]);
        setIsModalOpen(false);
        setNewProduct({ name: '', category: 'Pain Relief', stock: '', price: '', status: 'In Stock' });
    };

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h2 className='text-3xl font-bold tracking-tight'>Inventory & Products</h2>
                    <p className='text-muted-foreground'>Manage your product catalog and stock levels.</p>
                </div>
                {!readOnly && (
                    <Button onClick={() => setIsModalOpen(true)}>
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

            {/* Add Product Modal */}
            {isModalOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
                    <Card className='w-full max-w-md relative'>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <CardHeader>
                            <CardTitle>Add New Product</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddProduct} className='space-y-4'>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>Product Name</label>
                                    <Input
                                        placeholder='e.g., Ibuprofen 200mg'
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>Category</label>
                                    <Select
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    >
                                        <option value='Pain Relief'>Pain Relief</option>
                                        <option value='Antibiotics'>Antibiotics</option>
                                        <option value='Supplements'>Supplements</option>
                                        <option value='Cardiovascular'>Cardiovascular</option>
                                    </Select>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='space-y-2'>
                                        <label className='text-sm font-medium'>Stock Level</label>
                                        <Input
                                            type='number'
                                            placeholder='0'
                                            value={newProduct.stock}
                                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <label className='text-sm font-medium'>Price (ETB)</label>
                                        <Input
                                            type='number'
                                            placeholder='0.00'
                                            value={newProduct.price}
                                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>Status</label>
                                    <Select
                                        value={newProduct.status}
                                        onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
                                    >
                                        <option value='In Stock'>In Stock</option>
                                        <option value='Low Stock'>Low Stock</option>
                                        <option value='Out of Stock'>Out of Stock</option>
                                    </Select>
                                </div>
                                <div className='flex justify-end gap-2 pt-4'>
                                    <Button type='button' variant='outline' onClick={() => setIsModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type='submit'>Add Product</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
