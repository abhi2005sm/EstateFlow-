import { apiRequest } from './api';

// 1. Fetch Units (Supports ?status=past)
export const getUnitsByBuilding = async (buildingId: number | string, status: 'active' | 'past' = 'active') => {
  return await apiRequest(`/users/buildings/${buildingId}/units/?status=${status}`, {
    method: 'GET',
  });
};

// 2. Add New Unit
export const createUnit = async (buildingId: number | string, unitData: any) => {
  return await apiRequest(`/users/buildings/${buildingId}/units/`, {
    method: 'POST',
    body: JSON.stringify(unitData),
  });
};

// 3. Update Existing Unit
export const updateUnit = async (unitCode: string, unitData: any) => {
  return await apiRequest(`/users/units/${unitCode}/`, {
    method: 'PATCH',
    body: JSON.stringify(unitData),
  });
};

// 4. Soft Delete Unit
export const deleteUnit = async (unitCode: string) => {
  return await apiRequest(`/users/units/${unitCode}/`, {
    method: 'DELETE',
  });
};
