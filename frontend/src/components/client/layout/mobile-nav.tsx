'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Home,
  ShoppingBag,
  Heart,
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { name: 'All Products', href: '/shop' },
  { name: 'Rings', href: '/shop?category=rings' },
  { name: 'Necklaces', href: '/shop?category=necklaces' },
  { name: 'Earrings', href: '/shop?category=earrings' },
  { name: 'Bracelets', href: '/shop?category=bracelets' },
  { name: 'Pendants', href: '/shop?category=pendants' },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  // Close menu when route changes
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Hamburger Menu Drawer */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-80 p-0 bg-white">
          <SheetHeader className="border-b px-6 py-4">
            <SheetTitle className="text-left font-playfair text-xl text-[#7e1219]">
              Vasukriti
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-[calc(100vh-80px)]">
            <div className="flex-1 overflow-y-auto py-4">
              {/* User Section */}
              {isAuthenticated && user ? (
                <div className="px-6 py-4 bg-red-50 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7e1219] text-white font-semibold">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {user.fullName}
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-6 mb-4">
                  <div className="flex gap-2">
                    <Link
                      href="/login"
                      className="flex-1 px-4 py-2 text-center text-sm font-medium border border-[#7e1219] text-[#7e1219] rounded-md hover:bg-red-50 transition-colors"
                      onClick={onClose}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="flex-1 px-4 py-2 text-center text-sm font-medium bg-[#7e1219] text-white rounded-md hover:bg-[#6b0f15] transition-colors"
                      onClick={onClose}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="px-6 mb-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Shop by Category
                </h3>
                <nav className="space-y-1">
                  {categories.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                      onClick={onClose}
                    >
                      <span>{category.name}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Account Links */}
              {isAuthenticated && user && (
                <div className="px-6 mb-4">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    My Account
                  </h3>
                  <nav className="space-y-1">
                    <Link
                      href="/account"
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                      onClick={onClose}
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/account/orders"
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                      onClick={onClose}
                    >
                      <Package className="h-5 w-5" />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      href="/account/wishlist"
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                      onClick={onClose}
                    >
                      <Heart className="h-5 w-5" />
                      <span>Wishlist</span>
                    </Link>
                    <Link
                      href="/account/addresses"
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                      onClick={onClose}
                    >
                      <MapPin className="h-5 w-5" />
                      <span>Addresses</span>
                    </Link>
                    <Link
                      href="/account/profile"
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                      onClick={onClose}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium bg-red-50 text-[#7e1219] rounded-md hover:bg-red-100 transition-colors"
                        onClick={onClose}
                      >
                        <Sparkles className="h-5 w-5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                  </nav>
                </div>
              )}

              {/* Other Links */}
              <div className="px-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Help & Support
                </h3>
                <nav className="space-y-1">
                  <Link
                    href="/about"
                    className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                    onClick={onClose}
                  >
                    About Us
                  </Link>
                  <Link
                    href="/contact"
                    className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                    onClick={onClose}
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/faq"
                    className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                    onClick={onClose}
                  >
                    FAQs
                  </Link>
                </nav>
              </div>
            </div>

            {/* Logout Button */}
            {isAuthenticated && (
              <div className="border-t p-4">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Bottom Navigation Bar - Always visible on mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
        <nav className="flex items-center justify-around h-16">
          <Link
            href="/"
            className={cn(
              'flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
              pathname === '/'
                ? 'text-amber-600'
                : 'text-gray-600 hover:text-amber-600'
            )}
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link
            href="/shop"
            className={cn(
              'flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
              pathname === '/shop'
                ? 'text-amber-600'
                : 'text-gray-600 hover:text-amber-600'
            )}
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Shop</span>
          </Link>
          <Link
            href="/account/wishlist"
            className={cn(
              'flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
              pathname === '/account/wishlist'
                ? 'text-amber-600'
                : 'text-gray-600 hover:text-amber-600'
            )}
          >
            <Heart className="h-5 w-5" />
            <span>Wishlist</span>
          </Link>
          <Link
            href="/account"
            className={cn(
              'flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
              pathname?.startsWith('/account')
                ? 'text-amber-600'
                : 'text-gray-600 hover:text-amber-600'
            )}
          >
            <User className="h-5 w-5" />
            <span>Account</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
