export const tenantsData: Record<string, any[]> = {
  'b1': [
    { id: 't1', serialNumber: 1, name: 'Alice Walker', floorNumber: 1, phone: '+1 555-1001', email: 'alice@example.com', rentAmount: 1200, rentStatus: 'Paid', dueAmount: 0, moveInDate: '24 May 2024', members: 2, complainRate: 100 },
    { id: 't2', serialNumber: 2, name: 'John Smith', floorNumber: 2, phone: '+1 555-0101', email: 'john@example.com', rentAmount: 1200, rentStatus: 'Unpaid', dueAmount: 1200, moveInDate: '12 Jan 2024', members: 3, complainRate: 60 },
    { id: 't3', serialNumber: 3, name: 'Sarah Miller', floorNumber: 1, phone: '+1 555-0105', email: 'sarah.m@example.com', rentAmount: 1200, rentStatus: 'Paid', dueAmount: 0, moveInDate: '15 Feb 2024', members: 1, complainRate: 85 },
    { id: 't4', serialNumber: 4, name: 'Robert Fox', floorNumber: 3, phone: '+1 555-0109', email: 'robert@example.com', rentAmount: 1400, rentStatus: 'Unpaid', dueAmount: 1400, moveInDate: '20 Mar 2024', members: 4, complainRate: 40 },
  ],
  'b2': [
    { id: 't5', serialNumber: 1, name: 'Sarah Connor', floorNumber: 1, phone: '+1 555-0102', email: 'sarah@example.com', rentAmount: 1500, rentStatus: 'Unpaid', dueAmount: 1500, moveInDate: '01 Jan 2024', members: 2, complainRate: 90 },
    { id: 't6', serialNumber: 2, name: 'Bruce Wayne', floorNumber: 5, phone: '+1 555-1002', email: 'bruce@example.com', rentAmount: 2500, rentStatus: 'Paid', dueAmount: 0, moveInDate: '10 Nov 2023', members: 1, complainRate: 100 },
  ],
  'b3': [
    { id: 't7', serialNumber: 1, name: 'Acme Corp', floorNumber: 1, phone: '+1 555-2001', email: 'contact@acmecorp.com', rentAmount: 3000, rentStatus: 'Paid', dueAmount: 0, moveInDate: '15 Jun 2023', members: 15, complainRate: 95 },
  ],
  'b4': [
    { id: 't8', serialNumber: 1, name: 'Global Tech', floorNumber: 2, phone: '+1 555-3001', email: 'admin@globaltech.com', rentAmount: 5000, rentStatus: 'Unpaid', dueAmount: 5000, moveInDate: '20 Sep 2023', members: 25, complainRate: 70 },
  ]
};