import { UlbMaster } from '@/types/master.types';

export interface LoginFormProps {
    step: 'credentials' | 'otp';
    username?: string;
    ulbData?: UlbMaster;
}

export interface LoginPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface TrackingData {
    ipAddress?: string;
    userAgent?: string;
    browserName?: string;
    browserVersion?: string;
    operatingSystem?: string;
    deviceType?: string;
    sessionId?: string;
}

export interface LoginRequest {
    userName?: string;
    password?: string;
    rememberMe?: boolean;
    trackingData?: TrackingData;
}

export interface LoginResponse {
    token?: string;
    refreshToken?: string;
    expiresAt?: string;
    user?: {
        id: string;
        username: string;
        email: string;
        roles: string[];
    };
    isSuccess: boolean;
    message?: string;
}

export interface LogoutRequest {
    sessionId: string;
}
