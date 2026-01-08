import { Sidebar } from './Sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { NotificationBell } from '@/components/NotificationBell';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isRTL } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className={cn("min-h-screen", isRTL ? "pr-64" : "pl-64")}>
        <div className="min-h-screen p-6">
          <div className={cn("flex justify-end mb-4", isRTL && "flex-row-reverse")}>
            <NotificationBell />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
