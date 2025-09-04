import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { InventoryProvider } from '@/contexts/inventory-context';
import { DepartmentProvider } from '@/contexts/department-context';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InventoryProvider>
      <DepartmentProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </DepartmentProvider>
    </InventoryProvider>
  );
}
