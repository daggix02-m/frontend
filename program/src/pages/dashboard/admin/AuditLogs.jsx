import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/ui';

export function AuditLogs() {
    const logs = [
        { id: 1, action: 'User Login', user: 'admin@pharmacare.com', timestamp: '2023-10-27 10:30 AM', details: 'Successful login from IP 192.168.1.1' },
        { id: 2, action: 'Pharmacy Approved', user: 'admin@pharmacare.com', timestamp: '2023-10-27 11:15 AM', details: 'Approved "HealthPlus" pharmacy' },
        { id: 3, action: 'Plan Updated', user: 'system', timestamp: '2023-10-26 09:00 AM', details: 'Updated Pro plan pricing' },
    ];

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div>
                <h2 className='text-3xl font-bold tracking-tight'>Audit Logs</h2>
                <p className='text-muted-foreground'>View system-wide security and activity logs.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='overflow-x-auto'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Action</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className='font-medium'>{log.action}</TableCell>
                                        <TableCell>{log.user}</TableCell>
                                        <TableCell>{log.timestamp}</TableCell>
                                        <TableCell className='text-muted-foreground'>{log.details}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
