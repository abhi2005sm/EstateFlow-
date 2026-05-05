export interface Building {
  id: string;
  serialNumber: number;
  name: string;
  type: string;
  totalUnits: number;
  rentPaid: number;
  rentDue: number;
}

export interface Tenant {
  id: string;
  serialNumber: number;
  name: string;
  floorNumber: number;
  phone: string;
  rentStatus: string;
  dueAmount: number;
}