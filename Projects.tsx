import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Project } from '@/types/crm';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';

export default function Projects() {
  const { projects, areas, addProject } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    developer: '',
    areaId: '',
    totalUnits: '',
    status: 'upcoming' as Project['status'],
  });
  const { toast } = useToast();

  const columns = [
    { header: 'Name', accessor: 'name' as const },
    { header: 'Developer', accessor: 'developer' as const },
    { header: 'Area', accessor: 'areaName' as const },
    {
      header: 'Total Units',
      accessor: (project: Project) => project.totalUnits.toLocaleString(),
    },
    {
      header: 'Status',
      accessor: (project: Project) => <StatusBadge status={project.status} />,
    },
    {
      header: 'Created',
      accessor: (project: Project) =>
        new Date(project.createdAt).toLocaleDateString(),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProject({
      name: formData.name,
      developer: formData.developer,
      areaId: formData.areaId,
      totalUnits: parseInt(formData.totalUnits),
      status: formData.status,
    });
    setIsDialogOpen(false);
    setFormData({
      name: '',
      developer: '',
      areaId: '',
      totalUnits: '',
      status: 'upcoming',
    });
    toast({
      title: 'Project Added',
      description: `${formData.name} has been added to your projects.`,
    });
  };

  return (
    <MainLayout>
      <PageHeader
        title="Projects"
        description="Manage development projects and their details"
        action={{
          label: 'Add Project',
          onClick: () => setIsDialogOpen(true),
        }}
      />

      <div className="animate-fade-in">
        <DataTable columns={columns} data={projects} />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="developer">Developer</Label>
              <Input
                id="developer"
                value={formData.developer}
                onChange={(e) =>
                  setFormData({ ...formData, developer: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Area</Label>
              <Select
                value={formData.areaId}
                onValueChange={(value) =>
                  setFormData({ ...formData, areaId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.name} - {area.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalUnits">Total Units</Label>
              <Input
                id="totalUnits"
                type="number"
                value={formData.totalUnits}
                onChange={(e) =>
                  setFormData({ ...formData, totalUnits: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as Project['status'],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Project</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
