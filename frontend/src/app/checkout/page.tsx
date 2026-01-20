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
  AlertCircle,
  Mail,
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
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  const subtotal = useMemo(() => getSubtotal(), [getSubtotal]);
  const shipping = subtotal >= 5000 ? 0 : 200;
  const total = subtotal + shipping;

  // Check if user is verified
  const isUserVerified = user?.isVerified ?? false;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
  });

  // Redirect if cart is empty (but not if order is being completed)
  useEffect(() => {
    if (items.length === 0 && !isProcessing && !orderCompleted) {
      toast.error('Your cart is empty');
      router.push('/cart');
    }
  }, [items.length, router, isProcessing, orderCompleted]);

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
        setSelectedAddressId(defaultAddress._id || '');
        setValue('fullName', defaultAddress.fullName);
        setValue('phone', defaultAddress.phone);
        setValue('addressLine1', defaultAddress.addressLine1);
        setValue('addressLine2', defaultAddress.addressLine2 || '');
        setValue('city', defaultAddress.city);
        setValue('state', defaultAddress.state);
        setValue('pincode', defaultAddress.pincode);
      }
    } else {
      setShowNewAddressForm(true);
    }
  }, [user, setValue]);

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const address = user?.addresses?.find((addr) => addr._id === addressId);
    if (address) {
      setValue('fullName', address.fullName);
      setValue('phone', address.phone);
      setValue('addressLine1', address.addressLine1);
      setValue('addressLine2', address.addressLine2 || '');
      setValue('city', address.city);
      setValue('state', address.state);
      setValue('pincode', address.pincode);
      setShowNewAddressForm(false);
    }
  };

  const steps = [
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: Package },
  ];

  const onShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setCurrentStep('payment');
  };

  const handleResendVerificationEmail = async () => {
    try {
      setIsResendingEmail(true);
      const response = await axiosInstance.post('/auth/resend-verification');
      
      if (response.data.success) {
        toast.success('Verification email sent! Please check your inbox.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send verification email';
      toast.error(errorMessage);
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!shippingData) {
      toast.error('Please complete shipping details');
      setCurrentStep('shipping');
      return;
    }

    // Check if user is verified before allowing order
    if (!isUserVerified) {
      toast.error('Please verify your email address before placing an order');
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
      const order = response.data.data.order;
      
      console.log('Order created:', order);
      console.log('Order ID:', order._id);
      console.log('Order Number:', order.orderNumber);

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

            console.log('Razorpay Order Created:', { razorpayOrderId, amount, currency, keyId });

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
                color: '#7e1219',
              },
              modal: {
                ondismiss: function () {
                  console.log('Payment modal dismissed');
                  setIsProcessing(false);
                  toast.info('Payment cancelled');
                },
              },
              handler: async function (response: {
                razorpay_order_id: string;
                razorpay_payment_id: string;
                razorpay_signature: string;
              }) {
                try {
                  console.log('Payment successful:', response);
                  // Verify payment
                  await axiosInstance.post('/payment/verify', {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    orderId: order._id,
                  });

                  clearCart();
                  setOrderCompleted(true);
                  toast.success('Payment successful! Order placed.');
                  router.push(`/thank-you?orderId=${order._id}&orderNumber=${order.orderNumber}`);
                } catch (error) {
                  console.error('Payment verification failed:', error);
                  toast.error('Payment verification failed. Please contact support.');
                  setIsProcessing(false);
                }
              },
            };

            console.log('Opening Razorpay modal with options:', options);
            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
            console.log('Razorpay modal opened');
          } catch (error) {
            console.error('Razorpay initialization failed:', error);
            toast.error('Failed to initiate payment');
            setIsProcessing(false);
          }
        };
        script.onerror = () => {
          console.error('Failed to load Razorpay script');
          toast.error('Payment gateway failed to load');
          setIsProcessing(false);
        };
        document.body.appendChild(script);
      } else {
        // COD - Order placed successfully
        clearCart();
        setOrderCompleted(true);
        toast.success('Order placed successfully!');
        router.push(`/thank-you?orderId=${order._id}&orderNumber=${order.orderNumber}`);
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
        {/* Email Verification Warning */}
        {!isUserVerified && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-amber-900 mb-1">
                  Email Verification Required
                </h3>
                <p className="text-sm text-amber-800 mb-3">
                  You need to verify your email address before you can place an order. 
                  Please check your inbox for the verification link.
                </p>
                <Button
                  onClick={handleResendVerificationEmail}
                  disabled={isResendingEmail}
                  size="sm"
                  variant="outline"
                  className="text-amber-700 border-amber-300 hover:bg-amber-100"
                >
                  {isResendingEmail ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-3 w-3 mr-2" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

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

                  {/* Saved Addresses */}
                  {user?.addresses && user.addresses.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-medium text-gray-700 mb-4">
                        Saved Addresses
                      </h3>
                      <div className="space-y-3">
                        {user.addresses.map((address) => (
                          <div
                            key={address._id}
                            onClick={() => handleAddressSelect(address._id || '')}
                            className={`border-2 p-4 cursor-pointer transition-all ${
                              selectedAddressId === address._id
                                ? 'border-[#7e1219] bg-red-50/30'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="font-medium text-gray-900">
                                    {address.fullName}
                                  </p>
                                  {address.isDefault && (
                                    <span className="text-xs bg-[#7e1219] text-white px-2 py-0.5 rounded">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">
                                  {address.addressLine1}
                                  {address.addressLine2 && `, ${address.addressLine2}`}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {address.city}, {address.state} - {address.pincode}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Phone: {address.phone}
                                </p>
                              </div>
                              <div className="ml-4">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    selectedAddressId === address._id
                                      ? 'border-[#7e1219]'
                                      : 'border-gray-300'
                                  }`}
                                >
                                  {selectedAddressId === address._id && (
                                    <div className="w-3 h-3 rounded-full bg-[#7e1219]" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                        className="mt-4 w-full"
                      >
                        {showNewAddressForm ? 'Cancel' : '+ Add New Address'}
                      </Button>
                    </div>
                  )}

                  {/* Address Form */}
                  {(showNewAddressForm || !user?.addresses || user.addresses.length === 0) && (
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
                  )}

                  {/* Continue button for saved address */}
                  {!showNewAddressForm && user?.addresses && user.addresses.length > 0 && selectedAddressId && (
                    <Button
                      onClick={() => {
                        const address = user.addresses?.find((addr) => addr._id === selectedAddressId);
                        if (address) {
                          onShippingSubmit({
                            fullName: address.fullName,
                            phone: address.phone,
                            addressLine1: address.addressLine1,
                            addressLine2: address.addressLine2 || '',
                            city: address.city,
                            state: address.state,
                            pincode: address.pincode,
                          });
                        }
                      }}
                      className="w-full h-12 text-white text-xs tracking-wider uppercase font-light"
                      size="lg"
                      style={{ backgroundColor: '#7e1219' }}
                    >
                      Continue to Payment
                    </Button>
                  )}
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
                    {/* <div className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-amber-500 transition-colors cursor-pointer">
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
                    </div> */}

                    <div className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-amber-500 transition-colors cursor-pointer">
                      <RadioGroupItem value="razorpay" id="razorpay" />
                      <div className="flex-1">
                        <Label
                          htmlFor="razorpay"
                          className="text-base font-medium cursor-pointer"
                        >
                          Online Payment
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
                      disabled={isProcessing || !isUserVerified}
                      title={!isUserVerified ? 'Please verify your email to place an order' : ''}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Placing Order...
                        </>
                      ) : !isUserVerified ? (
                        <>
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Email Verification Required
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
