import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
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
} from 'lucide-react';
import { logout } from '@/api/auth.api';
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
} from "@/components/ui/sidebar"

export function DashboardLayout({ role = 'manager' }) {
  // Default to manager for now, but should be passed or retrieved
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  // Define navigation items for each role
  const roleNavItems = {
    admin: [
      { label: 'System Overview', path: '/admin/overview', icon: LayoutDashboard },
      { label: 'Pharmacy Management', path: '/admin/pharmacies', icon: Building2 },
      { label: 'Subscriptions', path: '/admin/subscriptions', icon: CreditCard },
      { label: 'Global Settings', path: '/admin/settings', icon: Settings },
      { label: 'Audit Logs', path: '/admin/audit-logs', icon: ClipboardList },
      { label: 'Billing', path: '/admin/billing', icon: CreditCard },
      { label: 'Support Tickets', path: '/admin/support-tickets', icon: LifeBuoy },
      { label: 'System Statistics', path: '/admin/statistics', icon: Activity },
      { label: 'Platform Users', path: '/admin/platform-users', icon: Users },
    ],
    manager: [
      { label: 'Overview', path: '/manager/overview', icon: LayoutDashboard },
      { label: 'Branches', path: '/manager/branches', icon: Building2 },
      { label: 'Staff', path: '/manager/staff', icon: Users },
      { label: 'Inventory & Products', path: '/manager/inventory', icon: Pill },
      { label: 'Reports', path: '/manager/reports', icon: BarChart3 },
      { label: 'Settings', path: '/manager/settings', icon: Settings },
      { label: 'Import Data', path: '/manager/import', icon: FileText },
      { label: 'Stock Transfers', path: '/manager/stock-transfers', icon: ArrowRightLeft },
      { label: 'Refunds & Discounts', path: '/manager/refunds-discounts', icon: Percent },
      { label: 'Notifications', path: '/manager/notifications', icon: Bell },
      { label: 'POS Sales', path: '/manager/pos-sales', icon: ShoppingCart },
    ],
    pharmacist: [
      { label: 'Dashboard', path: '/pharmacist/overview', icon: LayoutDashboard },
      { label: 'Inventory', path: '/pharmacist/inventory', icon: Pill },
      { label: 'Prescriptions', path: '/pharmacist/prescriptions', icon: FileText },
      { label: 'Stock Transfers', path: '/pharmacist/transfers', icon: ArrowRightLeft },
      { label: 'Reports', path: '/pharmacist/reports', icon: BarChart3 },
      { label: 'Stock Receiving', path: '/pharmacist/stock-receiving', icon: PackagePlus },
      { label: 'Settings', path: '/pharmacist/settings', icon: Settings },
    ],
    cashier: [
      { label: 'Dashboard', path: '/cashier/overview', icon: LayoutDashboard },
      { label: 'POS', path: '/cashier/pos-sales', icon: ShoppingCart },
      { label: 'Sales History', path: '/cashier/receipts', icon: Activity },
      { label: 'Sessions', path: '/cashier/sessions', icon: Clock },
      { label: 'Stock Check', path: '/cashier/stock', icon: Search },
      { label: 'Settings', path: '/cashier/settings', icon: Settings },
    ],
  };

  const navItems = roleNavItems[role] || roleNavItems.manager;

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className='flex items-center gap-2'>
            <img src='/logo.png' alt='Logo' className='size-8' />
            <span className='text-xl font-bold text-gray-800 dark:text-white group-data-[collapsible=icon]:hidden'>PharmaCare</span>
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
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                      >
                        <Link to={item.path}>
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
          <div className="flex items-center gap-2">
            <SidebarTrigger />
          </div>
          <div className='flex items-center gap-4 ml-auto'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold capitalize'>
                {role.charAt(0)}
              </div>
              <div className='hidden md:block'>
                <p className='text-sm font-medium text-gray-700 dark:text-gray-200 capitalize'>
                  {role}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>user@pharmacare.com</p>
              </div>
            </div>
          </div>
        </header>
        <main className='flex-1 overflow-auto p-6'>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
