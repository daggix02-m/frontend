import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Package,
  Receipt,
  Calculator
} from 'lucide-react';
import { cashierService } from '@/services/cashier.service';
import { toast } from 'sonner';

export function CashierPOSSales() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await cashierService.getProducts();

      if (response.success) {
        setProducts(Array.isArray(response.data) ? response.data : []);
      } else {
        toast.error(response.message || 'Failed to fetch products');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity < product.stock_quantity) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        toast.error('Not enough stock available');
      }
    } else {
      if (product.stock_quantity > 0) {
        setCart([...cart, { ...product, quantity: 1 }]);
      } else {
        toast.error('Product is out of stock');
      }
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
      return;
    }

    const product = products.find(p => p.id === id);
    if (product && newQuantity <= product.stock_quantity) {
      setCart(cart.map(item =>
        item.id === id
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } else {
      toast.error('Not enough stock available');
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  const handleProcessSale = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      const saleData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: calculateSubtotal(),
        discount: discount,
        total: calculateTotal(),
        payment_method: paymentMethod,
        customer_id: selectedCustomer?.id || null
      };

      const response = await cashierService.processSale(saleData);

      if (response.success) {
        toast.success('Sale processed successfully');
        setCart([]);
        setDiscount(0);
        setSelectedCustomer(null);
        setShowPayment(false);
      } else {
        toast.error(response.message || 'Failed to process sale');
      }
    } catch (error) {
      console.error('Error processing sale:', error);
      toast.error('Failed to process sale');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='space-y-6 p-4 md:p-8'>
      <div className='space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>POS Sales</h2>
        <p className='text-muted-foreground'>
          Process sales and manage transactions
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Product Search and List */}
        <div className='lg:col-span-2 space-y-4'>
          <div className='flex gap-2'>
            <div className='relative flex-1'>
              <Search className='absolute left-2.5 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search products...'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto'>
              {filteredProducts.map((product) => (
                <Card
                  key={product.id || product._id}
                  className='cursor-pointer hover:shadow-md transition-shadow'
                  onClick={() => addToCart(product)}
                >
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-lg flex justify-between items-center'>
                      <span>{product.name}</span>
                      <span className='text-sm font-normal'>ETB {product.price?.toFixed(2)}</span>
                    </CardTitle>
                    <div className='text-sm text-muted-foreground'>{product.category}</div>
                  </CardHeader>
                  <CardContent>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm'>Stock: {product.stock_quantity}</span>
                      <Button size='sm' variant='outline' onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}>
                        <Plus className='h-4 w-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Shopping Cart */}
        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <ShoppingCart className='h-5 w-5' />
                Shopping Cart
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className='text-muted-foreground text-center py-8'>Cart is empty</p>
              ) : (
                <div className='space-y-4'>
                  <div className='max-h-64 overflow-y-auto space-y-2'>
                    {cart.map((item) => (
                      <div key={item.id} className='flex items-center justify-between p-2 border rounded'>
                        <div className='flex-1'>
                          <div className='font-medium'>{item.name}</div>
                          <div className='text-sm text-muted-foreground'>ETB {item.price?.toFixed(2)} x {item.quantity}</div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className='h-4 w-4' />
                          </Button>
                          <span className='w-8 text-center'>{item.quantity}</span>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className='h-4 w-4' />
                          </Button>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Minus className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className='space-y-2 pt-2 border-t'>
                    <div className='flex justify-between'>
                      <span>Subtotal:</span>
                      <span>ETB {calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Discount (%):</span>
                      <Input
                        type='number'
                        min='0'
                        max='100'
                        value={discount}
                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                        className='w-20 inline-block'
                      />
                    </div>
                    <div className='flex justify-between font-bold text-lg'>
                      <span>Total:</span>
                      <span>ETB {calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Payment Method</label>
                    <div className='flex gap-2'>
                      <Button
                        size='sm'
                        variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('cash')}
                        className='flex-1'
                      >
                        <DollarSign className='h-4 w-4 mr-1' />
                        Cash
                      </Button>
                      <Button
                        size='sm'
                        variant={paymentMethod === 'card' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('card')}
                        className='flex-1'
                      >
                        <CreditCard className='h-4 w-4 mr-1' />
                        Card
                      </Button>
                    </div>
                  </div>

                  <Button
                    className='w-full'
                    onClick={handleProcessSale}
                    disabled={cart.length === 0}
                  >
                    <Receipt className='h-4 w-4 mr-2' />
                    Process Sale
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}