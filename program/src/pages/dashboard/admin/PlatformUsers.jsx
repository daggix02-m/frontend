import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button, Input, Dialog, DialogContent } from '@/components/ui/ui';
import { Select } from '@/components/ui/select';
import { UserPlus, Shield, Activity, Users } from 'lucide-react';
import { UserForm } from './components/UserForm';

export function PlatformUsers() {
    const [users, setUsers] = useState([
        { id: 1, name: 'Getachew Mamo', email: 'getachew@pharmacare.com', role: 'Super Admin', status: 'active', lastActive: '2 hours ago' },
        { id: 2, name: 'Rahel Bekele', email: 'rahel@pharmacare.com', role: 'Support Admin', status: 'active', lastActive: '5 minutes ago' },
        { id: 3, name: 'Elias Tesfaye', email: 'elias@pharmacare.com', role: 'Billing Admin', status: 'active', lastActive: '1 day ago' },
        { id: 4, name: 'Meron Hailu', email: 'meron@pharmacare.com', role: 'Support Admin', status: 'inactive', lastActive: '3 days ago' },
        { id: 5, name: 'Daniel Kebede', email: 'daniel@pharmacare.com', role: 'Analytics Admin', status: 'active', lastActive: '30 minutes ago' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'Support Admin'
    });

    const handleAddUser = (data) => {
        const user = {
            id: users.length + 1,
            ...data,
            status: 'active',
            lastActive: 'Just now'
        };
        setUsers([...users, user]);
        setIsModalOpen(false);
    };

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

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterRole === 'All' || user.role === filterRole;
        return matchesSearch && matchesFilter;
    });

    const roles = ['All', 'Super Admin', 'Support Admin', 'Billing Admin', 'Analytics Admin'];

    const stats = [
        { title: 'Total Admins', value: '12', icon: Users, color: 'text-blue-600' },
        { title: 'Active Now', value: '8', icon: Activity, color: 'text-green-600' },
        { title: 'Super Admins', value: '3', icon: Shield, color: 'text-red-600' },
        { title: 'New This Month', value: '2', icon: UserPlus, color: 'text-purple-600' },
    ];

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Platform Users</h1>
                    <p className='text-muted-foreground mt-2'>Manage platform administrator accounts</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <UserPlus className='mr-2 h-4 w-4' />
                    Add Admin User
                </Button>
            </div>

            {}
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

            {}
            <Card>
                <CardContent className='pt-6'>
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <Input
                            placeholder='Search users...'
                            className='max-w-sm'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                            {roles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {}
            <Card>
                <CardHeader>
                    <CardTitle>Administrator Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='overflow-x-auto'>
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
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className='font-medium'>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                                            <TableCell className='text-sm text-muted-foreground'>{user.lastActive}</TableCell>
                                            <TableCell className='text-right'>
                                                <Button variant='ghost' size='sm'>Edit</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>
                                            No users found matching "{searchTerm}"
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Admin Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-3'>
                        {[
                            { user: 'Getachew Mamo', action: 'Approved pharmacy registration', time: '10 minutes ago' },
                            { user: 'Rahel Bekele', action: 'Resolved support ticket #TKT-045', time: '25 minutes ago' },
                            { user: 'Daniel Kebede', action: 'Generated system report', time: '1 hour ago' },
                            { user: 'Elias Tesfaye', action: 'Processed refund for Pharmacy #123', time: '2 hours ago' },
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

            {}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="p-0 bg-transparent border-none shadow-none w-full max-w-lg">
                    <UserForm
                        onSubmit={handleAddUser}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
