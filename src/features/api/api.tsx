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
