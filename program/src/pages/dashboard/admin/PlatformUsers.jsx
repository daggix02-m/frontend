import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button, Input } from '@/components/ui/ui';
import { Select } from '@/components/ui/select';
import { UserPlus, Shield, Activity, Users, X } from 'lucide-react';

export function PlatformUsers() {
    const [users, setUsers] = useState([
        { id: 1, name: 'Getachew Mamo', email: 'getachew@pharmacare.com', role: 'Super Admin', status: 'active', lastActive: '2 hours ago' },
        { id: 2, name: 'Rahel Bekele', email: 'rahel@pharmacare.com', role: 'Support Admin', status: 'active', lastActive: '5 minutes ago' },
        { id: 3, name: 'Elias Tesfaye', email: 'elias@pharmacare.com', role: 'Billing Admin', status: 'active', lastActive: '1 day ago' },
        { id: 4, name: 'Meron Hailu', email: 'meron@pharmacare.com', role: 'Support Admin', status: 'inactive', lastActive: '3 days ago' },
        { id: 5, name: 'Daniel Kebede', email: 'daniel@pharmacare.com', role: 'Analytics Admin', status: 'active', lastActive: '30 minutes ago' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'Support Admin'
    });

    const handleAddUser = (e) => {
        e.preventDefault();
        const user = {
            id: users.length + 1,
            ...newUser,
            status: 'active',
            lastActive: 'Just now'
        };
        setUsers([...users, user]);
        setIsModalOpen(false);
        setNewUser({ name: '', email: '', role: 'Support Admin' });
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

            {/* Search and Filters */}
            <Card>
                <CardContent className='pt-6'>
                    <div className='flex flex-col sm:flex-row gap-4'>
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
                    </div>
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

            {/* Add User Modal */}
            {isModalOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
                    <Card className='w-full max-w-md relative'>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <CardHeader>
                            <CardTitle>Add New Admin User</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddUser} className='space-y-4'>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>Full Name</label>
                                    <Input
                                        placeholder='e.g., Abebe Bikila'
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>Email Address</label>
                                    <Input
                                        type='email'
                                        placeholder='e.g., abebe@pharmacare.com'
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>Role</label>
                                    <Select
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    >
                                        <option value='Support Admin'>Support Admin</option>
                                        <option value='Billing Admin'>Billing Admin</option>
                                        <option value='Analytics Admin'>Analytics Admin</option>
                                        <option value='Super Admin'>Super Admin</option>
                                    </Select>
                                </div>
                                <div className='flex justify-end gap-2 pt-4'>
                                    <Button type='button' variant='outline' onClick={() => setIsModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type='submit'>Add User</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
