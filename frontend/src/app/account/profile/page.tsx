'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Shield, Edit2, Save, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AccountLayout } from '@/components/client/account/account-layout';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios-instance';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put('/users/profile', data);
      const updatedUser = response.data.data?.user || response.data.data;
      
      updateUser(updatedUser);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      let errorMessage = 'Failed to update profile';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <AccountLayout>
      <div className="bg-white border-2 border-gray-900">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-light tracking-wide text-gray-900">My Profile</h2>
              <p className="text-xs font-light uppercase tracking-wider text-gray-400 mt-1">
                Manage your personal information
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:border-gray-900 transition-colors text-sm font-light uppercase tracking-wider"
              >
                <Edit2 className="h-4 w-4" strokeWidth={1} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
              <div
                className="h-24 w-24 flex items-center justify-center text-white font-light text-3xl uppercase"
                style={{ backgroundColor: '#7e1219' }}
              >
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-light tracking-wide text-gray-900">
                  {user?.fullName}
                </h3>
                <p className="text-sm font-light text-gray-600">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  {user?.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-xs font-light uppercase tracking-wider text-green-700 border border-green-200 bg-green-50 px-2 py-1">
                      <Shield className="h-3 w-3" strokeWidth={1} />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-light uppercase tracking-wider text-orange-700 border border-orange-200 bg-orange-50 px-2 py-1">
                      <Shield className="h-3 w-3" strokeWidth={1} />
                      Unverified
                    </span>
                  )}
                  <span className="inline-flex items-center text-xs font-light uppercase tracking-wider text-gray-700 border border-gray-200 bg-gray-50 px-2 py-1">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label htmlFor="fullName" className="block text-xs font-light uppercase tracking-wider text-gray-900 mb-2">
                  <User className="inline h-3 w-3 mr-2" strokeWidth={1} />
                  Full Name
                </label>
                <input
                  id="fullName"
                  {...register('fullName')}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border text-sm font-light text-gray-900 focus:outline-none transition-colors ${
                    isEditing
                      ? 'border-gray-200 focus:border-gray-900 bg-white'
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs font-light text-red-600 mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-light uppercase tracking-wider text-gray-900 mb-2">
                  <Mail className="inline h-3 w-3 mr-2" strokeWidth={1} />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border text-sm font-light text-gray-900 focus:outline-none transition-colors ${
                    isEditing
                      ? 'border-gray-200 focus:border-gray-900 bg-white'
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs font-light text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-xs font-light uppercase tracking-wider text-gray-900 mb-2">
                  <Phone className="inline h-3 w-3 mr-2" strokeWidth={1} />
                  Phone Number
                </label>
                <input
                  id="phone"
                  {...register('phone')}
                  placeholder="9876543210"
                  maxLength={10}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border text-sm font-light text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors ${
                    isEditing
                      ? 'border-gray-200 focus:border-gray-900 bg-white'
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs font-light text-red-600 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Member Since */}
              <div className="md:col-span-2">
                <label className="block text-xs font-light uppercase tracking-wider text-gray-900 mb-2">
                  <Calendar className="inline h-3 w-3 mr-2" strokeWidth={1} />
                  Member Since
                </label>
                <input
                  value={user?.id ? 'Member since registration' : 'Not available'}
                  disabled
                  className="w-full px-4 py-3 border border-gray-100 bg-gray-50 text-sm font-light text-gray-900 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 pt-4 border-t border-gray-200"
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 sm:flex-none px-6 py-3 text-sm font-light uppercase tracking-wider text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#7e1219' }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" strokeWidth={1} />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none px-6 py-3 border border-gray-200 hover:border-gray-900 text-sm font-light uppercase tracking-wider text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <X className="h-4 w-4" strokeWidth={1} />
                  Cancel
                </button>
              </motion.div>
            )}
          </form>

          {/* Additional Info */}
          {!isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 p-6 border border-blue-200 bg-blue-50"
            >
              <h4 className="font-light text-blue-900 mb-2 uppercase tracking-wider text-sm">
                Account Security
              </h4>
              <p className="text-sm font-light text-blue-800 mb-4">
                Keep your account secure by using a strong password and enabling two-factor authentication.
              </p>
              <button
                onClick={() => router.push('/account/password')}
                className="px-4 py-2 border border-blue-300 text-blue-700 hover:border-blue-400 transition-colors text-xs font-light uppercase tracking-wider"
              >
                Change Password
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </AccountLayout>
  );
}
