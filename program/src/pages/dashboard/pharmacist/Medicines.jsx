import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pagination, usePagination } from '@/components/ui/pagination';
import { pharmacistService } from '@/services/pharmacist.service';
import { toast } from 'sonner';
import {
  Pill,
  Search,
  Filter,
  Plus,
  Eye,
  AlertTriangle,
  Clock,
  Loader2,
  Package,
  Calendar,
  DollarSign,
} from 'lucide-react';

export function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Pagination state
  const { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage, paginate } = usePagination({
    initialPage: 1,
    initialItemsPerPage: 10,
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    filterMedicines();
  }, [searchQuery, selectedCategory, medicines]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await pharmacistService.getInventory();
      
      if (response.success) {
        const medicinesList = response.data || response.medicines || [];
        setMedicines(Array.isArray(medicinesList) ? medicinesList : []);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(medicinesList.map(m => m.category_name).filter(Boolean))];
        setCategories(uniqueCategories);
      } else {
        toast.error(response.message || 'Failed to fetch medicines');
        setMedicines([]);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      toast.error('Failed to fetch medicines');
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchMedicines();
      return;
    }

    try {
      setLoading(true);
      const response = await pharmacistService.searchMedicines(searchQuery);
      
      if (response.success) {
        const medicinesList = response.data || response.medicines || [];
        setMedicines(Array.isArray(medicinesList) ? medicinesList : []);
      } else {
        toast.error(response.message || 'Search failed');
      }
    } catch (error) {
      console.error('Error searching medicines:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (categoryId) => {
    setSelectedCategory(categoryId);
    
    if (!categoryId) {
      fetchMedicines();
      return;
    }

    try {
      setLoading(true);
      const response = await pharmacistService.getMedicinesByCategory(categoryId);
      
      if (response.success) {
        const medicinesList = response.data || response.medicines || [];
        setMedicines(Array.isArray(medicinesList) ? medicinesList : []);
      } else {
        toast.error(response.message || 'Filter failed');
      }
    } catch (error) {
      console.error('Error filtering by category:', error);
      toast.error('Filter failed');
    } finally {
      setLoading(false);
    }
  };

  const filterMedicines = () => {
    let filtered = [...medicines];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.name?.toLowerCase().includes(query) ||
        m.barcode?.toLowerCase().includes(query) ||
        m.manufacturer?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(m => m.category_name === selectedCategory);
    }

    setFilteredMedicines(filtered);
  };

  const handleViewDetails = (medicine) => {
    setSelectedMedicine(medicine);
    setShowDetailsModal(true);
  };

  const getStockStatus = (medicine) => {
    if (medicine.quantity_in_stock <= 10) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-300">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Low Stock
        </Badge>
      );
    }
    const expiryDate = new Date(medicine.expiry_date);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 30) {
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-300">
          <Clock className="w-3 h-3 mr-1" />
          Expiring Soon
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-green-100 text-green-800 border-green-300">
        In Stock
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
        <h2 className="text-3xl font-bold tracking-tight">Medicines</h2>
        <p className="text-muted-foreground">
          View and search all medicines in your branch
        </p>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, barcode, or manufacturer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <Button onClick={handleSearch}>
              <Filter className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Medicines Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Medicines
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({filteredMedicines.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMedicines.length === 0 ? (
            <div className="text-center py-12">
              <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No medicines found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Stock</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Expiry</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginate(filteredMedicines).map((medicine) => (
                      <tr key={medicine.medicine_id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                              <Package className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{medicine.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">{medicine.category_name || 'N/A'}</td>
                        <td className="py-3 px-4 text-sm">{medicine.type || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{medicine.quantity_in_stock}</span>
                            {medicine.quantity_in_stock <= 10 && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">ETB {medicine.price?.toFixed(2)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {medicine.expiry_date
                              ? new Date(medicine.expiry_date).toLocaleDateString()
                              : 'N/A'}
                          </div>
                        </td>
                        <td className="py-3 px-4">{getStockStatus(medicine)}</td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(medicine)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="mt-4 border-t pt-4">
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredMedicines.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(newSize) => {
                    setItemsPerPage(newSize);
                    setCurrentPage(1);
                  }}
                  itemsPerPageOptions={[10, 25, 50, 100]}
                  showPageSizeSelector={true}
                  showTotalItems={true}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Medicine Details Modal */}
      {selectedMedicine && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Medicine Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium text-lg">{selectedMedicine.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{selectedMedicine.category_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{selectedMedicine.type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Manufacturer</p>
                  <p className="font-medium">{selectedMedicine.manufacturer || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Barcode</p>
                  <p className="font-medium">{selectedMedicine.barcode || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity in Stock</p>
                  <p className="font-medium text-lg">{selectedMedicine.quantity_in_stock}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium text-lg">ETB {selectedMedicine.price?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className="font-medium">
                    {selectedMedicine.expiry_date
                      ? new Date(selectedMedicine.expiry_date).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
