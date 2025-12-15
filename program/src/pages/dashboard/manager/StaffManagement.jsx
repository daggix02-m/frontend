import { useState, useEffect } from 'react';
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
  Dialog,
  DialogContent,
} from '@/components/ui/ui';
import { Plus, Search, Edit, Trash2, Clock, Activity, User, Mail, MapPin } from 'lucide-react';
import { StaffForm } from './components/StaffForm';
import { ActivityLogDialog } from './components/ActivityLogDialog';
import { managerService } from '@/services/manager.service';
import { toast } from 'sonner';

export function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaffForLog, setSelectedStaffForLog] = useState(null);
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Pharmacist',
    branch: 'Main Branch',
    status: 'Active',
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await managerService.getStaff();

      if (response.success) {
        const staffData = response.data || response.staff || [];
        setStaff(Array.isArray(staffData) ? staffData : []);
      } else {
        toast.error('Failed to load staff');
        setStaff([]);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to load staff');
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

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

  const openActivityLog = (member) => {
    setSelectedStaffForLog(member);
    setIsActivityLogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        const response = await managerService.updateStaff(editingStaff.id || editingStaff._id, formData);
        if (response.success) {
          toast.success('Staff updated successfully');
          await fetchStaff();
        } else {
          toast.error(response.message || 'Failed to update staff');
        }
      } else {
        const response = await managerService.createStaff(formData);
        if (response.success) {
          toast.success('Staff created successfully');
          await fetchStaff();
        } else {
          toast.error(response.message || 'Failed to create staff');
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving staff:', error);
      toast.error('Failed to save staff');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      try {
        const response = await managerService.deleteStaff(id);
        if (response.success) {
          toast.success('Staff deleted successfully');
          await fetchStaff();
        } else {
          toast.error(response.message || 'Failed to delete staff');
        }
      } catch (error) {
        console.error('Error deleting staff:', error);
        toast.error('Failed to delete staff');
      }
    }
  };

  const filteredStaff = staff.filter(member =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.branch?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className='space-y-4 sm:space-y-6'>
        <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Staff Management</h2>
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
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Staff Management</h2>
          <p className='text-sm text-muted-foreground mt-1'>Manage your pharmacists and cashiers.</p>
        </div>
        <Button onClick={openAddModal} className="w-full sm:w-auto">
          <Plus className='mr-2 h-4 w-4' /> Add Staff
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="space-y-4">
          <CardTitle className="text-lg sm:text-xl">All Staff Members</CardTitle>
          <div className='relative w-full'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search staff...'
              className='pl-9'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          { }
          <div className='lg:hidden space-y-3 p-4'>
            {filteredStaff.length > 0 ? (
              filteredStaff.map((member) => (
                <Card key={member.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-semibold text-base">{member.name}</h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{member.branch}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={member.role === 'Pharmacist' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                      <Badge variant='outline' className={
                        member.status === 'Active' ? 'text-green-600 border-green-600' : 'text-yellow-600 border-yellow-600'
                      }>
                        {member.status}
                      </Badge>
                      <div className='flex items-center gap-1 text-xs text-muted-foreground ml-auto'>
                        <Clock className='h-3 w-3' />
                        {getTimeAgo(member.lastActive)}
                      </div>
                    </div>

                    <div className='flex gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        className="flex-1"
                        onClick={() => openActivityLog(member)}
                      >
                        <Activity className='h-4 w-4 mr-2' />
                        Activity
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className="flex-1"
                        onClick={() => openEditModal(member)}
                      >
                        <Edit className='h-4 w-4 mr-2' />
                        Edit
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='text-red-600 hover:text-red-700 hover:bg-red-50'
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className='text-center py-12 text-muted-foreground'>
                <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No staff members found.</p>
              </div>
            )}
          </div>

          { }
          <div className='hidden lg:block overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Online Status</TableHead>
                  <TableHead>Last Active</TableHead>
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
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <div className={`h-2 w-2 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className='text-sm'>
                            {member.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='text-sm text-muted-foreground'>
                        <div className='flex items-center gap-1'>
                          <Clock className='h-3 w-3' />
                          {getTimeAgo(member.lastActive)}
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex justify-end gap-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => openActivityLog(member)}
                            title='View Activity Log'
                          >
                            <Activity className='h-4 w-4' />
                          </Button>
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
                    <TableCell colSpan={7} className='text-center py-8 text-muted-foreground'>
                      No staff members found.
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
          <StaffForm
            initialData={editingStaff}
            onSubmit={(data) => {
              if (editingStaff) {
                setStaff(staff.map(s => s.id === editingStaff.id ? { ...data, id: s.id, isOnline: s.isOnline, lastActive: s.lastActive } : s));
              } else {
                const newStaff = {
                  ...data,
                  id: staff.length + 1,
                  isOnline: false,
                  lastActive: new Date().toISOString()
                };
                setStaff([...staff, newStaff]);
              }
              setIsModalOpen(false);
            }}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      { }
      <ActivityLogDialog
        isOpen={isActivityLogOpen}
        onClose={() => setIsActivityLogOpen(false)}
        staffMember={selectedStaffForLog}
      />
    </div >
  );
}
