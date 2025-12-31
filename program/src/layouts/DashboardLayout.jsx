import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  LogOut,
  Settings,
  Pill,
  ShoppingCart,
  FileText,
  Activity,
  ClipboardList,
  CreditCard,
  BarChart3,
  ArrowRightLeft,
  Clock,
  Search,
  LifeBuoy,
  Percent,
  PackagePlus,
  Bell,
  UserCog,
  DollarSign,
  Receipt,
  RotateCcw,
  TrendingUp,
  Package,
} from 'lucide-react';
import { logout } from '@/api/auth.api';
import Breadcrumb from '@/components/shared/Breadcrumb';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

function DashboardContent() {
  const { userRole, user, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { setOpenMobile } = useSidebar();

  const handleLogout = async () => {
    await authLogout();
    navigate('/auth/login');
  };

  const handleNavClick = () => {
    setOpenMobile(false);
  };

  // Define navigation items based on role
  const getNavItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin/overview', icon: LayoutDashboard },
          { label: 'Managers', path: '/admin/managers', icon: UserCog },
          { label: 'Branches', path: '/admin/branches', icon: Building2 },
          { label: 'Settings', path: '/admin/settings', icon: Settings },
        ];
      case 'manager':
        return [
          { label: 'Overview', path: '/manager/overview', icon: LayoutDashboard },
          { label: 'Branches', path: '/manager/branches', icon: Building2 },
          { label: 'Staff', path: '/manager/staff', icon: Users },
          { label: 'Inventory & Products', path: '/manager/inventory', icon: Pill },
          { label: 'Reports', path: '/manager/reports', icon: BarChart3 },
          { label: 'Settings', path: '/manager/settings', icon: Settings },
          { label: 'Import Data', path: '/manager/import', icon: FileText },
          { label: 'Refunds & Discounts', path: '/manager/refunds-discounts', icon: Percent },
          { label: 'Notifications', path: '/manager/notifications', icon: Bell },
          { label: 'POS Sales', path: '/manager/pos-sales', icon: ShoppingCart },
        ];
      case 'pharmacist':
        return [
          { label: 'Dashboard', path: '/pharmacist/overview', icon: LayoutDashboard },
          { label: 'Inventory', path: '/pharmacist/inventory', icon: Pill },
          { label: 'Medicines', path: '/pharmacist/medicines', icon: Package },
          { label: 'Sale', path: '/pharmacist/sale', icon: ShoppingCart },
          { label: 'Reports', path: '/pharmacist/medicines-reports', icon: BarChart3 },
          { label: 'Settings', path: '/pharmacist/settings', icon: Settings },
        ];
      case 'cashier':
        return [
          { label: 'Dashboard', path: '/cashier/overview', icon: LayoutDashboard },
          { label: 'POS', path: '/cashier/pos', icon: ShoppingCart },
          { label: 'Pending Payments', path: '/cashier/payments/pending', icon: Clock },
          { label: 'Receipts', path: '/cashier/receipts', icon: Receipt },
          { label: 'Returns', path: '/cashier/returns', icon: RotateCcw },
          { label: 'Transactions', path: '/cashier/transactions', icon: Activity },
          { label: 'Sales', path: '/cashier/sales', icon: TrendingUp },
          { label: 'Settings', path: '/cashier/settings', icon: Settings },
        ];
      default:
        return [
          { label: 'Overview', path: '/manager/overview', icon: LayoutDashboard },
          { label: 'Staff', path: '/manager/staff', icon: Users },
          { label: 'Inventory & Products', path: '/manager/inventory', icon: Pill },
          { label: 'Settings', path: '/manager/settings', icon: Settings },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      <Sidebar collapsible='icon'>
        <SidebarHeader>
          <div className='flex items-center gap-2'>
            <img src='/logo.png' alt='Logo' className='size-8' />
            <span className='text-xl font-bold text-gray-800 dark:text-white group-data-[collapsible=icon]:hidden'>
              PharmaCare
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                        <Link to={item.path} onClick={handleNavClick}>
                          <Icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className='text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
              >
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className='bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 h-16 flex items-center px-4 md:px-6 justify-between sticky top-0 z-40'>
          <div className='flex items-center gap-2'>
            <SidebarTrigger />
          </div>
          <div className='flex items-center gap-4 ml-auto'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold capitalize'>
                {userRole?.charAt(0)}
              </div>
              <div className='hidden md:block'>
                <p className='text-sm font-medium text-gray-700 dark:text-gray-200 capitalize'>
                  {userRole}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>{user?.email}</p>
              </div>
            </div>
          </div>
        </header>
        <main className='flex-1 overflow-auto p-6'>
          {/* Breadcrumbs */}
          {/* Dynamically generate breadcrumb paths based on location.pathname */}
          {(() => {
            const { pathname } = location;
            // Split path and build breadcrumb array
            const segments = pathname.split('/').filter(Boolean);
            const paths = segments.map((seg, idx) => {
              const href = '/' + segments.slice(0, idx + 1).join('/');
              // Capitalize segment for display
              const name = seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
              return { name, href };
            });
            // Add root dashboard if not present
            if (paths.length > 0 && paths[0].name.toLowerCase() !== 'dashboard') {
              const dashboardPath = userRole ? `/${userRole}/overview` : '/manager/overview';
              paths.unshift({ name: 'Dashboard', href: dashboardPath });
            }
            return <Breadcrumb paths={paths} />;
          })()}
          <Outlet />
        </main>
      </SidebarInset>
    </>
  );
}

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}
