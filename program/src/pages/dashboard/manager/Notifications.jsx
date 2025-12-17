import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input } from '@/components/ui/ui';
import {
  Bell,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
} from 'lucide-react';
import { managerService } from '@/services/manager.service';
import { toast } from 'sonner';

export function Notifications() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Total');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await managerService.getNotifications();

      if (response.success) {
        const notificationsData = response.data || response.notifications || [];
        setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
      } else {
        toast.error('Failed to load notifications');
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const response = await managerService.markNotificationRead(id);
      if (response.success) {
        setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
        toast.success('Marked as read');
      } else {
        toast.error(response.message || 'Failed to mark as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read);
      for (const notification of unreadNotifications) {
        await managerService.markNotificationRead(notification.id);
      }
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    toast.success('Notification deleted');
  };

  const categories = [
    { name: 'All', icon: Bell, color: 'text-blue-600' },
    { name: 'Transactions', icon: DollarSign, color: 'text-green-600', type: 'transaction' },
    { name: 'Stock', icon: Package, color: 'text-orange-600', type: 'stock' },
    { name: 'Staff', icon: Users, color: 'text-purple-600', type: 'staff' },
    { name: 'System', icon: AlertTriangle, color: 'text-red-600', type: 'system' },
  ];

  const stats = [
    {
      title: 'Unread',
      value: notifications.filter((n) => !n.read).length,
      icon: Bell,
      color: 'text-blue-600',
    },
    {
      title: 'High Priority',
      value: notifications.filter((n) => n.priority === 'high' && !n.read).length,
      icon: AlertTriangle,
      color: 'text-red-600',
    },
    {
      title: 'Today',
      value: notifications.filter((n) => !n.time.includes('Yesterday')).length,
      icon: Clock,
      color: 'text-orange-600',
    },
    { title: 'Total', value: notifications.length, icon: CheckCircle, color: 'text-green-600' },
  ];

  const filteredNotifications = notifications.filter((notification) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      notification.type === categories.find((c) => c.name === selectedCategory)?.type;
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatFilter = true;
    if (activeFilter === 'Unread') {
      matchesStatFilter = !notification.read;
    } else if (activeFilter === 'High Priority') {
      matchesStatFilter = notification.priority === 'high' && !notification.read;
    } else if (activeFilter === 'Today') {
      matchesStatFilter = !notification.time.includes('Yesterday');
    }

    return matchesCategory && matchesSearch && matchesStatFilter;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'transaction':
        return DollarSign;
      case 'stock':
        return Package;
      case 'staff':
        return Users;
      case 'system':
        return AlertTriangle;
      default:
        return Bell;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-l-red-500';
      case 'medium':
        return 'border-l-4 border-l-orange-500';
      case 'low':
        return 'border-l-4 border-l-green-500';
      default:
        return '';
    }
  };

  const groupNotificationsByTime = (notifications) => {
    const today = [];
    const yesterday = [];
    const older = [];

    notifications.forEach((notification) => {
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
      <div className='space-y-3'>
        <h3 className='text-sm font-semibold text-muted-foreground'>{title}</h3>
        {notifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          return (
            <Card
              key={notification.id}
              className={`${getPriorityColor(notification.priority)} ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''} hover:shadow-md transition-shadow cursor-pointer`}
            >
              <CardContent className='p-4'>
                <div className='flex items-start gap-4'>
                  <div
                    className={`p-2 rounded-lg ${notification.read ? 'bg-muted' : 'bg-blue-100 dark:bg-blue-900'}`}
                  >
                    <Icon
                      className={`h-5 w-5 ${notification.read ? 'text-muted-foreground' : 'text-blue-600'}`}
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between gap-2'>
                      <div className='flex-1'>
                        <h4
                          className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}
                        >
                          {notification.title}
                        </h4>
                        <p className='text-sm text-muted-foreground mt-1'>
                          {notification.description}
                        </p>
                        <div className='flex items-center gap-2 mt-2'>
                          <Clock className='h-3 w-3 text-muted-foreground' />
                          <span className='text-xs text-muted-foreground'>{notification.time}</span>
                          {notification.priority === 'high' && (
                            <Badge variant='destructive' className='text-xs'>
                              High Priority
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        {!notification.read && (
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <CheckCircle className='h-4 w-4' />
                          </Button>
                        )}
                        <Button
                          size='sm'
                          variant='ghost'
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

  if (loading) {
    return (
      <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
        <h1 className='text-3xl font-bold'>Notifications</h1>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6 p-4 md:p-8'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Notifications</h1>
          <p className='text-muted-foreground mt-2'>
            Stay updated with pharmacy activities and alerts
          </p>
        </div>
        <Button onClick={handleMarkAllAsRead}>
          <CheckCircle className='mr-2 h-4 w-4' />
          Mark All as Read
        </Button>
      </div>

      {}
      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeFilter === stat.title ? 'ring-2 ring-primary shadow-md' : ''
            }`}
            onClick={() => setActiveFilter(stat.title)}
          >
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
              <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent className='px-6 pb-6'>
              <div className='text-2xl font-bold'>{stat.value}</div>
              {activeFilter === stat.title && (
                <p className='text-xs text-muted-foreground mt-1'>Active filter</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {}
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

      {}
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
                {searchTerm ? `No results for "${searchTerm}"` : "You're all caught up!"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
