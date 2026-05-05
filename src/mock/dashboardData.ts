export const dashboardData = {
  buildings: 20,
  tenants: 150,
  activeUsers: 135,
  expiredUsers: 10,
  expiringSoon: 5,
  occupied: 120,
  vacant: 30,
  revenue: 950000,
  fees: {
    maintenance: 45000,
    electricity: 15000,
    water: 10000
  },
  revenueHistory: [
    { name: 'Jan', revenue: 75000 },
    { name: 'Feb', revenue: 80000 },
    { name: 'Mar', revenue: 85000 },
    { name: 'Apr', revenue: 82000 },
    { name: 'May', revenue: 90000 },
    { name: 'Jun', revenue: 95000 }
  ],
  occupancyStats: [
    { name: 'Occupied', value: 120, fill: '#3b82f6' },
    { name: 'Vacant', value: 30, fill: '#ef4444' }
  ],
  userStats: [
    { name: 'Active', value: 135, fill: '#10b981' },
    { name: 'Expiring Soon', value: 5, fill: '#f59e0b' },
    { name: 'Expired', value: 10, fill: '#ef4444' }
  ]
};

export const expiringSoonList = [
  { id: 1, name: 'Alice Smith', property: 'Sunset Apartments', daysLeft: 5 },
  { id: 2, name: 'Bob Johnson', property: 'Ocean View Complex', daysLeft: 12 },
  { id: 3, name: 'Charlie Davis', property: 'Downtown Lofts', daysLeft: 15 },
  { id: 4, name: 'Eve Miller', property: 'Green Valley Estates', daysLeft: 20 },
];
