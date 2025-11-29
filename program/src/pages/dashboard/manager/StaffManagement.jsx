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
  Dialog,
  DialogContent,
} from '@/components/ui/ui';
import { Plus, Search, Edit, Trash2, Clock, Activity } from 'lucide-react';
import { StaffForm } from './components/StaffForm';
import { ActivityLogDialog } from './components/ActivityLogDialog';

export function StaffManagement() {
  const [staff, setStaff] = useState([
    {
      id: 1,
      name: 'Alemayehu Desta',
      email: 'alemayehu@example.com',
      role: 'Pharmacist',
      branch: 'Main Branch',
      status: 'Active',
      isOnline: true,
      lastActive: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Selamawit Mekonnen',
      email: 'selamawit@example.com',
      role: 'Cashier',
      branch: 'Downtown Branch',
      status: 'Active',
      isOnline: false,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: 3,
      name: 'Berhanu Wolde',
      email: 'berhanu@example.com',
      role: 'Pharmacist',
      branch: 'Westside Branch',
      status: 'On Leave',
      isOnline: false,
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaffForLog, setSelectedStaffForLog] = useState(null);
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);

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

  const openActivityLog = (member) => {
    setSelectedStaffForLog(member);
    setIsActivityLogOpen(true);
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
          <div className='overflow-x-auto -mx-4 sm:-mx-6 md:mx-0'>
            <div className='px-4 sm:px-6 md:px-0'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden md:table-cell">Branch</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Online Status</TableHead>
                    <TableHead className="hidden xl:table-cell">Last Active</TableHead>
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
                            <span className='text-xs text-muted-foreground hidden sm:inline'>{member.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={member.role === 'Pharmacist' ? 'default' : 'secondary'}>
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell className='whitespace-nowrap hidden md:table-cell'>{member.branch}</TableCell>
                        <TableCell>
                          <Badge variant='outline' className={
                            member.status === 'Active' ? 'text-green-600 border-green-600' : 'text-yellow-600 border-yellow-600'
                          }>
                            {member.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className='flex items-center gap-2'>
                            <div className={`h-2 w-2 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <span className='text-sm'>
                              {member.isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className='text-sm text-muted-foreground hidden xl:table-cell'>
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
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Staff Modal */}
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

      {/* Activity Log Modal */}
      <ActivityLogDialog
        isOpen={isActivityLogOpen}
        onClose={() => setIsActivityLogOpen(false)}
        staffMember={selectedStaffForLog}
      />
    </div>
  );
}
