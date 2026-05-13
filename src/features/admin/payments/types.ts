export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Declined';
export type PaymentStatus = 'Paid' | 'Unpaid' | 'Partial';

export interface PaymentRequest {
  id: number;
  payment_id?: number; // Backend compatibility
  tenant_name: string;
  unit_id: string;
  unit_code?: string; // Backend compatibility
  fee_type: string;
  rent_month: string;
  rent_year: number;
  amount: string | number;
  due_amount?: string | number;
  payment_method: string;
  transaction_id: string;
  approval_status: ApprovalStatus;
  status: PaymentStatus;
  due_date: string | null;
  payment_date: string | null;
  created_at: string;
  tenant: number;
}
