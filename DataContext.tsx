import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Lead, Project, Area, Unit, AreaInsight } from '@/types/crm';

interface DataContextType {
  // Data
  leads: Lead[];
  projects: Project[];
  areas: Area[];
  units: Unit[];
  
  // Lead actions
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  
  // Project actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'areaName'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Area actions
  addArea: (area: Omit<Area, 'id' | 'createdAt'>) => void;
  updateArea: (id: string, area: Partial<Area>) => void;
  deleteArea: (id: string) => void;
  
  // Unit actions
  addUnit: (unit: Omit<Unit, 'id' | 'createdAt' | 'areaId' | 'areaName' | 'projectName'> & { projectId: string }) => void;
  updateUnit: (id: string, unit: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;
  
  // Insights
  areaInsights: AreaInsight[];
  
  // Helpers
  getProjectsByArea: (areaId: string) => Project[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialAreas: Area[] = [
  { id: '1', name: 'New Cairo', city: 'Cairo', createdAt: new Date() },
  { id: '2', name: '6th of October', city: 'Giza', createdAt: new Date() },
  { id: '3', name: 'Sheikh Zayed', city: 'Giza', createdAt: new Date() },
  { id: '4', name: 'New Administrative Capital', city: 'Cairo', createdAt: new Date() },
  { id: '5', name: 'North Coast', city: 'Marsa Matrouh', createdAt: new Date() },
];

const initialProjects: Project[] = [
  { id: '1', name: 'Madinaty', developer: 'Talaat Moustafa Group', areaId: '1', areaName: 'New Cairo', totalUnits: 12000, status: 'ongoing', createdAt: new Date() },
  { id: '2', name: 'Palm Hills October', developer: 'Palm Hills Developments', areaId: '2', areaName: '6th of October', totalUnits: 3500, status: 'ongoing', createdAt: new Date() },
  { id: '3', name: 'Mountain View iCity', developer: 'Mountain View', areaId: '1', areaName: 'New Cairo', totalUnits: 2800, status: 'upcoming', createdAt: new Date() },
  { id: '4', name: 'Zed Towers', developer: 'Ora Developers', areaId: '3', areaName: 'Sheikh Zayed', totalUnits: 1500, status: 'ongoing', createdAt: new Date() },
  { id: '5', name: 'Marassi', developer: 'Emaar', areaId: '5', areaName: 'North Coast', totalUnits: 800, status: 'completed', createdAt: new Date() },
];

const initialLeads: Lead[] = [
  { id: '1', name: 'أحمد محمود', email: 'ahmed.mahmoud@email.com', phone: '+20 100 123 4567', status: 'new', followUp: 'pending', source: 'Facebook', areaId: '1', areaName: 'New Cairo', projectId: '1', projectName: 'Madinaty', assignedTo: 'sales-1', assignedToName: 'Ahmed Sales', createdAt: new Date('2024-01-15') },
  { id: '2', name: 'Sara Hassan', email: 'sara.hassan@email.com', phone: '+20 112 987 6543', status: 'contacted', followUp: 'scheduled', source: 'Referral', areaId: '1', areaName: 'New Cairo', projectId: '3', projectName: 'Mountain View iCity', assignedTo: 'sales-2', assignedToName: 'Sara Sales', createdAt: new Date('2024-01-14') },
  { id: '3', name: 'Mohamed Ali', email: 'mali@email.com', phone: '+20 101 456 7890', status: 'qualified', followUp: 'callback', source: 'Property Exhibition', areaId: '3', areaName: 'Sheikh Zayed', projectId: '4', projectName: 'Zed Towers', assignedTo: 'sales-3', assignedToName: 'Mohamed Hassan', createdAt: new Date('2024-01-13') },
  { id: '4', name: 'Fatma Ibrahim', email: 'fatma.i@email.com', phone: '+20 115 222 3333', status: 'negotiation', followUp: 'completed', source: 'Website', areaId: '5', areaName: 'North Coast', projectId: '5', projectName: 'Marassi', assignedTo: 'sales-1', assignedToName: 'Ahmed Sales', createdAt: new Date('2024-01-12') },
  { id: '5', name: 'Omar Khaled', email: 'omar@email.com', phone: '+20 100 555 6666', status: 'new', followUp: 'pending', source: 'Facebook', areaId: '1', areaName: 'New Cairo', createdAt: new Date('2024-01-11') },
  { id: '6', name: 'Mona Samir', email: 'mona@email.com', phone: '+20 101 777 8888', status: 'contacted', followUp: 'scheduled', source: 'OLX', areaId: '2', areaName: '6th of October', projectId: '2', projectName: 'Palm Hills October', createdAt: new Date('2024-01-10') },
];

const initialUnits: Unit[] = [
  { id: '1', projectId: '1', projectName: 'Madinaty', areaId: '1', areaName: 'New Cairo', unitNumber: 'B7-205', type: '3 BR', size: 185, price: 4500000, ownerName: 'Khaled Mansour', ownerPhone: '+20 100 111 2222', photos: [], status: 'available', finishingStatus: 'fully-finished', paymentMethod: 'cash', createdAt: new Date('2024-01-12') },
  { id: '2', projectId: '2', projectName: 'Palm Hills October', areaId: '2', areaName: '6th of October', unitNumber: 'V-42', type: 'Villa', size: 320, price: 12000000, ownerName: 'Amira El-Sayed', ownerPhone: '+20 112 333 4444', photos: [], status: 'available', finishingStatus: 'semi-finished', paymentMethod: 'installments', installmentPlans: '10% down payment, 7 years installments', createdAt: new Date('2024-01-11') },
  { id: '3', projectId: '3', projectName: 'Mountain View iCity', areaId: '1', areaName: 'New Cairo', unitNumber: 'C3-108', type: '2 BR', size: 140, price: 3200000, ownerName: 'Omar Siddiqui', ownerPhone: '+20 101 555 6666', photos: [], status: 'reserved', finishingStatus: 'core-and-shell', paymentMethod: 'installments', installmentPlans: '5% down payment, 8 years installments', createdAt: new Date('2024-01-10') },
  { id: '4', projectId: '4', projectName: 'Zed Towers', areaId: '3', areaName: 'Sheikh Zayed', unitNumber: 'T1-1802', type: 'Penthouse', size: 280, price: 18500000, ownerName: 'Nadia Fouad', ownerPhone: '+20 115 777 8888', photos: [], status: 'available', finishingStatus: 'fully-finished', paymentMethod: 'cash', createdAt: new Date('2024-01-09') },
  { id: '5', projectId: '5', projectName: 'Marassi', areaId: '5', areaName: 'North Coast', unitNumber: 'CH-15', type: 'Chalet', size: 150, price: 6500000, ownerName: 'Hassan Ahmed', ownerPhone: '+20 100 999 0000', photos: [], status: 'available', finishingStatus: 'fully-finished', paymentMethod: 'installments', installmentPlans: '20% down payment, 6 years installments', createdAt: new Date('2024-01-08') },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('crm_leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });
  
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('crm_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });
  
  const [areas, setAreas] = useState<Area[]>(() => {
    const saved = localStorage.getItem('crm_areas');
    return saved ? JSON.parse(saved) : initialAreas;
  });
  
  const [units, setUnits] = useState<Unit[]>(() => {
    const saved = localStorage.getItem('crm_units');
    return saved ? JSON.parse(saved) : initialUnits;
  });

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('crm_leads', JSON.stringify(leads)); }, [leads]);
  useEffect(() => { localStorage.setItem('crm_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('crm_areas', JSON.stringify(areas)); }, [areas]);
  useEffect(() => { localStorage.setItem('crm_units', JSON.stringify(units)); }, [units]);

  // Calculate area insights
  const areaInsights = useMemo<AreaInsight[]>(() => {
    return areas.map(area => ({
      areaId: area.id,
      areaName: area.name,
      leadsCount: leads.filter(l => l.areaId === area.id).length,
      projectsCount: projects.filter(p => p.areaId === area.id).length,
      unitsCount: units.filter(u => u.areaId === area.id).length,
    })).sort((a, b) => b.leadsCount - a.leadsCount);
  }, [areas, leads, projects, units]);

  // Helper to get projects by area
  const getProjectsByArea = (areaId: string) => {
    return projects.filter(p => p.areaId === areaId);
  };

  // Lead actions
  const addLead = (lead: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = { ...lead, id: Date.now().toString(), createdAt: new Date() };
    setLeads(prev => [newLead, ...prev]);
  };
  
  const updateLead = (id: string, lead: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...lead } : l));
  };
  
  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  // Project actions
  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'areaName'>) => {
    const area = areas.find(a => a.id === project.areaId);
    const newProject: Project = {
      ...project,
      areaName: area?.name || '',
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setProjects(prev => [newProject, ...prev]);
  };
  
  const updateProject = (id: string, project: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...project } : p));
  };
  
  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Area actions
  const addArea = (area: Omit<Area, 'id' | 'createdAt'>) => {
    const newArea: Area = { ...area, id: Date.now().toString(), createdAt: new Date() };
    setAreas(prev => [newArea, ...prev]);
  };
  
  const updateArea = (id: string, area: Partial<Area>) => {
    setAreas(prev => prev.map(a => a.id === id ? { ...a, ...area } : a));
  };
  
  const deleteArea = (id: string) => {
    setAreas(prev => prev.filter(a => a.id !== id));
  };

  // Unit actions
  const addUnit = (unit: Omit<Unit, 'id' | 'createdAt' | 'areaId' | 'areaName' | 'projectName'> & { projectId: string }) => {
    const project = projects.find(p => p.id === unit.projectId);
    const newUnit: Unit = {
      ...unit,
      projectName: project?.name || '',
      areaId: project?.areaId || '',
      areaName: project?.areaName || '',
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setUnits(prev => [newUnit, ...prev]);
  };
  
  const updateUnit = (id: string, unit: Partial<Unit>) => {
    setUnits(prev => prev.map(u => u.id === id ? { ...u, ...unit } : u));
  };
  
  const deleteUnit = (id: string) => {
    setUnits(prev => prev.filter(u => u.id !== id));
  };

  return (
    <DataContext.Provider value={{
      leads, projects, areas, units,
      addLead, updateLead, deleteLead,
      addProject, updateProject, deleteProject,
      addArea, updateArea, deleteArea,
      addUnit, updateUnit, deleteUnit,
      areaInsights,
      getProjectsByArea,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
