'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Music,
  Music2,
  LogOut,
  Package,
  Settings,
  ChevronDown,
  Menu,
} from 'lucide-react';
import { navbarVariants } from '@/lib/animations';
import { MegaMenu } from './mega-menu';
import { CartDrawer } from '@/components/client/cart/cart-drawer';
import { SearchDialog } from '@/components/client/search/search-dialog';

interface LuxuryNavbarProps {
  onMobileMenuToggle?: () => void;
}

export function LuxuryNavbar({ onMobileMenuToggle }: LuxuryNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  
  const [scrolled, setScrolled] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if on hero page
  const isOnHeroPage = pathname === '/';

  const toggleMusic = () => {
    setMusicPlaying(!musicPlaying);
    if (globalThis.window !== undefined) {
      globalThis.window.dispatchEvent(new CustomEvent('toggleMusic'));
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    router.push('/');
  };

  return (
    <>
      <motion.header
        className="sticky top-0 left-0 right-0 z-50 border-b transition-all duration-elegant"
        initial={false}
        animate={scrolled || !isOnHeroPage ? 'solid' : 'transparent'}
        variants={navbarVariants}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6 text-gray-900" />
            </button>

            {/* Left Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors uppercase tracking-wider"
              >
                Home
              </Link>
              
              <button
                className="relative flex items-center gap-1 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors uppercase tracking-wider"
                onMouseEnter={() => setShopMenuOpen(true)}
              >
                Shop
                <ChevronDown className={`h-4 w-4 transition-transform ${shopMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors uppercase tracking-wider">
                  Pages
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                </button>
                
                {/* Simple Dropdown */}
                <div className="absolute left-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <motion.div 
                    className="glass rounded-luxury shadow-elegant py-3 px-2 min-w-[160px]"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href="/about" className="block px-4 py-2 text-sm text-charcoal-800 hover:text-champagne-600 hover:bg-champagne-50 rounded-soft transition-elegant">
                      About Us
                    </Link>
                    <Link href="/faq" className="block px-4 py-2 text-sm text-charcoal-800 hover:text-champagne-600 hover:bg-champagne-50 rounded-soft transition-elegant">
                      FAQ
                    </Link>
                  </motion.div>
                </div>
              </div>

              <Link
                href="/contact"
                className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors uppercase tracking-wider"
              >
                Contact
              </Link>
            </nav>

            {/* Center Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 group">
              <motion.h1 
                className="font-display text-xl sm:text-2xl lg:text-3xl font-light text-gray-900 uppercase tracking-widest"
                whileHover={{ opacity: 0.7 }}
                transition={{ duration: 0.2 }}
              >
                Vasukriti
              </motion.h1>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:opacity-60 transition-opacity touch-target"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-gray-900" />
              </button>

              {/* Wishlist - Hide on small mobile */}
              <Link
                href="/account/wishlist"
                className="hidden xs:block relative p-2 hover:opacity-60 transition-opacity touch-target"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5 text-gray-900" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-2 hover:opacity-60 transition-opacity touch-target"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5 text-gray-900" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Profile/Auth - Hide on small mobile if not authenticated */}
              {isAuthenticated ? (
                <div className="relative">                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="group p-2 hover:bg-champagne-50 rounded-full transition-elegant touch-target"
                    aria-label="Profile"
                  >
                    <User className="h-5 w-5 text-charcoal-700 group-hover:text-champagne-600 transition-elegant" />
                  </button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <>
                        <button
                          type="button"
                          className="fixed inset-0 z-30" 
                          onClick={() => setShowProfileMenu(false)}
                          onKeyDown={(e) => e.key === 'Escape' && setShowProfileMenu(false)}
                          aria-label="Close menu"
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 top-full mt-4 z-40 glass rounded-luxury shadow-elegant py-3 px-2 min-w-[200px]"
                        >
                          <div className="px-4 py-3 border-b border-champagne-200">
                            <p className="text-sm font-medium text-charcoal-900">{user?.fullName}</p>
                            <p className="text-xs text-charcoal-600">{user?.email}</p>
                          </div>
                          
                          <Link
                            href="/account/orders"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-charcoal-800 hover:bg-champagne-50 rounded-soft transition-elegant"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <Package className="h-4 w-4" />
                            My Orders
                          </Link>
                          
                          <Link
                            href="/account/settings"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-charcoal-800 hover:bg-champagne-50 rounded-soft transition-elegant"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <Settings className="h-4 w-4" />
                            Settings
                          </Link>
                          
                          {user?.role === 'admin' && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-soft transition-elegant"
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <Settings className="h-4 w-4" />
                              Admin Panel
                            </Link>
                          )}
                          
                          <div className="border-t border-champagne-200 mt-2 pt-2">
                            <button
                              onClick={handleLogout}
                              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-maroon-600 hover:bg-maroon-50 rounded-soft transition-elegant"
                            >
                              <LogOut className="h-4 w-4" />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden lg:inline-flex items-center gap-2 px-6 py-2 bg-neutral-900 text-white text-xs font-medium uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  <User className="h-4 w-4" />
                  Login
                </Link>
              )}

              {/* Music Control - Hidden for minimal design */}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mega Menu */}
      <AnimatePresence>
        {shopMenuOpen && (
          <MegaMenu onClose={() => setShopMenuOpen(false)} />
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} />

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
