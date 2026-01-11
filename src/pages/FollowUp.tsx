import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Lead } from '@/types/crm';
import { MessageCircle, Edit2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';

export default function FollowUp() {
  const { leads, updateLead } = useData();
  const { currentUser, isAdmin } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusFormData, setStatusFormData] = useState({
    status: 'new' as Lead['status'],
    followUp: 'pending' as Lead['followUp'],
  });

  // Filter leads with scheduled follow-up
  const followUpLeads = isAdmin
    ? leads.filter(lead => lead.followUp === 'scheduled')
    : leads.filter(lead => lead.followUp === 'scheduled' && (lead.assignedTo === currentUser?.id || !lead.assignedTo));

  const handleWhatsAppClick = (phone: string) => {
    const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+/, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const handleEditStatus = (lead: Lead) => {
    setSelectedLead(lead);
    setStatusFormData({
      status: lead.status,
      followUp: lead.followUp,
    });
    setIsStatusDialogOpen(true);
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    updateLead(selectedLead.id, {
      status: statusFormData.status,
      followUp: statusFormData.followUp,
    });

    if (statusFormData.followUp === 'completed') {
      addNotification({
        title: 'Follow Up Completed',
        message: `Follow up for ${selectedLead.name} has been completed.`,
        type: 'follow_up',
        leadId: selectedLead.id,
      });
    }

    setIsStatusDialogOpen(false);
    setSelectedLead(null);
    toast({
      title: 'Lead Updated',
      description: `Status updated for ${selectedLead.name}.`,
    });
  };

  const columns = [
    { header: 'Name', accessor: 'name' as const },
    { header: 'Phone', accessor: 'phone' as const },
    { header: 'Area', accessor: 'areaName' as const },
    { header: 'Project', accessor: 'projectName' as const },
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
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWhatsAppClick(lead.phone);
                }}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Contact via WhatsApp</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary hover:text-primary/80 hover:bg-primary/10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditStatus(lead);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Change Status</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Follow Up"
        description={`${followUpLeads.length} leads requiring follow up`}
      />

      <div className="animate-fade-in">
        <DataTable columns={columns} data={followUpLeads} />
      </div>

      {/* Change Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Lead Status</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleStatusSubmit} className="space-y-4">
            {selectedLead && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{selectedLead.name}</p>
                <p className="text-sm text-muted-foreground">{selectedLead.phone}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="editStatus">Status</Label>
              <Select
                value={statusFormData.status}
                onValueChange={(value) =>
                  setStatusFormData({ ...statusFormData, status: value as Lead['status'] })
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
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editFollowUp">Follow Up</Label>
              <Select
                value={statusFormData.followUp}
                onValueChange={(value) =>
                  setStatusFormData({
                    ...statusFormData,
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

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsStatusDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Status</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}