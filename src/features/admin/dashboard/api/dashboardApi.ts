import { apiRequest } from '../../../../features/api/api';

export const dashboardApi = {
  getOwnerDashboard: async () => {
    return apiRequest('/users/owner/dashboard/', {
      method: 'GET',
    });
  }
};
