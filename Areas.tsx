import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Area } from '@/types/crm';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';

export default function Areas() {
  const { areas, areaInsights, addArea } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
  });
  const { toast } = useToast();

  // Merge area data with insights for display
  const areasWithStats = areas.map(area => {
    const insight = areaInsights.find(i => i.areaId === area.id);
    return {
      ...area,
      projectCount: insight?.projectsCount || 0,
      leadsCount: insight?.leadsCount || 0,
    };
  });

  const columns = [
    { header: 'Area Name', accessor: 'name' as const },
    { header: 'City', accessor: 'city' as const },
    {
      header: 'Projects',
      accessor: (area: typeof areasWithStats[0]) => area.projectCount,
    },
    {
      header: 'Leads',
      accessor: (area: typeof areasWithStats[0]) => area.leadsCount,
    },
    {
      header: 'Created',
      accessor: (area: Area) =>
        new Date(area.createdAt).toLocaleDateString(),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addArea({
      name: formData.name,
      city: formData.city,
    });
    setIsDialogOpen(false);
    setFormData({ name: '', city: '' });
    toast({
      title: 'Area Added',
      description: `${formData.name} has been added to your areas.`,
    });
  };

  return (
    <MainLayout>
      <PageHeader
        title="Areas"
        description="Manage geographical areas and locations"
        action={{
          label: 'Add Area',
          onClick: () => setIsDialogOpen(true),
        }}
      />

      <div className="animate-fade-in">
        <DataTable columns={columns} data={areasWithStats} />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Area</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Area Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., New Cairo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="e.g., Cairo"
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Area</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
