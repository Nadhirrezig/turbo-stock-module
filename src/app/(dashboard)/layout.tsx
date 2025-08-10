import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { InventoryProvider } from '@/contexts/inventory-context';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InventoryProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </InventoryProvider>
  );
}
