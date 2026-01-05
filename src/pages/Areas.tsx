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
import { mockAreas } from '@/data/mockData';
import { Area } from '@/types/crm';
import { useToast } from '@/hooks/use-toast';

export default function Areas() {
  const [areas, setAreas] = useState<Area[]>(mockAreas);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
  });
  const { toast } = useToast();

  const columns = [
    { header: 'Area Name', accessor: 'name' as const },
    { header: 'City', accessor: 'city' as const },
    {
      header: 'Projects',
      accessor: (area: Area) => area.projectCount,
    },
    {
      header: 'Created',
      accessor: (area: Area) =>
        new Date(area.createdAt).toLocaleDateString(),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newArea: Area = {
      id: Date.now().toString(),
      name: formData.name,
      city: formData.city,
      projectCount: 0,
      createdAt: new Date(),
    };
    setAreas([newArea, ...areas]);
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
        <DataTable columns={columns} data={areas} />
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
                placeholder="e.g., Business Bay"
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
                placeholder="e.g., Dubai"
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
