import { Sidebar } from './Sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isRTL } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className={cn(
        "transition-all duration-200",
        isRTL ? "pr-64 pl-0" : "pl-64 pr-0"
      )}>
        <div className="min-h-screen p-6">{children}</div>
      </main>
    </div>
  );
}
