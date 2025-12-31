import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';
import {
  Users,
  Check,
  X,
  Search,
  Building2,
  Mail,
  Shield,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export function AdminManagers() {
  const [managers, setManagers] = useState([]);
  const [filteredManagers, setFilteredManagers] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchManagers();
    fetchBranches();
  }, [activeTab]);

  useEffect(() => {
    filterManagers();
  }, [searchQuery, selectedBranch, managers, activeTab]);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      let response;
      
      switch (activeTab) {
        case 'all':
          response = await adminService.getManagers();
          break;
        case 'pending':
          response = await adminService.getPendingManagers();
          break;
        case 'activated':
          response = await adminService.getActivatedManagers();
          break;
        default:
          response = await adminService.getManagers();
      }

      if (response.success) {
        const managersList = response.data || response.managers || [];
        setManagers(Array.isArray(managersList) ? managersList : []);
      } else {
        toast.error(response.message || 'Failed to fetch managers');
        setManagers([]);
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
      toast.error('Failed to fetch managers');
      setManagers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await adminService.getDashboardBranchesList();
      if (response.success) {
        setBranches(response.data || response.branches || []);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const filterManagers = () => {
    let filtered = [...managers];

    // Filter by tab
    if (activeTab === 'pending') {
      filtered = filtered.filter(m => !m.is_active);
    } else if (activeTab === 'activated') {
      filtered = filtered.filter(m => m.is_active);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.full_name?.toLowerCase().includes(query) ||
        m.email?.toLowerCase().includes(query)
      );
    }

    // Filter by branch
    if (selectedBranch) {
      filtered = filtered.filter(m => m.branch_id?.toString() === selectedBranch);
    }

    setFilteredManagers(filtered);
  };

  const handleActivate = async (userId, fullName) => {
    if (!confirm(`Are you sure you want to activate ${fullName}?`)) {
      return;
    }

    try {
      setActionLoading(userId);
      const response = await adminService.activateManager(userId);
      
      if (response.success) {
        toast.success('Manager activated successfully');
        fetchManagers();
      } else {
        toast.error(response.message || 'Failed to activate manager');
      }
    } catch (error) {
      console.error('Error activating manager:', error);
      toast.error('Failed to activate manager');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeactivate = async (userId, fullName) => {
    if (!confirm(`Are you sure you want to deactivate ${fullName}?`)) {
      return;
    }

    try {
      setActionLoading(userId);
      const response = await adminService.deactivateManager(userId);
      
      if (response.success) {
        toast.success('Manager deactivated successfully');
        fetchManagers();
      } else {
        toast.error(response.message || 'Failed to deactivate manager');
      }
    } catch (error) {
      console.error('Error deactivating manager:', error);
      toast.error('Failed to deactivate manager');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBranchChange = async (branchId) => {
    setSelectedBranch(branchId);
    if (branchId) {
      try {
        const response = await adminService.getManagersByBranch(branchId);
        if (response.success) {
          const managersList = response.data || response.managers || [];
          setManagers(Array.isArray(managersList) ? managersList : []);
        }
      } catch (error) {
        console.error('Error fetching managers by branch:', error);
        toast.error('Failed to fetch managers for this branch');
      }
    } else {
      fetchManagers();
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 border-green-300">
        <ShieldCheck className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
        <Shield className="w-3 h-3 mr-1" />
        Pending
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
        <h2 className="text-3xl font-bold tracking-tight">Manager Management</h2>
        <p className="text-muted-foreground">
          View and manage all pharmacy managers
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
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

            {/* Branch Filter */}
            <div className="md:w-64">
              <select
                value={selectedBranch}
                onChange={(e) => handleBranchChange(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch.branch_id} value={branch.branch_id}>
                    {branch.branch_name} - {branch.location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 border-b">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              All Managers
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'pending'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab('activated')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'activated'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Activated
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Managers Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'all' && 'All Managers'}
            {activeTab === 'pending' && 'Pending Managers'}
            {activeTab === 'activated' && 'Activated Managers'}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({filteredManagers.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredManagers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No managers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Branch</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Login</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredManagers.map((manager) => (
                    <tr key={manager.user_id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            {manager.full_name?.charAt(0) || 'M'}
                          </div>
                          <span className="font-medium">{manager.full_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {manager.email}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {manager.branch_name || `Branch ${manager.branch_id}`}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(manager.is_active)}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {manager.last_login
                          ? new Date(manager.last_login).toLocaleDateString()
                          : 'Never'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {manager.is_active ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeactivate(manager.user_id, manager.full_name)}
                            disabled={actionLoading === manager.user_id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {actionLoading === manager.user_id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                            <span className="ml-2">Deactivate</span>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActivate(manager.user_id, manager.full_name)}
                            disabled={actionLoading === manager.user_id}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            {actionLoading === manager.user_id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                            <span className="ml-2">Activate</span>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
