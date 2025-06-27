"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  Settings, 
  FileText, 
  Activity, 
  Menu,
  X,
  ChevronRight,
  Shield,
  BarChart3,
  MessageSquare,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AdminSidebarProps {
  className?: string;
}

const navigationItems = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        description: 'Main dashboard with analytics'
      },
      {
        title: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
        description: 'Detailed analytics and reports'
      }
    ]
  },
  {
    title: 'Management',
    items: [
      {
        title: 'Users',
        href: '/admin/users',
        icon: Users,
        description: 'Manage user accounts'
      },
      {
        title: 'Properties',
        href: '/admin/properties',
        icon: Home,
        description: 'Manage property listings'
      },
      {
        title: 'Messages',
        href: '/admin/messages',
        icon: MessageSquare,
        description: 'Monitor conversations'
      }
    ]
  },
  {
    title: 'Content',
    items: [
      {
        title: 'Reports',
        href: '/admin/reports',
        icon: FileText,
        description: 'User reports and moderation'
      },
      {
        title: 'Notifications',
        href: '/admin/notifications',
        icon: Bell,
        description: 'System notifications'
      }
    ]
  },
  {
    title: 'System',
    items: [
      {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
        description: 'System configuration'
      },
      {
        title: 'Activity Log',
        href: '/admin/activity',
        icon: Activity,
        description: 'Admin action history'
      },
      {
        title: 'Security',
        href: '/admin/security',
        icon: Shield,
        description: 'Security settings'
      }
    ]
  }
];

export default function AdminSidebar({ className }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
          <Image 
            src="/assets/images/houzdey-logo.png" 
            alt="Houzdey Logo" 
            width={32} 
            height={32} 
            style={{ width: "32px", height: "32px", objectFit: "contain" }}
          />
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-500">Houzdey Management</p>
            </div>
          )}
        </div>
        
        {/* Desktop toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:block p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
        </button>

        {/* Mobile close */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navigationItems.map((section) => (
          <div key={section.title} className="space-y-2">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      "hover:bg-gray-100",
                      active
                        ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600"
                        : "text-gray-700",
                      isCollapsed && "justify-center px-2"
                    )}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <Icon className={cn("w-5 h-5", active && "text-indigo-600")} />
                    {!isCollapsed && (
                      <div className="flex-1">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="text-xs text-gray-500">
            <p className="font-medium">Admin Access</p>
            <p>Manage Houzdey platform</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
          isCollapsed ? "w-16" : "w-72",
          className
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-gray-200 transform transition-transform lg:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
} 