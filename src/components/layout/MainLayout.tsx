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
      <main className={cn("min-h-screen", isRTL ? "pr-64" : "pl-64")}>
        <div className="min-h-screen p-6">{children}</div>
      </main>
    </div>
  );
}
