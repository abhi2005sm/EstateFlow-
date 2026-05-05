export const adminDashboardData = {
  overview: {
    totalBuildings: 12,
    residentialBuildings: 8,
    commercialBuildings: 4,
    totalUnits: 150,
    occupiedUnits: 135,
    vacantUnits: 15,
  },
  rentSummary: {
    totalRentCollected: 125000,
    totalRentDue: 15000,
    paidUnits: 120,
    unpaidUnits: 15,
  },
  charts: {
    occupancy: [
      { name: 'Occupied', value: 135, fill: '#10b981' },
      { name: 'Vacant', value: 15, fill: '#ef4444' }
    ],
    rentStatus: [
      { name: 'Paid', value: 120, fill: '#3b82f6' },
      { name: 'Unpaid', value: 15, fill: '#f59e0b' }
    ],
    buildingTypes: [
      { name: 'Residential', value: 8, fill: '#8b5cf6' },
      { name: 'Commercial', value: 4, fill: '#ec4899' }
    ]
  },
  defaulters: [
    { id: '1', name: 'John Smith', phone: '+1 555-0101', buildingName: 'Sunset Apartments', dueAmount: 1200 },
    { id: '2', name: 'Sarah Connor', phone: '+1 555-0102', buildingName: 'Ocean View', dueAmount: 1500 },
    { id: '3', name: 'Michael Bay', phone: '+1 555-0103', buildingName: 'Downtown Lofts', dueAmount: 2100 },
  ]
};