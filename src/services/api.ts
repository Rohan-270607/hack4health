/**
 * Centralized MindPulse API Client Configuration
 * Allows seamless switching between Mock API Service Layer and Production REST API Endpoints.
 */

export interface ApiConfig {
  useMockApi: boolean;
  baseUrl: string;
  timeoutMs: number;
}

export const defaultApiConfig: ApiConfig = {
  useMockApi: true,
  baseUrl: '/api',
  timeoutMs: 12000
};

let currentConfig = { ...defaultApiConfig };

export const getApiConfig = (): ApiConfig => currentConfig;

export const setUseMockApi = (useMock: boolean) => {
  currentConfig.useMockApi = useMock;
};

export const setBaseUrl = (url: string) => {
  currentConfig.baseUrl = url;
};

/**
 * Configurable Face Analysis Backend URL.
 * Change this single variable to point to a deployed backend.
 */
let FACE_API_BASE_URL = 'http://localhost:5000';

export const getFaceApiBaseUrl = (): string => FACE_API_BASE_URL;

export const setFaceApiBaseUrl = (url: string) => {
  FACE_API_BASE_URL = url;
};

/**
 * Standard simulated network delay helper for mock calls
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generic API request wrapper that dispatches to real HTTP fetch or mock handlers
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  mockFallback: () => Promise<T>
): Promise<T> {
  if (currentConfig.useMockApi) {
    return mockFallback();
  }

  try {
    const response = await fetch(`${currentConfig.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`API Request failed with status ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.warn(`[MindPulse API] Endpoint ${endpoint} failed or unreachable. Falling back to mock handler.`, error);
    return mockFallback();
  }
}
