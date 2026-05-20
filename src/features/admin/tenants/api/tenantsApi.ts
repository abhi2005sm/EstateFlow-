import { apiRequest } from '@/src/features/api/api';

export interface RegisterTenantPayload {
  email: string;
  name: string;
  phone_number: string;
  unit_code: string;
  tenant_type: string;
  male_count: number;
  female_count: number;
  adult_count: number;
  children_count: number;
  dietary_preference: string;
  pet_details: string;
  occupancy_type: string;
}

export const tenantsApi = {
  registerTenant: (data: RegisterTenantPayload) =>
    apiRequest('/auth/register-tenant/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getTenants: () => apiRequest('/users/tenants/'),
  getTenantsByBuildingId: (buildingId: string | number, status: 'active' | 'past' = 'active') => 
    apiRequest(`/users/buildings/${buildingId}/tenants/?status=${status}`),
  getTenantByUnitCode: (unitCode: string) => apiRequest(`/users/units/${unitCode}/tenant/`),
  getTenantById: (tenantId: number) => apiRequest(`/users/tenants/${tenantId}/`),
  getTenantPaymentHistory: (tenantId: number) => apiRequest(`/users/tenants/${tenantId}/payments/`),
  updateTenant: (tenantId: number, data: any) =>
    apiRequest(`/users/tenants/${tenantId}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteTenant: (tenantId: number) =>
    apiRequest(`/users/tenants/${tenantId}/`, {
      method: 'DELETE',
    }),
};
