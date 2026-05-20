import { apiRequest } from '../../../../features/api/api';
import { PaymentRequest, ApprovalStatus } from '../types';

export const paymentsApi = {
  getPaymentRequests: async (): Promise<PaymentRequest[]> => {
    // Standard endpoint for listing all payment requests (Admin view)
    return apiRequest('/users/payments/');
  },

  getTenantPayments: async (): Promise<PaymentRequest[]> => {
    // Specifically for the logged-in tenant to see their own payments
    // If /users/payments/ gives 404 for tenants, the backend might expect a different endpoint
    // Fallback to /users/payments/ if this is the only one
    return apiRequest('/users/payments/');
  },

  updatePaymentStatus: async (id: number, status: 'Approved' | 'Declined' | 'Rejected'): Promise<PaymentRequest> => {
    // Owner approve/decline payment
    // Approved: {{bas}}/users/payments/{id}/approve/ -> {"approval_status": "Approved"}
    return apiRequest(`/users/payments/${id}/approve/`, {
      method: 'PATCH',
      body: JSON.stringify({
        approval_status: status
      }),
    });
  },

  submitPayment: async (data: any): Promise<PaymentRequest> => {
    // Standard POST to /users/payments/submit/ for creation
    return apiRequest('/users/payments/submit/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
