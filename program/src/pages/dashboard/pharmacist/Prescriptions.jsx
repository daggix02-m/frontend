import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button, Input } from '@/components/ui/ui';
import { FileText, AlertCircle, CheckCircle, Clock, Search } from 'lucide-react';

export function Prescriptions() {
    const [prescriptions] = useState([
        { id: 'RX-001', patient: 'John Doe', doctor: 'Dr. Smith', medication: 'Amoxicillin 500mg', dosage: '3x daily', duration: '7 days', status: 'pending', date: '2025-11-28' },
        { id: 'RX-002', patient: 'Jane Smith', doctor: 'Dr. Johnson', medication: 'Lisinopril 10mg', dosage: '1x daily', duration: '30 days', status: 'validated', date: '2025-11-28' },
        { id: 'RX-003', patient: 'Mike Brown', doctor: 'Dr. Williams', medication: 'Metformin 850mg', dosage: '2x daily', duration: '90 days', status: 'dispensed', date: '2025-11-27' },
        { id: 'RX-004', patient: 'Sarah Davis', doctor: 'Dr. Anderson', medication: 'Atorvastatin 20mg', dosage: '1x daily', duration: '30 days', status: 'pending', date: '2025-11-27' },
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
        const Icon = icons[status];
        return (
            <Badge variant={variants[status]} className='flex items-center gap-1 w-fit'>
                <Icon className='h-3 w-3' />
                {status}
            </Badge>
        );
    };

    const stats = [
        { title: 'Pending Validation', value: '12', icon: Clock, color: 'text-orange-600' },
        { title: 'Validated Today', value: '28', icon: CheckCircle, color: 'text-green-600' },
        { title: 'Dispensed Today', value: '24', icon: FileText, color: 'text-blue-600' },
        { title: 'Flagged', value: '3', icon: AlertCircle, color: 'text-red-600' },
    ];

    const handleValidate = (id) => {
        console.log('Validating prescription:', id);
        // Backend integration needed
        alert(`Prescription ${id} validated successfully!`);
    };

    const handleDispense = (id) => {
        console.log('Dispensing prescription:', id);
        // Backend integration needed
        alert(`Prescription ${id} dispensed successfully!`);
    };

    return (
        <div className='space-y-6 p-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Prescription Management</h1>
                <p className='text-muted-foreground mt-2'>Validate and dispense prescriptions</p>
            </div>

            {/* Stats Grid */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search */}
            <Card>
                <CardContent className='pt-6'>
                    <div className='relative'>
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
                            <p className='font-medium'>Patient: John Doe (RX-001)</p>
                            <p className='text-sm text-muted-foreground'>
                                Potential interaction between Amoxicillin and current medication (Warfarin). Consult with doctor before dispensing.
                            </p>
                        </div>
                        <div className='border-l-4 border-yellow-600 pl-4 py-2'>
                            <p className='font-medium'>Patient: Sarah Davis (RX-004)</p>
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
