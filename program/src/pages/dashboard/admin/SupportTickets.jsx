import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button, Select } from '@/components/ui/ui';
import { Ticket, MessageSquare, User, Clock } from 'lucide-react';

export function SupportTickets() {
    const [tickets] = useState([
        { id: 'TKT-001', pharmacy: 'Green Valley Pharmacy', subject: 'Cannot access inventory', priority: 'high', status: 'open', assignee: 'Unassigned', created: '2 hours ago' },
        { id: 'TKT-002', pharmacy: 'City Health Pharmacy', subject: 'Payment integration issue', priority: 'urgent', status: 'in-progress', assignee: 'John Doe', created: '5 hours ago' },
        { id: 'TKT-003', pharmacy: 'MediCare Plus', subject: 'Report generation error', priority: 'medium', status: 'open', assignee: 'Unassigned', created: '1 day ago' },
        { id: 'TKT-004', pharmacy: 'Wellness Pharmacy', subject: 'User account locked', priority: 'high', status: 'in-progress', assignee: 'Jane Smith', created: '3 hours ago' },
        { id: 'TKT-005', pharmacy: 'HealthFirst Pharmacy', subject: 'Feature request: Export to PDF', priority: 'low', status: 'resolved', assignee: 'John Doe', created: '2 days ago' },
    ]);

    const getPriorityBadge = (priority) => {
        const variants = {
            urgent: 'destructive',
            high: 'destructive',
            medium: 'default',
            low: 'secondary',
        };
        return <Badge variant={variants[priority]}>{priority}</Badge>;
    };

    const getStatusBadge = (status) => {
        const variants = {
            open: 'destructive',
            'in-progress': 'default',
            resolved: 'secondary',
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    const stats = [
        { title: 'Open Tickets', value: '12', icon: Ticket, color: 'text-red-600' },
        { title: 'In Progress', value: '8', icon: Clock, color: 'text-blue-600' },
        { title: 'Resolved Today', value: '15', icon: MessageSquare, color: 'text-green-600' },
        { title: 'Avg Response Time', value: '1.2 hrs', icon: User, color: 'text-purple-600' },
    ];

    return (
        <div className='space-y-6 p-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Support Tickets</h1>
                <p className='text-muted-foreground mt-2'>Manage and respond to pharmacy support requests</p>
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

            {/* Filters */}
            <Card>
                <CardContent className='pt-6'>
                    <div className='flex gap-4'>
                        <Select className='w-48'>
                            <option value='all'>All Status</option>
                            <option value='open'>Open</option>
                            <option value='in-progress'>In Progress</option>
                            <option value='resolved'>Resolved</option>
                        </Select>
                        <Select className='w-48'>
                            <option value='all'>All Priority</option>
                            <option value='urgent'>Urgent</option>
                            <option value='high'>High</option>
                            <option value='medium'>Medium</option>
                            <option value='low'>Low</option>
                        </Select>
                        <Select className='w-48'>
                            <option value='all'>All Assignees</option>
                            <option value='unassigned'>Unassigned</option>
                            <option value='john'>John Doe</option>
                            <option value='jane'>Jane Smith</option>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Tickets Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ticket ID</TableHead>
                                <TableHead>Pharmacy</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Assignee</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell className='font-medium'>{ticket.id}</TableCell>
                                    <TableCell>{ticket.pharmacy}</TableCell>
                                    <TableCell>{ticket.subject}</TableCell>
                                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                                    <TableCell>{ticket.assignee}</TableCell>
                                    <TableCell>{ticket.created}</TableCell>
                                    <TableCell>
                                        <Button size='sm' variant='outline'>
                                            View
                                        </Button>
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
