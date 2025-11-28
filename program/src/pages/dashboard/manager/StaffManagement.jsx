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
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';

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
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'Pharmacist',
      branch: 'Westside Branch',
      status: 'On Leave',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Pharmacist',
    branch: 'Main Branch',
    status: 'Active',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingStaff(null);
    setFormData({ name: '', email: '', role: 'Pharmacist', branch: 'Main Branch', status: 'Active' });
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      branch: member.branch,
      status: member.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStaff) {
      // Update existing staff
      setStaff(staff.map(s => s.id === editingStaff.id ? { ...formData, id: s.id } : s));
    } else {
      // Add new staff
      const newStaff = { ...formData, id: staff.length + 1 };
      setStaff([...staff, newStaff]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      setStaff(staff.filter(s => s.id !== id));
    }
  };

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Staff Management</h2>
          <p className='text-muted-foreground'>Manage your pharmacists and cashiers.</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className='mr-2 h-4 w-4' /> Add Staff
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <CardTitle>All Staff Members</CardTitle>
            <div className='relative w-full md:max-w-md'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search staff...'
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
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((member) => (
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
                        <Badge variant='outline' className={
                          member.status === 'Active' ? 'text-green-600 border-green-600' : 'text-yellow-600 border-yellow-600'
                        }>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex justify-end gap-2'>
                          <Button variant='ghost' size='sm' onClick={() => openEditModal(member)}>
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button variant='ghost' size='sm' className='text-red-600 hover:text-red-700 hover:bg-red-50' onClick={() => handleDelete(member.id)}>
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className='text-center py-8 text-muted-foreground'>
                      No staff members found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Staff Modal */}
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
              <CardTitle>{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</CardTitle>
              <CardDescription>Enter the details for the employee.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Full Name</label>
                  <Input
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder='e.g. John Doe'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Email Address</label>
                  <Input
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder='name@example.com'
                    type='email'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Role</label>
                  <Select
                    name='role'
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value='Pharmacist'>Pharmacist</option>
                    <option value='Cashier'>Cashier</option>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Assign Branch</label>
                  <Select
                    name='branch'
                    value={formData.branch}
                    onChange={handleInputChange}
                  >
                    <option value='Main Branch'>Main Branch</option>
                    <option value='Downtown Branch'>Downtown Branch</option>
                    <option value='Westside Branch'>Westside Branch</option>
                  </Select>
                </div>
                {editingStaff && (
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Status</label>
                    <Select
                      name='status'
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value='Active'>Active</option>
                      <option value='On Leave'>On Leave</option>
                      <option value='Inactive'>Inactive</option>
                    </Select>
                  </div>
                )}
                <div className='flex justify-end gap-2 pt-4'>
                  <Button type='button' variant='outline' onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type='submit'>{editingStaff ? 'Save Changes' : 'Create Account'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
