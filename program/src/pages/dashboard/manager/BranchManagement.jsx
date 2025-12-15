import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Dialog,
  DialogContent,
} from '@/components/ui/ui';
import { Plus, Search, MapPin, Phone, Edit, Trash2, Building2 } from 'lucide-react';
import { BranchForm } from './components/BranchForm';
import { managerService } from '@/services/manager.service';
import { toast } from 'sonner';

export function BranchManagement() {
  const [branches, setBranches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await managerService.getBranches();

      if (response.success) {
        const branchesData = response.data || response.branches || [];
        setBranches(Array.isArray(branchesData) ? branchesData : []);
      } else {
        toast.error('Failed to load branches');
        setBranches([]);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast.error('Failed to load branches');
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingBranch(null);
    setFormData({ name: '', address: '', contact: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (branch) => {
    setEditingBranch(branch);
    setFormData({ name: branch.name, address: branch.address, contact: branch.contact });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBranch) {
        const response = await managerService.updateBranch(editingBranch.id || editingBranch._id, formData);
        if (response.success) {
          toast.success('Branch updated successfully');
          await fetchBranches();
        } else {
          toast.error(response.message || 'Failed to update branch');
        }
      } else {
        const response = await managerService.createBranch(formData);
        if (response.success) {
          toast.success('Branch created successfully');
          await fetchBranches();
        } else {
          toast.error(response.message || 'Failed to create branch');
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving branch:', error);
      toast.error('Failed to save branch');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch? This action cannot be undone.')) {
      try {
        const response = await managerService.deleteBranch(id);
        if (response.success) {
          toast.success('Branch deleted successfully');
          await fetchBranches();
        } else {
          toast.error(response.message || 'Failed to delete branch');
        }
      } catch (error) {
        console.error('Error deleting branch:', error);
        toast.error('Failed to delete branch');
      }
    }
  };

  const filteredBranches = branches.filter(branch =>
    branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className='space-y-4 sm:space-y-6'>
        <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Branch Management</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4'>
        <div>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Branch Management</h2>
          <p className='text-sm text-muted-foreground mt-1'>Manage your pharmacy branches across Ethiopia.</p>
        </div>
        <Button onClick={openAddModal} className="w-full sm:w-auto">
          <Plus className='mr-2 h-4 w-4' /> Add Branch
        </Button>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <CardTitle className="text-lg sm:text-xl">All Branches</CardTitle>
          <div className='relative w-full'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search branches...'
              className='pl-9'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          { }
          <div className='md:hidden space-y-3 p-4'>
            {filteredBranches.length > 0 ? (
              filteredBranches.map((branch) => (
                <Card key={branch.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-semibold text-base">{branch.name}</h3>
                        </div>
                        <div className="flex items-start gap-2 mb-2">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{branch.address}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{branch.contact}</span>
                        </div>
                      </div>
                    </div>

                    <div className='flex gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        className="flex-1"
                        onClick={() => openEditModal(branch)}
                      >
                        <Edit className='h-4 w-4 mr-2' />
                        Edit
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='text-red-600 hover:text-red-700 hover:bg-red-50'
                        onClick={() => handleDelete(branch.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className='text-center py-12 text-muted-foreground'>
                <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No branches found.</p>
              </div>
            )}
          </div>

          { }
          <div className='hidden md:block overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBranches.length > 0 ? (
                  filteredBranches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell className='font-medium'>{branch.name}</TableCell>
                      <TableCell>
                        <div className='flex items-center text-muted-foreground'>
                          <MapPin className='mr-2 h-3 w-3' />
                          <span className='whitespace-nowrap'>{branch.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center text-muted-foreground'>
                          <Phone className='mr-2 h-3 w-3' />
                          <span className='whitespace-nowrap'>{branch.contact}</span>
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex justify-end gap-2'>
                          <Button variant='ghost' size='sm' onClick={() => openEditModal(branch)}>
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button variant='ghost' size='sm' className='text-red-600 hover:text-red-700 hover:bg-red-50' onClick={() => handleDelete(branch.id)}>
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className='text-center py-8 text-muted-foreground'>
                      No branches found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      { }
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-0 bg-transparent border-none shadow-none w-full max-w-lg">
          <BranchForm
            initialData={editingBranch}
            onSubmit={async (data) => {
              try {
                if (editingBranch) {
                  const response = await managerService.updateBranch(editingBranch.id || editingBranch._id, data);
                  if (response.success) {
                    toast.success('Branch updated successfully');
                    await fetchBranches();
                    setIsModalOpen(false);
                  } else {
                    toast.error(response.message || 'Failed to update branch');
                  }
                } else {
                  const response = await managerService.createBranch(data);
                  if (response.success) {
                    toast.success('Branch created successfully');
                    await fetchBranches();
                    setIsModalOpen(false);
                  } else {
                    toast.error(response.message || 'Failed to create branch');
                  }
                }
              } catch (error) {
                console.error('Error saving branch:', error);
                toast.error('Failed to save branch');
              }
            }}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
