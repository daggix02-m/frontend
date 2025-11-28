import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
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
  Badge,
} from '@/components/ui/ui';
import { Plus, Search } from 'lucide-react';

export function StaffManagement() {
  const [staff, setStaff] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Pharmacist',
      branch: 'Main Branch',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Cashier',
      branch: 'Downtown Branch',
      status: 'Active',
    },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'Pharmacist',
    branch: 'Main Branch',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    setNewStaff((prev) => ({ ...prev, role: e.target.value }));
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    const mockStaff = { ...newStaff, id: staff.length + 1, status: 'Active' };
    setStaff([...staff, mockStaff]);
    setIsAddModalOpen(false);
    setNewStaff({ name: '', email: '', role: 'Pharmacist', branch: 'Main Branch' });
  };

  return (
    <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Staff Management</h2>
          <p className='text-muted-foreground'>Manage your pharmacists and cashiers.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className='mr-2 h-4 w-4' /> Add Staff
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <CardTitle>All Staff Members</CardTitle>
            <div className='relative w-full md:max-w-md'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input placeholder='Search staff...' className='pl-8' />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className='flex flex-col'>
                        <span className='font-medium'>{member.name}</span>
                        <span className='text-xs text-muted-foreground'>{member.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.role === 'Pharmacist' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell className='whitespace-nowrap'>{member.branch}</TableCell>
                    <TableCell>
                      <Badge variant='outline' className='text-green-600 border-green-600'>
                        {member.status}
                      </Badge>
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
          </div>
        </CardContent>
      </Card>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <Card className='w-full max-w-md'>
            <CardHeader>
              <CardTitle>Add New Staff Member</CardTitle>
              <CardDescription>Create an account for a new employee.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddStaff} className='space-y-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Full Name</label>
                  <Input
                    name='name'
                    value={newStaff.name}
                    onChange={handleInputChange}
                    placeholder='John Doe'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Email Address</label>
                  <Input
                    name='email'
                    value={newStaff.email}
                    onChange={handleInputChange}
                    placeholder='john@example.com'
                    type='email'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Role</label>
                  <Select
                    value={newStaff.role}
                    onChange={handleRoleChange}
                  >
                    <option value='Pharmacist'>Pharmacist</option>
                    <option value='Cashier'>Cashier</option>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Assign Branch</label>
                  <Select
                    value={newStaff.branch}
                    onChange={(e) => setNewStaff({ ...newStaff, branch: e.target.value })}
                  >
                    <option value='Main Branch'>Main Branch</option>
                    <option value='Downtown Branch'>Downtown Branch</option>
                  </Select>
                </div>
                <div className='flex justify-end gap-2 pt-4'>
                  <Button type='button' variant='outline' onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type='submit'>Create Account</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
