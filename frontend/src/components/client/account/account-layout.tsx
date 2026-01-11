'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import { ClientLayout } from '@/components/client/client-layout';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';

interface AccountLayoutProps {
  readonly children: React.ReactNode;
}

const navItems = [
  {
    label: 'My Profile',
    href: '/account/profile',
    icon: User,
  },
  {
    label: 'My Orders',
    href: '/account/orders',
    icon: Package,
  },
  {
    label: 'Wishlist',
    href: '/account/wishlist',
    icon: Heart,
  },
  {
    label: 'Addresses',
    href: '/account/addresses',
    icon: MapPin,
  },
  {
    label: 'Change Password',
    href: '/account/password',
    icon: Shield,
  },
];

export function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-light tracking-wide text-gray-900 mb-2">My Account</h1>
          <p className="text-sm font-light uppercase tracking-wider text-gray-400">
            Manage your account, orders, and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white border-2 border-gray-900 p-6 sticky top-24">
              {/* User Info */}
              <div className="pb-6 border-b border-gray-200 mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="h-14 w-14 flex items-center justify-center text-white font-light text-xl uppercase"
                    style={{ backgroundColor: '#7e1219' }}
                  >
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-light text-gray-900 truncate tracking-wide">
                      {user?.fullName}
                    </p>
                    <p className="text-xs font-light text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 border transition-colors font-light text-sm ${
                        isActive
                          ? 'border-gray-900 text-gray-900'
                          : 'border-gray-100 text-gray-600 hover:border-gray-900 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1} />
                      <span className="uppercase tracking-wider">{item.label}</span>
                    </Link>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 border border-gray-100 hover:border-red-200 text-red-600 hover:bg-red-50 transition-colors font-light text-sm"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1} />
                  <span className="uppercase tracking-wider">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden fixed bottom-4 right-4 z-50">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-14 w-14 shadow-lg text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#7e1219' }}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 mx-auto" />
              ) : (
                <Menu className="h-6 w-6 mx-auto" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* User Info */}
                <div className="pb-6 border-b border-gray-200 mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-14 w-14 flex items-center justify-center text-white font-light text-xl uppercase"
                      style={{ backgroundColor: '#7e1219' }}
                    >
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-light text-gray-900 truncate tracking-wide">
                        {user?.fullName}
                      </p>
                      <p className="text-xs font-light text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 border transition-colors font-light text-sm ${
                          isActive
                            ? 'border-gray-900 text-gray-900'
                            : 'border-gray-100 text-gray-600 hover:border-gray-900 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="h-4 w-4" strokeWidth={1} />
                        <span className="uppercase tracking-wider">{item.label}</span>
                      </Link>
                    );
                  })}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 border border-gray-100 hover:border-red-200 text-red-600 hover:bg-red-50 transition-colors font-light text-sm"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1} />
                    <span className="uppercase tracking-wider">Logout</span>
                  </button>
                </nav>
              </motion.div>
            </motion.div>
          )}

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
