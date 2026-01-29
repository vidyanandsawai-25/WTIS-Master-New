/**
 * API Service
 * Handles all HTTP requests to the WTIS backend
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5268/api/wtis';
//const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:44346/api/wtis';

// const BASE_URL = '/api/proxy';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  items?: T;
  errors?: Record<string, string[]>;
}

interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Backend Rate structure (matches API)
// Use BackendRate from src/lib/api/apiService
import type { BackendRate } from "@/lib/api/apiService";

export interface Zone {
  zoneID: number;
  zoneName: string;
  zoneCode: string;
  isActive: boolean;
  createdBy: number;
  createdDate: string;
  updatedBy?: number;
  updatedDate?: string;
}

export interface Ward {
  wardID: number;
  wardName: string;
  wardCode: string;
  zoneID: number;
  zoneName: string;
  isActive: boolean;
  createdBy: number;
  createdDate: string;
  updatedBy?: number;
  updatedDate?: string;
}

export interface ConnectionType {
  connectionTypeID: number;
  connectionTypeName: string;
  description?: string;
  isActive: boolean;
  createdBy: number;
  createdDate: string;
  updatedBy?: number;
  updatedDate?: string;
}

export interface ConnectionCategory {
  CategoryID: number;
  CategoryName: string;
  Description?: string;
  isActive: boolean;
  createdBy: number;
  createdDate: string;
  updatedBy?: number;
  updatedDate?: string;
}

export interface PipeSize {
  pipeSizeID: number;
  sizeName: string;
  diameterMM: number;
  isActive: boolean;
  createdBy: number;
  createdDate: string;
  updatedBy?: number;
  updatedDate?: string;
}

class ApiService {
  private async fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Check if we should use mock data
   

    const url = `${BASE_URL}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
      // Add authentication token if available (SSR-safe: implement via cookies/headers if needed)
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        // Provide more helpful error messages
        if (error.message.includes('Failed to fetch')) {
          throw new Error(
            'Cannot connect to backend API. Please ensure:\n' +
            '1. Backend server is running on ' + BASE_URL + '\n' +
            '2. CORS is properly configured\n' +
            '3. SSL certificate is trusted\n' 
            
          );
        }
      }
      console.error('API Error:', error);
      throw error;
    }
  }

  // Rate Master APIs
  async getRates(params?: {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
    zoneID?: number;
    wardID?: number;
    tapSizeID?: number;
    connectionTypeID?: number;
    connectionCategoryID?: number;
    year?: number;
    isActive?: boolean;
  }): Promise<PaginatedResponse<BackendRate>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/rate-master${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.fetchWithAuth<PaginatedResponse<BackendRate>>(endpoint);
  }

  async getRateById(id: number): Promise<BackendRate> {
    return this.fetchWithAuth<BackendRate>(`/rate-master/${id}`);
  }

  async createRate(data: {
    zoneID: number;
    wardID: number;
    tapSizeID: number;
    connectionTypeID: number;
    connectionCategoryID: number;
    minReading: number;
    maxReading: number;
    perLiter: number;
    minimumCharge: number;
    meterOffPenalty: number;
    rate: number;
    year: number;
    remark?: string;
    isActive: boolean;
    createdBy: number;
  }): Promise<BackendRate> {
    return this.fetchWithAuth<BackendRate>('/rate-master', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRate(
    id: number,
    data: Partial<{
      zoneID: number;
      wardID: number;
      tapSizeID: number;
      connectionTypeID: number;
      connectionCategoryID: number;
      minReading: number;
      maxReading: number;
      perLiter: number;
      minimumCharge: number;
      meterOffPenalty: number;
      rate: number;
      year: number;
      remark: string;
      isActive: boolean;
      updatedBy: number;
    }>
  ): Promise<BackendRate> {
    return this.fetchWithAuth<BackendRate>(`/rate-master/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRate(id: number): Promise<void> {
    await this.fetchWithAuth<void>(`/rate-master/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteMultipleRates(ids: number[]): Promise<void> {
    // Backend doesn't have bulk delete, so we'll call delete for each
    await Promise.all(
      ids.map(id => this.deleteRate(id))
    );
  }

  // Zone Master APIs
  async getZones(params?: {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
    isActive?: boolean;
  }): Promise<PaginatedResponse<Zone>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/zone-master${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.fetchWithAuth<PaginatedResponse<Zone>>(endpoint);
  }

  async createZone(data: {
    zoneName: string;
    zoneCode: string;
    isActive: boolean;
    createdBy: number;
  }): Promise<ApiResponse<Zone>> {
    return this.fetchWithAuth<ApiResponse<Zone>>('/zone-master', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Ward Master APIs
  async getWards(params?: {
     pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
    isActive?: boolean;
  }): Promise<PaginatedResponse<Ward>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/ward-master${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.fetchWithAuth<PaginatedResponse<Ward>>(endpoint);
  }

  async createWard(data: {
    description: string;
    descriptionEnglish: string;
    sequenceNo: number;
    zoneID: number;
    isActive: boolean;
    createdBy: number;
    createdDate: string;
    updatedBy?: number;
    updatedDate?: string;
  }): Promise<ApiResponse<Ward>> {
    return this.fetchWithAuth<ApiResponse<Ward>>('/ward-master', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  async deleteZone(id: number): Promise<void> {
  await this.fetchWithAuth<void>(`/zone-master/${id}`, { method: "DELETE" });
}

async deleteWard(id: number): Promise<void> {
  await this.fetchWithAuth<void>(`/ward-master/${id}`, { method: "DELETE" });
}

  // Connection Type APIs
  async getConnectionTypes(params?: {
    pageNumber?: number;
    pageSize?: number;
    isActive?: boolean;
  }): Promise<PaginatedResponse<ConnectionType>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const endpoint = `/connection-types${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.fetchWithAuth<PaginatedResponse<ConnectionType>>(endpoint);
  }

  async createConnectionType(data: {
    connectionTypeName: string;
    description?: string;
    isActive: boolean;
    createdBy: number;
  }): Promise<ConnectionType> {
    return this.fetchWithAuth<ConnectionType>('/connection-types', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteConnectionType(id: number): Promise<void> {
    return this.fetchWithAuth<void>(`/connection-types/${id}`, {
      method: 'DELETE',
    });
  }

  // Connection Category APIs
  async getConnectionCategories(params?: {
    pageNumber?: number;
    pageSize?: number;
    isActive?: boolean;
  }): Promise<PaginatedResponse<ConnectionCategory>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/connection-category${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.fetchWithAuth<PaginatedResponse<ConnectionCategory>>(endpoint);
  }

  async createConnectionCategory(data: {
    categoryName: string;
    description?: string;
    isActive: boolean;
    createdBy: number;
  }): Promise<ConnectionCategory> {
    return this.fetchWithAuth<ConnectionCategory>('/connection-category', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  
  async deleteConnectionCategory(id: number): Promise<void> {
    await this.fetchWithAuth<void>(`/connection-category/${id}`, {
      method: 'DELETE',
    });
  }

  

  // Pipe Size APIs
  async getPipeSizes(params?: { pageNumber?: number; pageSize?: number; isActive?: boolean }): Promise<PaginatedResponse<PipeSize>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const endpoint = `/tap-sizes${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.fetchWithAuth<PaginatedResponse<PipeSize>>(endpoint);
  }

  async createPipeSize(data: { sizeName: string; diameterMM: number; isActive: boolean; createdBy: number }): Promise<PipeSize> {
    return this.fetchWithAuth<PipeSize>('/tap-sizes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPipeSizeById(id: number): Promise<PipeSize> {
    return this.fetchWithAuth<PipeSize>(`/tap-sizes/${id}`);
  }

  async updatePipeSize(id: number, data: { sizeName: string; diameterMM: number; updatedBy: number }): Promise<PipeSize> {
    return this.fetchWithAuth<PipeSize>(`/tap-sizes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePipeSize(id: number): Promise<void> {
    await this.fetchWithAuth<void>(`/tap-sizes/${id}`, {
      method: 'DELETE',
    });
  }

  // Billing Cycle Master APIs
  async getBillingCyclesMaster(params?: {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
    isActive?: boolean;
  }): Promise<PaginatedResponse<any>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/billing-cycle-master${queryParams.toString() ? `?${queryParams}` : ''}`;
    console.log('Billing Cycle Master API response:', endpoint); 
    return this.fetchWithAuth<PaginatedResponse<any>>(endpoint);
    // console.log('Billing Cycle Master API response:', endpoint);  
  }

  // Get a single billing cycle by ID (like getRateById)
  async getBillingCycleById(id: number): Promise<any> {
    return this.fetchWithAuth<any>(`/billing-cycle-master/${id}`);
  }

  async createBillingCycleMaster(data: {
  createdDate: string;
  updatedDate: string;
  createdBy: number;
  updatedBy: number;
  zoneID: number;
  connectionCategoryID: number;
  cycleType: string;
  financialYear: number;
  billGenerationDate: string;
  billPeriodStartDate: string;
  billPeriodEndDate: string;
  currentPenaltyStartDate: string;
  currentPenaltyEndDate: string;
  pendingPenaltyStartDate: string;
  pendingPenaltyEndDate: string;
  currentPenaltyPercent: number;
  pendingPenaltyPercent: number;
  isReadingApproved: boolean;
  numberOfCycles: number;
  isActive: boolean;
}): Promise<any> {
  return this.fetchWithAuth<any>('/billing-cycle-master', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  }

  async updateBillingCycleMaster(
    id: number,
    data: Partial<{
     zone: string;
    connectionType: string;
    cycleName: string;
    cycleFrequency: number;
    financialYear: string;
    billGenerationDate: string;
    billPeriodStart: string;
    billPeriodEnd: string;
    currentPenaltyPercent: number;
    pendingPenaltyPercent: number;
    isActive: boolean;
    updatedBy: number;
    }>
  ): Promise<any> {
    return this.fetchWithAuth<any>(`/billing-cycle-master/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBillingCycleMaster(id: number): Promise<void> {
    return this.fetchWithAuth<void>(`/billing-cycle-master/${id}`, {
      method: 'DELETE' });
  }
}


// Create and export a singleton instance of ApiService
const apiService = new ApiService();
export default apiService;