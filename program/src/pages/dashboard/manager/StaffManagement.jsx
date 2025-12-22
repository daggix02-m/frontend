import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Search,
  Plus,
  User,
  Mail,
  Phone,
  UserPlus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { managerService } from '@/services/manager.service';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function StaffManagement() {
  const { branchId } = useAuth();
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    full_name: '',
    email: '',
    phone: '',
    role_id: '3', // Default to Pharmacist
    branch_id: '' // Will be set to current manager's branch
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await managerService.getStaff();

      if (response.success) {
        setStaff(Array.isArray(response.data) ? response.data : []);
      } else {
        toast.error(response.message || 'Failed to fetch staff');
        setStaff([]);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to fetch staff');
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();

    try {
      // Use dynamic branch_id from auth context
      const staffData = {
        ...newStaff,
        role_id: parseInt(newStaff.role_id),
        branch_id: branchId // Dynamic branch_id from authenticated user
      };

      const response = await managerService.createStaff(staffData);

      if (response.success) {
        toast.success('Staff member added successfully');
        setNewStaff({
          full_name: '',
          email: '',
          phone: '',
          role_id: '3',
          branch_id: ''
        });
        setShowAddStaffForm(false);
        fetchStaff(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to add staff member');
      }
    } catch (error) {
      console.error('Error adding staff:', error);
      toast.error('Failed to add staff member');
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        const response = await managerService.deleteStaff(id);

        if (response.success) {
          toast.success('Staff member deleted successfully');
          fetchStaff(); // Refresh the list
        } else {
          toast.error(response.message || 'Failed to delete staff member');
        }
      } catch (error) {
        console.error('Error deleting staff:', error);
        toast.error('Failed to delete staff member');
      }
    }
  };

  const filteredStaff = staff.filter(person =>
    person.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='space-y-6 p-4 md:p-8'>
      <div className='space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Staff Management</h2>
        <p className='text-muted-foreground'>
          Manage your pharmacy staff members
        </p>
      </div>

      {/* Search and Add Staff */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-2.5 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search staff...'
            className='pl-8'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowAddStaffForm(!showAddStaffForm)}>
          <UserPlus className='h-4 w-4 mr-2' />
          Add Staff
        </Button>
      </div>

      {/* Add Staff Form */}
      {showAddStaffForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Staff Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddStaff} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium'>Full Name</label>
                  <Input
                    value={newStaff.full_name}
                    onChange={(e) => setNewStaff({ ...newStaff, full_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className='text-sm font-medium'>Email</label>
                  <Input
                    type='email'
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className='text-sm font-medium'>Phone</label>
                  <Input
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className='text-sm font-medium'>Role</label>
                  <Select value={newStaff.role_id} onValueChange={(value) => setNewStaff({ ...newStaff, role_id: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='2'>Manager</SelectItem>
                      <SelectItem value='3'>Pharmacist</SelectItem>
                      <SelectItem value='4'>Cashier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='flex gap-2'>
                <Button type='submit'>Add Staff</Button>
                <Button type='button' variant='outline' onClick={() => setShowAddStaffForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Staff List */}
      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {filteredStaff.map((person) => (
            <Card key={person.id || person._id} className='overflow-hidden'>
              <CardHeader className='pb-2'>
                <div className='flex justify-between items-start'>
                  <CardTitle className='text-lg flex items-center gap-2'>
                    <User className='h-5 w-5 text-blue-500' />
                    {person.full_name}
                  </CardTitle>
                </div>
                <div className='text-sm text-muted-foreground capitalize'>{person.role || 'Staff'}</div>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Mail className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm'>{person.email}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Phone className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm'>{person.phone}</span>
                  </div>
                  <div className='text-sm'>
                    <span className='text-muted-foreground'>Branch: </span>
                    <span>{person.branch_name || 'Main Branch'}</span>
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
                    onClick={() => handleDeleteStaff(person.id || person._id)}
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

      {filteredStaff.length === 0 && !loading && (
        <div className='text-center py-12'>
          <User className='h-12 w-12 mx-auto text-muted-foreground' />
          <h3 className='mt-2 text-sm font-medium'>No staff found</h3>
          <p className='mt-1 text-sm text-muted-foreground'>
            {searchTerm ? 'Try a different search term.' : 'Get started by adding a new staff member.'}
          </p>
        </div>
      )}
    </div>
  );
}