import { useState, useRef } from 'react';
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
import { Unit } from '@/types/crm';
import { useToast } from '@/hooks/use-toast';
import { useConfig } from '@/contexts/ConfigContext';
import { useData } from '@/contexts/DataContext';
import { ImagePlus, X, Image } from 'lucide-react';

export default function Units() {
  const { units, projects, areas, addUnit } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPhotosDialogOpen, setIsPhotosDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const { unitTypes } = useConfig();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState({
    areaId: 'all',
    paymentMethod: 'all',
    minSize: '',
    maxSize: '',
  });

  const [formData, setFormData] = useState({
    projectId: '',
    unitNumber: '',
    type: '',
    size: '',
    price: '',
    ownerName: '',
    ownerPhone: '+20 ',
    status: 'available' as Unit['status'],
    finishingStatus: 'fully-finished' as Unit['finishingStatus'],
    paymentMethod: 'cash' as Unit['paymentMethod'],
    installmentPlans: '',
    photos: [] as string[],
  });

  const filteredUnits = units.filter(unit => {
    if (filters.areaId !== 'all' && unit.areaId !== filters.areaId) return false;
    if (filters.paymentMethod !== 'all' && unit.paymentMethod !== filters.paymentMethod) return false;
    if (filters.minSize && unit.size < parseInt(filters.minSize)) return false;
    if (filters.maxSize && unit.size > parseInt(filters.maxSize)) return false;
    return true;
  });

  const activeUnitTypes = unitTypes.filter((t) => t.isActive);

  const columns = [
    { header: 'Unit #', accessor: 'unitNumber' as const },
    { header: 'Project', accessor: 'projectName' as const },
    { header: 'Area', accessor: 'areaName' as const },
    {
      header: 'Type',
      accessor: (unit: Unit) => unit.type,
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
      header: 'Photos',
      accessor: (unit: Unit) => (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUnit(unit);
            setIsPhotosDialogOpen(true);
          }}
        >
          <Image className="h-4 w-4" />
          {unit.photos.length}
        </Button>
      ),
    },
    {
      header: 'Status',
      accessor: (unit: Unit) => <StatusBadge status={unit.status} />,
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, result],
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUnit({
      projectId: formData.projectId,
      unitNumber: formData.unitNumber,
      type: formData.type,
      size: parseInt(formData.size),
      price: parseInt(formData.price),
      ownerName: formData.ownerName,
      ownerPhone: formData.ownerPhone,
      status: formData.status,
      finishingStatus: formData.finishingStatus,
      paymentMethod: formData.paymentMethod,
      installmentPlans: formData.installmentPlans,
      photos: formData.photos,
    });
    setIsDialogOpen(false);
    setFormData({
      projectId: '',
      unitNumber: '',
      type: '',
      size: '',
      price: '',
      ownerName: '',
      ownerPhone: '+20 ',
      status: 'available',
      finishingStatus: 'fully-finished',
      paymentMethod: 'cash',
      installmentPlans: '',
      photos: [],
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

      <div className="bg-card p-4 rounded-xl border mb-6 flex flex-wrap gap-4 items-end">
        <div className="space-y-2">
          <Label>Area</Label>
          <Select value={filters.areaId} onValueChange={(v) => setFilters({ ...filters, areaId: v })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {areas.map(area => (
                <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Select value={filters.paymentMethod} onValueChange={(v) => setFilters({ ...filters, paymentMethod: v })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Methods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="installments">Installments</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Min Size (m²)</Label>
          <Input 
            type="number" 
            className="w-[100px]" 
            value={filters.minSize} 
            onChange={(e) => setFilters({ ...filters, minSize: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Max Size (m²)</Label>
          <Input 
            type="number" 
            className="w-[100px]" 
            value={filters.maxSize} 
            onChange={(e) => setFilters({ ...filters, maxSize: e.target.value })}
          />
        </div>
        <Button variant="ghost" onClick={() => setFilters({ areaId: 'all', paymentMethod: 'all', minSize: '', maxSize: '' })}>
          Reset
        </Button>
      </div>

      <div className="animate-fade-in">
        <DataTable columns={columns} data={filteredUnits} />
      </div>

      {/* Add Unit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
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
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name} ({project.areaName})
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
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeUnitTypes.map((type) => (
                      <SelectItem key={type.id} value={type.label}>
                        {type.label}
                      </SelectItem>
                    ))}
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

            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="finishingStatus">Finishing Status</Label>
                <Select
                  value={formData.finishingStatus}
                  onValueChange={(value) =>
                    setFormData({ ...formData, finishingStatus: value as Unit['finishingStatus'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="core-and-shell">Core & Shell</SelectItem>
                    <SelectItem value="semi-finished">Semi-Finished</SelectItem>
                    <SelectItem value="fully-finished">Fully Finished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentMethod: value as Unit['paymentMethod'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="installments">Installments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.paymentMethod === 'installments' && (
                <div className="space-y-2">
                  <Label htmlFor="installmentPlans">Installment Plans</Label>
                  <Input
                    id="installmentPlans"
                    value={formData.installmentPlans}
                    onChange={(e) =>
                      setFormData({ ...formData, installmentPlans: e.target.value })
                    }
                    placeholder="e.g., 10% DP, 7 years"
                  />
                </div>
              )}
            </div>

            {/* Photos Section */}
            <div className="space-y-2">
              <Label>Unit Photos</Label>
              <div className="flex flex-wrap gap-2">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Unit photo ${index + 1}`}
                      className="h-20 w-20 rounded-lg object-cover border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-20 w-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <ImagePlus className="h-6 w-6" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
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

      {/* View Photos Dialog */}
      <Dialog open={isPhotosDialogOpen} onOpenChange={setIsPhotosDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Unit Photos - {selectedUnit?.unitNumber}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {selectedUnit?.photos.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground py-8">
                No photos available for this unit
              </p>
            ) : (
              selectedUnit?.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Unit photo ${index + 1}`}
                  className="w-full h-40 rounded-lg object-cover border border-border"
                />
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
