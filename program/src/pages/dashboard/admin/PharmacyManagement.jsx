import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Badge, Input } from '@/components/ui/ui';
import { Check, X, Ban, Search } from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';

export function PharmacyManagement() {
    const [pharmacies, setPharmacies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPharmacies();
    }, []);

    const fetchPharmacies = async () => {
        try {
            setLoading(true);
            const response = await adminService.getPharmacies();

            if (response.success) {
                const pharmaciesData = response.data || response.pharmacies || [];
                setPharmacies(Array.isArray(pharmaciesData) ? pharmaciesData : []);
            } else {
                toast.error('Failed to load pharmacies');
                setPharmacies([]);
            }
        } catch (error) {
            console.error('Error fetching pharmacies:', error);
            toast.error('Failed to load pharmacies');
            setPharmacies([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (window.confirm('Are you sure you want to approve this pharmacy?')) {
            try {
                const response = await adminService.approvePharmacy(id);
                if (response.success) {
                    toast.success('Pharmacy approved successfully');
                    await fetchPharmacies(); // Refresh the list
                } else {
                    toast.error(response.message || 'Failed to approve pharmacy');
                }
            } catch (error) {
                console.error('Error approving pharmacy:', error);
                toast.error('Failed to approve pharmacy');
            }
        }
    };

    const handleReject = async (id) => {
        if (window.confirm('Are you sure you want to reject this pharmacy application?')) {
            try {
                const response = await adminService.rejectPharmacy(id);
                if (response.success) {
                    toast.success('Pharmacy rejected successfully');
                    await fetchPharmacies(); // Refresh the list
                } else {
                    toast.error(response.message || 'Failed to reject pharmacy');
                }
            } catch (error) {
                console.error('Error rejecting pharmacy:', error);
                toast.error('Failed to reject pharmacy');
            }
        }
    };

    const handleSuspend = async (id) => {
        if (window.confirm('Are you sure you want to suspend this pharmacy?')) {
            try {
                const response = await adminService.suspendPharmacy(id);
                if (response.success) {
                    toast.success('Pharmacy suspended successfully');
                    await fetchPharmacies(); // Refresh the list
                } else {
                    toast.error(response.message || 'Failed to suspend pharmacy');
                }
            } catch (error) {
                console.error('Error suspending pharmacy:', error);
                toast.error('Failed to suspend pharmacy');
            }
        }
    };

    const handleReactivate = async (id) => {
        if (window.confirm('Are you sure you want to reactivate this pharmacy?')) {
            try {
                const response = await adminService.reactivatePharmacy(id);
                if (response.success) {
                    toast.success('Pharmacy reactivated successfully');
                    await fetchPharmacies(); // Refresh the list
                } else {
                    toast.error(response.message || 'Failed to reactivate pharmacy');
                }
            } catch (error) {
                console.error('Error reactivating pharmacy:', error);
                toast.error('Failed to reactivate pharmacy');
            }
        }
    };

    const filteredPharmacies = pharmacies.filter(p => {
        const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.owner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.location?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || p.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
                <h2 className='text-3xl font-bold tracking-tight'>Pharmacy Management</h2>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h2 className='text-3xl font-bold tracking-tight'>Pharmacy Management</h2>
                    <p className='text-muted-foreground'>Approve, suspend, or deactivate pharmacies across Ethiopia.</p>
                </div>
                <div className='flex flex-wrap gap-2'>
                    <Button variant={filterStatus === 'All' ? 'default' : 'outline'} onClick={() => setFilterStatus('All')} size='sm'>All</Button>
                    <Button variant={filterStatus === 'Pending' ? 'default' : 'outline'} onClick={() => setFilterStatus('Pending')} size='sm'>Pending</Button>
                    <Button variant={filterStatus === 'Active' ? 'default' : 'outline'} onClick={() => setFilterStatus('Active')} size='sm'>Active</Button>
                    <Button variant={filterStatus === 'Suspended' ? 'default' : 'outline'} onClick={() => setFilterStatus('Suspended')} size='sm'>Suspended</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                        <CardTitle>Registered Pharmacies</CardTitle>
                        <div className='relative w-full md:max-w-md'>
                            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                            <Input
                                placeholder='Search by name, owner, or city...'
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
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead className='text-right'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPharmacies.length > 0 ? (
                                    filteredPharmacies.map((pharmacy) => (
                                        <TableRow key={pharmacy.id || pharmacy._id}>
                                            <TableCell>
                                                <div className='font-medium'>{pharmacy.name}</div>
                                                <div className='text-xs text-muted-foreground'>{pharmacy.phone}</div>
                                            </TableCell>
                                            <TableCell>{pharmacy.owner}</TableCell>
                                            <TableCell>{pharmacy.location || pharmacy.address}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    pharmacy.status === 'Active' ? 'default' :
                                                        pharmacy.status === 'Pending' ? 'secondary' :
                                                            pharmacy.status === 'Suspended' ? 'destructive' : 'outline'
                                                }>
                                                    {pharmacy.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{pharmacy.plan || 'Basic'}</TableCell>
                                            <TableCell className='text-right'>
                                                <div className='flex justify-end gap-2'>
                                                    {pharmacy.status === 'Pending' && (
                                                        <>
                                                            <Button size='sm' variant='outline' className='text-green-600 hover:text-green-700 hover:bg-green-50' onClick={() => handleApprove(pharmacy.id || pharmacy._id)} title="Approve">
                                                                <Check size={16} />
                                                            </Button>
                                                            <Button size='sm' variant='outline' className='text-red-600 hover:text-red-700 hover:bg-red-50' onClick={() => handleReject(pharmacy.id || pharmacy._id)} title="Reject">
                                                                <X size={16} />
                                                            </Button>
                                                        </>
                                                    )}
                                                    {pharmacy.status === 'Active' && (
                                                        <Button size='sm' variant='ghost' className='text-red-600 hover:text-red-700 hover:bg-red-50' onClick={() => handleSuspend(pharmacy.id || pharmacy._id)}>
                                                            <Ban size={16} className='mr-2' /> Suspend
                                                        </Button>
                                                    )}
                                                    {pharmacy.status === 'Suspended' && (
                                                        <Button size='sm' variant='ghost' className='text-green-600 hover:text-green-700 hover:bg-green-50' onClick={() => handleReactivate(pharmacy.id || pharmacy._id)}>
                                                            <Check size={16} className='mr-2' /> Reactivate
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>
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
