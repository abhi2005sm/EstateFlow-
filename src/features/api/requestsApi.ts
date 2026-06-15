import { apiRequest } from './api';

// 1. The GET request to fetch the list on page load
export const fetchOwnerRequests = async () => {
  return await apiRequest('/users/owners/maintenance/', {
    method: 'GET',
  });
};

// 2. The PATCH request to update status and reply
export const updateMaintenanceRequest = async (requestId: number, status: string, reply: string) => {
  return await apiRequest(`/users/owners/maintenance/${requestId}/`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: status,
      owner_reply: reply
    })
  });
};
