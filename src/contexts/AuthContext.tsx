import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types/crm';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users - in production, this would come from a database
const demoUsers: (User & { password: string })[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@isearch.com',
    phone: '+20 100 000 0000',
    role: 'admin',
    isActive: true,
    password: 'admin123',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'sales-1',
    name: 'Ahmed Sales',
    email: 'ahmed@isearch.com',
    phone: '+20 100 111 1111',
    role: 'sales',
    isActive: true,
    password: 'sales123',
    createdAt: new Date('2024-01-02'),
  },
  {
    id: 'sales-2',
    name: 'Sara Sales',
    email: 'sara@isearch.com',
    phone: '+20 100 222 2222',
    role: 'sales',
    isActive: true,
    password: 'sales123',
    createdAt: new Date('2024-01-03'),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const isAdmin = currentUser?.role === 'admin';

  const login = (email: string, password: string): boolean => {
    const user = demoUsers.find(
      (u) => u.email === email && u.password === password && u.isActive
    );
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { demoUsers };
