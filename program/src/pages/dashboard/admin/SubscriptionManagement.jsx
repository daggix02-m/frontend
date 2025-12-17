import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
} from '@/components/ui/ui';
import { Check, X, Plus, Users, CreditCard, Settings, UserPlus } from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';

export function SubscriptionManagement() {
  // View state
  const [activeView, setActiveView] = useState('plans'); // 'plans' or 'users'

  // Subscription Plans
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planFormData, setPlanFormData] = useState({
    name: '',
    price: '',
    features: [],
    popular: false,
  });

  // User Subscriptions
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [assignFormData, setAssignFormData] = useState({
    plan_id: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchPlans(), fetchUserSubscriptions(), fetchManagers()]);
  };

  const fetchPlans = async () => {
    try {
      setLoadingPlans(true);
      const response = await adminService.getSubscriptions();

      if (response.success) {
        const subscriptionsData = response.data || response.subscriptions || [];
        setPlans(Array.isArray(subscriptionsData) ? subscriptionsData : []);
      } else {
        toast.error('Failed to load subscription plans');
        setPlans([]);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load subscription plans');
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  };

  const fetchUserSubscriptions = async () => {
    try {
      setLoadingUsers(true);
      // This would typically be a separate endpoint for user subscriptions
      // For now, we'll get managers and their subscription info
      const response = await adminService.getManagers();

      if (response.success) {
        const managersData = response.data?.all || response.data || [];
        // Mock subscription data - in real app this would come from backend
        const subscriptionsWithPlans = managersData.map((manager) => ({
          ...manager,
          subscription: {
            plan_name: manager.subscription_plan || 'Basic',
            status: manager.subscription_status || 'active',
            start_date: manager.subscription_start || null,
            end_date: manager.subscription_end || null,
          },
        }));
        setUserSubscriptions(subscriptionsWithPlans);
      } else {
        setUserSubscriptions([]);
      }
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
      setUserSubscriptions([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await adminService.getManagers();
      if (response.success) {
        const managersData = response.data?.all || response.data || [];
        setManagers(Array.isArray(managersData) ? managersData : []);
      } else {
        setManagers([]);
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
      setManagers([]);
    }
  };

  // Plan Management Functions
  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanFormData({
      name: plan.name,
      price: plan.price,
      features: [...(plan.features || [])],
      popular: plan.popular || false,
    });
    setIsEditModalOpen(true);
  };

  const handleSavePlan = async () => {
    try {
      const response = await adminService.updateSubscription(
        editingPlan.id || editingPlan._id,
        planFormData
      );
      if (response.success) {
        toast.success('Subscription plan updated successfully');
        await fetchPlans();
        setIsEditModalOpen(false);
        setEditingPlan(null);
      } else {
        toast.error(response.message || 'Failed to update plan');
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error('Failed to update plan');
    }
  };

  // User Subscription Management Functions
  const handleAssignSubscription = (user) => {
    setSelectedUser(user);
    setAssignFormData({
      plan_id: user.subscription?.plan_id || '',
      start_date: user.subscription?.start_date
        ? new Date(user.subscription.start_date).toISOString().split('T')[0]
        : '',
      end_date: user.subscription?.end_date
        ? new Date(user.subscription.end_date).toISOString().split('T')[0]
        : '',
    });
    setIsAssignModalOpen(true);
  };

  const handleSaveSubscriptionAssignment = async () => {
    try {
      const response = await adminService.assignUserSubscription(
        selectedUser.user_id,
        assignFormData
      );
      if (response.success) {
        toast.success('Subscription assigned successfully');
        await fetchUserSubscriptions();
        setIsAssignModalOpen(false);
        setSelectedUser(null);
      } else {
        toast.error(response.message || 'Failed to assign subscription');
      }
    } catch (error) {
      console.error('Error assigning subscription:', error);
      toast.error('Failed to assign subscription');
    }
  };

  const handleAddFeature = () => {
    setPlanFormData({ ...planFormData, features: [...planFormData.features, ''] });
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = planFormData.features.filter((_, i) => i !== index);
    setPlanFormData({ ...planFormData, features: newFeatures });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...planFormData.features];
    newFeatures[index] = value;
    setPlanFormData({ ...planFormData, features: newFeatures });
  };

  const isLoading = loadingPlans || loadingUsers;

  if (isLoading) {
    return (
      <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
        <h2 className='text-3xl font-bold tracking-tight'>Subscription Management</h2>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Subscription Management</h2>
        <p className='text-muted-foreground'>Manage subscription plans and assign them to users.</p>
      </div>

      {/* View Navigation */}
      <div className='flex gap-2 mb-6'>
        <Button
          variant={activeView === 'plans' ? 'default' : 'outline'}
          onClick={() => setActiveView('plans')}
          className='flex items-center gap-2'
        >
          <Settings className='h-4 w-4' />
          Subscription Plans
        </Button>
        <Button
          variant={activeView === 'users' ? 'default' : 'outline'}
          onClick={() => setActiveView('users')}
          className='flex items-center gap-2'
        >
          <Users className='h-4 w-4' />
          User Subscriptions
        </Button>
      </div>

      {/* Plans View */}
      {activeView === 'plans' && (
        <div className='space-y-6'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-semibold'>Subscription Plans</h3>
            <Button onClick={() => toast.info('Create new plan functionality coming soon')}>
              <Plus className='h-4 w-4 mr-2' />
              Create Plan
            </Button>
          </div>

          <div className='grid gap-6 grid-cols-1 md:grid-cols-3'>
            {plans.map((plan) => (
              <Card
                key={plan.id || plan._id}
                className={plan.popular ? 'border-primary shadow-lg' : ''}
              >
                <CardHeader>
                  <CardTitle className='flex justify-between items-center'>
                    {plan.name}
                    {plan.popular && (
                      <span className='text-xs bg-primary/10 text-primary px-2 py-1 rounded-full'>
                        Popular
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    <span className='text-3xl font-bold text-gray-900 dark:text-white'>
                      {plan.price}
                    </span>{' '}
                    / month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-2 mb-4'>
                    {plan.features?.map((feature, index) => (
                      <li
                        key={index}
                        className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'
                      >
                        <Check size={16} className='text-green-600' />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className='w-full'
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleEditPlan(plan)}
                  >
                    Edit Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Users View */}
      {activeView === 'users' && (
        <div className='space-y-6'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-semibold'>User Subscription Management</h3>
            <div className='text-sm text-muted-foreground'>
              {userSubscriptions.length} total users
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Users className='h-5 w-5' />
                User Subscriptions
              </CardTitle>
              <CardDescription>
                View and manage subscription assignments for all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Current Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Valid Until</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userSubscriptions.length > 0 ? (
                      userSubscriptions.map((user) => (
                        <TableRow key={user.user_id}>
                          <TableCell>
                            <div className='font-medium'>{user.full_name}</div>
                            <div className='text-xs text-muted-foreground'>{user.email}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant='outline'>{user.role_name}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className='font-medium'>
                              {user.subscription?.plan_name || 'No Plan'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.subscription?.status === 'active'
                                  ? 'default'
                                  : user.subscription?.status === 'expired'
                                    ? 'destructive'
                                    : user.subscription?.status === 'pending'
                                      ? 'secondary'
                                      : 'outline'
                              }
                            >
                              {user.subscription?.status || 'No Plan'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.subscription?.end_date
                              ? new Date(user.subscription.end_date).toLocaleDateString()
                              : 'N/A'}
                          </TableCell>
                          <TableCell className='text-right'>
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={() => handleAssignSubscription(user)}
                            >
                              <UserPlus className='h-4 w-4 mr-2' />
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Plan Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Edit Subscription Plan</DialogTitle>
          </DialogHeader>

          {editingPlan && (
            <div className='space-y-6 p-4'>
              <div className='grid gap-4'>
                <div className='grid gap-2'>
                  <label className='text-sm font-medium'>Plan Name</label>
                  <Input
                    value={planFormData.name}
                    onChange={(e) => setPlanFormData({ ...planFormData, name: e.target.value })}
                    placeholder='Enter plan name'
                  />
                </div>

                <div className='grid gap-2'>
                  <label className='text-sm font-medium'>Price (per month)</label>
                  <Input
                    value={planFormData.price}
                    onChange={(e) => setPlanFormData({ ...planFormData, price: e.target.value })}
                    placeholder='ETB 29'
                  />
                </div>

                <div className='grid gap-2'>
                  <div className='flex items-center justify-between'>
                    <label className='text-sm font-medium'>Features</label>
                    <Button size='sm' variant='outline' onClick={handleAddFeature} type='button'>
                      <Plus size={16} className='mr-1' />
                      Add Feature
                    </Button>
                  </div>

                  <div className='space-y-2'>
                    {planFormData.features.map((feature, index) => (
                      <div key={index} className='flex items-center gap-2'>
                        <Input
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          placeholder='Enter feature'
                        />
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={() => handleRemoveFeature(index)}
                          className='text-red-600 hover:text-red-700 hover:bg-red-50'
                          type='button'
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    id='popular'
                    checked={planFormData.popular}
                    onChange={(e) =>
                      setPlanFormData({ ...planFormData, popular: e.target.checked })
                    }
                    className='rounded border-gray-300'
                  />
                  <label htmlFor='popular' className='text-sm font-medium'>
                    Mark as Popular Plan
                  </label>
                </div>
              </div>

              <div className='flex gap-3 justify-end pt-4 border-t'>
                <Button
                  variant='outline'
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingPlan(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSavePlan}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Subscription Modal */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Assign Subscription</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className='space-y-6 p-4'>
              <div className='text-center mb-4'>
                <div className='font-medium'>{selectedUser.full_name}</div>
                <div className='text-sm text-muted-foreground'>{selectedUser.email}</div>
              </div>

              <div className='grid gap-4'>
                <div className='grid gap-2'>
                  <label className='text-sm font-medium'>Subscription Plan</label>
                  <Select
                    value={assignFormData.plan_id}
                    onChange={(e) =>
                      setAssignFormData({ ...assignFormData, plan_id: e.target.value })
                    }
                  >
                    <option value=''>Select a plan</option>
                    {plans.map((plan) => (
                      <option key={plan.id || plan._id} value={plan.id || plan._id}>
                        {plan.name} - {plan.price}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className='grid gap-2'>
                  <label className='text-sm font-medium'>Start Date</label>
                  <Input
                    type='date'
                    value={assignFormData.start_date}
                    onChange={(e) =>
                      setAssignFormData({ ...assignFormData, start_date: e.target.value })
                    }
                  />
                </div>

                <div className='grid gap-2'>
                  <label className='text-sm font-medium'>End Date</label>
                  <Input
                    type='date'
                    value={assignFormData.end_date}
                    onChange={(e) =>
                      setAssignFormData({ ...assignFormData, end_date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className='flex gap-3 justify-end pt-4 border-t'>
                <Button
                  variant='outline'
                  onClick={() => {
                    setIsAssignModalOpen(false);
                    setSelectedUser(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveSubscriptionAssignment}>Assign Subscription</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
