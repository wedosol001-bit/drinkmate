// CO2 API - Handles CO2 cylinder operations and data fetching
// Sample commit for demonstration purposes
import { api, apiCache, retryRequest, getAuthToken } from '../api';
import { fallbackCylinders } from '../fallback-data';

/**
 * Checks if the device is currently online
 * @returns {boolean} True if the device is online, false otherwise
 */
const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true; // Assume online if we can't detect
};

/**
 * Handles API errors with improved diagnostics
 * @param {any} error - The error object from the API call
 * @param {string} context - Context for the error (e.g., 'getCylinders')
 */
const handleApiError = (error: any, context: string): void => {
  // Create detailed error info
  const errorInfo = {
    context,
    message: error.message || 'Unknown error',
    type: error.response ? `HTTP ${error.response.status}` : 'Network Error',
    online: isOnline(),
    apiURL: api.defaults.baseURL,
    timestamp: new Date().toISOString(),
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  };
  
  // Log with different levels based on error type
  if (!error.response) {
    console.warn('CO2API Network Error:', errorInfo);
  } else if (error.response.status >= 500) {
    console.error('CO2API Server Error:', errorInfo);
  } else {
    console.warn('CO2API Client Error:', errorInfo);
  }
};

// CO2 Cylinders API
export const co2API = {
  // Get all CO2 cylinders
  getCylinders: async (params?: { page?: number; limit?: number; brand?: string; type?: string; status?: string }) => {
    // Check connectivity first
    if (!isOnline()) {
      console.warn('CO2API: Device appears to be offline');
      return {
        success: false,
        cylinders: [],
        message: 'Device appears to be offline. Please check your connection.'
      };
    }
    
    // Clear cache to get fresh data
    const cacheKey = 'co2-cylinders';
    apiCache.delete(cacheKey);
    
    try {
      return await retryRequest(async () => {
        // Get token for admin requests
        const token = getAuthToken();
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        // Build query parameters
        const queryParams: any = { _t: Date.now() }; // Cache busting
        if (params) {
          if (params.page) queryParams.page = params.page;
          if (params.limit) queryParams.limit = params.limit;
          if (params.brand) queryParams.brand = params.brand;
          if (params.type) queryParams.type = params.type;
          if (params.status) queryParams.status = params.status;
        }
        
        // Debug logging
        if (process.env.NODE_ENV === 'development') {
          console.log('CO2API Debug:', {
            baseURL: api.defaults.baseURL,
            endpoint: '/co2/cylinders',
            fullURL: `${api.defaults.baseURL}/co2/cylinders`,
            queryParams,
            hasToken: !!token,
            timestamp: new Date().toISOString()
          });
        }
        
        // Add cache-busting parameter to ensure fresh data
        const response = await api.get('/co2/cylinders', { 
          headers,
          params: queryParams,
          timeout: 10000 // 10 second timeout
        });
        
        if (process.env.NODE_ENV === 'development') {
          console.log('CO2API Response:', response.data);
        }
        return response.data;
      }, cacheKey, 3, 1500); // More retries with longer initial delay
    } catch (error) {
      handleApiError(error, 'getCylinders');
      // Don't return fallback data - return error instead
      // This allows the UI to show proper error messages
      return {
        success: false,
        cylinders: [],
        message: 'Failed to fetch cylinders. Please check your connection and try again.',
        error: error
      };
    }
  },
  
  
  // Get a single CO2 cylinder by slug or ID
  getCylinder: async (slugOrId: string) => {
    if (!slugOrId) {
      console.warn('getCylinder called with empty slugOrId');
      return { success: false, message: 'No slug or ID provided' };
    }
    
    // Check connectivity first
    if (!isOnline()) {
      console.warn(`CO2API: Device is offline for cylinder ${slugOrId}`);
      return {
        success: false,
        cylinder: null,
        message: 'Device appears to be offline. Please check your connection.'
      };
    }
    
    const cacheKey = `co2-cylinder-${slugOrId}`;
    
    try {
      return await retryRequest(async () => {
        const token = getAuthToken();
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        const isSlug = slugOrId.includes('-');
        const endpoint = isSlug ? `/co2/cylinders/slug/${slugOrId}` : `/co2/cylinders/${slugOrId}`;
        
        const response = await api.get(endpoint, { 
          headers,
          params: { _t: Date.now() }, // Cache busting
          timeout: 10000 // 10 second timeout
        });
        
        return response.data;
      }, cacheKey, 3, 1500); // More retries with longer initial delay
    } catch (error) {
      handleApiError(error, `getCylinder(${slugOrId})`);
      
      return {
        success: false,
        cylinder: null,
        message: 'Failed to fetch cylinder. Please check your connection and try again.',
        error: error
      };
    }
  },
  
  // Create a new CO2 cylinder (admin only)
  createCylinder: async (cylinderData: any) => {
    // Verify we're online before attempting write operations
    if (!isOnline()) {
      return { 
        success: false, 
        message: 'Cannot create cylinder - device is offline' 
      };
    }
    
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, message: 'Authentication required' };
      }
      
      const response = await api.post('/co2/cylinders', cylinderData, {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 15000 // 15 second timeout for create operations
      });
      
      return response.data;
    } catch (error: any) {
      handleApiError(error, 'createCylinder');
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create cylinder due to network issues' 
      };
    }
  },
  
  // Update a CO2 cylinder (admin only)
  updateCylinder: async (id: string, cylinderData: any) => {
    // Verify we're online before attempting write operations
    if (!isOnline()) {
      return { 
        success: false, 
        message: 'Cannot update cylinder - device is offline' 
      };
    }
    
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, message: 'Authentication required' };
      }
      
      const response = await api.put(`/co2/cylinders/${id}`, cylinderData, {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 15000 // 15 second timeout for update operations
      });
      
      return response.data;
    } catch (error: any) {
      handleApiError(error, `updateCylinder(${id})`);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update cylinder due to network issues' 
      };
    }
  },
  
  // Delete a CO2 cylinder (admin only)
  deleteCylinder: async (id: string) => {
    // Verify we're online before attempting write operations
    if (!isOnline()) {
      return { 
        success: false, 
        message: 'Cannot delete cylinder - device is offline' 
      };
    }
    
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, message: 'Authentication required' };
      }
      
      const response = await api.delete(`/co2/cylinders/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 15000 // 15 second timeout for delete operations
      });
      
      return response.data;
    } catch (error: any) {
      handleApiError(error, `deleteCylinder(${id})`);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete cylinder due to network issues' 
      };
    }
  }
};
