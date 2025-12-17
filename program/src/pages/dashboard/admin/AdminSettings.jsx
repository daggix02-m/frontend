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
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';

export function AdminSettings() {
  const [platformSettings, setPlatformSettings] = useState({
    platformName: '',
    supportEmail: '',
    contactPhone: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlatformSettings();
  }, []);

  const fetchPlatformSettings = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPlatformSettings();
      if (response.success) {
        const settings = response.data || response.settings || {};
        setPlatformSettings({
          platformName: settings.platformName || settings.platform_name || 'PharmaCare SaaS',
          supportEmail: settings.supportEmail || settings.support_email || 'support@pharmacare.com',
          contactPhone: settings.contactPhone || settings.contact_phone || '',
        });
      }
    } catch (error) {
      console.error('Error fetching platform settings:', error);
      toast.error('Failed to load platform settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = async () => {
    try {
      const response = await adminService.updatePlatformSettings(platformSettings);
      if (response.success) {
        toast.success('Platform settings updated successfully');
      } else {
        toast.error('Failed to update platform settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update platform settings');
    }
  };

  return (
    <div className='space-y-6 p-4 sm:p-6'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Global Settings</h2>
        <p className='text-muted-foreground'>Manage your account and system-wide configurations.</p>
      </div>

      {}
      <ProfileSettings userRole='Admin' />

      {}
      <div className='grid gap-6 grid-cols-1'>
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Platform details and defaults.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-2'>
              <label className='text-sm font-medium'>Platform Name</label>
              <Input
                value={platformSettings.platformName}
                onChange={(e) =>
                  setPlatformSettings({ ...platformSettings, platformName: e.target.value })
                }
                placeholder={loading ? 'Loading...' : 'Enter platform name'}
              />
            </div>
            <div className='grid gap-2'>
              <label className='text-sm font-medium'>Support Email</label>
              <Input
                value={platformSettings.supportEmail}
                onChange={(e) =>
                  setPlatformSettings({ ...platformSettings, supportEmail: e.target.value })
                }
                placeholder={loading ? 'Loading...' : 'Enter support email'}
              />
            </div>
            <div className='grid gap-2'>
              <label className='text-sm font-medium'>Contact Phone</label>
              <Input
                value={platformSettings.contactPhone}
                onChange={(e) =>
                  setPlatformSettings({ ...platformSettings, contactPhone: e.target.value })
                }
                placeholder={loading ? 'Loading...' : 'Enter contact phone'}
              />
            </div>
            <Button onClick={handleSettingsUpdate} disabled={loading}>
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Password policies and session settings.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center gap-2'>
              <input type='checkbox' id='mfa' className='rounded border-gray-300' defaultChecked />
              <label htmlFor='mfa' className='text-sm font-medium'>
                Enforce MFA for Admins
              </label>
            </div>
            <Button
              variant='secondary'
              onClick={() => toast.info('Security settings update coming soon')}
            >
              Update Security
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
