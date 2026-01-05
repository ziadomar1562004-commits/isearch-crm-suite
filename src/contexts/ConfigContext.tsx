import { createContext, useContext, useState, ReactNode } from 'react';
import { ConfigOption, User } from '@/types/crm';

interface ConfigContextType {
  leadSources: ConfigOption[];
  unitTypes: ConfigOption[];
  salesReps: User[];
  addLeadSource: (label: string) => void;
  removeLeadSource: (id: string) => void;
  addUnitType: (label: string) => void;
  removeUnitType: (id: string) => void;
  addSalesRep: (user: Omit<User, 'id' | 'createdAt'>) => void;
  removeSalesRep: (id: string) => void;
  toggleSalesRepStatus: (id: string) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const defaultLeadSources: ConfigOption[] = [
  { id: '1', label: 'Facebook', isActive: true },
  { id: '2', label: 'Instagram', isActive: true },
  { id: '3', label: 'Website', isActive: true },
  { id: '4', label: 'Referral', isActive: true },
  { id: '5', label: 'Property Exhibition', isActive: true },
  { id: '6', label: 'Walk-in', isActive: true },
  { id: '7', label: 'OLX', isActive: true },
  { id: '8', label: 'TikTok', isActive: true },
  { id: '9', label: 'Google Ads', isActive: true },
];

const defaultUnitTypes: ConfigOption[] = [
  { id: '1', label: 'Studio', isActive: true },
  { id: '2', label: '1 BR', isActive: true },
  { id: '3', label: '2 BR', isActive: true },
  { id: '4', label: '3 BR', isActive: true },
  { id: '5', label: '4 BR', isActive: true },
  { id: '6', label: 'Penthouse', isActive: true },
  { id: '7', label: 'Duplex', isActive: true },
  { id: '8', label: 'Townhouse', isActive: true },
  { id: '9', label: 'Villa', isActive: true },
  { id: '10', label: 'Twin House', isActive: true },
];

const defaultSalesReps: User[] = [
  {
    id: 'sales-1',
    name: 'Ahmed Sales',
    email: 'ahmed@isearch.com',
    phone: '+20 100 111 1111',
    role: 'sales',
    isActive: true,
    createdAt: new Date('2024-01-02'),
  },
  {
    id: 'sales-2',
    name: 'Sara Sales',
    email: 'sara@isearch.com',
    phone: '+20 100 222 2222',
    role: 'sales',
    isActive: true,
    createdAt: new Date('2024-01-03'),
  },
  {
    id: 'sales-3',
    name: 'Mohamed Hassan',
    email: 'mohamed@isearch.com',
    phone: '+20 100 333 3333',
    role: 'sales',
    isActive: true,
    createdAt: new Date('2024-01-04'),
  },
];

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [leadSources, setLeadSources] = useState<ConfigOption[]>(() => {
    const saved = localStorage.getItem('leadSources');
    return saved ? JSON.parse(saved) : defaultLeadSources;
  });

  const [unitTypes, setUnitTypes] = useState<ConfigOption[]>(() => {
    const saved = localStorage.getItem('unitTypes');
    return saved ? JSON.parse(saved) : defaultUnitTypes;
  });

  const [salesReps, setSalesReps] = useState<User[]>(() => {
    const saved = localStorage.getItem('salesReps');
    return saved ? JSON.parse(saved) : defaultSalesReps;
  });

  const saveLeadSources = (sources: ConfigOption[]) => {
    setLeadSources(sources);
    localStorage.setItem('leadSources', JSON.stringify(sources));
  };

  const saveUnitTypes = (types: ConfigOption[]) => {
    setUnitTypes(types);
    localStorage.setItem('unitTypes', JSON.stringify(types));
  };

  const saveSalesReps = (reps: User[]) => {
    setSalesReps(reps);
    localStorage.setItem('salesReps', JSON.stringify(reps));
  };

  const addLeadSource = (label: string) => {
    const newSource: ConfigOption = {
      id: Date.now().toString(),
      label,
      isActive: true,
    };
    saveLeadSources([...leadSources, newSource]);
  };

  const removeLeadSource = (id: string) => {
    saveLeadSources(leadSources.filter((s) => s.id !== id));
  };

  const addUnitType = (label: string) => {
    const newType: ConfigOption = {
      id: Date.now().toString(),
      label,
      isActive: true,
    };
    saveUnitTypes([...unitTypes, newType]);
  };

  const removeUnitType = (id: string) => {
    saveUnitTypes(unitTypes.filter((t) => t.id !== id));
  };

  const addSalesRep = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newRep: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    saveSalesReps([...salesReps, newRep]);
  };

  const removeSalesRep = (id: string) => {
    saveSalesReps(salesReps.filter((r) => r.id !== id));
  };

  const toggleSalesRepStatus = (id: string) => {
    saveSalesReps(
      salesReps.map((r) =>
        r.id === id ? { ...r, isActive: !r.isActive } : r
      )
    );
  };

  return (
    <ConfigContext.Provider
      value={{
        leadSources,
        unitTypes,
        salesReps,
        addLeadSource,
        removeLeadSource,
        addUnitType,
        removeUnitType,
        addSalesRep,
        removeSalesRep,
        toggleSalesRepStatus,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
