import { cn } from '@/lib/utils';

type StatusType = 
  | 'new' | 'contacted' | 'qualified' | 'negotiation' | 'closed'
  | 'upcoming' | 'ongoing' | 'completed'
  | 'available' | 'reserved' | 'sold'
  | 'pending' | 'scheduled' | 'no-answer' | 'callback';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  // Lead statuses
  new: { label: 'New', className: 'bg-primary/10 text-primary' },
  contacted: { label: 'Contacted', className: 'bg-warning/10 text-warning' },
  qualified: { label: 'Qualified', className: 'bg-accent/10 text-accent' },
  negotiation: { label: 'Negotiation', className: 'bg-purple-500/10 text-purple-600' },
  closed: { label: 'Closed', className: 'bg-success/10 text-success' },
  // Follow-up statuses
  pending: { label: 'Pending', className: 'bg-orange-500/10 text-orange-600' },
  scheduled: { label: 'Scheduled', className: 'bg-blue-500/10 text-blue-600' },
  completed: { label: 'Completed', className: 'bg-success/10 text-success' },
  'no-answer': { label: 'No Answer', className: 'bg-destructive/10 text-destructive' },
  callback: { label: 'Callback', className: 'bg-violet-500/10 text-violet-600' },
  // Project statuses
  upcoming: { label: 'Upcoming', className: 'bg-primary/10 text-primary' },
  ongoing: { label: 'Ongoing', className: 'bg-warning/10 text-warning' },
  // Unit statuses
  available: { label: 'Available', className: 'bg-success/10 text-success' },
  reserved: { label: 'Reserved', className: 'bg-warning/10 text-warning' },
  sold: { label: 'Sold', className: 'bg-muted text-muted-foreground' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
