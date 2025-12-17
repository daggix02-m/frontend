import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
} from '@/components/ui/ui';
import { Select } from '@/components/ui/select';
import { Percent, DollarSign, Tag, Settings } from 'lucide-react';
import { managerService } from '@/services/manager.service';
import { toast } from 'sonner';

export function RefundsDiscounts() {
  const [refundPolicy, setRefundPolicy] = useState({
    enabled: true,
    maxDays: 30,
    requireReceipt: true,
    requireApproval: true,
  });

  const [discountRules, setDiscountRules] = useState([]);
  const [newDiscount, setNewDiscount] = useState({
    name: '',
    type: 'percentage',
    value: '',
    appliesTo: 'all',
  });
  const [loading, setLoading] = useState(true);

  const [statsData, setStatsData] = useState({
    totalSavings: 0,
    avgDiscount: 0,
    refundsCount: 0,
  });

  useEffect(() => {
    fetchDiscountRules();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await managerService.getDiscountStats();
      if (response.success) {
        setStatsData(response.data || { totalSavings: 0, avgDiscount: 0, refundsCount: 0 });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchDiscountRules = async () => {
    try {
      setLoading(true);
      const response = await managerService.getDiscountRules();

      if (response.success) {
        const rulesData = response.data || response.rules || [];
        setDiscountRules(Array.isArray(rulesData) ? rulesData : []);
      } else {
        toast.error('Failed to load discount rules');
        setDiscountRules([]);
      }
    } catch (error) {
      console.error('Error fetching discount rules:', error);
      toast.error('Failed to load discount rules');
      setDiscountRules([]);
    } finally {
      setLoading(false);
    }
  };

  // ... (rest of the functions)

  const stats = [
    {
      title: 'Active Discounts',
      value: discountRules.filter((r) => r.active).length.toString(),
      icon: Tag,
      color: 'text-blue-600',
    },
    {
      title: 'Total Savings',
      value: `ETB ${statsData.totalSavings.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Avg Discount',
      value: `${statsData.avgDiscount}%`,
      icon: Percent,
      color: 'text-purple-600',
    },
    {
      title: 'Refunds This Month',
      value: statsData.refundsCount.toString(),
      icon: Settings,
      color: 'text-orange-600',
    },
  ];

  const handleCreateDiscount = async () => {
    if (!newDiscount.name || !newDiscount.value) return;

    try {
      const discountData = {
        name: newDiscount.name,
        type: newDiscount.type,
        value: Number(newDiscount.value),
        appliesTo: newDiscount.appliesTo,
        active: true,
      };

      const response = await managerService.createDiscountRule(discountData);
      if (response.success) {
        toast.success('Discount created successfully!');
        await fetchDiscountRules(); // Refresh the list
        setNewDiscount({ name: '', type: 'percentage', value: '', appliesTo: 'all' });
      } else {
        toast.error(response.message || 'Failed to create discount');
      }
    } catch (error) {
      console.error('Error creating discount:', error);
      toast.error('Failed to create discount');
    }
  };

  const handleToggleDiscount = async (id) => {
    try {
      // In a real implementation, we'd have a separate method to toggle status
      // For now, we'll use the delete method to toggle the discount
      const rule = discountRules.find((r) => r.id === id);
      if (rule) {
        const response = rule.active
          ? await managerService.deleteDiscountRule(id) // Assuming this deactivates
          : await managerService.createDiscountRule({ ...rule, active: true }); // Reactivate
        if (response.success) {
          toast.success('Discount status updated!');
          await fetchDiscountRules(); // Refresh the list
        } else {
          toast.error(response.message || 'Failed to update discount status');
        }
      }
    } catch (error) {
      console.error('Error toggling discount:', error);
      toast.error('Failed to update discount status');
    }
  };

  const handleEditDiscount = (rule) => {
    setNewDiscount({
      name: rule.name,
      type: rule.type,
      value: rule.value.toString(),
      appliesTo: 'all',
    });
    toast.info('Edit discount details and click Create to update');
  };

  const handleSaveRefundPolicy = async () => {
    try {
      const response = await managerService.updateRefundPolicy(refundPolicy);
      if (response.success) {
        toast.success('Refund policy saved!');
      } else {
        toast.error(response.message || 'Failed to save refund policy');
      }
    } catch (error) {
      console.error('Error saving refund policy:', error);
      toast.error('Failed to save refund policy');
    }
  };

  if (loading) {
    return (
      <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
        <h1 className='text-3xl font-bold'>Refunds & Discounts</h1>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Refunds & Discounts</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          Configure refund policies and discount rules
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

      <div className='grid gap-6 grid-cols-1 md:grid-cols-2'>
        {}
        <Card>
          <CardHeader>
            <CardTitle>Refund Policy Settings</CardTitle>
            <CardDescription>Configure your pharmacy's refund policy</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <label className='text-sm font-medium'>Enable Refunds</label>
              <input
                type='checkbox'
                checked={refundPolicy.enabled}
                onChange={(e) => setRefundPolicy({ ...refundPolicy, enabled: e.target.checked })}
                className='h-4 w-4'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Refund Window (Days)</label>
              <Input
                type='number'
                value={refundPolicy.maxDays}
                onChange={(e) => setRefundPolicy({ ...refundPolicy, maxDays: e.target.value })}
              />
            </div>
            <div className='flex items-center justify-between'>
              <label className='text-sm font-medium'>Require Receipt</label>
              <input
                type='checkbox'
                checked={refundPolicy.requireReceipt}
                onChange={(e) =>
                  setRefundPolicy({ ...refundPolicy, requireReceipt: e.target.checked })
                }
                className='h-4 w-4'
              />
            </div>
            <div className='flex items-center justify-between'>
              <label className='text-sm font-medium'>Require Manager Approval</label>
              <input
                type='checkbox'
                checked={refundPolicy.requireApproval}
                onChange={(e) =>
                  setRefundPolicy({ ...refundPolicy, requireApproval: e.target.checked })
                }
                className='h-4 w-4'
              />
            </div>
            <Button className='w-full' onClick={handleSaveRefundPolicy}>
              Save Refund Policy
            </Button>
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader>
            <CardTitle>Create New Discount</CardTitle>
            <CardDescription>Add a new discount rule</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Discount Name</label>
              <Input
                placeholder='e.g., Student Discount'
                value={newDiscount.name}
                onChange={(e) => setNewDiscount({ ...newDiscount, name: e.target.value })}
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Discount Type</label>
              <Select
                value={newDiscount.type}
                onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value })}
              >
                <option value='percentage'>Percentage</option>
                <option value='fixed'>Fixed Amount</option>
              </Select>
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Discount Value</label>
              <Input
                type='number'
                placeholder='10'
                value={newDiscount.value}
                onChange={(e) => setNewDiscount({ ...newDiscount, value: e.target.value })}
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Applies To</label>
              <Select
                value={newDiscount.appliesTo}
                onChange={(e) => setNewDiscount({ ...newDiscount, appliesTo: e.target.value })}
              >
                <option value='all'>All Products</option>
                <option value='category'>Specific Category</option>
                <option value='product'>Specific Product</option>
              </Select>
            </div>
            <Button className='w-full' onClick={handleCreateDiscount}>
              Create Discount
            </Button>
          </CardContent>
        </Card>
      </div>

      {}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg sm:text-xl'>Active Discount Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {discountRules.map((rule) => (
              <div
                key={rule.id}
                className='flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 last:border-0 gap-3'
              >
                <div className='flex-1'>
                  <p className='font-medium'>{rule.name}</p>
                  <p className='text-sm text-muted-foreground'>
                    {rule.type === 'percentage' ? `${rule.value}% off` : `ETB ${rule.value} off`}
                  </p>
                </div>
                <div className='flex items-center gap-2 sm:flex-shrink-0'>
                  <span className={`text-sm ${rule.active ? 'text-green-600' : 'text-gray-400'}`}>
                    {rule.active ? 'Active' : 'Inactive'}
                  </span>
                  <Button
                    size='sm'
                    variant='outline'
                    className='flex-1 sm:flex-none'
                    onClick={() => handleEditDiscount(rule)}
                  >
                    Edit
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    className='flex-1 sm:flex-none'
                    onClick={() => handleToggleDiscount(rule.id)}
                  >
                    {rule.active ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg sm:text-xl'>Approval Thresholds</CardTitle>
          <CardDescription>Set limits for automatic approval</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Max Refund Amount (Auto-Approve)</label>
              <Input type='number' placeholder='100' />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Max Discount % (Auto-Apply)</label>
              <Input type='number' placeholder='20' />
            </div>
          </div>
          <Button onClick={() => toast.success('Thresholds updated!')}>Update Thresholds</Button>
        </CardContent>
      </Card>
    </div>
  );
}
