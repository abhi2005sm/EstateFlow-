// Shared API request utility
import { apiRequest } from '@/src/features/api/api';

export interface Owner {
  id: number;
  owner_id: string;
  name: string;
  email: string;
  phone_number: string;
  is_active: boolean;
  total_buildings: number;
  residential_count: number;
  commercial_count: number;
  city?: string;
  state?: string;
  area_name?: string;
  zip_code?: string;
}

export interface GetOwnersResponse {
  summary: {
    total_owners: number;
  };
  owners: Owner[];
}

export interface OwnerRegistrationData {
  email: string;
  name: string;
  phone_number: string;
  area_name: string;
  city: string;
  state: string;
  zip_code: string;
}

export const superAdminApi = {
  // GET OWNERS
  getOwners: async (): Promise<GetOwnersResponse> => {
    return apiRequest("/users/super-admin/owners/", {
      method: "GET",
    });
  },

  // ADD OWNER
  addOwner: async (data: OwnerRegistrationData) => {
    return apiRequest("/auth/register/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};