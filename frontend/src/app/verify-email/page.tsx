'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ClientLayout } from '@/components/client/client-layout';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/lib/axios';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token provided.');
        return;
      }
      try {
        const response = await axiosInstance.get(`/auth/verify-email/${token}`);
        
        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message);
          
          // Redirect to home after 3 seconds
          setTimeout(() => {
            router.push('/');
            // Refresh the page to update the user context
            globalThis.location.reload();
          }, 3000);
        }
      } catch (error) {
        setStatus('error');
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to verify email. The link may be invalid or expired.';
        setMessage(errorMessage);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <ClientLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-amber-50 via-white to-rose-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {status === 'verifying' && (
              <>
                <div className="flex justify-center mb-4">
                  <Loader2 className="h-16 w-16 text-amber-600 animate-spin" />
                </div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  Verifying Your Email
                </h2>
                <p className="text-gray-600 font-light">
                  Please wait while we verify your email address...
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="flex justify-center mb-4"
                >
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </motion.div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  Email Verified!
                </h2>
                <p className="text-gray-600 font-light mb-6">
                  {message}
                </p>
                <p className="text-sm text-gray-500 font-light">
                  You can now place orders. Redirecting to home page...
                </p>
                <div className="mt-6">
                  <Button
                    onClick={() => router.push('/')}
                    style={{ backgroundColor: '#7e1219' }}
                    className="w-full"
                  >
                    Go to Home
                  </Button>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="flex justify-center mb-4">
                  <XCircle className="h-16 w-16 text-red-500" />
                </div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  Verification Failed
                </h2>
                <p className="text-gray-600 font-light mb-6">
                  {message}
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push('/')}
                    style={{ backgroundColor: '#7e1219' }}
                    className="w-full"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Go to Home
                  </Button>
                  <p className="text-sm text-gray-500 font-light">
                    You can request a new verification email from your account settings.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Support Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 font-light">
              Having trouble?{' '}
              <a href="/contact" className="text-amber-600 hover:text-amber-700 underline">
                Contact Support
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </ClientLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <ClientLayout>
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          </div>
        </ClientLayout>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
