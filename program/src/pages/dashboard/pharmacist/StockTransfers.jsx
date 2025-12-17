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
  Button,
  Badge,
  Input,
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/ui';
import { Select } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { pharmacistService } from '@/services/pharmacist.service';
import { toast } from 'sonner';
import { StockTransferForm } from './components/StockTransferForm';

export function StockTransfers() {
  const [transfers, setTransfers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const response = await pharmacistService.getStockTransfers();

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

  const handleNewTransfer = () => {
    setIsModalOpen(true);
  };

  const handleCreateTransfer = async (data) => {
    try {
      const response = await pharmacistService.requestStockTransfer(data);
      if (response.success) {
        toast.success('Stock transfer requested successfully');
        await fetchTransfers(); // Refresh the list
        setIsModalOpen(false);
      } else {
        toast.error(response.message || 'Failed to request stock transfer');
      }
    } catch (error) {
      console.error('Error requesting stock transfer:', error);
      toast.error('Failed to request stock transfer');
    }
  };

  const handleViewTransfer = (id) => {
    alert(`Viewing details for transfer #${id}`);
  };

  if (loading) {
    return (
      <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
        <h1 className='text-3xl font-bold'>Stock Transfers</h1>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Stock Transfers</h2>
          <p className='text-muted-foreground'>
            Request and manage stock transfers between branches.
          </p>
        </div>
        <Button onClick={handleNewTransfer}>
          <Plus className='mr-2 h-4 w-4' /> New Transfer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell>{transfer.from}</TableCell>
                    <TableCell>{transfer.to}</TableCell>
                    <TableCell>{transfer.items}</TableCell>
                    <TableCell>{transfer.date}</TableCell>
                    <TableCell>
                      <Badge variant={transfer.status === 'Completed' ? 'default' : 'secondary'}>
                        {transfer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleViewTransfer(transfer.id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='p-0 bg-transparent border-none shadow-none w-full max-w-lg'>
          <StockTransferForm
            onSubmit={handleCreateTransfer}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
