import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Users, Building2, MapPin, Home } from 'lucide-react';
import { mockLeads, mockUnits } from '@/data/mockData';

export default function Dashboard() {
  const recentLeads = mockLeads.slice(0, 5);
  const recentUnits = mockUnits.slice(0, 5);

  const leadColumns = [
    { header: 'Name', accessor: 'name' as const },
    { header: 'Phone', accessor: 'phone' as const },
    { header: 'Source', accessor: 'source' as const },
    {
      header: 'Status',
      accessor: (lead: typeof mockLeads[0]) => (
        <StatusBadge status={lead.status} />
      ),
    },
    {
      header: 'Follow Up',
      accessor: (lead: typeof mockLeads[0]) => (
        <StatusBadge status={lead.followUp} />
      ),
    },
  ];

  const unitColumns = [
    { header: 'Unit', accessor: 'unitNumber' as const },
    { header: 'Project', accessor: 'projectName' as const },
    { header: 'Type', accessor: 'type' as const },
    {
      header: 'Price',
      accessor: (unit: typeof mockUnits[0]) =>
        `EGP ${unit.price.toLocaleString()}`,
    },
    { header: 'Owner Phone', accessor: 'ownerPhone' as const },
    {
      header: 'Status',
      accessor: (unit: typeof mockUnits[0]) => (
        <StatusBadge status={unit.status} />
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with your sales."
      />

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={mockLeads.length}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Projects"
          value={2}
          icon={Building2}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Areas Covered"
          value={3}
          icon={MapPin}
        />
        <StatCard
          title="Available Units"
          value={mockUnits.filter((u) => u.status === 'available').length}
          icon={Home}
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-in">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Recent Leads
          </h2>
          <DataTable columns={leadColumns} data={recentLeads} />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Latest Units
          </h2>
          <DataTable columns={unitColumns} data={recentUnits} />
        </div>
      </div>
    </MainLayout>
  );
}
