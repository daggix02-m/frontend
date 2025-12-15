import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/ui';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';

export function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAuditLogs();

            if (response.success) {
                const logsData = response.data || response.logs || [];
                setLogs(Array.isArray(logsData) ? logsData : []);
            } else {
                toast.error('Failed to load audit logs');
                setLogs([]);
            }
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            toast.error('Failed to load audit logs');
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
                <h1 className='text-3xl font-bold'>Audit Logs</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

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
