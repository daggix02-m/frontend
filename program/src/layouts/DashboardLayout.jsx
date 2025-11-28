import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Building2,
  Users,
  LogOut,
  Menu,
  X,
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
} from 'lucide-react';
import { logout } from '@/api/auth.api';

export function DashboardLayout({ role = 'manager' }) {
  // Default to manager for now, but should be passed or retrieved
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

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
    ],
    manager: [
      { label: 'Overview', path: '/manager/overview', icon: LayoutDashboard },
      { label: 'Branches', path: '/manager/branches', icon: Building2 },
      { label: 'Staff', path: '/manager/staff', icon: Users },
      { label: 'Inventory & Products', path: '/manager/inventory', icon: Pill },
      { label: 'Reports', path: '/manager/reports', icon: BarChart3 },
      { label: 'Settings', path: '/manager/settings', icon: Settings },
      { label: 'Import Data', path: '/manager/import', icon: FileText },
    ],
    pharmacist: [
      { label: 'Dashboard', path: '/pharmacist/overview', icon: LayoutDashboard },
      { label: 'Inventory', path: '/pharmacist/inventory', icon: Pill },
      { label: 'Prescriptions', path: '/pharmacist/prescriptions', icon: FileText },
      { label: 'Stock Transfers', path: '/pharmacist/transfers', icon: ArrowRightLeft },
    ],
    cashier: [
      { label: 'Dashboard', path: '/cashier/overview', icon: LayoutDashboard },
      { label: 'POS', path: '/cashier/pos-sales', icon: ShoppingCart },
      { label: 'Sales History', path: '/cashier/receipts', icon: Activity },
      { label: 'Sessions', path: '/cashier/sessions', icon: Clock },
      { label: 'Stock Check', path: '/cashier/stock', icon: Search },
    ],
  };

  const navItems = roleNavItems[role] || roleNavItems.manager;

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-900 flex'>
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 lg:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:relative lg:translate-x-0`}
      >
        <div className='h-full flex flex-col'>
          <div className='p-6 border-b dark:border-gray-700 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <img src='/logo.png' alt='Logo' className='w-8 h-8' />
              <span className='text-xl font-bold text-gray-800 dark:text-white'>PharmaCare</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className='lg:hidden text-gray-500 hover:text-gray-700'
            >
              <X size={24} />
            </button>
          </div>

          <nav className='flex-1 p-4 space-y-2'>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  <Icon size={20} />
                  <span className='font-medium'>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className='p-4 border-t dark:border-gray-700'>
            <Button
              variant='ghost'
              className='w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
              onClick={handleLogout}
            >
              <LogOut size={20} className='mr-2' />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className='flex-1 flex flex-col min-w-0 overflow-hidden'>
        {/* Header */}
        <header className='bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 h-16 flex items-center px-6 justify-between'>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className='lg:hidden text-gray-500 hover:text-gray-700'
          >
            <Menu size={24} />
          </button>
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

        {/* Page Content */}
        <main className='flex-1 overflow-auto p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
