import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, LayoutDashboard, Settings, PieChart, Bell } from 'lucide-react';
import { NotificationBadge } from './NotificationBadge';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Admin', href: '/admin', icon: Settings },
    { name: 'Reports', href: '/reports', icon: PieChart },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">CommTracker</h1>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.href
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b border-gray-200 bg-white">
            <div className="h-full px-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {navigation.find((item) => item.href === location.pathname)?.name}
              </h2>
              <div className="flex items-center gap-4">
                <NotificationBadge />
                <div className="h-8 w-8 rounded-full bg-gray-200" />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}