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
import { Plus, Search, MapPin, Phone } from 'lucide-react';

export function BranchManagement() {
  const [branches, setBranches] = useState([
    { id: 1, name: 'Main Branch', address: 'Lafto, Addis Ababa', contact: '555-0101' },
    { id: 2, name: 'Bole Branch', address: 'Bole, Addis Ababa', contact: '555-0102' },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: '',
    address: '',
    contact: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBranch((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBranch = async (e) => {
    e.preventDefault();
    // const response = await createBranch(newBranch);
    // if (response.success) {
    //   setBranches([...branches, response.data]);
    //   setIsAddModalOpen(false);
    //   setNewBranch({ name: '', address: '', contact: '' });
    // }
    const mockBranch = { ...newBranch, id: branches.length + 1 };
    setBranches([...branches, mockBranch]);
    setIsAddModalOpen(false);
    setNewBranch({ name: '', address: '', contact: '' });
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Branch Management</h2>
          <p className='text-muted-foreground'>Manage your pharmacy branches here.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className='mr-2 h-4 w-4' /> Add Branch
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>All Branches</CardTitle>
            <div className='relative w-64'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input placeholder='Search branches...' className='pl-8' />
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
              {branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className='font-medium'>{branch.name}</TableCell>
                  <TableCell>
                    <div className='flex items-center text-muted-foreground'>
                      <MapPin className='mr-2 h-3 w-3' />
                      {branch.address}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center text-muted-foreground'>
                      <Phone className='mr-2 h-3 w-3' />
                      {branch.contact}
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button variant='ghost' size='sm'>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Branch Modal (Simplified) */}
      {isAddModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <Card className='w-full max-w-md'>
            <CardHeader>
              <CardTitle>Add New Branch</CardTitle>
              <CardDescription>Enter the details for the new branch.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddBranch} className='space-y-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Branch Name</label>
                  <Input
                    name='name'
                    value={newBranch.name}
                    onChange={handleInputChange}
                    placeholder='e.g. Westside Branch'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Address</label>
                  <Input
                    name='address'
                    value={newBranch.address}
                    onChange={handleInputChange}
                    placeholder='Full Address'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Contact Number</label>
                  <Input
                    name='contact'
                    value={newBranch.contact}
                    onChange={handleInputChange}
                    placeholder='Phone Number'
                    required
                  />
                </div>
                <div className='flex justify-end gap-2 pt-4'>
                  <Button type='button' variant='outline' onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type='submit'>Create Branch</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
