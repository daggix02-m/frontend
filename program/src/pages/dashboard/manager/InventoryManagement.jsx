import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Search,
  Plus,
  Package,
  AlertTriangle,
  Calendar,
  Pill,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { managerService } from '@/services/manager.service';
import { toast } from 'sonner';

export function InventoryManagement() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddMedicineForm, setShowAddMedicineForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    category: '',
    price: '',
    stock_quantity: '',
    expiry_date: '',
    description: ''
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await managerService.getProducts();

      if (response.success) {
        setMedicines(Array.isArray(response.data) ? response.data : []);
      } else {
        toast.error(response.message || 'Failed to fetch medicines');
        setMedicines([]);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      toast.error('Failed to fetch medicines');
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();

    try {
      const medicineData = {
        ...newMedicine,
        price: parseFloat(newMedicine.price),
        stock_quantity: parseInt(newMedicine.stock_quantity)
      };

      const response = await managerService.createProduct(medicineData);

      if (response.success) {
        toast.success('Medicine added successfully');
        setNewMedicine({
          name: '',
          category: '',
          price: '',
          stock_quantity: '',
          expiry_date: '',
          description: ''
        });
        setShowAddMedicineForm(false);
        fetchMedicines(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to add medicine');
      }
    } catch (error) {
      console.error('Error adding medicine:', error);
      toast.error('Failed to add medicine');
    }
  };

  const handleDeleteMedicine = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        const response = await managerService.deleteProduct(id);

        if (response.success) {
          toast.success('Medicine deleted successfully');
          fetchMedicines(); // Refresh the list
        } else {
          toast.error(response.message || 'Failed to delete medicine');
        }
      } catch (error) {
        console.error('Error deleting medicine:', error);
        toast.error('Failed to delete medicine');
      }
    }
  };

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockMedicines = medicines.filter(medicine => medicine.stock_quantity <= 5);

  return (
    <div className='space-y-6 p-4 md:p-8'>
      <div className='space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Inventory Management</h2>
        <p className='text-muted-foreground'>
          Manage your pharmacy's medicine inventory
        </p>
      </div>

      {/* Low Stock Alert */}
      {lowStockMedicines.length > 0 && (
        <Card className='border-l-4 border-l-yellow-500'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <AlertTriangle className='h-5 w-5 text-yellow-500' />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              {lowStockMedicines.length} medicine{lowStockMedicines.length > 1 ? 's' : ''} running low on stock.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Search and Add Medicine */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-2.5 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search medicines...'
            className='pl-8'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowAddMedicineForm(!showAddMedicineForm)}>
          <Plus className='h-4 w-4 mr-2' />
          Add Medicine
        </Button>
      </div>

      {/* Add Medicine Form */}
      {showAddMedicineForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Medicine</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddMedicine} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium'>Name</label>
                  <Input
                    value={newMedicine.name}
                    onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className='text-sm font-medium'>Category</label>
                  <Input
                    value={newMedicine.category}
                    onChange={(e) => setNewMedicine({ ...newMedicine, category: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className='text-sm font-medium'>Price (ETB)</label>
                  <Input
                    type='number'
                    value={newMedicine.price}
                    onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className='text-sm font-medium'>Stock Quantity</label>
                  <Input
                    type='number'
                    value={newMedicine.stock_quantity}
                    onChange={(e) => setNewMedicine({ ...newMedicine, stock_quantity: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className='text-sm font-medium'>Expiry Date</label>
                  <Input
                    type='date'
                    value={newMedicine.expiry_date}
                    onChange={(e) => setNewMedicine({ ...newMedicine, expiry_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className='text-sm font-medium'>Description</label>
                <Input
                  value={newMedicine.description}
                  onChange={(e) => setNewMedicine({ ...newMedicine, description: e.target.value })}
                />
              </div>
              <div className='flex gap-2'>
                <Button type='submit'>Add Medicine</Button>
                <Button type='button' variant='outline' onClick={() => setShowAddMedicineForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Medicine List */}
      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {filteredMedicines.map((medicine) => (
            <Card key={medicine.id || medicine._id} className='overflow-hidden'>
              <CardHeader className='pb-2'>
                <div className='flex justify-between items-start'>
                  <CardTitle className='text-lg'>{medicine.name}</CardTitle>
                  <Pill className='h-5 w-5 text-blue-500' />
                </div>
                <div className='text-sm text-muted-foreground'>{medicine.category}</div>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>Price:</span>
                    <span className='font-medium'>ETB {medicine.price?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>Stock:</span>
                    <span className={`font-medium ${medicine.stock_quantity <= 5 ? 'text-red-500' : 'text-green-500'}`}>
                      {medicine.stock_quantity} {medicine.stock_quantity <= 5 ? '(Low)' : ''}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>Expiry:</span>
                    <span className='font-medium'>{medicine.expiry_date || 'N/A'}</span>
                  </div>
                  <div className='text-sm text-muted-foreground line-clamp-2'>
                    {medicine.description || 'No description available'}
                  </div>
                </div>
                <div className='flex gap-2 mt-4'>
                  <Button size='sm' variant='outline' className='flex-1'>
                    <Edit className='h-4 w-4 mr-1' />
                    Edit
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    className='flex-1'
                    onClick={() => handleDeleteMedicine(medicine.id || medicine._id)}
                  >
                    <Trash2 className='h-4 w-4 mr-1' />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredMedicines.length === 0 && !loading && (
        <div className='text-center py-12'>
          <Package className='h-12 w-12 mx-auto text-muted-foreground' />
          <h3 className='mt-2 text-sm font-medium'>No medicines found</h3>
          <p className='mt-1 text-sm text-muted-foreground'>
            {searchTerm ? 'Try a different search term.' : 'Get started by adding a new medicine.'}
          </p>
        </div>
      )}
    </div>
  );
}