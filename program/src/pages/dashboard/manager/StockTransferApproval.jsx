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
} from '@/components/ui/ui';
import { Package, CheckCircle, XCircle, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { managerService } from '@/services/manager.service';
import { toast } from 'sonner';

export function StockTransferApproval() {
  const [transfers, setTransfers] = useState([]);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const response = await managerService.getStockTransfers();

      if (response.success) {
        const transfersData = response.data || response.transfers || [];
        setTransfers(Array.isArray(transfersData) ? transfersData : []);
      } else {
        toast.error('Failed to load stock transfers');
        setTransfers([]);
      }
    } catch (error) {
      console.error('Error fetching stock transfers:', error);
      toast.error('Failed to load stock transfers');
      setTransfers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this transfer?')) {
      try {
        const response = await managerService.approveStockTransfer(id);
        if (response.success) {
          toast.success('Transfer approved successfully!');
          await fetchTransfers(); // Refresh the list
        } else {
          toast.error(response.message || 'Failed to approve transfer');
        }
      } catch (error) {
        console.error('Error approving transfer:', error);
        toast.error('Failed to approve transfer');
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this transfer?')) {
      try {
        const response = await managerService.rejectStockTransfer(id);
        if (response.success) {
          toast.error('Transfer rejected');
          await fetchTransfers(); // Refresh the list
        } else {
          toast.error(response.message || 'Failed to reject transfer');
        }
      } catch (error) {
        console.error('Error rejecting transfer:', error);
        toast.error('Failed to reject transfer');
      }
    }
  };

  const handleViewDetails = (transfer) => {
    setSelectedTransfer(transfer);
    setIsDetailsOpen(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'default',
      approved: 'secondary',
      rejected: 'destructive',
    };
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
    };
    const Icon = icons[status];
    return (
      <Badge variant={variants[status]} className='flex items-center gap-1 w-fit'>
        <Icon className='h-3 w-3' />
        {status}
      </Badge>
    );
  };

  const stats = [
    {
      title: 'Pending Approvals',
      value: transfers.filter((t) => t.status === 'pending').length,
      icon: Clock,
      color: 'text-orange-600',
    },
    {
      title: 'Approved Today',
      value: transfers.filter((t) => t.status === 'approved').length,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Rejected',
      value: transfers.filter((t) => t.status === 'rejected').length,
      icon: XCircle,
      color: 'text-red-600',
    },
    {
      title: 'Total This Month',
      value: transfers.length,
      icon: TrendingUp,
      color: 'text-blue-600',
    },
  ];

  if (loading) {
    return (
      <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
        <h1 className='text-3xl font-bold'>Stock Transfer Approval</h1>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Stock Transfer Approval</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          Review and approve stock transfers between branches
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
        <CardHeader>
          <CardTitle className='text-lg sm:text-xl'>Transfer Requests</CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          {}
          <div className='lg:hidden space-y-3 p-4'>
            {transfers.map((transfer) => (
              <Card key={transfer.id} className='overflow-hidden'>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between mb-3'>
                    <span className='font-semibold text-sm'>{transfer.id}</span>
                    {getStatusBadge(transfer.status)}
                  </div>

                  <div className='mb-3'>
                    <p className='text-xs text-muted-foreground mb-1'>Transfer Route</p>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-medium'>{transfer.from}</span>
                      <ArrowRight className='h-3.5 w-3.5 text-muted-foreground' />
                      <span className='text-sm font-medium'>{transfer.to}</span>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-3 mb-3'>
                    <div>
                      <p className='text-xs text-muted-foreground mb-1'>Product</p>
                      <p className='text-sm font-medium'>{transfer.product}</p>
                    </div>
                    <div>
                      <p className='text-xs text-muted-foreground mb-1'>Quantity</p>
                      <p className='text-sm font-medium'>{transfer.quantity} units</p>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-3 mb-3'>
                    <div>
                      <p className='text-xs text-muted-foreground mb-1'>Requested By</p>
                      <p className='text-sm'>{transfer.requestedBy}</p>
                    </div>
                    <div>
                      <p className='text-xs text-muted-foreground mb-1'>Date</p>
                      <p className='text-sm'>{transfer.date}</p>
                    </div>
                  </div>

                  {transfer.status === 'pending' ? (
                    <div className='flex gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='flex-1 text-green-600 hover:text-green-700 hover:bg-green-50'
                        onClick={() => handleApprove(transfer.id)}
                      >
                        <CheckCircle className='h-4 w-4 mr-2' />
                        Approve
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='flex-1 text-red-600 hover:text-red-700 hover:bg-red-50'
                        onClick={() => handleReject(transfer.id)}
                      >
                        <XCircle className='h-4 w-4 mr-2' />
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant='outline'
                      size='sm'
                      className='w-full'
                      onClick={() => handleViewDetails(transfer)}
                    >
                      View Details
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {}
          <div className='hidden lg:block overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transfer ID</TableHead>
                  <TableHead>From Branch</TableHead>
                  <TableHead>To Branch</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className='font-medium'>{transfer.id}</TableCell>
                    <TableCell>{transfer.from}</TableCell>
                    <TableCell>{transfer.to}</TableCell>
                    <TableCell>{transfer.product}</TableCell>
                    <TableCell>{transfer.quantity}</TableCell>
                    <TableCell>{transfer.requestedBy}</TableCell>
                    <TableCell>{transfer.date}</TableCell>
                    <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                    <TableCell>
                      {transfer.status === 'pending' ? (
                        <div className='flex gap-2'>
                          <Button
                            size='sm'
                            variant='outline'
                            className='text-green-600 hover:text-green-700 hover:bg-green-50'
                            onClick={() => handleApprove(transfer.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size='sm'
                            variant='outline'
                            className='text-red-600 hover:text-red-700 hover:bg-red-50'
                            onClick={() => handleReject(transfer.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => handleViewDetails(transfer)}
                        >
                          View Details
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg sm:text-xl'>Recent Transfer History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {transfers
              .filter((t) => t.status !== 'pending')
              .slice(0, 5)
              .map((item, index) => (
                <div
                  key={index}
                  className='flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 last:border-0 gap-2'
                >
                  <div>
                    <p className='font-medium'>{item.product}</p>
                    <p className='text-sm text-muted-foreground'>
                      {item.from} → {item.to} • Qty: {item.quantity}
                    </p>
                  </div>
                  <Badge variant={item.status === 'approved' ? 'secondary' : 'destructive'}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            {transfers.filter((t) => t.status !== 'pending').length === 0 && (
              <p className='text-sm text-muted-foreground text-center py-4'>
                No recent transfer history
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className='max-w-2xl'>
          {selectedTransfer && (
            <div className='space-y-4'>
              <div>
                <h2 className='text-2xl font-bold'>Transfer Details</h2>
                <p className='text-sm text-muted-foreground'>Transfer ID: {selectedTransfer.id}</p>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>From Branch</p>
                  <p className='text-lg font-semibold'>{selectedTransfer.from}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>To Branch</p>
                  <p className='text-lg font-semibold'>{selectedTransfer.to}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>Product</p>
                  <p className='text-lg font-semibold'>{selectedTransfer.product}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>Quantity</p>
                  <p className='text-lg font-semibold'>{selectedTransfer.quantity} units</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>Requested By</p>
                  <p className='text-lg font-semibold'>{selectedTransfer.requestedBy}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>Request Date</p>
                  <p className='text-lg font-semibold'>{selectedTransfer.date}</p>
                </div>
                <div className='col-span-2'>
                  <p className='text-sm font-medium text-muted-foreground'>Status</p>
                  <div className='mt-1'>{getStatusBadge(selectedTransfer.status)}</div>
                </div>
              </div>

              <div className='pt-4 border-t'>
                <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
