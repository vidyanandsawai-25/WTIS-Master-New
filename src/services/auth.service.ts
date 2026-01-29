import 'server-only';
import { apiClient } from './api.service';
import { LoginRequest, LoginResponse } from '@/types/login.types';
import { ApiResponse } from '@/types/common.types';

export const authService = {
    login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
        const { headers } = await import('next/headers');
        const headersList = await headers();
        const userAgent = headersList.get('user-agent') || 'Unknown';
        const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

        // Basic User Agent Parsing for Tracking
        const getBrowser = (ua: string) => {
            if (ua.includes('Edg/')) return 'Edge';
            if (ua.includes('Chrome/')) return 'Chrome';
            if (ua.includes('Firefox/')) return 'Firefox';
            if (ua.includes('Safari/')) return 'Safari';
            return 'Other';
        };

        const getOS = (ua: string) => {
            if (ua.includes('Windows')) return 'Windows';
            if (ua.includes('Mac')) return 'MacOS';
            if (ua.includes('Linux')) return 'Linux';
            if (ua.includes('Android')) return 'Android';
            if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
            return 'Other';
        };

        const payload = {
            ...credentials,
            rememberMe: true,
            trackingData: {
                ipAddress: ipAddress,
                userAgent: userAgent,
                browserName: getBrowser(userAgent),
                browserVersion: "Latest", // Simplified version tracking
                operatingSystem: getOS(userAgent),
                deviceType: /Mobile|Android|iPhone|iPad/i.test(userAgent) ? "Mobile" : "Desktop",
                ...credentials.trackingData,
            }
        };
        return apiClient.post<LoginResponse>('/Auth/login', payload);
    },

    logout: async (sessionId: string, token?: string): Promise<ApiResponse<object>> => {
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return apiClient.post<object>('/Auth/logout', { sessionId }, { headers });
    },
};
