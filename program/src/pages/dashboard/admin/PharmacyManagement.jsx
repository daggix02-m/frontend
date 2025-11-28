import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Badge } from '@/components/ui/ui';
import { Check, X, Ban } from 'lucide-react';

export function PharmacyManagement() {
    const pharmacies = [
        { id: 1, name: 'City Pharmacy', owner: 'John Doe', status: 'Active', plan: 'Pro' },
        { id: 2, name: 'HealthPlus', owner: 'Jane Smith', status: 'Pending', plan: 'Basic' },
        { id: 3, name: 'MediCare', owner: 'Bob Wilson', status: 'Suspended', plan: 'Enterprise' },
    ];

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='text-3xl font-bold tracking-tight'>Pharmacy Management</h2>
                    <p className='text-muted-foreground'>Approve, suspend, or deactivate pharmacies.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Registered Pharmacies</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pharmacy Name</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead className='text-right'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pharmacies.map((pharmacy) => (
                                <TableRow key={pharmacy.id}>
                                    <TableCell className='font-medium'>{pharmacy.name}</TableCell>
                                    <TableCell>{pharmacy.owner}</TableCell>
                                    <TableCell>
                                        <Badge variant={pharmacy.status === 'Active' ? 'default' : pharmacy.status === 'Pending' ? 'secondary' : 'destructive'}>
                                            {pharmacy.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{pharmacy.plan}</TableCell>
                                    <TableCell className='text-right'>
                                        <div className='flex justify-end gap-2'>
                                            {pharmacy.status === 'Pending' && (
                                                <>
                                                    <Button size='sm' variant='outline' className='text-green-600 hover:text-green-700 hover:bg-green-50'>
                                                        <Check size={16} />
                                                    </Button>
                                                    <Button size='sm' variant='outline' className='text-red-600 hover:text-red-700 hover:bg-red-50'>
                                                        <X size={16} />
                                                    </Button>
                                                </>
                                            )}
                                            {pharmacy.status === 'Active' && (
                                                <Button size='sm' variant='ghost' className='text-red-600 hover:text-red-700 hover:bg-red-50'>
                                                    <Ban size={16} className='mr-2' /> Suspend
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
