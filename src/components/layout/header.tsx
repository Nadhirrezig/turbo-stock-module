'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Menu, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BranchSelector } from '@/components/shared/branch-selector';
import { useBranchContext } from '@/contexts/branch-context';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
  ({ onMenuClick, className }, ref) => {
    const pathname = usePathname();
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const { selectedBranchId, switchToBranch } = useBranchContext();

    // Generate breadcrumbs based on current path
    const generateBreadcrumbs = (): BreadcrumbItem[] => {
      const pathSegments = pathname.split('/').filter(Boolean);
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: '/' }
      ];

      if (pathSegments.length === 0) {
        return [{ label: 'Dashboard' }];
      }

      let currentPath = '';
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        
        // Convert path segments to readable labels
        const label = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        // Don't add href for the last item (current page)
        const isLast = index === pathSegments.length - 1;
        breadcrumbs.push({
          label,
          href: isLast ? undefined : currentPath
        });
      });

      return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    // Toggle dark mode
    const toggleDarkMode = () => {
      setIsDarkMode(!isDarkMode);
      // In a real app, you'd persist this to localStorage and apply the theme
      document.documentElement.classList.toggle('dark');
    };

    // Initialize dark mode from system preference
    React.useEffect(() => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }, []);

    return (
      <header
        ref={ref}
        className={cn(
          'flex items-center justify-between h-16 px-4 bg-background border-b border-border',
          className
        )}
      >
        {/* Left side - Menu button and Breadcrumbs */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-1 text-sm">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">
                    {item.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Center - Branch and Department Selectors */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          <div className="hidden sm:block">
            <BranchSelector 
              selectedBranchId={selectedBranchId || undefined}
              onBranchChange={switchToBranch}
            />
          </div>
          <div className="sm:hidden ">
            <BranchSelector 
              selectedBranchId={selectedBranchId || undefined}
              onBranchChange={switchToBranch}
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="h-9 w-9"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle dark mode</span>
          </Button>

          {/* User menu placeholder */}
          <div className="flex items-center space-x-2 pl-2 border-l border-border">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-primary-foreground">
                U
              </span>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-foreground">User</div>
              <div className="text-xs text-muted-foreground">Admin</div>
            </div>
          </div>
        </div>
      </header>
    );
  }
);

Header.displayName = 'Header';

export { Header };
