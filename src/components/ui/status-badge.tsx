import { cn } from '@/lib/utils';

type StatusType = 
  | 'new' | 'contacted' | 'qualified' | 'negotiation' | 'closed'
  | 'upcoming' | 'ongoing' | 'completed'
  | 'available' | 'reserved' | 'sold';

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
  // Project statuses
  upcoming: { label: 'Upcoming', className: 'bg-primary/10 text-primary' },
  ongoing: { label: 'Ongoing', className: 'bg-warning/10 text-warning' },
  completed: { label: 'Completed', className: 'bg-success/10 text-success' },
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
