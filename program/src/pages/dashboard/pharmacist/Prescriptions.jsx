import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button, Input } from '@/components/ui/ui';
import { FileText, AlertCircle, CheckCircle, Clock, Search } from 'lucide-react';

export function Prescriptions() {
    const [prescriptions, setPrescriptions] = useState([
        { id: 'RX-001', patient: 'Abebe Kebede', doctor: 'Dr. Yohannes Tadesse', medication: 'Amoxicillin 500mg', dosage: '3x daily', duration: '7 days', status: 'pending', date: '2025-11-28' },
        { id: 'RX-002', patient: 'Tigist Alemayehu', doctor: 'Dr. Mekdes Hailu', medication: 'Lisinopril 10mg', dosage: '1x daily', duration: '30 days', status: 'validated', date: '2025-11-28' },
        { id: 'RX-003', patient: 'Dawit Tesfaye', doctor: 'Dr. Solomon Bekele', medication: 'Metformin 850mg', dosage: '2x daily', duration: '90 days', status: 'dispensed', date: '2025-11-27' },
        { id: 'RX-004', patient: 'Hanna Girma', doctor: 'Dr. Mulugeta Assefa', medication: 'Atorvastatin 20mg', dosage: '1x daily', duration: '30 days', status: 'pending', date: '2025-11-27' },
    ]);

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'default',
            validated: 'secondary',
            dispensed: 'secondary',
            rejected: 'destructive',
        };
        const icons = {
            pending: Clock,
            validated: CheckCircle,
            dispensed: CheckCircle,
            rejected: AlertCircle,
        };
        const Icon = icons[status] || Clock;
        return (
            <Badge variant={variants[status] || 'default'} className='flex items-center gap-1 w-fit'>
                <Icon className='h-3 w-3' />
                {status}
            </Badge>
        );
    };

    const stats = [
        { title: 'Pending Validation', value: prescriptions.filter(p => p.status === 'pending').length, icon: Clock, color: 'text-orange-600' },
        { title: 'Validated Today', value: prescriptions.filter(p => p.status === 'validated').length, icon: CheckCircle, color: 'text-green-600' },
        { title: 'Dispensed Today', value: prescriptions.filter(p => p.status === 'dispensed').length, icon: FileText, color: 'text-blue-600' },
        { title: 'Flagged', value: '3', icon: AlertCircle, color: 'text-red-600' },
    ];

    const handleValidate = (id) => {
        if (window.confirm('Are you sure you want to validate this prescription?')) {
            setPrescriptions(prescriptions.map(p =>
                p.id === id ? { ...p, status: 'validated' } : p
            ));
        }
    };

    const handleDispense = (id) => {
        if (window.confirm('Confirm dispensing for this prescription?')) {
            setPrescriptions(prescriptions.map(p =>
                p.id === id ? { ...p, status: 'dispensed' } : p
            ));
        }
    };

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Prescription Management</h1>
                <p className='text-muted-foreground mt-2'>Validate and dispense prescriptions</p>
            </div>

            {/* Stats Grid */}
            <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
                            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent className='px-6 pb-6'>
                            <div className='text-2xl font-bold'>{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search */}
            <Card>
                <CardContent className='pt-6'>
                    <div className='relative w-full md:max-w-md'>
                        <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                        <Input placeholder='Search by prescription ID, patient name, or medication...' className='pl-10' />
                    </div>
                </CardContent>
            </Card>

            {/* Prescriptions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Active Prescriptions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='overflow-x-auto'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Prescription ID</TableHead>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead>Medication</TableHead>
                                    <TableHead>Dosage</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {prescriptions.map((rx) => (
                                    <TableRow key={rx.id}>
                                        <TableCell className='font-medium'>{rx.id}</TableCell>
                                        <TableCell>{rx.patient}</TableCell>
                                        <TableCell>{rx.doctor}</TableCell>
                                        <TableCell>{rx.medication}</TableCell>
                                        <TableCell>{rx.dosage}</TableCell>
                                        <TableCell>{rx.duration}</TableCell>
                                        <TableCell>{rx.date}</TableCell>
                                        <TableCell>{getStatusBadge(rx.status)}</TableCell>
                                        <TableCell>
                                            <div className='flex gap-2'>
                                                {rx.status === 'pending' && (
                                                    <Button size='sm' variant='outline' onClick={() => handleValidate(rx.id)}>
                                                        Validate
                                                    </Button>
                                                )}
                                                {rx.status === 'validated' && (
                                                    <Button size='sm' variant='outline' onClick={() => handleDispense(rx.id)}>
                                                        Dispense
                                                    </Button>
                                                )}
                                                <Button size='sm' variant='outline'>
                                                    View
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Drug Interaction Alerts */}
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <AlertCircle className='h-5 w-5 text-red-600' />
                        Drug Interaction Alerts
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-3'>
                        <div className='border-l-4 border-red-600 pl-4 py-2'>
                            <p className='font-medium'>Patient: Abebe Kebede (RX-001)</p>
                            <p className='text-sm text-muted-foreground'>
                                Potential interaction between Amoxicillin and current medication (Warfarin). Consult with doctor before dispensing.
                            </p>
                        </div>
                        <div className='border-l-4 border-yellow-600 pl-4 py-2'>
                            <p className='font-medium'>Patient: Hanna Girma (RX-004)</p>
                            <p className='text-sm text-muted-foreground'>
                                Patient has reported allergy to statins. Verify prescription with prescribing doctor.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
