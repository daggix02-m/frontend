
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input } from '@/components/ui/ui';
import { Check, X, Plus } from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';

export function SubscriptionManagement() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        features: [],
        popular: false
    });

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const response = await adminService.getSubscriptions();

            if (response.success) {
                const subscriptionsData = response.data || response.subscriptions || [];
                setPlans(Array.isArray(subscriptionsData) ? subscriptionsData : []);
            } else {
                toast.error('Failed to load subscriptions');
                setPlans([]);
            }
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            toast.error('Failed to load subscriptions');
            setPlans([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEditPlan = (plan) => {
        setEditingPlan(plan);
        setFormData({
            name: plan.name,
            price: plan.price,
            features: [...(plan.features || [])],
            popular: plan.popular || false
        });
        setIsEditModalOpen(true);
    };

    const handleSavePlan = async () => {
        try {
            const response = await adminService.updateSubscription(editingPlan.id || editingPlan._id, formData);
            if (response.success) {
                toast.success('Subscription plan updated successfully');
                await fetchSubscriptions();
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

    const handleAddFeature = () => {
        setFormData({ ...formData, features: [...formData.features, ''] });
    };

    const handleRemoveFeature = (index) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData({ ...formData, features: newFeatures });
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    if (loading) {
        return (
            <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
                <h2 className='text-3xl font-bold tracking-tight'>Subscription Management</h2>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
            <div>
                <h2 className='text-3xl font-bold tracking-tight'>Subscription Management</h2>
                <p className='text-muted-foreground'>Manage subscription plans and billing.</p>
            </div>

            <div className='grid gap-6 grid-cols-1 md:grid-cols-3'>
                {plans.map((plan) => (
                    <Card key={plan.id} className={plan.popular ? 'border-primary shadow-lg' : ''}>
                        <CardHeader>
                            <CardTitle className='flex justify-between items-center'>
                                {plan.name}
                                {plan.popular && <span className='text-xs bg-primary/10 text-primary px-2 py-1 rounded-full'>Popular</span>}
                            </CardTitle>
                            <CardDescription>
                                <span className='text-3xl font-bold text-gray-900 dark:text-white'>{plan.price}</span> / month
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className='space-y-2'>
                                {plan.features.map((feature, index) => (
                                    <li key={index} className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                                        <Check size={16} className='text-green-600' />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                className='w-full mt-6'
                                variant={plan.popular ? 'default' : 'outline'}
                                onClick={() => handleEditPlan(plan)}
                            >
                                Edit Plan
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Plan Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Subscription Plan</DialogTitle>
                    </DialogHeader>

                    {editingPlan && (
                        <div className='space-y-6 p-4'>
                            <div className='grid gap-4'>
                                <div className='grid gap-2'>
                                    <label className='text-sm font-medium'>Plan Name</label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder='Enter plan name'
                                    />
                                </div>

                                <div className='grid gap-2'>
                                    <label className='text-sm font-medium'>Price (per month)</label>
                                    <Input
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder='ETB 29'
                                    />
                                </div>

                                <div className='grid gap-2'>
                                    <div className='flex items-center justify-between'>
                                        <label className='text-sm font-medium'>Features</label>
                                        <Button
                                            size='sm'
                                            variant='outline'
                                            onClick={handleAddFeature}
                                            type='button'
                                        >
                                            <Plus size={16} className='mr-1' />
                                            Add Feature
                                        </Button>
                                    </div>

                                    <div className='space-y-2'>
                                        {formData.features.map((feature, index) => (
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
                                        checked={formData.popular}
                                        onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                                        className='rounded border-gray-300'
                                    />
                                    <label htmlFor='popular' className='text-sm font-medium'>Mark as Popular Plan</label>
                                </div>
                            </div>

                            <div className='flex gap-3 justify-end pt-4 border-t'>
                                <Button
                                    variant='outline'
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleSavePlan}>
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
