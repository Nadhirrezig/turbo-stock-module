'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  ChevronDown,
  Package,
  Truck,
  Tags,
  Boxes,
  TrendingUp,
  ArrowUpDown,
  BarChart3,
  Home,
  Building2,
  Ruler,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DepartmentSelector } from '@/components/shared/department-selector';
import { BranchSelector } from '@/components/shared/branch-selector';
import { useBranchContext } from '@/contexts/branch-context';

interface SidebarItem {
  id: string;
  name: string;
  href?: string;
  icon: React.ReactNode;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/',
    icon: <Home className="w-5 h-5" />,
  },
  {
    id: 'Departments',
    name: 'Departments',
    href: '/departments',
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: 'inventory',
    name: 'Inventory',
    icon: <Package className="w-5 h-5" />,
    children: [
      {
        id: 'units',
        name: 'Units',
        href: '/units',
        icon: <Ruler className="w-4 h-4" />,
      },
      {
        id: 'inventory-item-categories',
        name: 'Categories',
        href: '/inventory-item-categories',
        icon: <Tags className="w-4 h-4" />,
      },
      {
        id: 'inventory-items',
        name: 'Inventory Items',
        href: '/inventory-items',
        icon: <Package className="w-4 h-4" />,
      },
      {
        id: 'inventory-stocks',
        name: 'Stock Management',
        href: '/inventory-stocks',
        icon: <Boxes className="w-4 h-4" />,
      },
      {
        id: 'inventory-movements',
        name: 'Stock Movements',
        href: '/inventory-movements',
        icon: <ArrowUpDown className="w-4 h-4" />,
      },
      {
        id: 'suppliers',
        name: 'Suppliers',
        href: '/suppliers',
        icon: <Truck className="w-4 h-4" />,
      },
    ],
  },
  {
    id: 'reports',
    name: 'Reports',
    icon: <BarChart3 className="w-5 h-5" />,
    children: [
      {
        id: 'usage-report',
        name: 'Usage Report',
        href: '/reports/usage',
        icon: <TrendingUp className="w-4 h-4" />,
      },
      {
        id: 'forecasting-report',
        name: 'Forecasting Report',
        href: '/reports/forecasting',
        icon: <BarChart3 className="w-4 h-4" />,
      },
    ],
  },
];

interface SidebarProps {
  className?: string;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className }, ref) => {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = React.useState<string[]>(['inventory']);
    const { selectedBranchId, switchToBranch } = useBranchContext();
    // Department context is used by DepartmentSelector component internally

    const toggleExpanded = (itemId: string) => {
      setExpandedItems(prev =>
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    };

    const isActive = (href?: string) => {
      if (!href) return false;
      return pathname === href || (href !== '/' && pathname.startsWith(href));
    };

    const isParentActive = (item: SidebarItem) => {
      if (item.href && isActive(item.href)) return true;
      return item.children?.some(child => isActive(child.href)) || false;
    };

    const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedItems.includes(item.id);
      const itemIsActive = isActive(item.href);
      const parentIsActive = isParentActive(item);

      if (hasChildren) {
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => toggleExpanded(item.id)}
              className={cn(
                'flex items-center w-full p-2 rounded-lg transition-colors duration-200 group',
                parentIsActive
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'hover:bg-accent hover:text-accent-foreground',
                level > 0 && 'pl-10'
              )}
            >
              {item.icon}
              <span className="flex-1 ml-3 text-left whitespace-nowrap">
                {item.name}
              </span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 transition-transform duration-300',
                  isExpanded && 'rotate-180'
                )}
              />
            </button>

            <ul
              className={cn(
                'pl-4 mt-2 space-y-1 overflow-hidden transition-[max-height] duration-300 ease-in-out',
                isExpanded ? 'max-h-96' : 'max-h-0'
              )}
            >
              {item.id === 'inventory' && (
                <li className="px-2 mb-3">
                  <DepartmentSelector className="w-full" />
                </li>
              )}
              {item.children?.map(child => renderSidebarItem(child, level + 1))}
            </ul>
          </li>
        );
      }

      return (
        <li key={item.id}>
          <Link
            href={item.href || '#'}
            className={cn(
              'flex items-center p-2 rounded-md transition-colors duration-200 group',
              itemIsActive
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'hover:bg-accent hover:text-accent-foreground',
              level > 0 && 'pl-10'
            )}
          >
            {item.icon}
            <span className="ml-3 whitespace-nowrap">{item.name}</span>
          </Link>
        </li>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col w-64 h-screen bg-background border-r border-border',
          'scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent',
          className
        )}
      >
        <div className="flex items-center justify-center h-16 px-4 border-b border-border">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo1.png"
              alt="Blink Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold text-foreground">
              Blink Stock
            </span>
          </Link>
        </div>

        {/* Branch Selector - Mobile only */}
        <div className="md:hidden px-3 py-2 border-b border-border">
          <BranchSelector 
            selectedBranchId={selectedBranchId || undefined}
            onBranchChange={switchToBranch}
            className="w-full"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {sidebarItems.map(item => renderSidebarItem(item))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            Inventory Management v1.0
          </div>
        </div>
      </div>
    );
  }
);

Sidebar.displayName = 'Sidebar';

export { Sidebar };
