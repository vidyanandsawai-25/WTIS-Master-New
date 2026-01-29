'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from "next/image";
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Card, CardContent, CardHeader } from '@/components/common/Card';

import { validateCredentialsAction, validateOtpAction } from '@/app/login/actions';
import { LoginFormProps } from '@/types/login.types';

export const LoginForm = ({ step: initialStep, username, ulbData }: LoginFormProps) => {

    const logoSrc = ulbData?.ulbLogo || "/images/thane_logo.png";
    const title = ulbData?.ulbName || "Thane Municipal Corporation";
    const subTitle = ulbData?.ulbNameLocal || "ठाणे महानगर पालिका";

    // --- State Management ---
    // 'idle' means we are in the normal login flow (credentials or server-side OTP)
    // 'username', 'verify-otp', 'reset-password', 'success' are for Forgot Password
    type FpStep = 'idle' | 'username' | 'verify-otp' | 'reset-password' | 'success';
    const [fpStep, setFpStep] = useState<FpStep>('idle');

    // Forgot Password Form Data
    const [fpUsername, setFpUsername] = useState('');
    const [fpOtp, setFpOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    // Timer State
    const [timer, setTimer] = useState(40);

    // Refs for OTP inputs
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Reset error when step changes
    useEffect(() => {
        setError('');
    }, [fpStep]);

    // Focus management for OTP
    useEffect(() => {
        if ((fpStep === 'verify-otp' || initialStep === 'otp') && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [fpStep, initialStep]);

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (fpStep === 'verify-otp' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [fpStep, timer]);

    // Reset timer when entering OTP step
    useEffect(() => {
        if (fpStep === 'verify-otp') {
            setTimer(40);
        }
    }, [fpStep]);

    // We need to maintain the original OTP state for the Server Action Login Flow
    const [loginOtp, setLoginOtp] = useState(['', '', '', '', '', '']);

    const onOtpInput = (element: HTMLInputElement, index: number, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (isNaN(Number(element.value))) return;
        const val = element.value;
        const newState = [...state];
        newState[index] = val.substring(val.length - 1);
        setState(newState);
        if (val !== '' && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const onOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (e.key === 'Backspace') {
            if (state[index] === '' && index > 0) {
                inputRefs.current[index - 1]?.focus();
                const newState = [...state];
                newState[index - 1] = '';
                setState(newState);
            } else {
                const newState = [...state];
                newState[index] = '';
                setState(newState);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // --- Forgot Password Handlers ---

    const handleFpStart = (e: React.MouseEvent) => {
        e.preventDefault();
        setFpStep('username');
    };

    const submitFpUsername = () => {
        if (!fpUsername.trim()) {
            setError('Username is required');
            return;
        }
        // Simulate API check
        setFpStep('verify-otp');
    };

    const submitFpOtp = () => {
        const otpValue = fpOtp.join('');
        if (otpValue !== '123456') {
            setError('Invalid OTP. Please try 123456');
            return;
        }
        setFpStep('reset-password');
    };

    const submitResetPassword = () => {
        if (!newPassword || !confirmPassword) {
            setError('Both fields are required');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        // Simulate Success
        setFpStep('success');
    };

    const backToLogin = () => {
        setFpStep('idle');
        setFpUsername('');
        setFpOtp(['', '', '', '', '', '']);
        setNewPassword('');
        setConfirmPassword('');
        setError('');
    };

    const handleResendOtp = () => {
        setTimer(40);
        setFpOtp(['', '', '', '', '', '']);
        // Simulate API call to resend OTP
        alert("OTP Resent successfully! (Hint: 123456)");
    };

    // Auto-redirect on success
    useEffect(() => {
        if (fpStep === 'success') {
            const timeout = setTimeout(() => {
                backToLogin();
            }, 1000); // 1 second delay
            return () => clearTimeout(timeout);
        }
    }, [fpStep]);

    // Determine current display mode
    // If fpStep is 'idle', we follow the parent `step` prop ('credentials' or 'otp')
    const isForgotFlow = fpStep !== 'idle';

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-900">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url("/images/thane-municipal-corporations.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(8px)',
                    transform: 'scale(1.1)'
                }}
            >
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <Card className="relative z-10 w-full max-w-md mx-4 bg-white/80 backdrop-blur-md border border-white/40 shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 ease-in-out">
                <CardHeader className="flex flex-col items-center text-center space-y-1 pb-2 pt-8">
                    {/* Logo Section */}
                    <div className="mb-6 relative drop-shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <div className="w-24 h-28 relative flex items-center justify-center">
                            {ulbData?.ulbLogo ? (
                                <img src={logoSrc} alt={`${title} Logo`} className="w-full h-full object-contain drop-shadow-md" />
                            ) : (
                                <Image src={logoSrc} alt={`${title} Logo`} fill className="object-contain drop-shadow-md" priority />
                            )}
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
                    <h2 className="text-lg text-gray-600 font-medium">{subTitle}</h2>

                    {/* Progress Loader (Visual Only) */}
                    <div className="flex items-center w-full justify-center gap-2 py-4">
                        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                        <div className={`w-1.5 h-1.5 rounded-full ${!isForgotFlow && initialStep === 'credentials' ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'bg-gray-300'}`}></div>
                        <div className={`w-1.5 h-1.5 rounded-full ${!isForgotFlow && initialStep === 'otp' ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'bg-gray-300'}`}></div>
                        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                    </div>

                    <div className="text-cyan-600 font-bold tracking-[0.2em] text-sm pt-1 uppercase">
                        {isForgotFlow
                            ? (fpStep === 'success' ? 'Password Changed' : 'Reset Password')
                            : (initialStep === 'credentials' ? 'Smart Login Portal' : 'Two-Factor Authentication')
                        }
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-4 px-8 pb-10">

                    {/* --- ERROR MESSAGE --- */}
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-center animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    {/* --- NORMAL LOGIN FLOW --- */}
                    {!isForgotFlow && initialStep === 'credentials' && (
                        <form action={validateCredentialsAction} className="animate-in fade-in slide-in-from-right-8 duration-300">
                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
                                    <Input
                                        name="username"
                                        placeholder="Enter your username"
                                        className="bg-gray-50/50 border-gray-200 py-2.5 px-4 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 rounded-xl"
                                        fullWidth
                                        defaultValue={username}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                                    <Input
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        className="bg-gray-50/50 border-gray-200 py-2.5 px-4 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 rounded-xl"
                                        fullWidth
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-2 pb-4">
                                <button type="button" onClick={handleFpStart} className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">
                                    Forgot Password?
                                </button>
                            </div>
                            <Button type="submit" fullWidth className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 text-lg rounded-xl shadow-lg shadow-cyan-500/30 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
                                SIGN IN
                            </Button>
                        </form>
                    )}

                    {/* --- NORMAL OTP FLOW --- */}
                    {!isForgotFlow && initialStep === 'otp' && (
                        <form action={validateOtpAction} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                            <input type="hidden" name="username" value={username} />
                            <div className="text-center text-gray-600 text-sm">
                                Please enter the 6-digit token sent to your registered mobile number.
                            </div>
                            <div className="flex justify-center px-1">
                                <input type="hidden" name="otp" value={loginOtp.join('')} />
                                <div className="flex justify-center gap-2 sm:gap-3">
                                    {loginOtp.map((data, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength={1}
                                            value={data}
                                            ref={(el) => { inputRefs.current[index] = el }}
                                            onChange={e => onOtpInput(e.target, index, loginOtp, setLoginOtp)}
                                            onKeyDown={e => onOtpKeyDown(e, index, loginOtp, setLoginOtp)}
                                            className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all shadow-sm hover:border-cyan-400"
                                            autoComplete="off"
                                            inputMode="numeric"
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="pt-2">
                                <Button type="submit" fullWidth className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 text-lg rounded-xl shadow-lg shadow-cyan-500/30 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
                                    VERIFY TOKEN
                                </Button>
                                <a href="/login" className="block w-full mt-4 text-center text-sm text-gray-500 hover:text-cyan-600 font-medium transition-colors">
                                    Back to Login
                                </a>
                            </div>
                        </form>
                    )}

                    {/* --- FORGOT PASSWORD: 1. USERNAME --- */}
                    {fpStep === 'username' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Enter your Username</label>
                                <Input
                                    value={fpUsername}
                                    onChange={(e) => setFpUsername(e.target.value)}
                                    placeholder="Username"
                                    className="bg-gray-50/50 border-gray-200 py-2.5 px-4 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 rounded-xl"
                                    fullWidth
                                />
                            </div>
                            <Button onClick={submitFpUsername} fullWidth className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 text-lg rounded-xl shadow-lg shadow-cyan-500/30 transition-all duration-300">
                                PROCEED
                            </Button>
                            <button onClick={backToLogin} className="block w-full text-center text-sm text-gray-500 hover:text-cyan-600 font-medium transition-colors">
                                Back to Login
                            </button>
                        </div>
                    )}

                    {/* --- FORGOT PASSWORD: 2. OTP --- */}
                    {fpStep === 'verify-otp' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                            {/* Disabled Username Input */}
                            <div className="space-y-1.5 opacity-70">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
                                <Input
                                    value={fpUsername}
                                    readOnly
                                    disabled
                                    className="bg-gray-100 border-gray-200 py-2.5 px-4 rounded-xl text-gray-500 cursor-not-allowed"
                                    fullWidth
                                />
                            </div>

                            <div className="text-center text-gray-600 text-sm">
                                Enter the 6-digit OTP sent to your mobile. <br />(Hint: 123456)
                            </div>
                            <div className="flex justify-center gap-2 sm:gap-3">
                                {fpOtp.map((data, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength={1}
                                        value={data}
                                        ref={(el) => { inputRefs.current[index] = el }}
                                        onChange={e => onOtpInput(e.target, index, fpOtp, setFpOtp)}
                                        onKeyDown={e => onOtpKeyDown(e, index, fpOtp, setFpOtp)}
                                        className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all shadow-sm hover:border-cyan-400"
                                        autoComplete="off"
                                        inputMode="numeric"
                                    />
                                ))}
                            </div>

                            {/* Timer / Resend OTP */}
                            <div className="text-center">
                                {timer > 0 ? (
                                    <p className="text-sm text-gray-500 font-medium">
                                        Resend OTP in <span className="text-cyan-600">{timer}s</span>
                                    </p>
                                ) : (
                                    <button
                                        onClick={handleResendOtp}
                                        className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 transition-colors underline"
                                    >
                                        Resend OTP
                                    </button>
                                )}
                            </div>

                            <Button onClick={submitFpOtp} fullWidth className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 text-lg rounded-xl shadow-lg shadow-cyan-500/30 transition-all duration-300">
                                VERIFY OTP
                            </Button>
                            <button onClick={() => setFpStep('username')} className="block w-full text-center text-sm text-gray-500 hover:text-cyan-600 font-medium transition-colors">
                                Back
                            </button>
                        </div>
                    )}

                    {/* --- FORGOT PASSWORD: 3. RESET --- */}
                    {fpStep === 'reset-password' && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-300">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700 ml-1">New Password</label>
                                <Input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="bg-gray-50/50 border-gray-200 py-2.5 px-4 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 rounded-xl"
                                    fullWidth
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Confirm Password</label>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter new password"
                                    className="bg-gray-50/50 border-gray-200 py-2.5 px-4 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 rounded-xl"
                                    fullWidth
                                />
                            </div>
                            <Button onClick={submitResetPassword} fullWidth className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 text-lg rounded-xl shadow-lg shadow-cyan-500/30 transition-all duration-300">
                                RESET PASSWORD
                            </Button>
                        </div>
                    )}

                    {/* --- FORGOT PASSWORD: 4. SUCCESS --- */}
                    {fpStep === 'success' && (
                        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Password Reset Successful!</h3>
                                <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
                            </div>
                            <Button onClick={backToLogin} fullWidth className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 text-lg rounded-xl shadow-lg shadow-cyan-500/30 transition-all duration-300">
                                GO TO LOGIN
                            </Button>
                        </div>
                    )}

                </CardContent>
            </Card>
        </div>
    );
};
