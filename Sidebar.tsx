import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  MapPin,
  Home,
  Search,
  Settings,
  LogOut,
  Shield,
  User,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Projects', href: '/projects', icon: Building2 },
  { name: 'Areas', href: '/areas', icon: MapPin },
  { name: 'Units', href: '/units', icon: Home },
];

const adminNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAdmin, logout } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={cn(
      "fixed inset-y-0 z-50 flex w-64 flex-col bg-sidebar",
      isRTL ? "right-0" : "left-0"
    )}>
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
          <Search className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-sidebar-foreground">
          i<span className="text-primary">Search</span>
        </span>
      </div>

      {/* User Info */}
      {currentUser && (
        <div className="border-b border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent">
              <User className="h-5 w-5 text-sidebar-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {currentUser.name}
              </p>
              <Badge
                variant="outline"
                className={cn(
                  'mt-1 text-xs',
                  isAdmin
                    ? 'border-primary/50 text-primary'
                    : 'border-sidebar-muted text-sidebar-foreground/70'
                )}
              >
                {isAdmin ? (
                  <>
                    <Shield className="mr-1 h-3 w-3" />
                    Admin
                  </>
                ) : (
                  'Sales Rep'
                )}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const navKey = `nav.${item.name.toLowerCase()}`;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {t(navKey)}
            </Link>
          );
        })}

        {/* Admin-only navigation */}
        {isAdmin && (
          <>
            <div className="my-4 border-t border-sidebar-border" />
            <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              Admin
            </p>
            {adminNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-primary'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4 space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-xs font-medium text-sidebar-foreground/70">
            <Globe className="h-3.5 w-3.5" />
            <span>{language === 'en' ? 'Language' : 'اللغة'}</span>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={() => setLanguage('en')}
              className={cn(
                "text-[10px] px-2 py-0.5 rounded transition-colors",
                language === 'en' ? "bg-primary text-primary-foreground" : "text-sidebar-foreground/50 hover:bg-sidebar-accent"
              )}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('ar')}
              className={cn(
                "text-[10px] px-2 py-0.5 rounded transition-colors",
                language === 'ar' ? "bg-primary text-primary-foreground" : "text-sidebar-foreground/50 hover:bg-sidebar-accent"
              )}
            >
              AR
            </button>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {language === 'en' ? 'Sign Out' : 'تسجيل الخروج'}
        </Button>
      </div>
    </aside>
  );
}
