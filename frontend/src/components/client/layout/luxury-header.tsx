'use client';

import { useState, useEffect } from 'react';
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
  Home,
  Info,
  Mail,
  HelpCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { CartDrawer } from '@/components/client/cart/cart-drawer';
import { SearchAutocomplete } from '@/components/search/search-autocomplete';

interface LuxuryHeaderProps {
  readonly onMobileMenuToggle?: () => void;
}

export function LuxuryHeader({ onMobileMenuToggle }: LuxuryHeaderProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Sync with global audio state
  useEffect(() => {
    const audio = document.getElementById('global-audio') as HTMLAudioElement | null;
    if (audio) {
      // avoid synchronous setState in effect
      setTimeout(() => setAudioPlaying(!audio.paused && !audio.muted), 0);
    }

    const handler = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail && typeof detail.isPlaying === 'boolean') setAudioPlaying(detail.isPlaying);
    };

    globalThis.addEventListener('global-audio-state', handler as EventListener);
    return () => globalThis.removeEventListener('global-audio-state', handler as EventListener);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/95 border-b border-gray-200 shadow-sm">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-800 via-red-700 to-red-900 px-4 py-2 text-center text-sm text-white">
        <p className="flex items-center justify-center gap-2 font-medium">
          <Sparkles className="h-4 w-4" />
          <span>Get 10% off on your first order! Use code: FIRST10</span>
        </p>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="relative flex h-16 sm:h-20 items-center justify-between gap-4">
          {/* Left Side - Navigation */}
          <nav className="hidden lg:flex items-center gap-6 flex-1">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-red-700 transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/shop"
              className="text-sm font-medium text-gray-700 hover:text-red-700 transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-red-700 transition-colors flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:text-red-700 transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Contact
            </Link>
            <Link
              href="/faq"
              className="text-sm font-medium text-gray-700 hover:text-red-700 transition-colors flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden text-gray-700"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Center - Logo */}
          <Link
            href="/"
            className="absolute left-1/2 transform -translate-x-1/2 font-playfair text-base sm:text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-800 via-red-700 to-red-900 bg-clip-text text-transparent hover:scale-105 transition-transform whitespace-nowrap max-w-[120px] sm:max-w-none overflow-hidden text-center"
          >
            VASUKRITI
          </Link>

          {/* Right Side - Actions & More Nav */}
          <div className="flex items-center gap-4 lg:gap-6 flex-1 justify-end">
            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              {/* Speaker (global audio control) - Hidden on mobile */}
              <button
                onClick={() => {
                  try {
                    globalThis.dispatchEvent(new CustomEvent('global-audio-control', { detail: { type: 'toggle' } }));
                    // optimistic UI toggle
                    setAudioPlaying((s) => !s);
                  } catch {
                    // ignore in SSR/hydration
                  }
                }}
                aria-label="Toggle music"
                className="hidden sm:block text-gray-700 hover:text-red-700 transition-colors"
              >
                {audioPlaying ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </button>
              {/* Search Icon - Hidden on mobile */}
              <button
                onClick={() => router.push('/search')}
                className="hidden sm:block text-gray-700 hover:text-red-700 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist - Hidden on very small screens */}
              <Link
                href="/account/wishlist"
                className="hidden xs:block relative text-gray-700 hover:text-rose-600 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Cart */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative text-gray-700 hover:text-red-700 transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-700 text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center gap-2 rounded-full border-2 border-red-200 px-3 py-1.5 hover:border-red-700 transition-colors bg-red-50/50"
                      aria-label="User menu"
                    >
                      <User className="h-4 w-4 text-red-700" />
                      <span className="hidden sm:inline text-sm font-medium text-gray-900">
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
                    className="hidden sm:flex text-gray-700 hover:text-red-700"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => router.push('/register')}
                    className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold"
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
      </div>

      {/* Search Bar - Mobile/Tablet - Below header */}
      <div className="lg:hidden border-t border-gray-200 px-4 py-3 bg-gray-50">
        <SearchAutocomplete />
      </div>

      {/* Cart Drawer */}
      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} />
    </header>
  );
}
