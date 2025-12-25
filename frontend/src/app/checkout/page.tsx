'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  CreditCard,
  Truck,
  Package,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import { ClientLayout } from '@/components/client/client-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios-instance';

// Form validation schemas
const shippingSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  addressLine1: z.string().min(5, 'Address must be at least 5 characters'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

type CheckoutStep = 'shipping' | 'payment' | 'review';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay'>('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);

  const subtotal = useMemo(() => getSubtotal(), [getSubtotal]);
  const shipping = subtotal >= 5000 ? 0 : 200;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      router.push('/cart');
    }
  }, [items.length, router]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, router]);

  // Pre-fill form with user's default address
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddress = user.addresses.find((addr) => addr.isDefault) || user.addresses[0];
      if (defaultAddress) {
        setValue('fullName', defaultAddress.fullName);
        setValue('phone', defaultAddress.phone);
        setValue('addressLine1', defaultAddress.addressLine1);
        setValue('addressLine2', defaultAddress.addressLine2 || '');
        setValue('city', defaultAddress.city);
        setValue('state', defaultAddress.state);
        setValue('pincode', defaultAddress.pincode);
      }
    }
  }, [user, setValue]);

  const steps = [
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: Package },
  ];

  const onShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setCurrentStep('payment');
  };

  const handlePlaceOrder = async () => {
    if (!shippingData) {
      toast.error('Please complete shipping details');
      setCurrentStep('shipping');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          fullName: shippingData.fullName,
          phone: shippingData.phone,
          addressLine1: shippingData.addressLine1,
          addressLine2: shippingData.addressLine2,
          city: shippingData.city,
          state: shippingData.state,
          pincode: shippingData.pincode,
          label: 'home' as const,
          isDefault: false,
        },
        paymentMethod,
      };

      const response = await axiosInstance.post('/orders', orderData);
      const order = response.data.data;

      // If Razorpay payment, initiate payment flow
      if (paymentMethod === 'razorpay') {
        // Load Razorpay script and open checkout
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = async () => {
          try {
            // Create Razorpay order
            const paymentRes = await axiosInstance.post('/payment/create-order', {
              amount: total,
              currency: 'INR',
              receipt: order.orderNumber,
            });

            const { id: razorpayOrderId, amount, currency } = paymentRes.data.data;
            const keyId = paymentRes.data.keyId;

            // Open Razorpay checkout
            const options = {
              key: keyId,
              amount,
              currency,
              name: 'Vasukriti Jewels',
              description: `Order #${order.orderNumber}`,
              order_id: razorpayOrderId,
              prefill: {
                name: user?.fullName || shippingData.fullName,
                email: user?.email || '',
                contact: shippingData.phone,
              },
              theme: {
                color: '#d97706',
              },
              handler: async function (response: {
                razorpay_order_id: string;
                razorpay_payment_id: string;
                razorpay_signature: string;
              }) {
                try {
                  // Verify payment
                  await axiosInstance.post('/payment/verify', {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    orderId: order._id,
                  });

                  clearCart();
                  toast.success('Payment successful! Order placed.');
                  router.push(`/orders/${order._id || order.orderNumber}`);
                } catch (error) {
                  console.error('Payment verification failed:', error);
                  toast.error('Payment verification failed. Please contact support.');
                }
              },
              modal: {
                ondismiss: function () {
                  setIsProcessing(false);
                  toast.info('Payment cancelled');
                },
              },
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
          } catch (error) {
            console.error('Razorpay initialization failed:', error);
            toast.error('Failed to initiate payment');
            setIsProcessing(false);
          }
        };
        script.onerror = () => {
          toast.error('Payment gateway failed to load');
          setIsProcessing(false);
        };
        document.body.appendChild(script);
      } else {
        // COD - Order placed successfully
        clearCart();
        toast.success('Order placed successfully!');
        router.push(`/orders/${order._id || order.orderNumber}`);
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      let errorMessage = 'Failed to place order';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
      setIsProcessing(false);
    }
  };

  if (items.length === 0 || !isAuthenticated) {
    return null;
  }

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted =
                steps.findIndex((s) => s.id === currentStep) > index;

              let stepClasses = 'bg-white border-gray-200 text-gray-400';
              if (isCompleted) {
                stepClasses = 'border-gray-400 text-gray-400';
              } else if (isActive) {
                stepClasses = 'border-gray-900 text-gray-900';
              }

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`flex items-center justify-center w-12 h-12 border-2 transition-colors ${stepClasses}`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-light uppercase tracking-wider ${
                        isActive || isCompleted
                          ? 'text-gray-900'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-px flex-1 mx-4 transition-colors ${
                        isCompleted ? 'bg-gray-400' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Shipping Step */}
              {currentStep === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white border border-gray-100 p-8"
                >
                  <h2 className="text-2xl font-light text-gray-900 mb-8 tracking-wide">
                    Shipping Address
                  </h2>

                  <form
                    onSubmit={handleSubmit(onShippingSubmit)}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="fullName" className="text-xs font-light uppercase tracking-wider text-gray-600">Full Name *</Label>
                      <Input
                        id="fullName"
                        {...register('fullName')}
                        placeholder="John Doe"
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        {...register('phone')}
                        placeholder="9876543210"
                        maxLength={10}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="addressLine1">Address Line 1 *</Label>
                      <Input
                        id="addressLine1"
                        {...register('addressLine1')}
                        placeholder="House No., Building Name, Street"
                      />
                      {errors.addressLine1 && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.addressLine1.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="addressLine2">Address Line 2</Label>
                      <Input
                        id="addressLine2"
                        {...register('addressLine2')}
                        placeholder="Area, Landmark (Optional)"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          {...register('city')}
                          placeholder="Mumbai"
                        />
                        {errors.city && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.city.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          {...register('state')}
                          placeholder="Maharashtra"
                        />
                        {errors.state && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.state.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        {...register('pincode')}
                        placeholder="400001"
                        maxLength={6}
                      />
                      {errors.pincode && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.pincode.message}
                        </p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-white text-xs tracking-wider uppercase font-light" 
                      size="lg"
                      style={{ backgroundColor: '#7e1219' }}
                    >
                      Continue to Payment
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* Payment Step */}
              {currentStep === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white border border-gray-100 p-8"
                >
                  <h2 className="text-2xl font-light text-gray-900 mb-8 tracking-wide">
                    Payment Method
                  </h2>

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) =>
                      setPaymentMethod(value as 'cod' | 'razorpay')
                    }
                    className="space-y-4"
                  >
                    <div className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-amber-500 transition-colors cursor-pointer">
                      <RadioGroupItem value="cod" id="cod" />
                      <div className="flex-1">
                        <Label
                          htmlFor="cod"
                          className="text-base font-medium cursor-pointer"
                        >
                          Cash on Delivery
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          Pay with cash when you receive your order
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-amber-500 transition-colors cursor-pointer opacity-50">
                      <RadioGroupItem value="razorpay" id="razorpay" disabled />
                      <div className="flex-1">
                        <Label
                          htmlFor="razorpay"
                          className="text-base font-medium cursor-pointer"
                        >
                          Online Payment (Coming Soon)
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          Pay securely using UPI, Cards, or Net Banking
                        </p>
                      </div>
                    </div>
                  </RadioGroup>

                  <div className="flex gap-4 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('shipping')}
                      className="flex-1 h-12 border-gray-200 text-xs tracking-wider uppercase font-light"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setCurrentStep('review')}
                      className="flex-1 h-12 text-white text-xs tracking-wider uppercase font-light"
                      style={{ backgroundColor: '#7e1219' }}
                    >
                      Review Order
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Review Step */}
              {currentStep === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Shipping Address Review */}
                  <div className="bg-white border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-base font-light text-gray-900 uppercase tracking-wider">
                        Shipping Address
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep('shipping')}
                      >
                        Edit
                      </Button>
                    </div>
                    {shippingData && (
                      <div className="text-gray-600 space-y-1 text-sm font-light">
                        <p className="font-light text-gray-900">{shippingData.fullName}</p>
                        <p>{shippingData.phone}</p>
                        <p>{shippingData.addressLine1}</p>
                        {shippingData.addressLine2 && (
                          <p>{shippingData.addressLine2}</p>
                        )}
                        <p>
                          {shippingData.city}, {shippingData.state} -{' '}
                          {shippingData.pincode}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Payment Method Review */}
                  <div className="bg-white border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-base font-light text-gray-900 uppercase tracking-wider">
                        Payment Method
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep('payment')}
                        className="text-xs uppercase tracking-wider"
                      >
                        Edit
                      </Button>
                    </div>
                    <p className="text-gray-600 font-light text-sm">
                      {paymentMethod === 'cod'
                        ? 'Cash on Delivery'
                        : 'Online Payment'}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white border border-gray-100 p-6">
                    <h3 className="text-base font-light text-gray-900 uppercase tracking-wider mb-6">
                      Order Items ({items.length})
                    </h3>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.product._id}
                          className="flex gap-4 pb-4 border-b border-gray-100 last:border-0"
                        >
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden bg-gray-50">
                            <Image
                              src={
                                item.product.images?.[0]?.url ||
                                '/placeholder-product.jpg'
                              }
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-light text-gray-900 text-sm">
                              {item.product.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1 font-light">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-light text-gray-900 text-sm">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="flex-1 h-12 border-gray-200 text-xs tracking-wider uppercase font-light"
                      disabled={isProcessing}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 h-12 text-white text-xs tracking-wider uppercase font-light"
                      style={{ backgroundColor: '#7e1219' }}
                      size="lg"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-100 p-8 sticky top-24 space-y-6">
              <h3 className="text-xl font-light text-gray-900 tracking-wide">
                Order Summary
              </h3>

              <div className="space-y-4 border-t border-gray-200 pt-6">
                <div className="flex justify-between text-gray-600 font-light">
                  <span className="text-xs uppercase tracking-wider">Subtotal ({items.length} items)</span>
                  <span className="text-sm">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-gray-600 font-light">
                  <span className="text-xs uppercase tracking-wider">Shipping</span>
                  <span className="text-sm">
                    {shipping === 0 ? (
                      <span className="text-gray-600 font-light">Free</span>
                    ) : (
                      `₹${shipping.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600 font-light">
                  <span className="text-xs uppercase tracking-wider">Tax (GST 18%)</span>
                  <span className="text-sm">
                    ₹{tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="flex justify-between text-base font-light text-gray-900 border-t border-gray-200 pt-4">
                  <span className="uppercase tracking-wider">Total</span>
                  <span>
                    ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="border-t border-gray-200 pt-6 space-y-3 text-xs text-gray-500 font-light">
                <p className="flex items-center gap-2">
                  <span className="text-gray-400">✓</span>
                  Secure checkout
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-gray-400">✓</span>
                  100% authentic products
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-gray-400">✓</span>
                  Easy returns within 30 days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
