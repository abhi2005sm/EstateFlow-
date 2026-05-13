import { apiRequest } from '@/src/features/api/api';

export interface Unit {
  id: number;
  unit_id: string;
  floor_number: number;
  unit_number: string;
  unit_type: string;
  price: string;
  occupancy_type: string;
  is_occupied: boolean;
  building: number;
}

export interface Building {
  id: number;
  owner: number;
  name: string;
  building_type: string;
  building_id: string;
  total_floors: number;
  total_units: number;
  count_1rk: number;
  count_1bhk: number;
  count_2bhk: number;
  count_3bhk: number;
  price_1rk: string;
  price_1bhk: string;
  price_2bhk: string;
  price_3bhk: string;
  units: Unit[];
  area_name?: string;
  city?: string;
  rentDue?: number;
}

export interface GetBuildingsResponse {
  summary: {
    total_buildings: number;
    residential_count: number;
    commercial_count: number;
    building_names: string[];
  };
  buildings: Building[];
}

export interface FloorData {
  floor_number: number;
  units: {
    unit_number: string;
    unit_type: string;
  }[];
}

export interface CreateBuildingPayload {
  name: string;
  building_type: string;
  total_floors: number;
  price_1rk: number;
  price_1bhk: number;
  price_2bhk: number;
  price_3bhk: number;
  floors_data: FloorData[];
}

export const buildingsApi = {
  createBuilding: (data: CreateBuildingPayload) =>
    apiRequest('/users/buildings/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getBuildings: (): Promise<GetBuildingsResponse> => apiRequest('/users/buildings/'),
  getBuildingById: (id: string): Promise<Building> => apiRequest(`/users/buildings/${id}/`),
};
