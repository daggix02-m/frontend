import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Button,
  Input,
} from '@/components/ui/ui';
import { Select } from '@/components/ui/select';
import { Ticket, MessageSquare, User, Clock } from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';

export function SupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSupportTickets();

      if (response.success) {
        const ticketsData = response.data || response.tickets || [];
        setTickets(Array.isArray(ticketsData) ? ticketsData : []);
      } else {
        toast.error('Failed to load support tickets');
        setTickets([]);
      }
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      toast.error('Failed to load support tickets');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

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

  // Filter tickets based on selected filters and search term
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    const matchesSearch =
      searchTerm === '' ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.pharmacy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());

    // Handle assignee filter - need to match the assignee name
    let matchesAssignee = true;
    if (filterAssignee !== 'all') {
      if (filterAssignee === 'unassigned') {
        matchesAssignee = ticket.assignee === 'Unassigned' || !ticket.assignee;
      } else if (filterAssignee === 'mulugeta') {
        matchesAssignee = ticket.assignee === 'Mulugeta Assefa';
      } else if (filterAssignee === 'bethlehem') {
        matchesAssignee = ticket.assignee === 'Bethlehem Yilma';
      }
    }

    return matchesStatus && matchesPriority && matchesAssignee && matchesSearch;
  });

  const stats = [
    {
      title: 'Open Tickets',
      value: tickets.filter((t) => t.status === 'open').length.toString(),
      icon: Ticket,
      color: 'text-red-600',
    },
    {
      title: 'In Progress',
      value: tickets.filter((t) => t.status === 'in-progress').length.toString(),
      icon: Clock,
      color: 'text-blue-600',
    },
    {
      title: 'Resolved',
      value: tickets.filter((t) => t.status === 'resolved').length.toString(),
      icon: MessageSquare,
      color: 'text-green-600',
    },
    {
      title: 'Total Tickets',
      value: tickets.length.toString(),
      icon: User,
      color: 'text-purple-600',
    },
  ];

  if (loading) {
    return (
      <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
        <h1 className='text-3xl font-bold'>Support Tickets</h1>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Support Tickets</h1>
        <p className='text-muted-foreground mt-2'>
          Manage and respond to pharmacy support requests
        </p>
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
              placeholder='Search tickets...'
              className='max-w-sm'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              className='w-full sm:w-48'
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value='all'>All Status</option>
              <option value='open'>Open</option>
              <option value='in-progress'>In Progress</option>
              <option value='resolved'>Resolved</option>
            </Select>
            <Select
              className='w-full sm:w-48'
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value='all'>All Priority</option>
              <option value='urgent'>Urgent</option>
              <option value='high'>High</option>
              <option value='medium'>Medium</option>
              <option value='low'>Low</option>
            </Select>
            <Select
              className='w-full sm:w-48'
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
            >
              <option value='all'>All Assignees</option>
              <option value='unassigned'>Unassigned</option>
              <option value='mulugeta'>Mulugeta Assefa</option>
              <option value='bethlehem'>Bethlehem Yilma</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle>All Tickets ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
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
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className='font-medium'>{ticket.id}</TableCell>
                      <TableCell>{ticket.pharmacy}</TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>{ticket.assignee || 'Unassigned'}</TableCell>
                      <TableCell>{ticket.created}</TableCell>
                      <TableCell>
                        <Button size='sm' variant='outline'>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className='text-center py-8 text-muted-foreground'>
                      No tickets match the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
