// Global API configuration - Using /api proxy to bypass Third-Party Cookie restrictions
const BASE_URL = '/api';

// Helper to get cookie by name
function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  if (!BASE_URL) {
    console.warn('[API] NEXT_PUBLIC_API_URL is not defined in environment variables.');
  }

  const cleanBaseUrl = (BASE_URL || '').replace(/\/$/, '');
  const cleanEndpoint = endpoint.replace(/^\//, '');
  
  // Ensure the endpoint always has a trailing slash for Django/Backend compatibility (ignoring query params)
  let endpointWithSlash = cleanEndpoint;
  const queryIndex = cleanEndpoint.indexOf('?');
  
  if (queryIndex !== -1) {
    const path = cleanEndpoint.substring(0, queryIndex);
    const query = cleanEndpoint.substring(queryIndex);
    const pathWithSlash = path.endsWith('/') ? path : `${path}/`;
    endpointWithSlash = `${pathWithSlash}${query}`;
  } else {
    endpointWithSlash = cleanEndpoint.endsWith('/') ? cleanEndpoint : `${cleanEndpoint}/`;
  }
  
  const url = endpoint.startsWith('http') ? endpoint : `${cleanBaseUrl}/${endpointWithSlash}`;
  
  // Get token from all possible sources
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('access_token') || 
            localStorage.getItem('token') || 
            getCookie('access_token') || 
            getCookie('token');
  }

  // Sanitize token (check for 'undefined' or 'null' as strings)
  if (token === 'undefined' || token === 'null') {
    token = null;
  }

  const headers: any = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log(`[API Request] ${options.method || 'GET'} ${url}`, {
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 10)}...` : 'none'
  });

  // MOCK BACKEND INTERCEPTOR
  // Set to true to use mock data locally without a running backend.
  // Set to false to connect to the real Django API Gateway.
  const USE_MOCK = false;
  if (USE_MOCK) {
    console.log('[MOCK API] Intercepted request to:', url);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (url.includes('/auth/login/')) {
      const body = options.body ? JSON.parse(options.body as string) : {};
      let role = 'superadmin';
      if (body.email?.includes('superadmin')) {
        role = 'superadmin';
      } else if (body.email?.includes('admin')) {
        role = 'admin';
      } else if (body.email?.includes('user') || body.email?.includes('tenant')) {
        role = 'tenant';
      } else if (body.email?.includes('security')) {
        role = 'security';
      }
      
      return {
        access_token: 'mock_token_123',
        email: body.email || 'mock@example.com',
        name: 'Mock User',
        role: role
      };
    }
    
    if (url.includes('/users/owner/dashboard/')) {
      return {
        property_overview: { total_buildings: 12, occupied_units: 135, total_units: 150 },
        rent_summary: { total_collected: 125000, total_due: 15000 },
        lease_alerts: [
          { tenant_name: "John Doe", unit: "101", days_left: 15, renewal_likelihood: "High" },
          { tenant_name: "Jane Smith", unit: "204", days_left: 5, renewal_likelihood: "Low" }
        ],
        monthly_rent_trends: [
          {month: "Jan", collected: 10000, due: 2000},
          {month: "Feb", collected: 12000, due: 1000}
        ]
      };
    }

    if (url.includes('/users/buildings/') && (!options.method || options.method === 'GET')) {
       return {
         summary: { total_buildings: 12, residential_count: 8, commercial_count: 4, building_names: ["Sunset Apartments"] },
         buildings: [
           { id: 1, name: "Sunset Apartments", building_type: "Residential", total_units: 50, units: [] }
         ]
       };
    }

    if (url.includes('/users/owners/maintenance/')) {
      return [
        { request_id: 'REQ-001', tenant_name: 'Alex Johnson', building_name: 'Sunset Apartments', unit_code: '101', issue_title: 'Leaking Faucet', description: 'The kitchen sink faucet is dripping constantly.', status: 'Pending' },
        { request_id: 'REQ-002', tenant_name: 'Maria Garcia', building_name: 'Ocean View', unit_code: '305', issue_title: 'Broken AC', description: 'Air conditioner is making a loud noise and not cooling.', status: 'In Progress' }
      ];
    }

    if (url.includes('/users/tenants/')) {
      return [
        { id: 1, name: 'Alex Johnson', unit_code: '101', vacate_status: 'Active' },
        { id: 2, name: 'David Lee', unit_code: '204', deposit_amount: 1500, vacate_status: 'Pending Confirmation' }
      ];
    }

    // Generic fallback to prevent UI crashes for other endpoints
    // Returning an array by default to prevent .map() errors on unhandled endpoints
    return [];
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    console.log(`[API Response] ${response.status} ${url}`, {
      headers: Object.fromEntries(response.headers.entries())
    });
    const contentType = response.headers.get("content-type");

    let data: any = null;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    console.log("STATUS:", response.status);
    console.log("DATA:", data);

    if (!response.ok) {
      if (response.status === 401 && typeof window !== 'undefined') {
        console.warn('[API] Unauthorized access detected. Redirecting to login...');
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }

      throw new Error(
        typeof data === "object"
          ? data?.error || data?.detail || `API Error: ${response.status}`
          : `API Error: ${response.status}`
      );
    }

    if (response.status === 204) {
      return null;
    }
    
    return data;
  } catch (error: any) {
    if (error.message === 'Failed to fetch') {
      console.error(`[API Network Error] Could not connect to: ${url}. Is the backend server/ngrok running?`);
      throw new Error(`Network Error: Could not connect to backend. Please check if your ngrok tunnel is active at ${url}`);
    }
    throw error;
  }
}

export const authApi = {
  login: (credentials: any) => 
    apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
};
