import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Badge, Input } from '@/components/ui/ui';
import { Check, X, Ban, Search, Filter, MoreHorizontal } from 'lucide-react';

export function PharmacyManagement() {

    const initialPharmacies = [
        { id: 1, name: 'City Pharmacy', owner: 'Yohannes Tadesse', location: 'Addis Ababa', status: 'Active', plan: 'Pro', phone: '+251-11-551-2345', joined: '2023-01-15' },
        { id: 2, name: 'HealthPlus', owner: 'Almaz Worku', location: 'Bahir Dar', status: 'Pending', plan: 'Basic', phone: '+251-58-220-3456', joined: '2023-02-20' },
        { id: 3, name: 'MediCare', owner: 'Tewodros Alemu', location: 'Hawassa', status: 'Suspended', plan: 'Enterprise', phone: '+251-46-220-4567', joined: '2023-03-10' },
        { id: 4, name: 'Wellness Drug Store', owner: 'Senait Gebremedhin', location: 'Mekelle', status: 'Active', plan: 'Pro', phone: '+251-34-440-5678', joined: '2023-04-05' },
        { id: 5, name: 'Community Rx', owner: 'Fekadu Mengistu', location: 'Dire Dawa', status: 'Pending', plan: 'Basic', phone: '+251-25-112-6789', joined: '2023-05-12' },
    ];

    const [pharmacies, setPharmacies] = useState(initialPharmacies);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const handleApprove = (id) => {
        if (window.confirm('Are you sure you want to approve this pharmacy?')) {
            setPharmacies(pharmacies.map(p => p.id === id ? { ...p, status: 'Active' } : p));
        }
    };

    const handleReject = (id) => {
        if (window.confirm('Are you sure you want to reject this pharmacy application?')) {
            setPharmacies(pharmacies.map(p => p.id === id ? { ...p, status: 'Rejected' } : p));
        }
    };

    const handleSuspend = (id) => {
        if (window.confirm('Are you sure you want to suspend this pharmacy?')) {
            setPharmacies(pharmacies.map(p => p.id === id ? { ...p, status: 'Suspended' } : p));
        }
    };

    const filteredPharmacies = pharmacies.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || p.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h2 className='text-3xl font-bold tracking-tight'>Pharmacy Management</h2>
                    <p className='text-muted-foreground'>Approve, suspend, or deactivate pharmacies across Ethiopia.</p>
                </div>
                <div className='flex gap-2'>
                    <Button variant={filterStatus === 'All' ? 'default' : 'outline'} onClick={() => setFilterStatus('All')}>All</Button>
                    <Button variant={filterStatus === 'Pending' ? 'default' : 'outline'} onClick={() => setFilterStatus('Pending')}>Pending</Button>
                    <Button variant={filterStatus === 'Active' ? 'default' : 'outline'} onClick={() => setFilterStatus('Active')}>Active</Button>
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
                                        <TableRow key={pharmacy.id}>
                                            <TableCell>
                                                <div className='font-medium'>{pharmacy.name}</div>
                                                <div className='text-xs text-muted-foreground'>{pharmacy.phone}</div>
                                            </TableCell>
                                            <TableCell>{pharmacy.owner}</TableCell>
                                            <TableCell>{pharmacy.location}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    pharmacy.status === 'Active' ? 'default' :
                                                        pharmacy.status === 'Pending' ? 'secondary' :
                                                            pharmacy.status === 'Suspended' ? 'destructive' : 'outline'
                                                }>
                                                    {pharmacy.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{pharmacy.plan}</TableCell>
                                            <TableCell className='text-right'>
                                                <div className='flex justify-end gap-2'>
                                                    {pharmacy.status === 'Pending' && (
                                                        <>
                                                            <Button size='sm' variant='outline' className='text-green-600 hover:text-green-700 hover:bg-green-50' onClick={() => handleApprove(pharmacy.id)} title="Approve">
                                                                <Check size={16} />
                                                            </Button>
                                                            <Button size='sm' variant='outline' className='text-red-600 hover:text-red-700 hover:bg-red-50' onClick={() => handleReject(pharmacy.id)} title="Reject">
                                                                <X size={16} />
                                                            </Button>
                                                        </>
                                                    )}
                                                    {pharmacy.status === 'Active' && (
                                                        <Button size='sm' variant='ghost' className='text-red-600 hover:text-red-700 hover:bg-red-50' onClick={() => handleSuspend(pharmacy.id)}>
                                                            <Ban size={16} className='mr-2' /> Suspend
                                                        </Button>
                                                    )}
                                                    {pharmacy.status === 'Suspended' && (
                                                        <Button size='sm' variant='ghost' className='text-green-600 hover:text-green-700 hover:bg-green-50' onClick={() => handleApprove(pharmacy.id)}>
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
