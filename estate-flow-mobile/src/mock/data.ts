export interface Building {
  id: string;
  serialNumber: number;
  name: string;
  type: 'Residential' | 'Commercial';
  totalUnits: number;
  occupiedUnits: number;
  rentPaid: number;
  rentDue: number;
  address: string;
  units?: any[];
}

export interface Tenant {
  id: string;
  serialNumber: number;
  name: string;
  unit: string;
  buildingId: string;
  buildingName: string;
  phone: string;
  email: string;
  rentAmount: number;
  rentStatus: 'Paid' | 'Unpaid';
  dueAmount: number;
  moveInDate: string;
  complainRate: number;
}

export interface PaymentHistory {
  id: string;
  tenantName: string;
  feeType: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending';
}

export interface MaintenanceRequest {
  id: string;
  tenantName: string;
  unit: string;
  title: string;
  description: string;
  category: 'Plumbing' | 'Electrical' | 'HVAC' | 'Appliance' | 'Other';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Resolved';
  date: string;
}

export interface Visitor {
  id: string;
  visitor_name: string;
  visitor_phone: string;
  purpose: string;
  unit: string;
  tenant_name: string;
  tenant_id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  security_staff: string;
}

export interface SecurityStaff {
  id: string;
  name: string;
  status: 'On Duty' | 'Off Duty';
  role?: string;
}

export const securityStaffData: SecurityStaff[] = [
  { id: 's1', name: 'Alexander G.', status: 'On Duty' },
  { id: 's2', name: 'Marcus V.', status: 'Off Duty' },
  { id: 's3', name: 'Devendra K.', status: 'Off Duty' },
];

export const buildingsData: Building[] = [
  { id: 'b1', serialNumber: 1, name: 'Sunset Apartments', type: 'Residential', totalUnits: 40, occupiedUnits: 36, rentPaid: 45000, rentDue: 5000, address: '102 Sunset Blvd, Los Angeles' },
  { id: 'b2', serialNumber: 2, name: 'Ocean View Condos', type: 'Residential', totalUnits: 60, occupiedUnits: 55, rentPaid: 55000, rentDue: 2500, address: '405 Pacific Ave, Santa Monica' },
  { id: 'b3', serialNumber: 3, name: 'Downtown Plaza', type: 'Commercial', totalUnits: 10, occupiedUnits: 8, rentPaid: 15000, rentDue: 0, address: '888 Broadway, New York' },
  { id: 'b4', serialNumber: 4, name: 'Tech Hub Park', type: 'Commercial', totalUnits: 15, occupiedUnits: 12, rentPaid: 25000, rentDue: 5000, address: 'Silicon Valley Way, San Jose' },
];

export const tenantsData: Tenant[] = [
  { id: 't1', serialNumber: 1, name: 'Alice Walker', unit: 'Apt 101', buildingId: 'b1', buildingName: 'Sunset Apartments', phone: '+1 555-1001', email: 'alice@example.com', rentAmount: 1200, rentStatus: 'Paid', dueAmount: 0, moveInDate: '24 May 2024', complainRate: 100 },
  { id: 't2', serialNumber: 2, name: 'John Smith', unit: 'Apt 202', buildingId: 'b1', buildingName: 'Sunset Apartments', phone: '+1 555-0101', email: 'john@example.com', rentAmount: 1200, rentStatus: 'Unpaid', dueAmount: 1200, moveInDate: '12 Jan 2024', complainRate: 60 },
  { id: 't3', serialNumber: 3, name: 'Sarah Miller', unit: 'Apt 105', buildingId: 'b1', buildingName: 'Sunset Apartments', phone: '+1 555-0105', email: 'sarah.m@example.com', rentAmount: 1200, rentStatus: 'Paid', dueAmount: 0, moveInDate: '15 Feb 2024', complainRate: 85 },
  { id: 't4', serialNumber: 4, name: 'Robert Fox', unit: 'Apt 208', buildingId: 'b1', buildingName: 'Sunset Apartments', phone: '+1 555-0109', email: 'robert@example.com', rentAmount: 1400, rentStatus: 'Unpaid', dueAmount: 1400, moveInDate: '20 Mar 2024', complainRate: 40 },
  { id: 't5', serialNumber: 5, name: 'Sarah Connor', unit: 'Apt 102', buildingId: 'b2', buildingName: 'Ocean View Condos', phone: '+1 555-0102', email: 'sarah@example.com', rentAmount: 1500, rentStatus: 'Unpaid', dueAmount: 1500, moveInDate: '01 Jan 2024', complainRate: 90 },
  { id: 't6', serialNumber: 6, name: 'Bruce Wayne', unit: 'Penthouse', buildingId: 'b2', buildingName: 'Ocean View Condos', phone: '+1 555-1002', email: 'bruce@example.com', rentAmount: 2500, rentStatus: 'Paid', dueAmount: 0, moveInDate: '10 Nov 2023', complainRate: 100 },
];

export const paymentHistoryData: PaymentHistory[] = [
  { id: 'h1', tenantName: 'Alice Walker', feeType: 'Rent', amount: 1200, date: '2026-05-01', status: 'Paid' },
  { id: 'h2', tenantName: 'Bruce Wayne', feeType: 'Rent', amount: 2500, date: '2026-05-01', status: 'Paid' },
  { id: 'h3', tenantName: 'John Smith', feeType: 'Maintenance', amount: 100, date: '2026-05-01', status: 'Paid' },
];

export const maintenanceRequestsData: MaintenanceRequest[] = [
  { id: 'r1', tenantName: 'John Smith', unit: 'Sunset Apartments, Apt 202', title: 'Leaky Kitchen Pipe', description: 'Water is slowly leaking from the kitchen sink drainage pipe. It is pooling under the cabinet.', category: 'Plumbing', priority: 'High', status: 'Pending', date: '2026-06-08' },
  { id: 'r2', tenantName: 'Alice Walker', unit: 'Sunset Apartments, Apt 101', title: 'AC Filter Replacement', description: 'AC is not cooling effectively. Requires filter cleaning or replacing.', category: 'HVAC', priority: 'Medium', status: 'In Progress', date: '2026-06-09' },
  { id: 'r3', tenantName: 'Sarah Connor', unit: 'Ocean View Condos, Apt 102', title: 'Flickering Balcony Light', description: 'The light fixture on the balcony keeps flickering when switched on.', category: 'Electrical', priority: 'Low', status: 'Resolved', date: '2026-06-05' },
];

export const visitorsData: Visitor[] = [
  { id: 'v1', visitor_name: 'Mark Zuckerberg', visitor_phone: '+1 555-9999', purpose: 'Guest Visit', unit: 'Penthouse', tenant_name: 'Bruce Wayne', tenant_id: 't6', status: 'APPROVED', created_at: new Date().toISOString(), security_staff: 'Alexander G.' },
  { id: 'v2', visitor_name: 'Amazon Delivery', visitor_phone: '+1 555-8888', purpose: 'Delivery', unit: 'Apt 202', tenant_name: 'John Smith', tenant_id: 't2', status: 'PENDING', created_at: new Date().toISOString(), security_staff: 'Alexander G.' },
];

export interface Owner {
  id: string;
  name: string;
  totalBuildings: number;
  residentialCount: number;
  commercialCount: number;
  isActive: boolean;
  email: string;
}

export const ownersData: Owner[] = [
  { id: 'o1', name: 'Richard Hendricks', totalBuildings: 2, residentialCount: 2, commercialCount: 0, isActive: true, email: 'richard@hooli.xyz' },
  { id: 'o2', name: 'Erlich Bachman', totalBuildings: 1, residentialCount: 1, commercialCount: 0, isActive: true, email: 'erlich@bachmanity.com' },
  { id: 'o3', name: 'Laurie Bream', totalBuildings: 1, residentialCount: 0, commercialCount: 1, isActive: true, email: 'laurie@raviga.com' },
  { id: 'o4', name: 'Russ Hanneman', totalBuildings: 0, residentialCount: 0, commercialCount: 0, isActive: false, email: 'russ@threecomma.club' },
];
