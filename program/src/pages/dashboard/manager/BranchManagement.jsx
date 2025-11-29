import { useState } from 'react';
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
} from '@/components/ui/ui';
import { Plus, Search, MapPin, Phone, Edit, Trash2, X } from 'lucide-react';

export function BranchManagement() {
  const [branches, setBranches] = useState([
    { id: 1, name: 'Main Branch', address: 'Bole Road, Near Edna Mall, Addis Ababa', contact: '+251-11-662-3456' },
    { id: 2, name: 'Downtown Branch', address: 'Tana Avenue, Kebele 03, Bahir Dar', contact: '+251-58-220-1234' },
    { id: 3, name: 'Westside Branch', address: 'Hawassa Road, Piazza Area, Hawassa', contact: '+251-46-220-5678' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBranch) {
      // Update existing branch
      setBranches(branches.map(b => b.id === editingBranch.id ? { ...formData, id: b.id } : b));
    } else {
      // Add new branch
      const newBranch = { ...formData, id: branches.length + 1 };
      setBranches([...branches, newBranch]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this branch? This action cannot be undone.')) {
      setBranches(branches.filter(b => b.id !== id));
    }
  };

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Branch Management</h2>
          <p className='text-muted-foreground'>Manage your pharmacy branches across Ethiopia.</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className='mr-2 h-4 w-4' /> Add Branch
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <CardTitle>All Branches</CardTitle>
            <div className='relative w-full md:max-w-md'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search branches...'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
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

      {/* Add/Edit Branch Modal */}
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
              <CardTitle>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</CardTitle>
              <CardDescription>Enter the details for the pharmacy branch.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Branch Name</label>
                  <Input
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder='e.g. Westside Branch'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Address</label>
                  <Input
                    name='address'
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder='Full Address'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Contact Number</label>
                  <Input
                    name='contact'
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder='Phone Number'
                    required
                  />
                </div>
                <div className='flex justify-end gap-2 pt-4'>
                  <Button type='button' variant='outline' onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type='submit'>{editingBranch ? 'Save Changes' : 'Create Branch'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
