import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input } from '@/components/ui/ui';
import { Bell, DollarSign, Package, Users, AlertTriangle, CheckCircle, Clock, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

export function Notifications() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [notifications, setNotifications] = useState([
        // Transactions
        { id: 1, type: 'transaction', title: 'High-Value Sale Completed', description: 'Sale of ETB 5,450 - Receipt #RCP-1234', time: '5 minutes ago', read: false, priority: 'high' },
        { id: 2, type: 'transaction', title: 'Refund Processed', description: 'Refund of ETB 245 for Receipt #RCP-1189', time: '15 minutes ago', read: false, priority: 'medium' },
        { id: 3, type: 'transaction', title: 'Daily Sales Target Reached', description: 'Congratulations! Daily target of ETB 50,000 achieved', time: '1 hour ago', read: true, priority: 'low' },

        // Stock Requests
        { id: 4, type: 'stock', title: 'Transfer Request Pending', description: 'Paracetamol 500mg (500 units) - From Main to Downtown', time: '10 minutes ago', read: false, priority: 'high' },
        { id: 5, type: 'stock', title: 'Low Stock Alert', description: 'Amoxicillin 250mg below minimum threshold (Current: 45, Min: 100)', time: '30 minutes ago', read: false, priority: 'high' },
        { id: 6, type: 'stock', title: 'Replenishment Request', description: 'Vitamin C 1000mg - Requested by Alemayehu Desta', time: '2 hours ago', read: true, priority: 'medium' },
        { id: 7, type: 'stock', title: 'Stock Transfer Approved', description: 'Transfer #ST-003 approved - Ibuprofen 400mg (300 units)', time: '3 hours ago', read: true, priority: 'low' },

        // Staff Activities
        { id: 8, type: 'staff', title: 'New Staff Member Added', description: 'Tigist Alemayehu joined as Pharmacist', time: '45 minutes ago', read: false, priority: 'medium' },
        { id: 9, type: 'staff', title: 'Staff Login Alert', description: 'Unusual login time: Berhanu Wolde at 2:30 AM', time: '6 hours ago', read: true, priority: 'high' },
        { id: 10, type: 'staff', title: 'Staff Activity Log', description: 'Selamawit Mekonnen completed 8-hour shift', time: 'Yesterday', read: true, priority: 'low' },

        // System Alerts
        { id: 11, type: 'system', title: 'Products Expiring Soon', description: '15 products expiring within 30 days', time: '20 minutes ago', read: false, priority: 'high' },
        { id: 12, type: 'system', title: 'System Update Available', description: 'Version 2.1.0 ready for installation', time: '4 hours ago', read: true, priority: 'medium' },
        { id: 13, type: 'system', title: 'Backup Completed', description: 'Daily backup completed successfully', time: 'Yesterday', read: true, priority: 'low' },
    ]);

    const categories = [
        { name: 'All', icon: Bell, color: 'text-blue-600' },
        { name: 'Transactions', icon: DollarSign, color: 'text-green-600', type: 'transaction' },
        { name: 'Stock', icon: Package, color: 'text-orange-600', type: 'stock' },
        { name: 'Staff', icon: Users, color: 'text-purple-600', type: 'staff' },
        { name: 'System', icon: AlertTriangle, color: 'text-red-600', type: 'system' },
    ];

    const stats = [
        { title: 'Unread', value: notifications.filter(n => !n.read).length, icon: Bell, color: 'text-blue-600' },
        { title: 'High Priority', value: notifications.filter(n => n.priority === 'high' && !n.read).length, icon: AlertTriangle, color: 'text-red-600' },
        { title: 'Today', value: notifications.filter(n => !n.time.includes('Yesterday')).length, icon: Clock, color: 'text-orange-600' },
        { title: 'Total', value: notifications.length, icon: CheckCircle, color: 'text-green-600' },
    ];

    const handleMarkAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
        toast.success('Marked as read');
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        toast.success('All notifications marked as read');
    };

    const handleDeleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
        toast.success('Notification deleted');
    };

    const filteredNotifications = notifications.filter(notification => {
        const matchesCategory = selectedCategory === 'All' ||
            notification.type === categories.find(c => c.name === selectedCategory)?.type;
        const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'transaction': return DollarSign;
            case 'stock': return Package;
            case 'staff': return Users;
            case 'system': return AlertTriangle;
            default: return Bell;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'border-l-4 border-l-red-500';
            case 'medium': return 'border-l-4 border-l-orange-500';
            case 'low': return 'border-l-4 border-l-green-500';
            default: return '';
        }
    };

    const groupNotificationsByTime = (notifications) => {
        const today = [];
        const yesterday = [];
        const older = [];

        notifications.forEach(notification => {
            if (notification.time.includes('Yesterday')) {
                yesterday.push(notification);
            } else if (notification.time.includes('hour') || notification.time.includes('minute')) {
                today.push(notification);
            } else {
                older.push(notification);
            }
        });

        return { today, yesterday, older };
    };

    const { today, yesterday, older } = groupNotificationsByTime(filteredNotifications);

    const renderNotificationGroup = (title, notifications) => {
        if (notifications.length === 0) return null;

        return (
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
                {notifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    return (
                        <Card
                            key={notification.id}
                            className={`${getPriorityColor(notification.priority)} ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''} hover:shadow-md transition-shadow cursor-pointer`}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-lg ${notification.read ? 'bg-muted' : 'bg-blue-100 dark:bg-blue-900'}`}>
                                        <Icon className={`h-5 w-5 ${notification.read ? 'text-muted-foreground' : 'text-blue-600'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <h4 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                    {notification.title}
                                                </h4>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {notification.description}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                                                    {notification.priority === 'high' && (
                                                        <Badge variant="destructive" className="text-xs">High Priority</Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {!notification.read && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleDeleteNotification(notification.id)}
                                                >
                                                    ×
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        );
    };

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Notifications</h1>
                    <p className='text-muted-foreground mt-2'>Stay updated with pharmacy activities and alerts</p>
                </div>
                <Button onClick={handleMarkAllAsRead}>
                    <CheckCircle className='mr-2 h-4 w-4' />
                    Mark All as Read
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

            {/* Filters */}
            <Card>
                <CardContent className='pt-6'>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='relative flex-1'>
                            <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                            <Input
                                placeholder='Search notifications...'
                                className='pl-10'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className='flex gap-2 flex-wrap'>
                            {categories.map((category) => {
                                const Icon = category.icon;
                                return (
                                    <Button
                                        key={category.name}
                                        variant={selectedCategory === category.name ? 'default' : 'outline'}
                                        onClick={() => setSelectedCategory(category.name)}
                                        className='flex items-center gap-2'
                                    >
                                        <Icon className='h-4 w-4' />
                                        {category.name}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications List */}
            <div className='space-y-6'>
                {renderNotificationGroup('Today', today)}
                {renderNotificationGroup('Yesterday', yesterday)}
                {renderNotificationGroup('Older', older)}

                {filteredNotifications.length === 0 && (
                    <Card>
                        <CardContent className='py-12 text-center'>
                            <Bell className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                            <h3 className='text-lg font-semibold mb-2'>No notifications found</h3>
                            <p className='text-muted-foreground'>
                                {searchTerm ? `No results for "${searchTerm}"` : 'You\'re all caught up!'}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
