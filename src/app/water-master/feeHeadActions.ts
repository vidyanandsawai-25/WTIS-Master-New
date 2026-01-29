// feeHeadActions.ts
// Handles all Fee Head Master and Fee Head Rate Master API calls using apiService

import apiService from '@/lib/api/apiService';

export const feeHeadActions = {
  async fetchFeeHeads(params: Record<string, any> = {}) {
    return apiService.fetchWithAuth('/feehead-master', { ...params });
  },
  async fetchFeeHeadRates(params: Record<string, any> = {}) {
    return apiService.fetchWithAuth('/feehead-rate-master', { ...params });
  },
  async createFeeHead(data: Record<string, any>) {
    return apiService.fetchWithAuth('/feehead-master', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateFeeHead(id: string | number, data: Record<string, any>) {
    return apiService.fetchWithAuth(`/feehead-master/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async deleteFeeHead(id: string | number) {
    return apiService.fetchWithAuth(`/feehead-master/${id}`, {
      method: 'DELETE',
    });
  },
  async createFeeHeadRate(data: Record<string, any>) {
    return apiService.fetchWithAuth('/feehead-rate-master', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateFeeHeadRate(id: string | number, data: Record<string, any>) {
    return apiService.fetchWithAuth(`/feehead-rate-master/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async deleteFeeHeadRate(id: string | number) {
    return apiService.fetchWithAuth(`/feehead-rate-master/${id}`, {
      method: 'DELETE',
    });
  },
};
