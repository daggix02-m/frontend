import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';
import {
  Building2,
  Users,
  MapPin,
  Phone,
  Mail,
  Loader2,
} from 'lucide-react';

export function AdminBranches() {
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    filterBranches();
  }, [searchQuery, branches]);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardBranchesList();
      
      if (response.success) {
        const branchesList = response.data || response.branches || [];
        setBranches(Array.isArray(branchesList) ? branchesList : []);
      } else {
        toast.error(response.message || 'Failed to fetch branches');
        setBranches([]);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast.error('Failed to fetch branches');
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBranches = () => {
    if (!searchQuery) {
      setFilteredBranches(branches);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = branches.filter(branch =>
      branch.branch_name?.toLowerCase().includes(query) ||
      branch.location?.toLowerCase().includes(query) ||
      branch.email?.toLowerCase().includes(query)
    );
    setFilteredBranches(filtered);
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
        <h2 className="text-3xl font-bold tracking-tight">Branch Management</h2>
        <p className="text-muted-foreground">
          View all pharmacy branches and their employee counts
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search branches by name, location, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Branches Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Branches
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({filteredBranches.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBranches.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No branches found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Branch Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Location</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Phone</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Employees</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBranches.map((branch) => (
                    <tr key={branch.branch_id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{branch.branch_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {branch.location}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {branch.email || 'N/A'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {branch.phone || 'N/A'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{branch.employee_count || 0}</span>
                          <span className="text-sm text-muted-foreground">
                            {branch.active_employees || 0} active
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {branch.created_at
                          ? new Date(branch.created_at).toLocaleDateString()
                          : 'N/A'}
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
