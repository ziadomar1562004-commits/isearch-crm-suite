export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'negotiation' | 'closed';
  source: string;
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
  type: 'studio' | '1br' | '2br' | '3br' | 'penthouse' | 'villa';
  size: number;
  price: number;
  ownerName: string;
  ownerPhone: string;
  status: 'available' | 'reserved' | 'sold';
  createdAt: Date;
}
