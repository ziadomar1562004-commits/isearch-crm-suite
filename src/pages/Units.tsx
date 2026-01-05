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
import { mockUnits, mockProjects } from '@/data/mockData';
import { Unit } from '@/types/crm';
import { useToast } from '@/hooks/use-toast';

export default function Units() {
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    unitNumber: '',
    type: '1br' as Unit['type'],
    size: '',
    price: '',
    ownerName: '',
    ownerPhone: '',
    status: 'available' as Unit['status'],
  });
  const { toast } = useToast();

  const columns = [
    { header: 'Unit #', accessor: 'unitNumber' as const },
    { header: 'Project', accessor: 'projectName' as const },
    {
      header: 'Type',
      accessor: (unit: Unit) => unit.type.toUpperCase(),
    },
    {
      header: 'Size (m²)',
      accessor: (unit: Unit) => unit.size.toLocaleString(),
    },
    {
      header: 'Price (EGP)',
      accessor: (unit: Unit) => unit.price.toLocaleString(),
    },
    { header: 'Owner', accessor: 'ownerName' as const },
    { header: 'Owner Phone', accessor: 'ownerPhone' as const },
    {
      header: 'Status',
      accessor: (unit: Unit) => <StatusBadge status={unit.status} />,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProject = mockProjects.find((p) => p.id === formData.projectId);
    const newUnit: Unit = {
      id: Date.now().toString(),
      projectId: formData.projectId,
      projectName: selectedProject?.name || '',
      unitNumber: formData.unitNumber,
      type: formData.type,
      size: parseInt(formData.size),
      price: parseInt(formData.price),
      ownerName: formData.ownerName,
      ownerPhone: formData.ownerPhone,
      status: formData.status,
      createdAt: new Date(),
    };
    setUnits([newUnit, ...units]);
    setIsDialogOpen(false);
    setFormData({
      projectId: '',
      unitNumber: '',
      type: '1br',
      size: '',
      price: '',
      ownerName: '',
      ownerPhone: '',
      status: 'available',
    });
    toast({
      title: 'Unit Added',
      description: `Unit ${formData.unitNumber} has been added.`,
    });
  };

  return (
    <MainLayout>
      <PageHeader
        title="Units"
        description="Manage available units from property owners"
        action={{
          label: 'Add Unit',
          onClick: () => setIsDialogOpen(true),
        }}
      />

      <div className="animate-fade-in">
        <DataTable columns={columns} data={units} />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Unit</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Select
                  value={formData.projectId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, projectId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitNumber">Unit Number</Label>
                <Input
                  id="unitNumber"
                  value={formData.unitNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, unitNumber: e.target.value })
                  }
                  placeholder="e.g., A-1205"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as Unit['type'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="1br">1 BR</SelectItem>
                    <SelectItem value="2br">2 BR</SelectItem>
                    <SelectItem value="3br">3 BR</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size (m²)</Label>
                <Input
                  id="size"
                  type="number"
                  value={formData.size}
                  onChange={(e) =>
                    setFormData({ ...formData, size: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (EGP)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerPhone">Owner Phone</Label>
                <Input
                  id="ownerPhone"
                  value={formData.ownerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerPhone: e.target.value })
                  }
                  placeholder="+20 1XX XXX XXXX"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as Unit['status'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
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
              <Button type="submit">Add Unit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
