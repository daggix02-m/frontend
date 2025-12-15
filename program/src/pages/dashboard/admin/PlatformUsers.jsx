import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button, Input, Dialog, DialogContent } from '@/components/ui/ui';
import { Select } from '@/components/ui/select';
import { UserPlus, Shield, Activity, Users } from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';
import { UserForm } from './components/UserForm';

export function PlatformUsers() {
    const [users, setUsers] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
        fetchAuditLogs();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getPlatformUsers();

            if (response.success) {
                const usersData = response.data || response.users || [];
                setUsers(Array.isArray(usersData) ? usersData : []);
            } else {
                toast.error('Failed to load platform users');
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching platform users:', error);
            toast.error('Failed to load platform users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAuditLogs = async () => {
        try {
            const response = await adminService.getAuditLogs({ limit: 5 });
            if (response.success) {
                setAuditLogs(response.data || response.logs || []);
            }
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        }
    };

    const handleAddUser = async (data) => {
        try {
            const response = await adminService.createPlatformUser(data);
            if (response.success) {
                toast.success('User added successfully');
                await fetchUsers(); // Refresh the list
                setIsModalOpen(false);
            } else {
                toast.error(response.message || 'Failed to add user');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            toast.error('Failed to add user');
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleUpdateUser = async (data) => {
        try {
            const response = await adminService.updateUser(editingUser.id, data);
            if (response.success) {
                toast.success('User updated successfully');
                await fetchUsers(); // Refresh the list
                setIsModalOpen(false);
                setIsEditMode(false);
                setEditingUser(null);
            } else {
                toast.error(response.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Failed to update user');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingUser(null);
    };

    const handleOpenAddModal = () => {
        setIsEditMode(false);
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleUpdateUserStatus = async (userId, newStatus) => {
        try {
            const response = await adminService.updateUserStatus(userId, newStatus);
            if (response.success) {
                toast.success(`User status updated to ${newStatus}`);
                await fetchUsers(); // Refresh the list
            } else {
                toast.error(response.message || 'Failed to update user status');
            }
        } catch (error) {
            console.error('Error updating user status:', error);
            toast.error('Failed to update user status');
        }
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
        { title: 'Total Admins', value: users.length.toString(), icon: Users, color: 'text-blue-600' },
        { title: 'Active Now', value: users.filter(u => u.status === 'active').length.toString(), icon: Activity, color: 'text-green-600' },
        { title: 'Super Admins', value: users.filter(u => u.role === 'Super Admin').length.toString(), icon: Shield, color: 'text-red-600' },
        {
            title: 'New This Month', value: users.filter(u => {
                const joinedDate = new Date(u.joinedAt || u.createdAt);
                const now = new Date();
                return joinedDate.getMonth() === now.getMonth() && joinedDate.getFullYear() === now.getFullYear();
            }).length.toString(), icon: UserPlus, color: 'text-purple-600'
        },
    ];

    if (loading) {
        return (
            <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
                <h1 className='text-3xl font-bold'>Platform Users</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Platform Users</h1>
                    <p className='text-muted-foreground mt-2'>Manage platform administrator accounts</p>
                </div>
                <Button onClick={handleOpenAddModal}>
                    <UserPlus className='mr-2 h-4 w-4' />
                    Add Admin User
                </Button>
            </div>

            {/* Stats Cards */}
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

            {/* Filters and Search */}
            <Card>
                <CardContent className='pt-6'>
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <Input
                            placeholder='Search users...'
                            className='max-w-sm'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Select value={filterRole} onValueChange={(value) => setFilterRole(value)}>
                            {roles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Administrator Accounts Table */}
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
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                    onClick={() => handleEditUser(user)}
                                                >
                                                    Edit
                                                </Button>
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

            {/* Recent Admin Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Admin Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-3'>
                        {auditLogs.length > 0 ? (
                            auditLogs.map((activity, index) => (
                                <div key={index} className='flex items-center justify-between border-b pb-2 last:border-0'>
                                    <div>
                                        <p className='font-medium'>{activity.user || activity.userName}</p>
                                        <p className='text-sm text-muted-foreground'>{activity.action}</p>
                                    </div>
                                    <p className='text-xs text-muted-foreground'>{new Date(activity.timestamp || activity.createdAt).toLocaleString()}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No recent activity.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
                <DialogContent className="p-0 bg-transparent border-none shadow-none w-full max-w-lg">
                    <UserForm
                        onSubmit={isEditMode ? handleUpdateUser : handleAddUser}
                        onCancel={handleCloseModal}
                        initialData={isEditMode ? editingUser : null}
                        isEditMode={isEditMode}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
