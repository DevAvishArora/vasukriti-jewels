'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Users, 
  UserCog,
  Warehouse,
  Ticket,
  MessageSquare,
  BarChart3, 
  Settings,
  LogOut,
  Store,
  Layers,
  X,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: FolderTree,
  },
  {
    title: 'Subcategories',
    href: '/admin/subcategories',
    icon: Layers,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
  },

    {
    title: 'Inventory',
    href: '/admin/inventory',
    icon: Warehouse,
  },

  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Customers',
    href: '/admin/customers',
    icon: Users,
  },
  {
    title: 'Users & Staff',
    href: '/admin/users',
    icon: UserCog,
  },

  {
    title: 'Coupons',
    href: '/admin/coupons',
    icon: Ticket,
  },
  {
    title: 'Reviews',
    href: '/admin/reviews',
    icon: MessageSquare,
  },
  {
    title: 'CMS',
    href: '/admin/cms',
    icon: Palette,
  },
 
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleLinkClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Logo & Brand */}
      <div className="border-b border-gray-700 px-6 py-5">
        <Link href="/admin" className="flex items-center gap-3" onClick={handleLinkClick}>
          <div className="rounded-lg bg-[#7e1219] p-2">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Vasukriti</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="border-b border-gray-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7e1219] font-semibold">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-[#7e1219] text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Actions */}
      <div className="border-t border-gray-700 p-4 space-y-2">
        <Link href="/" onClick={handleLinkClick}>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
          >
            <Store className="h-4 w-4" />
            View Store
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Always visible on large screens */}
      <div className="hidden lg:flex h-screen w-64 flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar - Drawer */}
      <Sheet open={isMobileOpen} onOpenChange={onMobileClose}>
        <SheetContent side="left" className="w-64 p-0 bg-transparent border-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
