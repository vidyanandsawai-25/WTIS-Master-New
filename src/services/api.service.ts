import 'server-only';
/**
 * API Client Service
 * Centralized HTTP client for making API requests
 */

import { appConfig } from '@/config/app.config';
import { ApiResponse } from '@/types/common.types';

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = appConfig.api.baseUrl;
    this.timeout = appConfig.api.timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    // Configure request options
    const fetchOptions: RequestInit & { agent?: any } = {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // For development with self-signed certificates
    if (process.env.NODE_ENV === 'development') {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, fetchOptions);

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        // Handle both camelCase and PascalCase response formats

        let message = data.message || data.Message || data.title || 'An error occurred';
        const errors = data.errors || data.Errors;

        // Append validation errors if present
        if (errors) {
          let errorDetails = '';
          if (Array.isArray(errors)) {
            errorDetails = errors.join(', ');
          } else if (typeof errors === 'object') {
            errorDetails = Object.values(errors).flat().join(', ');
          }

          if (errorDetails) {
            message += `: ${errorDetails}`;
          }
        }

        return {
          success: false,
          error: message,
        };
      }

      // Handle PascalCase properties in successful response
      return {
        success: true,
        data: data.data || data.Data || data,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
