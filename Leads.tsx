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
import { Lead } from '@/types/crm';
import { useToast } from '@/hooks/use-toast';
import { useConfig } from '@/contexts/ConfigContext';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';

export default function Leads() {
  const { leads, areas, projects, getProjectsByArea, addLead } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { leadSources, salesReps } = useConfig();
  const { currentUser, isAdmin } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+20 ',
    source: '',
    areaId: '',
    projectId: '',
    status: 'new' as Lead['status'],
    followUp: 'pending' as Lead['followUp'],
    assignedTo: '',
  });

  // Filter leads based on user role
  const filteredLeads = isAdmin
    ? leads
    : leads.filter((lead) => lead.assignedTo === currentUser?.id || !lead.assignedTo);

  const activeSalesReps = salesReps.filter((rep) => rep.isActive);
  const availableProjects = formData.areaId ? getProjectsByArea(formData.areaId) : projects;

  const columns = [
    { header: 'Name', accessor: 'name' as const },
    { header: 'Phone', accessor: 'phone' as const },
    { header: 'Area', accessor: 'areaName' as const },
    { header: 'Project', accessor: 'projectName' as const },
    { header: 'Source', accessor: 'source' as const },
    {
      header: 'Assigned To',
      accessor: (lead: Lead) =>
        lead.assignedToName ? (
          <Badge variant="outline" className="font-normal">
            {lead.assignedToName}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs">Unassigned</span>
        ),
    },
    {
      header: 'Status',
      accessor: (lead: Lead) => <StatusBadge status={lead.status} />,
    },
    {
      header: 'Follow Up',
      accessor: (lead: Lead) => <StatusBadge status={lead.followUp} />,
    },
    {
      header: 'Actions',
      accessor: (lead: Lead) => (
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
          onClick={(e) => {
            e.stopPropagation();
            handleWhatsAppClick(lead);
          }}
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Button>
      ),
    },
  ];

  const handleWhatsAppClick = (lead: Lead) => {
    const cleanPhone = lead.phone.replace(/\D/g, '');
    const message = `أهلاً ${lead.name}، أنا أتواصل معك بخصوص استفسارك عن مشروع ${lead.projectName || 'عقاراتنا'}.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    
    // Log interaction (Mock API call)
    console.log(`Logging WhatsApp interaction for lead: ${lead.id}`);
    toast({
      title: 'WhatsApp Interaction Logged',
      description: `Interaction with ${lead.name} has been recorded.`,
    });
    
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedRep = salesReps.find((r) => r.id === formData.assignedTo);
    const selectedArea = areas.find((a) => a.id === formData.areaId);
    const selectedProject = projects.find((p) => p.id === formData.projectId);
    
    addLead({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      source: formData.source,
      areaId: formData.areaId || undefined,
      areaName: selectedArea?.name,
      projectId: formData.projectId || undefined,
      projectName: selectedProject?.name,
      status: formData.status,
      followUp: formData.followUp,
      assignedTo: formData.assignedTo || undefined,
      assignedToName: assignedRep?.name,
    });
    setIsDialogOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '+20 ',
      source: '',
      areaId: '',
      projectId: '',
      status: 'new',
      followUp: 'pending',
      assignedTo: '',
    });
    toast({
      title: 'Lead Added',
      description: `${formData.name} has been added to your leads.`,
    });
  };

  return (
    <MainLayout>
      <PageHeader
        title="Leads"
        description={
          isAdmin
            ? 'Manage all sales leads and prospects'
            : 'View and manage your assigned leads'
        }
        action={{
          label: 'Add Lead',
          onClick: () => setIsDialogOpen(true),
        }}
      />

      <div className="animate-fade-in">
        <DataTable columns={columns} data={filteredLeads} />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
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
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+20 1XX XXX XXXX"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area">Interested Area</Label>
                <Select
                  value={formData.areaId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, areaId: value, projectId: '' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project">Interested Project</Label>
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
                    {availableProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) =>
                    setFormData({ ...formData, source: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {leadSources
                      .filter((s) => s.isActive)
                      .map((source) => (
                        <SelectItem key={source.id} value={source.label}>
                          {source.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Select
                  value={formData.assignedTo}
                  onValueChange={(value) =>
                    setFormData({ ...formData, assignedTo: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sales rep" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeSalesReps.map((rep) => (
                      <SelectItem key={rep.id} value={rep.id}>
                        {rep.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as Lead['status'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="followUp">Follow Up</Label>
                <Select
                  value={formData.followUp}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      followUp: value as Lead['followUp'],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="no-answer">No Answer</SelectItem>
                    <SelectItem value="callback">Callback</SelectItem>
                  </SelectContent>
                </Select>
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
              <Button type="submit">Add Lead</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
