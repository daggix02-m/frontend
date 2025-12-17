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
import { ProfileSettings } from '@/components/shared/ProfileSettings';
import { managerService } from '@/services/manager.service';
import { toast } from 'sonner';

export function Settings() {
  const [pharmacyProfile, setPharmacyProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [subscription, setSubscription] = useState({
    plan: '',
    price: '',
    status: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      // Fetch pharmacy profile
      const profileResponse = await managerService.getPharmacyProfile();
      if (profileResponse.success) {
        const profile = profileResponse.data || profileResponse.pharmacy || {};
        setPharmacyProfile({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || profile.contact || '',
          address: profile.address || '',
        });
      }

      // Fetch subscription info
      const subscriptionResponse = await managerService.getSubscription();
      if (subscriptionResponse.success) {
        const sub = subscriptionResponse.data || subscriptionResponse.subscription || {};
        setSubscription({
          plan: sub.plan || sub.plan_name || 'Basic',
          price: sub.price ? `ETB ${sub.price}/month` : 'ETB 0/month',
          status: sub.status || 'Active',
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await managerService.updatePharmacyProfile(pharmacyProfile);
      if (response.success) {
        toast.success('Pharmacy profile updated successfully');
      } else {
        toast.error('Failed to update pharmacy profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update pharmacy profile');
    }
  };

  return (
    <div className='space-y-6 p-4 sm:p-6'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Settings</h2>
        <p className='text-muted-foreground'>
          Manage your account, pharmacy configuration and subscription.
        </p>
      </div>

      {}
      <ProfileSettings userRole='Manager' />

      {}
      <div className='grid gap-6 grid-cols-1'>
        <Card>
          <CardHeader>
            <CardTitle>Pharmacy Profile</CardTitle>
            <CardDescription>Update your pharmacy details.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-2'>
              <label className='text-sm font-medium'>Pharmacy Name</label>
              <Input
                value={pharmacyProfile.name}
                onChange={(e) => setPharmacyProfile({ ...pharmacyProfile, name: e.target.value })}
                placeholder={loading ? 'Loading...' : 'Enter pharmacy name'}
              />
            </div>
            <div className='grid gap-2'>
              <label className='text-sm font-medium'>Contact Email</label>
              <Input
                value={pharmacyProfile.email}
                onChange={(e) => setPharmacyProfile({ ...pharmacyProfile, email: e.target.value })}
                placeholder={loading ? 'Loading...' : 'Enter contact email'}
              />
            </div>
            <div className='grid gap-2'>
              <label className='text-sm font-medium'>Phone Number</label>
              <Input
                value={pharmacyProfile.phone}
                onChange={(e) => setPharmacyProfile({ ...pharmacyProfile, phone: e.target.value })}
                placeholder={loading ? 'Loading...' : 'Enter phone number'}
              />
            </div>
            <div className='grid gap-2'>
              <label className='text-sm font-medium'>Address</label>
              <Input
                value={pharmacyProfile.address}
                onChange={(e) =>
                  setPharmacyProfile({ ...pharmacyProfile, address: e.target.value })
                }
                placeholder={loading ? 'Loading...' : 'Enter pharmacy address'}
              />
            </div>
            <Button onClick={handleProfileUpdate} disabled={loading}>
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Manage your current plan.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between p-4 border rounded-lg'>
              <div>
                <p className='font-medium'>{loading ? 'Loading...' : subscription.plan}</p>
                <p className='text-sm text-muted-foreground'>
                  {loading ? '...' : subscription.price}
                </p>
              </div>
              <Button variant='outline'>Upgrade</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Refunds & Discounts</CardTitle>
            <CardDescription>Configure policies for returns and discounts.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='allow-refunds'
                className='rounded border-gray-300'
                defaultChecked
              />
              <label htmlFor='allow-refunds' className='text-sm font-medium'>
                Allow Cashiers to process refunds
              </label>
            </div>
            <div className='flex items-center gap-2'>
              <input type='checkbox' id='allow-discounts' className='rounded border-gray-300' />
              <label htmlFor='allow-discounts' className='text-sm font-medium'>
                Allow Cashiers to apply discounts
              </label>
            </div>
            <Button variant='secondary'>Update Policies</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
