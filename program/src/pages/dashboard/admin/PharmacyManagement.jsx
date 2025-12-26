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
  const [pharmacies, setPharmacies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getPharmacies();

      if (response.success) {
        // The endpoint returns { success: true, data: [...] } or just the array depending on implementation
        // Adjusting based on common patterns, assuming data is the array or inside data property
        const pharmaciesData = Array.isArray(response.data) ? response.data : [];
        setPharmacies(pharmaciesData);
      } else {
        const errorMsg = response.message || 'Failed to load pharmacies';
        setError(errorMsg);
        toast.error(errorMsg);
        setPharmacies([]);
      }
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      const errorMsg = error.message || 'Failed to load pharmacies';
      setError(errorMsg);
      toast.error(errorMsg);
      setPharmacies([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter pharmacies
  const filteredPharmacies = pharmacies.filter((pharmacy) => {
    const matchesSearch =
      pharmacy.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.contact_phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || pharmacy.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
        <h2 className='text-3xl font-bold tracking-tight'>Pharmacy Management</h2>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
        <h2 className='text-3xl font-bold tracking-tight'>Pharmacy Management</h2>
        <div className='flex flex-col items-center justify-center h-64 text-center'>
          <p className='text-red-600 mb-4'>{error}</p>
          <Button onClick={fetchPharmacies} variant='outline'>
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
          <h2 className='text-3xl font-bold tracking-tight'>Pharmacy Management</h2>
          <p className='text-muted-foreground'>
            Manage registered pharmacies and branches.
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
            variant={filterStatus === 'Active' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('Active')}
            size='sm'
          >
            Active
          </Button>
          <Button
            variant={filterStatus === 'Inactive' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('Inactive')}
            size='sm'
          >
            Inactive
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <CardTitle>Pharmacies</CardTitle>
            <div className='relative w-full md:max-w-md'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search by name, location, or phone...'
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
                  <TableHead>Pharmacy Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Employees</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPharmacies.length > 0 ? (
                  filteredPharmacies.map((pharmacy) => (
                    <TableRow key={pharmacy.branch_id || pharmacy.id}>
                      <TableCell>
                        <div className='font-medium'>{pharmacy.name}</div>
                        <div className='text-xs text-muted-foreground'>ID: {pharmacy.branch_id || pharmacy.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Building2 size={14} className='text-muted-foreground' />
                          {pharmacy.location}
                        </div>
                      </TableCell>
                      <TableCell>{pharmacy.contact_phone}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            pharmacy.status === 'Active'
                              ? 'default'
                              : pharmacy.status === 'Inactive'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {pharmacy.status || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-right'>
                        {pharmacy.employee_count || 0}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className='text-center py-8 text-muted-foreground'>
                      No pharmacies found matching your criteria.
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
