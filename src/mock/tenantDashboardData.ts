export const tenantDashboardData = {
  overview: {
    totalRent: 1500,
    paidAmount: 1500,
    dueAmount: 0,
    nextDueDate: '2026-06-01'
  },
  feesBreakdown: [
    { id: 'f1', name: 'Maintenance Fees', amount: 100, status: 'Paid' },
    { id: 'f2', name: 'Electricity Fees', amount: 50, status: 'Paid' },
    { id: 'f3', name: 'Water Fees', amount: 30, status: 'Unpaid' }
  ],
  paymentStatus: {
    paidUnits: 2,
    pendingPayments: 1
  },
  paymentHistory: [
    { id: 'h1', serialNumber: 1, feeType: 'Rent', amount: 1500, date: '2026-05-01', status: 'Paid' },
    { id: 'h2', serialNumber: 2, feeType: 'Maintenance', amount: 100, date: '2026-05-01', status: 'Paid' },
    { id: 'h3', serialNumber: 3, feeType: 'Water', amount: 30, date: '2026-05-05', status: 'Pending' }
  ]
};