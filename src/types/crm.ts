export type UserRole = 'admin' | 'sales';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'negotiation' | 'closed';
  followUp: 'pending' | 'scheduled' | 'completed' | 'no-answer' | 'callback';
  source: string;
  areaId?: string;
  areaName?: string;
  projectId?: string;
  projectName?: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  developer: string;
  areaId: string;
  areaName: string;
  totalUnits: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  createdAt: Date;
}

export interface Area {
  id: string;
  name: string;
  city: string;
  createdAt: Date;
}

export interface Unit {
  id: string;
  projectId: string;
  projectName: string;
  areaId: string;
  areaName: string;
  unitNumber: string;
  type: string;
  size: number;
  price: number;
  ownerName: string;
  ownerPhone: string;
  photos: string[];
  status: 'available' | 'reserved' | 'sold';
  createdAt: Date;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface ConfigOption {
  id: string;
  label: string;
  isActive: boolean;
}

export interface CRMConfig {
  leadSources: ConfigOption[];
  unitTypes: ConfigOption[];
  salesReps: User[];
}

export interface AreaInsight {
  areaId: string;
  areaName: string;
  leadsCount: number;
  projectsCount: number;
  unitsCount: number;
}
