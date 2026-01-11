import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Lead } from '@/types/crm';
import { MessageCircle, RotateCcw } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

export default function Archive() {
  const { leads, updateLead } = useData();
  const { currentUser, isAdmin } = useAuth();
  const { toast } = useToast();

  // Filter archived leads
  const archivedLeads = isAdmin
    ? leads.filter(lead => lead.status === 'archived')
    : leads.filter(lead => lead.status === 'archived' && (lead.assignedTo === currentUser?.id || !lead.assignedTo));

  const handleWhatsAppClick = (phone: string) => {
    const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+/, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const handleRestore = (lead: Lead) => {
    updateLead(lead.id, { status: 'new' });
    toast({
      title: 'Lead Restored',
      description: `${lead.name} has been restored to active leads.`,
    });
  };

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
                  handleRestore(lead);
                }}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Restore Lead</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Archive"
        description={`${archivedLeads.length} archived leads`}
      />

      <div className="animate-fade-in">
        {archivedLeads.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No archived leads
          </div>
        ) : (
          <DataTable columns={columns} data={archivedLeads} />
        )}
      </div>
    </MainLayout>
  );
}