export const tenantsData: Record<string, any[]> = {
  'b1': [
    { id: 't1', serialNumber: 1, name: 'Alice Walker', floorNumber: 1, phone: '+1 555-1001', rentAmount: 1200, rentStatus: 'Paid', dueAmount: 0 },
    { id: 't2', serialNumber: 2, name: 'John Smith', floorNumber: 2, phone: '+1 555-0101', rentAmount: 1200, rentStatus: 'Unpaid', dueAmount: 1200 },
  ],
  'b2': [
    { id: 't3', serialNumber: 1, name: 'Sarah Connor', floorNumber: 1, phone: '+1 555-0102', rentAmount: 1500, rentStatus: 'Unpaid', dueAmount: 1500 },
    { id: 't4', serialNumber: 2, name: 'Bruce Wayne', floorNumber: 5, phone: '+1 555-1002', rentAmount: 2500, rentStatus: 'Paid', dueAmount: 0 },
  ],
  'b3': [
    { id: 't5', serialNumber: 1, name: 'Acme Corp', floorNumber: 1, phone: '+1 555-2001', rentAmount: 3000, rentStatus: 'Paid', dueAmount: 0 },
  ],
  'b4': [
    { id: 't6', serialNumber: 1, name: 'Global Tech', floorNumber: 2, phone: '+1 555-3001', rentAmount: 5000, rentStatus: 'Unpaid', dueAmount: 5000 },
  ]
};