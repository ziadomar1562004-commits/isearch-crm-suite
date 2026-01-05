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
  assignedTo?: string; // Sales rep ID
  assignedToName?: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  developer: string;
  location: string;
  totalUnits: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  createdAt: Date;
}

export interface Area {
  id: string;
  name: string;
  city: string;
  projectCount: number;
  createdAt: Date;
}

export interface Unit {
  id: string;
  projectId: string;
  projectName: string;
  unitNumber: string;
  type: string;
  size: number;
  price: number;
  ownerName: string;
  ownerPhone: string;
  status: 'available' | 'reserved' | 'sold';
  createdAt: Date;
}

// Configurable options
export interface ConfigOption {
  id: string;
  label: string;
  isActive: boolean;
}

export interface CRMConfig {
  leadSources: ConfigOption[];
  unitTypes: ConfigOption[];
}
