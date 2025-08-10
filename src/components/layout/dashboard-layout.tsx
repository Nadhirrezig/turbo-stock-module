'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';
import { Header } from './header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardLayout = React.forwardRef<HTMLDivElement, DashboardLayoutProps>(
  ({ children, className }, ref) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
      setSidebarOpen(false);
    };

    // Close sidebar when clicking outside on mobile
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const sidebar = document.getElementById('sidebar');
        const menuButton = document.querySelector('[data-menu-button]');
        
        if (
          sidebarOpen &&
          sidebar &&
          !sidebar.contains(event.target as Node) &&
          !menuButton?.contains(event.target as Node)
        ) {
          closeSidebar();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [sidebarOpen]);

    // Close sidebar on route change (mobile)
    React.useEffect(() => {
      closeSidebar();
    }, []);

    return (
      <div ref={ref} className={cn('flex h-screen bg-background', className)}>
        {/* Sidebar - Desktop */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Sidebar - Mobile */}
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={closeSidebar}
            />
            
            {/* Sidebar */}
            <div 
              id="sidebar"
              className="fixed inset-y-0 left-0 z-50 md:hidden"
            >
              <Sidebar />
            </div>
          </>
        )}

        {/* Main content area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <Header onMenuClick={toggleSidebar} />

          {/* Page content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }
);

DashboardLayout.displayName = 'DashboardLayout';

export { DashboardLayout };
