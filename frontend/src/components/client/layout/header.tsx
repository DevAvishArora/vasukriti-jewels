'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  LogIn,
  UserPlus,
  Package,
  MapPin,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { CartDrawer } from '@/components/client/cart/cart-drawer';
import { SearchAutocomplete } from '@/components/search/search-autocomplete';

interface HeaderProps {
  readonly onMobileMenuToggle?: () => void;
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      {/* Top Banner - Promotional */}
      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 px-4 py-2 text-center text-sm text-white">
        <p className="flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span className="font-medium">Get 10% off on your first order!</span>
          <span className="hidden sm:inline">Use code: FIRST10</span>
        </p>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="font-playfair text-xl font-bold sm:text-2xl bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent"
          >
            Vasukriti Jewels
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/shop"
              className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/faq"
              className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors"
            >
              FAQ
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md">
            <SearchAutocomplete />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Icon - Mobile */}
            <button
              onClick={() => router.push('/search')}
              className="md:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-700" />
            </button>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="relative"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5 text-gray-700 hover:text-rose-600 transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5 text-gray-700 hover:text-amber-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 hover:border-amber-600 transition-colors"
                    aria-label="User menu"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm font-medium">
                      {user.fullName.split(' ')[0]}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.fullName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/account')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/account/orders')}>
                    <Package className="mr-2 h-4 w-4" />
                    <span>My Orders</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/account/wishlist')}>
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Wishlist</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/account/addresses')}>
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>Addresses</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/account/profile')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push('/admin')}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/login')}
                  className="hidden sm:flex"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push('/register')}
                  className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Sign Up</span>
                  <span className="sm:hidden">Join</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden border-t px-4 py-2">
        <SearchAutocomplete />
      </div>

      {/* Cart Drawer */}
      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} />
    </header>
  );
}
