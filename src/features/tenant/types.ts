export interface PaymentRecord {
  id: string;
  serialNumber: number;
  feeType: string;
  amount: number;
  dueDate?: string;
  date?: string;
  status: 'Paid' | 'Unpaid' | 'Pending';
}

export interface FeeBreakdown {
  id: string;
  name: string;
  amount: number;
  status: 'Paid' | 'Unpaid';
}