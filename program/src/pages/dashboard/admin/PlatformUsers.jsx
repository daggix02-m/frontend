import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button, Input } from '@/components/ui/ui';
import { UserPlus, Shield, Activity, Users } from 'lucide-react';

export function PlatformUsers() {
    const [users] = useState([
        { id: 1, name: 'John Doe', email: 'john@pharmacare.com', role: 'Super Admin', status: 'active', lastActive: '2 hours ago' },
        { id: 2, name: 'Jane Smith', email: 'jane@pharmacare.com', role: 'Support Admin', status: 'active', lastActive: '5 minutes ago' },
        { id: 3, name: 'Mike Johnson', email: 'mike@pharmacare.com', role: 'Billing Admin', status: 'active', lastActive: '1 day ago' },
        { id: 4, name: 'Sarah Williams', email: 'sarah@pharmacare.com', role: 'Support Admin', status: 'inactive', lastActive: '3 days ago' },
        { id: 5, name: 'Tom Brown', email: 'tom@pharmacare.com', role: 'Analytics Admin', status: 'active', lastActive: '30 minutes ago' },
    ]);

    const getStatusBadge = (status) => {
        return status === 'active' ? (
            <Badge variant='secondary'>Active</Badge>
        ) : (
            <Badge variant='destructive'>Inactive</Badge>
        );
    };

    const getRoleBadge = (role) => {
        const variants = {
            'Super Admin': 'destructive',
            'Support Admin': 'default',
            'Billing Admin': 'default',
            'Analytics Admin': 'default',
        };
        return <Badge variant={variants[role]}>{role}</Badge>;
    };

    const stats = [
        { title: 'Total Admins', value: '12', icon: Users, color: 'text-blue-600' },
        { title: 'Active Now', value: '8', icon: Activity, color: 'text-green-600' },
        { title: 'Super Admins', value: '3', icon: Shield, color: 'text-red-600' },
        { title: 'New This Month', value: '2', icon: UserPlus, color: 'text-purple-600' },
    ];

    return (
        <div className='space-y-6 p-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Platform Users</h1>
                    <p className='text-muted-foreground mt-2'>Manage platform administrator accounts</p>
                </div>
                <Button>
                    <UserPlus className='mr-2 h-4 w-4' />
                    Add Admin User
                </Button>
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

            {/* Search and Filters */}
            <Card>
                <CardContent className='pt-6'>
                    <div className='flex gap-4'>
                        <Input placeholder='Search users...' className='max-w-sm' />
                        <Button variant='outline'>Filter by Role</Button>
                        <Button variant='outline'>Filter by Status</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Administrator Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Active</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className='font-medium'>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                                    <TableCell>{user.lastActive}</TableCell>
                                    <TableCell>
                                        <div className='flex gap-2'>
                                            <Button size='sm' variant='outline'>
                                                Edit
                                            </Button>
                                            <Button size='sm' variant='outline'>
                                                Logs
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Activity Log */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Admin Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-3'>
                        {[
                            { user: 'John Doe', action: 'Approved pharmacy registration', time: '10 minutes ago' },
                            { user: 'Jane Smith', action: 'Resolved support ticket #TKT-045', time: '25 minutes ago' },
                            { user: 'Tom Brown', action: 'Generated system report', time: '1 hour ago' },
                            { user: 'Mike Johnson', action: 'Processed refund for Pharmacy #123', time: '2 hours ago' },
                        ].map((activity, index) => (
                            <div key={index} className='flex items-center justify-between border-b pb-2 last:border-0'>
                                <div>
                                    <p className='font-medium'>{activity.user}</p>
                                    <p className='text-sm text-muted-foreground'>{activity.action}</p>
                                </div>
                                <p className='text-xs text-muted-foreground'>{activity.time}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
