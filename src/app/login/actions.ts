'use server';

import crypto from 'crypto';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import 'server-only';

import { authService } from '@/services/auth.service';
import { appConfig } from '@/config/app.config';

export async function validateCredentialsAction(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
        redirect(`/login?error=Validation Error&message=Username and Password are required`);
    }

    const sessionId = crypto.randomUUID(); // Generate Session ID client-side (Server Action)

    let response;
    try {
        console.log('Attempting login to:', appConfig.api.baseUrl);
        response = await authService.login({
            userName: username,
            password: password,
            trackingData: {
                sessionId: sessionId
            }
        });
    } catch (error: any) {
        console.error('Login Error:', error);
        // Extract a meaningful error message
        const errorMessage = error?.message || 'An unexpected error occurred during login';
        response = { success: false, error: errorMessage };
    }

        // Static login: admin / 123456
        if (username === 'admin' && password === '123456') {
            const cookieStore = await cookies();
            // Set a non-expiring is_logged_in cookie for client-side SessionWatcher
            cookieStore.set('is_logged_in', 'true', {
                httpOnly: false,
                path: '/',
                maxAge: 60 * 60 * 24 * 365 // 1 year
            });
            // Optionally set a dummy session cookie if needed for UI
            cookieStore.set('session_id', 'static-session', { path: '/', httpOnly: false });
            redirect('/dashboard');
        } else {
            redirect(`/login?error=Invalid credentials&message=Use admin/123456`);
        }
}

export async function validateOtpAction(formData: FormData) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const otp = formData.get('otp') as string;

    if (!otp || otp.length !== 6) {
        redirect(`/login?step=otp&error=Invalid Token&message=Please enter a valid 6-digit token`);
    }

    // Verify OTP
    if (otp === '123456') {
        const cookieStore = await cookies();
        const pendingAuthCookie = cookieStore.get('pending_auth');

        if (!pendingAuthCookie?.value) {
            redirect(`/login?error=Session Expired&message=Please login again`);
        }

        let pendingAuthData;
        try {
            pendingAuthData = JSON.parse(pendingAuthCookie.value);
        } catch (e) {
            redirect(`/login?error=Session Invalid&message=Please login again`);
        }

        // Now we Promote the pending session to a real session

        // 1. Session ID (The one we created in step 1)
        if (pendingAuthData.sessionId) {
            cookieStore.set('session_id', pendingAuthData.sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7,
                path: '/'
            });
        }

        // 2. Auth Token
        if (pendingAuthData.token) {
            cookieStore.set('auth_token', pendingAuthData.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/'
            });
        }

        // 3. Refresh Token
        if (pendingAuthData.refreshToken) {
            cookieStore.set('refresh_token', pendingAuthData.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7,
                path: '/'
            });
        }

        // 4. Session Status Marker (For client-side syncing)
        // This is NOT HttpOnly so document.cookie can read it
        cookieStore.set('is_logged_in', 'true', {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });

        // 5. User Name Cookie (For Header Display)
        if (pendingAuthData.username) {
            cookieStore.set('user_name', pendingAuthData.username, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7,
                path: '/'
            });
        }

        // Cleanup pending cookie
        cookieStore.delete('pending_auth');

        // Login Success - Redirect to Dashboard
        redirect('/dashboard');
    }

    redirect(`/login?step=otp&error=Verification Failed&message=Invalid OTP (Try 123456)`);
}

export async function logoutAction() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    // Default to a dummy session if not found, just to attempt the call
    const sessionId = cookieStore.get('session_id')?.value || 'current-session';

    if (token) {
        try {
            await authService.logout(sessionId, token);
        } catch (error) {
            console.error('Logout Error:', error);
            // Continue with local logout
        }
    }

    // Clear cookies
    // Clear cookies with explicit path to ensure they are found and removed
    cookieStore.delete({ name: 'auth_token', path: '/' });
    cookieStore.delete({ name: 'refresh_token', path: '/' });
    cookieStore.delete({ name: 'session_id', path: '/' });
    cookieStore.delete({ name: 'pending_auth', path: '/' }); // Cleanup just in case
    cookieStore.delete({ name: 'is_logged_in', path: '/' });
    cookieStore.delete({ name: 'user_name', path: '/' });
    redirect('/');
}
