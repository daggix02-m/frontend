import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { managerService } from '@/services/manager.service';
import { toast } from 'sonner';
import {
  Users,
  Plus,
  Search,
  Mail,
  Shield,
  ShieldCheck,
  ShieldX,
  Key,
  Loader2,
  UserCheck,
  UserX,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';

export function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  
  // Add Staff Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    full_name: '',
    email: '',
    role_id: '3', // Default to Pharmacist
  });
  
  // Verify Staff Modal
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  
  // Reset Password Modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStaffId, setResetStaffId] = useState(null);
  const [resetStaffName, setResetStaffName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    filterStaff();
  }, [searchQuery, staff]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await managerService.getStaff();
      
      if (response.success) {
        const staffList = response.data || response.staff || [];
        setStaff(Array.isArray(staffList) ? staffList : []);
      } else {
        toast.error(response.message || 'Failed to fetch staff');
        setStaff([]);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to fetch staff');
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const filterStaff = () => {
    if (!searchQuery) {
      setFilteredStaff(staff);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = staff.filter(s =>
      s.full_name?.toLowerCase().includes(query) ||
      s.email?.toLowerCase().includes(query)
    );
    setFilteredStaff(filtered);
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    
    try {
      setActionLoading('add');
      const response = await managerService.createStaff(newStaff);
      
      if (response.success) {
        toast.success('Staff member created successfully');
        setShowAddModal(false);
        setNewStaff({ full_name: '', email: '', role_id: '3' });
        fetchStaff();
      } else {
        toast.error(response.message || 'Failed to create staff member');
      }
    } catch (error) {
      console.error('Error creating staff:', error);
      toast.error('Failed to create staff member');
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyStaff = async (e) => {
    e.preventDefault();
    
    try {
      setVerifying(true);
      const response = await managerService.verifyStaff(verifyEmail, verifyCode);
      
      if (response.success) {
        toast.success('Staff verified successfully. Temporary password sent to email.');
        setShowVerifyModal(false);
        setVerifyEmail('');
        setVerifyCode('');
        fetchStaff();
      } else {
        toast.error(response.message || 'Failed to verify staff');
      }
    } catch (error) {
      console.error('Error verifying staff:', error);
      toast.error('Failed to verify staff');
    } finally {
      setVerifying(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      setResetting(true);
      const response = await managerService.resetStaffPassword(resetStaffId, newPassword);
      
      if (response.success) {
        toast.success('Password reset successfully. New password sent to staff email.');
        setShowResetModal(false);
        setNewPassword('');
        setConfirmPassword('');
        setResetStaffId(null);
      } else {
        toast.error(response.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password');
    } finally {
      setResetting(false);
    }
  };

  const handleDeactivate = async (userId, fullName) => {
    if (!confirm(`Are you sure you want to deactivate ${fullName}?`)) {
      return;
    }

    try {
      setActionLoading(userId);
      const response = await managerService.updateStaff(userId, { is_active: false });
      
      if (response.success) {
        toast.success('Staff deactivated successfully');
        fetchStaff();
      } else {
        toast.error(response.message || 'Failed to deactivate staff');
      }
    } catch (error) {
      console.error('Error deactivating staff:', error);
      toast.error('Failed to deactivate staff');
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivate = async (userId, fullName) => {
    if (!confirm(`Are you sure you want to activate ${fullName}?`)) {
      return;
    }

    try {
      setActionLoading(userId);
      const response = await managerService.updateStaff(userId, { is_active: true });
      
      if (response.success) {
        toast.success('Staff activated successfully');
        fetchStaff();
      } else {
        toast.error(response.message || 'Failed to activate staff');
      }
    } catch (error) {
      console.error('Error activating staff:', error);
      toast.error('Failed to activate staff');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId, fullName) => {
    if (!confirm(`Are you sure you want to remove ${fullName}? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoading(userId);
      const response = await managerService.deleteStaff(userId);
      
      if (response.success) {
        toast.success('Staff removed successfully');
        fetchStaff();
      } else {
        toast.error(response.message || 'Failed to remove staff');
      }
    } catch (error) {
      console.error('Error removing staff:', error);
      toast.error('Failed to remove staff');
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadge = (roleId) => {
    switch (roleId) {
      case 3:
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Pharmacist</Badge>;
      case 4:
        return <Badge className="bg-green-100 text-green-800 border-green-300">Cashier</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Unknown</Badge>;
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 border-green-300">
        <ShieldCheck className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-300">
        <ShieldX className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Staff Management</h2>
        <p className="text-muted-foreground">
          Manage pharmacy staff members - pharmacists and cashiers
        </p>
      </div>

      {/* Actions Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => setShowVerifyModal(true)}
                variant="outline"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Verify Staff
              </Button>
              <Button
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Staff Members
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({filteredStaff.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStaff.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No staff members found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Login</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((member) => (
                    <tr key={member.user_id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            {member.full_name?.charAt(0) || 'U'}
                          </div>
                          <span className="font-medium">{member.full_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {member.email}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getRoleBadge(member.role_id)}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(member.is_active)}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {member.last_login
                          ? new Date(member.last_login).toLocaleString()
                          : 'Never'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          {member.is_active ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setResetStaffId(member.user_id);
                                setResetStaffName(member.full_name);
                                setShowResetModal(true);
                              }}
                              disabled={actionLoading === member.user_id}
                              title="Reset Password"
                            >
                              <Key className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleActivate(member.user_id, member.full_name)}
                              disabled={actionLoading === member.user_id}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              title="Activate"
                            >
                              {actionLoading === member.user_id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <UserCheck className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          {member.is_active && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeactivate(member.user_id, member.full_name)}
                              disabled={actionLoading === member.user_id}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Deactivate"
                            >
                              {actionLoading === member.user_id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <UserX className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(member.user_id, member.full_name)}
                            disabled={actionLoading === member.user_id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Remove"
                          >
                            {actionLoading === member.user_id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <ShieldX className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Staff Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddStaff}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  placeholder="Enter full name"
                  value={newStaff.full_name}
                  onChange={(e) => setNewStaff({ ...newStaff, full_name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role_id">Role</Label>
                <select
                  id="role_id"
                  value={newStaff.role_id}
                  onChange={(e) => setNewStaff({ ...newStaff, role_id: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="3">Pharmacist</option>
                  <option value="4">Cashier</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddModal(false)}
                disabled={actionLoading === 'add'}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={actionLoading === 'add'}>
                {actionLoading === 'add' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Create Staff
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Verify Staff Modal */}
      <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verify Staff Email</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleVerifyStaff}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="verify_email">Staff Email</Label>
                <Input
                  id="verify_email"
                  type="email"
                  placeholder="Enter staff email"
                  value={verifyEmail}
                  onChange={(e) => setVerifyEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="verify_code">Verification Code</Label>
                <Input
                  id="verify_code"
                  placeholder="Enter 6-digit verification code"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowVerifyModal(false)}
                disabled={verifying}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={verifying}>
                {verifying ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <UserCheck className="h-4 w-4 mr-2" />
                )}
                Verify Staff
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={showResetModal} onOpenChange={setShowResetModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Password for {resetStaffName}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleResetPassword}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="new_password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new_password"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter new password (min 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowResetModal(false)}
                disabled={resetting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={resetting}>
                {resetting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Key className="h-4 w-4 mr-2" />
                )}
                Reset Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
