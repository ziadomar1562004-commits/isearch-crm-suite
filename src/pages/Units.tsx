import { useState, useRef, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { Unit, PaymentType } from '@/types/crm';
import { useToast } from '@/hooks/use-toast';
import { useConfig } from '@/contexts/ConfigContext';
import { useData } from '@/contexts/DataContext';
import { ImagePlus, X, Image, MapPin, Banknote, CreditCard } from 'lucide-react';
import { UnitMap } from '@/components/UnitMap';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function Units() {
  const { units, projects, areas, addUnit, updateUnit } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPhotosDialogOpen, setIsPhotosDialogOpen] = useState(false);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const { unitTypes } = useConfig();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    projectId: '',
    unitNumber: '',
    type: '',
    size: '',
    price: '',
    paymentType: 'cash' as PaymentType,
    downPaymentPercent: '20',
    installmentYears: '5',
    ownerName: '',
    ownerPhone: '+20 ',
    status: 'available' as Unit['status'],
    photos: [] as string[],
    location: undefined as { lat: number; lng: number } | undefined,
  });

  const activeUnitTypes = unitTypes.filter((t) => t.isActive);

  // Calculate price per meter in real-time
  const pricePerMeter = useMemo(() => {
    const price = parseInt(formData.price) || 0;
    const size = parseInt(formData.size) || 0;
    return size > 0 ? Math.round(price / size) : 0;
  }, [formData.price, formData.size]);

  // Calculate payment details for installment
  const paymentDetails = useMemo(() => {
    if (formData.paymentType !== 'installment') return null;
    const totalPrice = parseInt(formData.price) || 0;
    const downPaymentPercent = parseInt(formData.downPaymentPercent) || 0;
    const downPayment = Math.round((totalPrice * downPaymentPercent) / 100);
    const rest = totalPrice - downPayment;
    return { downPayment, rest, totalPrice };
  }, [formData.price, formData.downPaymentPercent, formData.paymentType]);

  const handleSetLocation = (unit: Unit) => {
    setSelectedUnit(unit);
    setIsMapDialogOpen(true);
  };

  const handleLocationSave = (location: { lat: number; lng: number } | undefined) => {
    if (selectedUnit) {
      updateUnit(selectedUnit.id, { location });
      toast({
        title: location ? 'Location Set' : 'Location Removed',
        description: location 
          ? `Location set for unit ${selectedUnit.unitNumber}`
          : `Location removed from unit ${selectedUnit.unitNumber}`,
      });
    }
    setIsMapDialogOpen(false);
    setSelectedUnit(null);
  };

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
    {
      header: 'Price/m²',
      accessor: (unit: Unit) => unit.pricePerMeter ? unit.pricePerMeter.toLocaleString() : '-',
    },
    {
      header: 'Payment',
      accessor: (unit: Unit) => {
        const paymentPlan = unit.paymentPlan || { type: 'cash' as const };
        return (
          <div className="flex items-center gap-1">
            {paymentPlan.type === 'cash' ? (
              <Badge variant="outline" className="gap-1">
                <Banknote className="h-3 w-3" />
                Cash
              </Badge>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="gap-1 cursor-help">
                    <CreditCard className="h-3 w-3" />
                    {paymentPlan.downPaymentPercent || 0}% DP
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs space-y-1">
                    <p>Down Payment: {paymentPlan.downPaymentPercent || 0}%</p>
                    <p>Duration: {paymentPlan.installmentYears || 0} years</p>
                    <p>DP Amount: EGP {Math.round((unit.price * (paymentPlan.downPaymentPercent || 0)) / 100).toLocaleString()}</p>
                    <p>Rest: EGP {Math.round(unit.price * (1 - (paymentPlan.downPaymentPercent || 0) / 100)).toLocaleString()}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    { header: 'Owner', accessor: 'ownerName' as const },
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
      header: 'Location',
      accessor: (unit: Unit) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${unit.location ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSetLocation(unit);
              }}
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{unit.location ? 'View/Edit Location' : 'Set Location'}</p>
          </TooltipContent>
        </Tooltip>
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
      paymentPlan: formData.paymentType === 'cash' 
        ? { type: 'cash' }
        : { 
            type: 'installment', 
            downPaymentPercent: parseInt(formData.downPaymentPercent),
            installmentYears: parseInt(formData.installmentYears),
          },
      ownerName: formData.ownerName,
      ownerPhone: formData.ownerPhone,
      status: formData.status,
      photos: formData.photos,
      location: formData.location,
    });
    setIsDialogOpen(false);
    setFormData({
      projectId: '',
      unitNumber: '',
      type: '',
      size: '',
      price: '',
      paymentType: 'cash',
      downPaymentPercent: '20',
      installmentYears: '5',
      ownerName: '',
      ownerPhone: '+20 ',
      status: 'available',
      photos: [],
      location: undefined,
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
                <Label htmlFor="price">Total Price (EGP)</Label>
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

            {/* Price per meter display */}
            {pricePerMeter > 0 && (
              <div className="rounded-lg bg-muted/50 p-3 text-sm">
                <span className="text-muted-foreground">Price per m²: </span>
                <span className="font-semibold text-foreground">
                  EGP {pricePerMeter.toLocaleString()}
                </span>
              </div>
            )}

            {/* Payment Plan Section */}
            <div className="space-y-4 rounded-lg border p-4">
              <div className="space-y-2">
                <Label>Payment Type</Label>
                <Select
                  value={formData.paymentType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentType: value as PaymentType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        Cash
                      </div>
                    </SelectItem>
                    <SelectItem value="installment">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Installment
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.paymentType === 'installment' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="downPayment">Down Payment (%)</Label>
                      <Input
                        id="downPayment"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.downPaymentPercent}
                        onChange={(e) =>
                          setFormData({ ...formData, downPaymentPercent: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="years">Years</Label>
                      <Input
                        id="years"
                        type="number"
                        min="1"
                        max="20"
                        value={formData.installmentYears}
                        onChange={(e) =>
                          setFormData({ ...formData, installmentYears: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  {paymentDetails && (
                    <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-3 text-sm">
                      <div>
                        <span className="text-muted-foreground block">Down Payment</span>
                        <span className="font-semibold text-foreground">
                          EGP {paymentDetails.downPayment.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Rest Amount</span>
                        <span className="font-semibold text-foreground">
                          EGP {paymentDetails.rest.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Total Price</span>
                        <span className="font-semibold text-foreground">
                          EGP {paymentDetails.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
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

            {/* Location Map Section */}
            <div className="space-y-2">
              <Label>Unit Location</Label>
              <UnitMap
                location={formData.location}
                onLocationChange={(location) =>
                  setFormData({ ...formData, location })
                }
              />
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

      {/* Location Map Dialog */}
      <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Unit Location - {selectedUnit?.unitNumber}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <UnitMap
              location={selectedUnit?.location}
              onLocationChange={handleLocationSave}
              unitName={selectedUnit?.unitNumber}
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsMapDialogOpen(false);
                  setSelectedUnit(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}