import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pharmacistService } from '@/services/pharmacist.service';
import { toast } from 'sonner';
import {
  ShoppingCart,
  Plus,
  Trash2,
  Search,
  DollarSign,
  Loader2,
  Package,
  CreditCard,
} from 'lucide-react';

export function SaleCreation() {
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await pharmacistService.getInventory();
      if (response.success) {
        const medicinesList = response.data || response.medicines || [];
        setMedicines(Array.isArray(medicinesList) ? medicinesList : []);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      toast.error('Failed to fetch medicines');
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
      }
    } catch (error) {
      console.error('Error searching medicines:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (medicine) => {
    const existingItem = cart.find(item => item.medicine_id === medicine.medicine_id);
    
    if (existingItem) {
      // Update quantity
      setCart(cart.map(item =>
        item.medicine_id === medicine.medicine_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Add new item
      setCart([...cart, {
        medicine_id: medicine.medicine_id,
        name: medicine.name,
        price: medicine.price,
        quantity: 1,
        maxQuantity: medicine.quantity_in_stock,
      }]);
    }
    toast.success(`${medicine.name} added to cart`);
  };

  const updateCartQuantity = (medicineId, newQuantity) => {
    if (newQuantity < 1) {
      // Remove item if quantity is 0
      setCart(cart.filter(item => item.medicine_id !== medicineId));
      return;
    }
    
    setCart(cart.map(item =>
      item.medicine_id === medicineId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (medicineId) => {
    setCart(cart.filter(item => item.medicine_id !== medicineId));
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    if (confirm('Are you sure you want to clear the cart?')) {
      setCart([]);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  const handleCreateSale = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Cart is empty. Add items to create a sale.');
      return;
    }

    // Validate stock availability
    const outOfStockItems = cart.filter(item => item.quantity > item.maxQuantity);
    if (outOfStockItems.length > 0) {
      toast.error('Some items have insufficient stock. Please update quantities.');
      return;
    }

    try {
      setCreating(true);
      
      const saleData = {
        items: cart.map(item => ({
          medicine_id: item.medicine_id,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity,
        })),
        subtotal: calculateSubtotal(),
        discount: 0,
        total: calculateTotal(),
        payment_method: paymentMethod,
        customer_name: customerName || null,
        customer_phone: customerPhone || null,
      };

      const response = await pharmacistService.createSale(saleData);
      
      if (response.success) {
        toast.success('Sale created successfully!');
        setCart([]);
        setCustomerName('');
        setCustomerPhone('');
        setPaymentMethod('cash');
      } else {
        toast.error(response.message || 'Failed to create sale');
      }
    } catch (error) {
      console.error('Error creating sale:', error);
      toast.error('Failed to create sale');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">New Sale</h2>
        <p className="text-muted-foreground">
          Create a new sale by adding medicines to the cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Medicine Search */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Search Medicines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="ml-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Medicines List */}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {medicines.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No medicines found</p>
                  </div>
                ) : (
                  medicines.map((medicine) => (
                    <div
                      key={medicine.medicine_id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => addToCart(medicine)}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{medicine.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {medicine.quantity_in_stock} | Price: ETB {medicine.price?.toFixed(2)}
                        </p>
                      </div>
                      <Button size="sm" disabled={medicine.quantity_in_stock <= 0}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cart */}
        <Card>
          <CardHeader>
            <CardTitle>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({cart.length} items)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSale} className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Cart is empty</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.medicine_id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ETB {item.price?.toFixed(2)} x {item.quantity} = ETB {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(item.medicine_id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(item.medicine_id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity}
                        >
                          +
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromCart(item.medicine_id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Customer Info */}
              <div className="space-y-3 pt-4 border-t">
                <div className="grid gap-2">
                  <Label htmlFor="customer_name">Customer Name (Optional)</Label>
                  <Input
                    id="customer_name"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customer_phone">Customer Phone (Optional)</Label>
                  <Input
                    id="customer_phone"
                    placeholder="Enter customer phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="payment_method">Payment Method</Label>
                  <select
                    id="payment_method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="mobile">Mobile Payment</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">ETB {calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount:</span>
                  <span className="font-medium">ETB 0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-primary">ETB {calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearCart}
                  disabled={cart.length === 0}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
                <Button
                  type="submit"
                  disabled={cart.length === 0 || creating}
                  className="flex-1"
                >
                  {creating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <DollarSign className="h-4 w-4 mr-2" />
                  )}
                  Create Sale
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
