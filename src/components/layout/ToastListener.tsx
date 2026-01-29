'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function ToastListener() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const lastToastRef = useRef<string | null>(null);

    useEffect(() => {
        const error = searchParams.get('error');
        const success = searchParams.get('success');
        const message = searchParams.get('message');
        const step = searchParams.get('step');
        const username = searchParams.get('username');

        // Construct unique ID based on content to prevent duplicates in React Strict Mode
        const toastContentId = error ? `error-${error}` : success ? `success-${success}` : null;

        if (toastContentId && lastToastRef.current !== toastContentId) {
            // Show toast with a fixed ID to prevent visual stacking of the same message
            if (error) {
                toast.error(error, {
                    description: message || '',
                    id: 'login-error-toast' // Fixed ID prevents overlapping stacks
                });
            } else if (success) {
                toast.success(success, {
                    description: message || '',
                    id: 'login-success-toast'
                });
            }

            lastToastRef.current = toastContentId;

            // Remove toast params but keep state params (step, username)
            const newParams = new URLSearchParams();
            if (step) newParams.set('step', step);
            if (username) newParams.set('username', username);

            router.replace(`${pathname}?${newParams.toString()}`);
        } else if (!error && !success) {
            // Reset ref if no toast params present, so new errors can be shown later
            lastToastRef.current = null;
        }
    }, [searchParams, pathname, router]);

    return null;
}
