import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Tag } from 'lucide-react';
import { FormCard, FADE_IN_VARIANTS } from '@/components/shared/FormCard';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select } from '@/components/ui/select';

export const ProductForm = ({ initialData, onSubmit, onCancel, className }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Pain Relief',
    stock: '',
    price: '',
    status: 'In Stock',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'Pain Relief',
        stock: initialData.stock || '',
        price: initialData.price ? initialData.price.replace('ETB ', '') : '',
        status: initialData.status || 'In Stock',
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <FormCard
      title={initialData ? 'Edit Product' : 'Add New Product'}
      onCancel={onCancel}
      className={className}
    >
      <form onSubmit={handleSubmit} className='grid grid-cols-1 gap-8 md:grid-cols-3'>
        {}
        <motion.div
          variants={FADE_IN_VARIANTS}
          className='flex flex-col items-center gap-3 md:col-span-1'
        >
          <div className='relative'>
            <Avatar className='h-24 w-24 border-2 border-dashed border-border flex items-center justify-center bg-muted/30'>
              <AvatarFallback className='bg-transparent'>
                <Package className='h-10 w-10 text-muted-foreground' />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className='text-center'>
            <p className='text-sm font-medium text-foreground'>Product Details</p>
            <p className='text-xs text-muted-foreground'>Manage inventory items</p>
          </div>
        </motion.div>

        {}
        <div className='flex flex-col gap-4 md:col-span-2'>
          <motion.div variants={FADE_IN_VARIANTS} className='grid w-full items-center gap-1.5'>
            <Label htmlFor='name'>Product Name</Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              placeholder='e.g., Ibuprofen 200mg'
              required
            />
          </motion.div>

          <motion.div variants={FADE_IN_VARIANTS} className='grid w-full items-center gap-1.5'>
            <Label htmlFor='category'>Category</Label>
            <Select
              id='category'
              name='category'
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value='Pain Relief'>Pain Relief</option>
              <option value='Antibiotics'>Antibiotics</option>
              <option value='Supplements'>Supplements</option>
              <option value='Cardiovascular'>Cardiovascular</option>
            </Select>
          </motion.div>

          <div className='grid grid-cols-2 gap-4'>
            <motion.div variants={FADE_IN_VARIANTS} className='space-y-2'>
              <Label htmlFor='stock'>Stock Level</Label>
              <Input
                id='stock'
                name='stock'
                type='number'
                placeholder='0'
                value={formData.stock}
                onChange={handleInputChange}
                required
              />
            </motion.div>
            <motion.div variants={FADE_IN_VARIANTS} className='space-y-2'>
              <Label htmlFor='price'>Price (ETB)</Label>
              <Input
                id='price'
                name='price'
                type='number'
                placeholder='0.00'
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </motion.div>
          </div>

          <motion.div variants={FADE_IN_VARIANTS} className='grid w-full items-center gap-1.5'>
            <Label htmlFor='status'>Status</Label>
            <Select id='status' name='status' value={formData.status} onChange={handleInputChange}>
              <option value='In Stock'>In Stock</option>
              <option value='Low Stock'>Low Stock</option>
              <option value='Out of Stock'>Out of Stock</option>
            </Select>
          </motion.div>
        </div>

        {}
        <motion.div variants={FADE_IN_VARIANTS} className='flex justify-end gap-3 md:col-span-3'>
          <Button type='button' variant='ghost' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit'>{initialData ? 'Save Changes' : 'Add Product'}</Button>
        </motion.div>
      </form>
    </FormCard>
  );
};
