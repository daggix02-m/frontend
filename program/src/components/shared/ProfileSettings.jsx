import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Eye, EyeOff, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { getProfile, updateProfile, changePassword } from '@/api/auth.api';

export const ProfileSettings = ({ userRole = 'User' }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      if (response.success) {
        const user = response.data || response.user;
        setProfileData({
          name: user.name || user.full_name || '',
          email: user.email || '',
          phone: user.phone || user.phone_number || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      const response = await updateProfile(profileData);
      if (response.success) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (response.success) {
        toast.success('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(response.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details and contact information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className='space-y-6'>
            <div className='flex items-center gap-6'>
              <div className='relative'>
                <Avatar className='h-24 w-24'>
                  <AvatarFallback className='bg-primary/10 text-primary text-2xl'>
                    <User className='h-12 w-12' />
                  </AvatarFallback>
                </Avatar>
                <button
                  type='button'
                  className='absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors'
                  onClick={() => toast.info('Photo upload coming soon')}
                >
                  <Camera className='h-4 w-4' />
                </button>
              </div>
              <div>
                <p className='font-medium text-lg'>{profileData.name}</p>
                <p className='text-sm text-muted-foreground capitalize'>{userRole}</p>
              </div>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Full Name</Label>
                <Input
                  id='name'
                  name='name'
                  value={profileData.name}
                  onChange={handleProfileChange}
                  placeholder='Enter your full name'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Email Address</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  value={profileData.email}
                  onChange={handleProfileChange}
                  placeholder='your.email@example.com'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='phone'>Phone Number</Label>
                <Input
                  id='phone'
                  name='phone'
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  placeholder='+251 91 234 5678'
                />
              </div>
            </div>

            <div className='flex justify-end'>
              <Button type='submit' disabled={isUpdatingProfile}>
                {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='currentPassword'>Current Password</Label>
              <div className='relative'>
                <Input
                  id='currentPassword'
                  name='currentPassword'
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder='Enter current password'
                />
                <button
                  type='button'
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                >
                  {showCurrentPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='newPassword'>New Password</Label>
                <div className='relative'>
                  <Input
                    id='newPassword'
                    name='newPassword'
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder='Enter new password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                  >
                    {showNewPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </button>
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>Confirm New Password</Label>
                <div className='relative'>
                  <Input
                    id='confirmPassword'
                    name='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder='Confirm new password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <p className='text-xs text-muted-foreground'>
              Password must be at least 8 characters long.
            </p>

            <div className='flex justify-end'>
              <Button type='submit' disabled={isChangingPassword}>
                {isChangingPassword ? 'Changing Password...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
