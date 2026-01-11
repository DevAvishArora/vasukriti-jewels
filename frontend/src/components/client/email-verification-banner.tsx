'use client';

import { useState } from 'react';
import { X, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

interface EmailVerificationBannerProps {
  readonly onDismiss?: () => void;
}

export default function EmailVerificationBanner({ onDismiss }: Readonly<EmailVerificationBannerProps>) {
  const [isResending, setIsResending] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      const response = await axiosInstance.post('/auth/resend-verification');
      
      if (response.data.success) {
        toast.success('Verification email sent! Please check your inbox.');
      }
    } catch (error) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to send verification email';
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-500 to-rose-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 gap-4">
          <div className="flex items-center gap-3 flex-1">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
              <p className="text-sm font-medium">
                Please verify your email address to place orders.
              </p>
              <Button
                onClick={handleResendEmail}
                disabled={isResending}
                size="sm"
                variant="outline"
                className="text-amber-600 bg-white hover:bg-gray-50 border-white text-xs px-3 py-1 h-auto whitespace-nowrap"
              >
                {isResending ? (
                  <>
                    <Mail className="h-3 w-3 mr-1 animate-pulse" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-3 w-3 mr-1" />
                    Resend Email
                  </>
                )}
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white hover:text-gray-200 transition-colors flex-shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
