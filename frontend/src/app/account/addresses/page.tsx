'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { AccountLayout } from '@/components/client/account/account-layout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosInstance from '@/lib/axios-instance';
import { toast } from 'sonner';

const addressSchema = z.object({
  label: z.enum(['home', 'work', 'other']),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please provide a valid 10-digit phone number'),
  addressLine1: z.string().min(5, 'Address must be at least 5 characters'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^[1-9]\d{5}$/, 'Please provide a valid 6-digit pincode'),
  isDefault: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface Address extends AddressFormData {
  _id: string;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: 'home',
      isDefault: false,
    },
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/addresses');
      const data = response.data.data;
      setAddresses(data?.addresses || []);
    } catch (error) {
      console.error('Failed to load addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    reset({
      label: 'home',
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: addresses.length === 0,
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (address: Address) => {
    setValue('label', address.label);
    setValue('fullName', address.fullName);
    setValue('phone', address.phone);
    setValue('addressLine1', address.addressLine1);
    setValue('addressLine2', address.addressLine2 || '');
    setValue('city', address.city);
    setValue('state', address.state);
    setValue('pincode', address.pincode);
    setValue('isDefault', address.isDefault);
    setEditingId(address._id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = async (data: AddressFormData) => {
    try {
      if (editingId) {
        // Update existing address
        await axiosInstance.put(`/addresses/${editingId}`, data);
        toast.success('Address updated successfully');
      } else {
        // Add new address
        await axiosInstance.post('/addresses', data);
        toast.success('Address added successfully');
      }
      
      await loadAddresses();
      handleCancel();
    } catch (error: unknown) {
      console.error('Failed to save address:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save address';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/addresses/${id}`);
      toast.success('Address deleted successfully');
      await loadAddresses();
    } catch (error: unknown) {
      console.error('Failed to delete address:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete address';
      toast.error(errorMessage);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await axiosInstance.patch(`/addresses/${id}/set-default`);
      toast.success('Default address updated');
      await loadAddresses();
    } catch (error: unknown) {
      console.error('Failed to set default address:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to set default address';
      toast.error(errorMessage);
    }
  };

  const getLabelColor = (label: string) => {
    const colors = {
      home: 'bg-blue-50 text-blue-700 border border-blue-200',
      work: 'bg-purple-50 text-purple-700 border border-purple-200',
      other: 'bg-gray-50 text-gray-700 border border-gray-200',
    };
    return colors[label as keyof typeof colors] || colors.other;
  };

  if (loading) {
    return (
      <AccountLayout>
        <div className="space-y-6">
          <div className="bg-white border-2 border-gray-900 p-6">
            <div className="h-8 bg-gray-100 animate-pulse w-1/3 mb-4" />
            <div className="h-4 bg-gray-100 animate-pulse w-2/3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white border border-gray-200 p-6">
                <div className="h-6 bg-gray-100 animate-pulse w-1/2 mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 animate-pulse" />
                  <div className="h-4 bg-gray-100 animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white border-2 border-gray-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 flex items-center gap-2">
                <MapPin className="h-7 w-7 text-[#7e1219]" strokeWidth={1} />
                Saved Addresses
              </h2>
              <p className="text-gray-600 mt-1 font-light">
                {addresses.length} {addresses.length === 1 ? 'address' : 'addresses'} saved
              </p>
            </div>
            {!showForm && (
              <button
                onClick={handleAddNew}
                className="bg-[#7e1219] text-white px-6 py-2.5 font-light uppercase tracking-wider text-sm hover:bg-[#6a0f15] transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" strokeWidth={1.5} />
                Add New Address
              </button>
            )}
          </div>
        </div>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-gray-200 p-6 overflow-hidden"
            >
              <h3 className="text-lg font-light tracking-wide text-gray-900 mb-6 uppercase">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Address Label */}
                <div>
                  <label className="text-xs font-light uppercase tracking-wider text-gray-700 mb-3 block">
                    Address Label
                  </label>
                  <div className="flex gap-4">
                    {['home', 'work', 'other'].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          {...register('label')}
                          value={type}
                          className="h-4 w-4 text-[#7e1219] focus:ring-[#7e1219]"
                        />
                        <span className="text-sm font-light capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                  {errors.label && (
                    <p className="text-sm text-red-600 mt-1 font-light">{errors.label.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="text-xs font-light uppercase tracking-wider text-gray-700 mb-2 block">
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      {...register('fullName')}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors font-light"
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-600 mt-1 font-light">{errors.fullName.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="text-xs font-light uppercase tracking-wider text-gray-700 mb-2 block">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      {...register('phone')}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors font-light"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600 mt-1 font-light">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Address Line 1 */}
                <div>
                  <label htmlFor="addressLine1" className="text-xs font-light uppercase tracking-wider text-gray-700 mb-2 block">
                    Address Line 1 *
                  </label>
                  <input
                    id="addressLine1"
                    {...register('addressLine1')}
                    placeholder="House No., Building Name"
                    className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors font-light"
                  />
                  {errors.addressLine1 && (
                    <p className="text-sm text-red-600 mt-1 font-light">{errors.addressLine1.message}</p>
                  )}
                </div>

                {/* Address Line 2 */}
                <div>
                  <label htmlFor="addressLine2" className="text-xs font-light uppercase tracking-wider text-gray-700 mb-2 block">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    id="addressLine2"
                    {...register('addressLine2')}
                    placeholder="Road Name, Area, Colony"
                    className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors font-light"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* City */}
                  <div>
                    <label htmlFor="city" className="text-xs font-light uppercase tracking-wider text-gray-700 mb-2 block">
                      City *
                    </label>
                    <input
                      id="city"
                      {...register('city')}
                      placeholder="Mumbai"
                      className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors font-light"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600 mt-1 font-light">{errors.city.message}</p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label htmlFor="state" className="text-xs font-light uppercase tracking-wider text-gray-700 mb-2 block">
                      State *
                    </label>
                    <input
                      id="state"
                      {...register('state')}
                      placeholder="Maharashtra"
                      className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors font-light"
                    />
                    {errors.state && (
                      <p className="text-sm text-red-600 mt-1 font-light">{errors.state.message}</p>
                    )}
                  </div>

                  {/* Pincode */}
                  <div>
                    <label htmlFor="pincode" className="text-xs font-light uppercase tracking-wider text-gray-700 mb-2 block">
                      Pincode *
                    </label>
                    <input
                      id="pincode"
                      {...register('pincode')}
                      placeholder="400001"
                      maxLength={6}
                      className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors font-light"
                    />
                    {errors.pincode && (
                      <p className="text-sm text-red-600 mt-1 font-light">{errors.pincode.message}</p>
                    )}
                  </div>
                </div>

                {/* Set as Default */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    {...register('isDefault')}
                    className="h-4 w-4 border-gray-300 text-[#7e1219] focus:ring-[#7e1219]"
                  />
                  <label htmlFor="isDefault" className="cursor-pointer text-sm font-light">
                    Set as default address
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#7e1219] text-white px-6 py-2.5 font-light uppercase tracking-wider text-sm hover:bg-[#6a0f15] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {(() => {
                      if (isSubmitting) return 'Saving...';
                      if (editingId) return 'Update Address';
                      return 'Add Address';
                    })()}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="border border-gray-900 text-gray-900 px-6 py-2.5 font-light uppercase tracking-wider text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Address List */}
        {addresses.length === 0 && !showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 p-12 text-center"
          >
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" strokeWidth={1} />
            <h3 className="text-xl font-light tracking-wide text-gray-900 mb-2">
              No addresses saved
            </h3>
            <p className="text-gray-600 mb-6 font-light">
              Add your delivery addresses for a faster checkout experience
            </p>
            <button
              onClick={handleAddNew}
              className="bg-[#7e1219] text-white px-6 py-2.5 font-light uppercase tracking-wider text-sm hover:bg-[#6a0f15] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" strokeWidth={1.5} />
              Add Your First Address
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address, index) => (
              <motion.div
                key={address._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 p-6 hover:border-gray-900 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-light uppercase tracking-wider ${getLabelColor(address.label)}`}>
                      {address.label}
                    </span>
                    {address.isDefault && (
                      <span className="px-3 py-1 text-xs font-light uppercase tracking-wider bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
                        <Check className="h-3 w-3" strokeWidth={2} />
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                      aria-label="Edit address"
                    >
                      <Edit2 className="h-4 w-4 text-gray-600" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => handleDelete(address._id)}
                      className="p-2 hover:bg-red-50 transition-colors"
                      aria-label="Delete address"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-gray-700 font-light">
                  <p className="font-normal text-gray-900">{address.fullName}</p>
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="text-sm">Phone: {address.phone}</p>
                </div>

                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address._id)}
                    className="w-full mt-4 border border-gray-900 text-gray-900 py-2 font-light uppercase tracking-wider text-sm hover:bg-gray-50 transition-colors"
                  >
                    Set as Default
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
