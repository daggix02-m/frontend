import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
  Badge,
  Input,
} from '@/components/ui/ui';
import { Check, X, Ban, Search } from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { Building2 } from 'lucide-react';
import { toast } from 'sonner';

export function PharmacyManagement() {
  const [managers, setManagers] = useState([]);
  const [pendingManagers, setPendingManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getManagers();

      if (response.success) {
        const managersData = response.data || {};
        const allManagers = Array.isArray(managersData.all) ? managersData.all : [];
        const pending = Array.isArray(managersData.pending) ? managersData.pending : [];

        setManagers(allManagers);
        setPendingManagers(pending);
      } else {
        const errorMsg = response.message || 'Failed to load managers';
        setError(errorMsg);
        toast.error(errorMsg);
        setManagers([]);
        setPendingManagers([]);
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
      const errorMsg = error.message || 'Failed to load managers';
      setError(errorMsg);
      toast.error(errorMsg);
      setManagers([]);
      setPendingManagers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id) => {
    if (window.confirm('Are you sure you want to activate this manager?')) {
      try {
        const response = await adminService.activateManager(id);
        if (response.success) {
          toast.success('Manager activated successfully');
          await fetchManagers(); // Refresh the list
        } else {
          toast.error(response.message || 'Failed to activate manager');
        }
      } catch (error) {
        console.error('Error activating manager:', error);
        toast.error('Failed to activate manager');
      }
    }
  };

  const handleDeactivate = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this manager?')) {
      try {
        const response = await adminService.deactivateManager(id);
        if (response.success) {
          toast.success('Manager deactivated successfully');
          await fetchManagers(); // Refresh the list
        } else {
          toast.error(response.message || 'Failed to deactivate manager');
        }
      } catch (error) {
        console.error('Error deactivating manager:', error);
        toast.error('Failed to deactivate manager');
      }
    }
  };

  // Combine all managers and pending managers for display
  const allManagersForDisplay = Array.isArray(managers)
    ? managers.map((manager) => ({
        ...manager,
        status: manager.is_active ? 'Activated' : 'Pending',
      }))
    : [];

  const filteredManagers = Array.isArray(allManagersForDisplay)
    ? allManagersForDisplay.filter((m) => {
        const matchesSearch =
          m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.branch_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || m.status === filterStatus;
        return matchesSearch && matchesFilter;
      })
    : [];

  if (loading) {
    return (
      <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
        <h2 className='text-3xl font-bold tracking-tight'>Manager Management</h2>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
        <h2 className='text-3xl font-bold tracking-tight'>Manager Management</h2>
        <div className='flex flex-col items-center justify-center h-64 text-center'>
          <p className='text-red-600 mb-4'>{error}</p>
          <Button onClick={fetchManagers} variant='outline'>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Manager Management</h2>
          <p className='text-muted-foreground'>
            Approve and manage pharmacy managers across Ethiopia.
          </p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button
            variant={filterStatus === 'All' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('All')}
            size='sm'
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'Pending' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('Pending')}
            size='sm'
          >
            Pending
          </Button>
          <Button
            variant={filterStatus === 'Activated' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('Activated')}
            size='sm'
          >
            Activated
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <CardTitle>Pharmacy Managers</CardTitle>
            <div className='relative w-full md:max-w-md'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search by name, email, or branch...'
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
                  <TableHead>Manager Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredManagers.length > 0 ? (
                  filteredManagers.map((manager) => (
                    <TableRow key={manager.user_id}>
                      <TableCell>
                        <div className='font-medium'>{manager.full_name}</div>
                        <div className='text-xs text-muted-foreground'>{manager.email}</div>
                      </TableCell>
                      <TableCell>{manager.email}</TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Building2 size={14} className='text-muted-foreground' />
                          {manager.branch_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            manager.status === 'Activated'
                              ? 'default'
                              : manager.status === 'Pending'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {manager.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{manager.role_name}</TableCell>
                      <TableCell className='text-right'>
                        <div className='flex justify-end gap-2'>
                          {manager.status === 'Pending' && (
                            <Button
                              size='sm'
                              variant='outline'
                              className='text-green-600 hover:text-green-700 hover:bg-green-50'
                              onClick={() => handleActivate(manager.user_id)}
                              title='Activate'
                            >
                              <Check size={16} />
                            </Button>
                          )}
                          {manager.status === 'Activated' && (
                            <Button
                              size='sm'
                              variant='ghost'
                              className='text-red-600 hover:text-red-700 hover:bg-red-50'
                              onClick={() => handleDeactivate(manager.user_id)}
                            >
                              <Ban size={16} className='mr-2' /> Deactivate
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>
                      No managers found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
