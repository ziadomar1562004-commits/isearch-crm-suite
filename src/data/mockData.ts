import { Lead, Project, Area, Unit } from '@/types/crm';

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    email: 'ahmed@email.com',
    phone: '+971 50 123 4567',
    status: 'new',
    source: 'Website',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    phone: '+971 55 987 6543',
    status: 'contacted',
    source: 'Referral',
    createdAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    name: 'Mohammed Ali',
    email: 'mali@email.com',
    phone: '+971 52 456 7890',
    status: 'qualified',
    source: 'Property Fair',
    createdAt: new Date('2024-01-13'),
  },
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Marina Heights',
    developer: 'Emaar Properties',
    location: 'Dubai Marina',
    totalUnits: 450,
    status: 'ongoing',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    name: 'Palm Residences',
    developer: 'Nakheel',
    location: 'Palm Jumeirah',
    totalUnits: 200,
    status: 'upcoming',
    createdAt: new Date('2024-01-08'),
  },
];

export const mockAreas: Area[] = [
  {
    id: '1',
    name: 'Dubai Marina',
    city: 'Dubai',
    projectCount: 12,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Downtown Dubai',
    city: 'Dubai',
    projectCount: 8,
    createdAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    name: 'Palm Jumeirah',
    city: 'Dubai',
    projectCount: 15,
    createdAt: new Date('2024-01-03'),
  },
];

export const mockUnits: Unit[] = [
  {
    id: '1',
    projectId: '1',
    projectName: 'Marina Heights',
    unitNumber: 'A-1205',
    type: '2br',
    size: 1450,
    price: 2500000,
    ownerName: 'Khalid Mansour',
    ownerPhone: '+971 50 111 2222',
    status: 'available',
    createdAt: new Date('2024-01-12'),
  },
  {
    id: '2',
    projectId: '1',
    projectName: 'Marina Heights',
    unitNumber: 'B-801',
    type: '1br',
    size: 850,
    price: 1200000,
    ownerName: 'Fatima Al-Rashid',
    ownerPhone: '+971 55 333 4444',
    status: 'available',
    createdAt: new Date('2024-01-11'),
  },
  {
    id: '3',
    projectId: '2',
    projectName: 'Palm Residences',
    unitNumber: 'P-502',
    type: 'penthouse',
    size: 4500,
    price: 15000000,
    ownerName: 'Omar Siddiqui',
    ownerPhone: '+971 52 555 6666',
    status: 'reserved',
    createdAt: new Date('2024-01-10'),
  },
];
