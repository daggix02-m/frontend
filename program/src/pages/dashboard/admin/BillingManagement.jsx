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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/ui';
import { DollarSign, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';

export function BillingManagement() {
  const [billingIssues, setBillingIssues] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillingIssues();
    fetchTransactions();
  }, []);

  const fetchBillingIssues = async () => {
    try {
      setLoading(true);
      const response = await adminService.getBillingIssues();

      if (response.success) {
        const billingIssuesData = response.data || response.billingIssues || [];
        setBillingIssues(Array.isArray(billingIssuesData) ? billingIssuesData : []);
      } else {
        toast.error('Failed to load billing issues');
        setBillingIssues([]);
      }
    } catch (error) {
      console.error('Error fetching billing issues:', error);
      toast.error('Failed to load billing issues');
      setBillingIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await adminService.getTransactions({ limit: 5 });
      if (response.success) {
        setTransactions(response.data || response.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleViewDetails = (issue) => {
    setSelectedIssue(issue);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedIssue(null);
  };

  const handleResolveIssue = async (id) => {
    if (window.confirm('Are you sure you want to resolve this billing issue?')) {
      try {
        const response = await adminService.resolveBillingIssue(id);
        if (response.success) {
          toast.success('Billing issue resolved successfully');
          await fetchBillingIssues(); // Refresh the list
        } else {
          toast.error(response.message || 'Failed to resolve billing issue');
        }
      } catch (error) {
        console.error('Error resolving billing issue:', error);
        toast.error('Failed to resolve billing issue');
      }
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'destructive',
      'in-progress': 'default',
      resolved: 'secondary',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const stats = [
    {
      title: 'Total Revenue',
      value:
        'ETB ' + transactions.reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString(),
      icon: DollarSign,
      trend: '+12.5%',
    },
    {
      title: 'Pending Issues',
      value: billingIssues.filter((i) => i.status === 'pending').length.toString(),
      icon: AlertCircle,
      trend: '-3',
    },
    {
      title: 'Resolved Today',
      value: billingIssues.filter((i) => i.status === 'resolved').length.toString(),
      icon: CheckCircle,
      trend: '+5',
    },
    { title: 'Avg Resolution Time', value: '2.3 hrs', icon: Clock, trend: '-0.5 hrs' },
  ];

  if (loading) {
    return (
      <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
        <h1 className='text-3xl font-bold'>Billing Management</h1>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Billing Management</h1>
        <p className='text-muted-foreground mt-2'>Handle billing issues and payment disputes</p>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6'>
              <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
              <stat.icon className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent className='px-6 pb-6'>
              <div className='text-2xl font-bold'>{stat.value}</div>
              <p className='text-xs text-muted-foreground mt-1'>{stat.trend} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Billing Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Billing Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pharmacy</TableHead>
                  <TableHead>Issue Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className='font-medium'>{issue.pharmacy}</TableCell>
                    <TableCell>{issue.issue}</TableCell>
                    <TableCell>{issue.amount}</TableCell>
                    <TableCell>{issue.date}</TableCell>
                    <TableCell>{getStatusBadge(issue.status)}</TableCell>
                    <TableCell>
                      <Button size='sm' variant='outline' onClick={() => handleViewDetails(issue)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between border-b pb-3 last:border-0'
                >
                  <div>
                    <p className='font-medium'>
                      Payment from {transaction.pharmacy || transaction.source}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {transaction.description || 'Subscription Payment'}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='font-bold text-green-600'>
                      +ETB {transaction.amount?.toLocaleString()}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {new Date(transaction.date || transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-sm text-muted-foreground'>No recent transactions.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailsModalOpen} onOpenChange={handleCloseDetails}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Billing Issue Details</DialogTitle>
          </DialogHeader>

          {selectedIssue && (
            <div className='space-y-6 p-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>Pharmacy Name</p>
                  <p className='text-base font-semibold mt-1'>{selectedIssue.pharmacy}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>Issue Type</p>
                  <p className='text-base font-semibold mt-1'>{selectedIssue.issue}</p>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>Amount</p>
                  <p className='text-base font-semibold mt-1'>{selectedIssue.amount}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>Status</p>
                  <div className='mt-1'>{getStatusBadge(selectedIssue.status)}</div>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>Date Reported</p>
                  <p className='text-base font-semibold mt-1'>{selectedIssue.date}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>Transaction ID</p>
                  <p className='text-base font-semibold mt-1'>{selectedIssue.transactionId}</p>
                </div>
              </div>

              <div>
                <p className='text-sm font-medium text-muted-foreground'>Contact Email</p>
                <p className='text-base font-semibold mt-1'>{selectedIssue.contactEmail}</p>
              </div>

              <div>
                <p className='text-sm font-medium text-muted-foreground'>Last Payment Attempt</p>
                <p className='text-base font-semibold mt-1'>{selectedIssue.lastAttempt}</p>
              </div>

              <div>
                <p className='text-sm font-medium text-muted-foreground'>Description</p>
                <p className='text-base mt-1 text-gray-700 dark:text-gray-300'>
                  {selectedIssue.description}
                </p>
              </div>

              <div className='flex gap-3 justify-end pt-4 border-t'>
                <Button variant='outline' onClick={handleCloseDetails}>
                  Close
                </Button>
                <Button onClick={() => handleResolveIssue(selectedIssue.id)}>Resolve Issue</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
