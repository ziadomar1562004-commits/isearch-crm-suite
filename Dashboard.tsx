import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, MapPin, Home, TrendingUp } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Progress } from '@/components/ui/progress';

export default function Dashboard() {
  const { leads, projects, areas, units, areaInsights } = useData();
  
  const recentLeads = leads.slice(0, 5);
  const recentUnits = units.slice(0, 5);
  const topAreas = areaInsights.slice(0, 5);
  const maxLeads = Math.max(...topAreas.map(a => a.leadsCount), 1);

  const leadColumns = [
    { header: 'Name', accessor: 'name' as const },
    { header: 'Phone', accessor: 'phone' as const },
    { header: 'Area', accessor: 'areaName' as const },
    { header: 'Source', accessor: 'source' as const },
    {
      header: 'Status',
      accessor: (lead: typeof leads[0]) => (
        <StatusBadge status={lead.status} />
      ),
    },
    {
      header: 'Follow Up',
      accessor: (lead: typeof leads[0]) => (
        <StatusBadge status={lead.followUp} />
      ),
    },
  ];

  const unitColumns = [
    { header: 'Unit', accessor: 'unitNumber' as const },
    { header: 'Project', accessor: 'projectName' as const },
    { header: 'Area', accessor: 'areaName' as const },
    { header: 'Type', accessor: 'type' as const },
    {
      header: 'Price',
      accessor: (unit: typeof units[0]) =>
        `EGP ${unit.price.toLocaleString()}`,
    },
    {
      header: 'Status',
      accessor: (unit: typeof units[0]) => (
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
          value={leads.length}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Projects"
          value={projects.filter(p => p.status === 'ongoing').length}
          icon={Building2}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Areas Covered"
          value={areas.length}
          icon={MapPin}
        />
        <StatCard
          title="Available Units"
          value={units.filter((u) => u.status === 'available').length}
          icon={Home}
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Area Insights */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Most Active Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topAreas.map((area, index) => (
              <div key={area.areaId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <span className="font-medium text-foreground">{area.areaName}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{area.leadsCount} leads</span>
                    <span>{area.projectsCount} projects</span>
                    <span>{area.unitsCount} units</span>
                  </div>
                </div>
                <Progress value={(area.leadsCount / maxLeads) * 100} className="h-2" />
              </div>
            ))}
            {topAreas.length === 0 && (
              <p className="text-center text-muted-foreground">No area data available</p>
            )}
          </div>
        </CardContent>
      </Card>

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
