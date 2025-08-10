import { PageHeader } from '@/components/shared/page-header';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your inventory management system"
        showAction={false}
      />

      <div className="px-4 sm:px-6">
        {/* Dashboard content will be implemented later */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Stats cards placeholder */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-card-foreground">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-destructive">23</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-card-foreground">$45,678</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Suppliers</p>
                <p className="text-2xl font-bold text-card-foreground">12</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Recent Activity
            </h3>
            <p className="text-muted-foreground">
              Recent inventory movements and updates will be displayed here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
