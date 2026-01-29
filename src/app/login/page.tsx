import { LoginForm } from '@/components/modules/auth/LoginForm';
import { ToastListener } from '@/components/layout/ToastListener';
import { Suspense } from 'react';
import { masterService } from '@/services/master.service';

import { LoginPageProps } from '@/types/login.types';

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const resolvedParams = await searchParams;
    const step = (resolvedParams?.step as 'credentials' | 'otp') || 'credentials';
    const username = (resolvedParams?.username as string) || '';

    // Fetch ULB data to display Logo and Corporation Name
    let ulbData = undefined;
    try {
        const ulbResponse = await masterService.getActiveUlbs();
        if (ulbResponse.success && ulbResponse.data && ulbResponse.data.length > 0) {
            ulbData = ulbResponse.data[0];
        }
    } catch (error) {

    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ToastListener />
            <LoginForm step={step} username={username} ulbData={ulbData} />
        </Suspense>
    );
}
