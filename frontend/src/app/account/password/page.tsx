'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Shield, Loader2, Check } from 'lucide-react';
import { AccountLayout } from '@/components/client/account/account-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios-instance';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ChangePasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      await axiosInstance.put('/users/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      
      toast.success('Password changed successfully', {
        description: 'Your password has been updated',
      });
      
      reset();
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error('Failed to change password:', error);
      let errorMessage = 'Failed to change password';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AccountLayout>
      <div className="bg-white border-2 border-gray-900">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6" style={{ color: '#7e1219' }} strokeWidth={1} />
            <div>
              <h2 className="text-2xl font-light tracking-wide text-gray-900">Change Password</h2>
              <p className="text-xs font-light uppercase tracking-wider text-gray-400 mt-1">
                Update your account password
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-xs font-light uppercase tracking-wider text-gray-700">
                Current Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  {...register('currentPassword')}
                  className="pl-10 pr-10 h-11 border-gray-200 focus:border-gray-900"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-xs text-red-500">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-xs font-light uppercase tracking-wider text-gray-700">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  {...register('newPassword')}
                  className="pl-10 pr-10 h-11 border-gray-200 focus:border-gray-900"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-red-500">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs font-light uppercase tracking-wider text-gray-700">
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className="pl-10 pr-10 h-11 border-gray-200 focus:border-gray-900"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 border border-gray-100 p-4 space-y-2">
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">Password Requirements:</p>
              <ul className="space-y-1 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-gray-400" />
                  At least 6 characters long
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-gray-400" />
                  Mix of letters and numbers recommended
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-gray-400" />
                  Use a unique password
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-white text-xs tracking-wider uppercase font-light"
              style={{ backgroundColor: '#7e1219' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Change Password
                </>
              )}
            </Button>
          </form>

          {/* Security Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 p-6 bg-blue-50 border border-blue-100"
          >
            <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security Tips
            </h3>
            <ul className="space-y-2 text-xs text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Never share your password with anyone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Use a unique password for this account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Change your password regularly for better security</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Avoid using personal information in your password</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </AccountLayout>
  );
}
