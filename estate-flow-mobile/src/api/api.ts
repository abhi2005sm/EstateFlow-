import { Platform } from 'react-native';

// Set this to your machine's local IP address (e.g. '192.168.1.100')
// to test on physical devices via Expo Go on the same Wi-Fi network.
const DEV_HOST_IP = 'localhost';

export const getBaseUrl = (): string => {
  if (Platform.OS === 'web') {
    return 'http://localhost:8000';
  }
  if (Platform.OS === 'android') {
    // 10.0.2.2 is the standard loopback IP pointing to the host machine in Android Emulator
    return 'http://10.0.2.2:8000';
  }
  // iOS Simulator or real devices
  return `http://${DEV_HOST_IP}:8000`;
};

let authToken: string | null = null;
let loggedInUser: { email: string; name: string; role: string } | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = (): string | null => {
  return authToken;
};

export const setLoggedInUser = (user: { email: string; name: string; role: string } | null) => {
  loggedInUser = user;
};

export const getLoggedInUser = () => {
  return loggedInUser;
};

export async function apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
  const baseUrl = getBaseUrl();
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanEndpoint = endpoint.replace(/^\//, '');

  // Ensure the endpoint always has a trailing slash for Django/Backend compatibility
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

  const headers: any = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  console.log(`[Mobile API Request] ${options.method || 'GET'} ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type");
    let data: any = null;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMsg = typeof data === "object"
        ? data?.error || data?.detail || `API Error: ${response.status}`
        : `API Error: ${response.status}`;
      throw new Error(errorMsg);
    }

    if (response.status === 204) {
      return null;
    }

    return data;
  } catch (error: any) {
    console.error(`[Mobile API Error] ${url}:`, error.message);
    throw error;
  }
}
