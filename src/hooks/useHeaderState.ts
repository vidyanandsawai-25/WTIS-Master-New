// useHeaderState.ts
'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export type LanguageType = 'English' | 'हिन्दी (Hindi)' | 'मराठी (Marathi)';

export function useHeaderState(initialIp = '192.168.1.100') {
    const [language, setLanguage] = useState<LanguageType>('English');
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [showSessionInfo, setShowSessionInfo] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [loginTime] = useState(new Date());
    const [ipAddress] = useState(initialIp);

    const toggleLanguage = () => {
        setShowLanguageDropdown((prev) => !prev);
    };

    const selectLanguage = (lang: LanguageType) => {
        setLanguage(lang);
        setShowLanguageDropdown(false);
        toast.success(`Language changed to ${lang}`);
    };

    const getLoginDuration = () => {
        const now = new Date();
        const diff = now.getTime() - loginTime.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const router = useRouter();

    const handleLogout = () => {
        toast.success('Logging out...');
        try {
            localStorage.removeItem('ntis_user');
            localStorage.removeItem('employee_data');
            localStorage.removeItem('ntis_employee_code');
            localStorage.removeItem('ntis_user_id');
            localStorage.removeItem('ntis_session_start');
            localStorage.removeItem('ntis_session_id');
            localStorage.removeItem('jwt');
            localStorage.removeItem('ntis_last_activity');
        } catch { }

        setTimeout(() => {
            toast.info('Logout successful');
            try {
                router.replace('/login');
            } catch {
                window.location.href = '/login';
            }
        }, 400);
    };

    const handleProfile = () => {
        setShowProfileDropdown(false);
        toast.info('Opening profile page...');
    };

    const handleSettings = () => {
        setShowProfileDropdown(false);
        toast.info('Opening settings...');
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (showLanguageDropdown && !target.closest('.language-dropdown-container')) {
                setShowLanguageDropdown(false);
            }
            if (showProfileDropdown && !target.closest('.profile-dropdown-container')) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showLanguageDropdown, showProfileDropdown]);

    return {
        // state
        language,
        showLanguageDropdown,
        showSessionInfo,
        showProfileDropdown,
        loginTime,
        ipAddress,

        // setters you need in JSX
        setShowSessionInfo,
        setShowProfileDropdown,

        // actions
        toggleLanguage,
        selectLanguage,
        getLoginDuration,
        handleLogout,
        handleProfile,
        handleSettings,
    };
}
