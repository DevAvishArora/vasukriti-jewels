'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import axiosInstance from '@/lib/axios-instance';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  amount: number;
  currency?: string;
  orderId?: string;
  onSuccess: (response: RazorpaySuccessResponse) => void;
  onFailure?: (error: any) => void;
}

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export function useRazorpay() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  // Load Razorpay script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setIsLoaded(true);
      script.onerror = () => {
        console.error('Failed to load Razorpay SDK');
        toast.error('Payment gateway failed to load');
      };
      document.body.appendChild(script);
    } else if (window.Razorpay) {
      setIsLoaded(true);
    }
  }, []);

  const createOrder = async (options: RazorpayOptions) => {
    if (!isLoaded) {
      toast.error('Payment gateway is not ready yet');
      return;
    }

    setIsLoading(true);

    try {
      // Create Razorpay order on backend
      const { data } = await axiosInstance.post('/payment/create-order', {
        amount: options.amount,
        currency: options.currency || 'INR',
        receipt: options.orderId || `order_${Date.now()}`,
      });

      const { id: razorpayOrderId, amount, currency } = data.data;
      const keyId = data.keyId;

      // Open Razorpay checkout
      const razorpayOptions = {
        key: keyId,
        amount,
        currency,
        name: 'Vasukriti Jewels',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#d97706', // amber-600
        },
        handler: async function (response: RazorpaySuccessResponse) {
          try {
            // Verify payment on backend
            await axiosInstance.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: options.orderId,
            });

            toast.success('Payment successful!');
            options.onSuccess(response);
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed');
            if (options.onFailure) options.onFailure(error);
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            toast.info('Payment cancelled');
            if (options.onFailure) options.onFailure(new Error('Payment cancelled'));
          },
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
    } catch (error) {
      console.error('Failed to create Razorpay order:', error);
      toast.error('Failed to initiate payment');
      if (options.onFailure) options.onFailure(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoaded,
    isLoading,
    createOrder,
  };
}
