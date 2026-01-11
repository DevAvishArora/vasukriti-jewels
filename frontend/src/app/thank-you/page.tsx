'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Home, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ClientLayout } from '@/components/client/client-layout';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    const id = searchParams.get('orderId');
    const orderNum = searchParams.get('orderNumber');
    
    if (id) {
      setOrderId(id);
    }
    
    if (orderNum) {
      setOrderNumber(orderNum);
    }

    // Redirect to home after 10 seconds
    const timeout = setTimeout(() => {
      router.push('/');
    }, 10000);

    return () => clearTimeout(timeout);
  }, [searchParams, router]);

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-green-200 shadow-xl">
              <CardContent className="p-8 text-center">
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </motion.div>

                {/* Success Message */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-gray-900 mb-3"
                >
                  Thank You for Your Order! 🎉
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-gray-600 mb-6"
                >
                  Your order has been successfully placed
                </motion.p>

                {orderNumber && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-6"
                  >
                    <p className="text-sm text-gray-600 mb-1">Order Number</p>
                    <p className="text-2xl font-bold text-[#7e1219]">{orderNumber}</p>
                  </motion.div>
                )}

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-600 mb-8"
                >
                  We've sent an order confirmation email with details of your order.
                  <br />
                  You can track your order status in your account.
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  {orderId && (
                    <Link href={`/orders/${orderId}`}>
                      <Button
                        size="lg"
                        className="w-full sm:w-auto bg-[#7e1219] hover:bg-[#6a0f15]"
                      >
                        <FileText className="h-5 w-5 mr-2" />
                        View Order Details
                      </Button>
                    </Link>
                  )}
                  
                  <Link href="/shop">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-2 border-[#7e1219] text-[#7e1219] hover:bg-[#7e1219] hover:text-white"
                    >
                      <Package className="h-5 w-5 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>

                  <Link href="/">
                    <Button
                      size="lg"
                      variant="ghost"
                      className="w-full sm:w-auto"
                    >
                      <Home className="h-5 w-5 mr-2" />
                      Go to Home
                    </Button>
                  </Link>
                </motion.div>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-10 pt-8 border-t border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div>
                      <div className="text-2xl mb-2">🚚</div>
                      <p className="font-semibold text-gray-900">Free Shipping</p>
                      <p className="text-gray-600">On orders above ₹10,000</p>
                    </div>
                    <div>
                      <div className="text-2xl mb-2">✨</div>
                      <p className="font-semibold text-gray-900">Premium Quality</p>
                      <p className="text-gray-600">Certified jewelry</p>
                    </div>
                    <div>
                      <div className="text-2xl mb-2">🔒</div>
                      <p className="font-semibold text-gray-900">Secure Payment</p>
                      <p className="text-gray-600">100% protected</p>
                    </div>
                  </div>
                </motion.div>

                {/* Auto-redirect message */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-xs text-gray-500 mt-6"
                >
                  You will be redirected to the homepage in 10 seconds...
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ClientLayout>
  );
}
