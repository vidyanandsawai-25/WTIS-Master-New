'use client';

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/login/actions';

export function SessionWatcher() {
    const pathname = usePathname();

    const handleLogout = useCallback(async () => {
        try {
            await logoutAction();
        } catch (error) {
            console.error("Logout failed", error);
            // Fallback if action fails
            window.location.href = '/login';
        }
    }, []);

    useEffect(() => {
        // Only run on protected paths
        if (pathname === '/login' || pathname === '/') return;

        const checkSession = () => {
            // document.cookie returns a string like "key1=value1; key2=value2"
            // We check if is_logged_in exists (since session_id is HttpOnly and invisible to JS)
            const hasSession = document.cookie
                .split('; ')
                .find((row) => row.startsWith('is_logged_in='));

            if (!hasSession) {
                // If client-side cookie is missing, we MUST clear server-side cookies too
                // to prevent the Middleware Loop (Middleware sees session -> redirects to dashboard -> Watcher sees no cookie -> redirects to login)
                handleLogout();
            }
        };

        // Poll every 2 seconds to reduce load
        const interval = setInterval(checkSession, 2000);

        return () => clearInterval(interval);
    }, [pathname, handleLogout]);

    return null;
}
