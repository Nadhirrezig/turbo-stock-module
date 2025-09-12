import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { InventoryProvider } from '@/contexts/inventory-context';
import { BranchProvider } from '@/contexts/branch-context';
import { DepartmentProvider } from '@/contexts/department-context';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InventoryProvider>
      <BranchProvider>
        <DepartmentProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </DepartmentProvider>
      </BranchProvider>
    </InventoryProvider>
  );
}
