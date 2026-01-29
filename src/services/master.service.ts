import 'server-only';
import { apiClient } from './api.service';
import { ApiResponse } from '@/types/common.types';
import { UlbMaster } from '@/types/master.types';

export const masterService = {
    getAllUlbs: async (): Promise<ApiResponse<UlbMaster[]>> => {
        return apiClient.get<UlbMaster[]>('/ULBMaster');
    },

    getActiveUlbs: async (): Promise<ApiResponse<UlbMaster[]>> => {
        return apiClient.get<UlbMaster[]>('/ULBMaster/active');
    }
};
