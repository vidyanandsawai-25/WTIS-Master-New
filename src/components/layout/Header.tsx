"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/login/actions";
import type { Language } from "@/app/water-master/page";

import { UlbMaster } from '@/types/master.types';

interface HeaderProps {
  ulbData?: UlbMaster;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  waterRates: any[]; // Adjust type as needed
  username?: string;
}

export function Header({ ulbData, username }: HeaderProps) {
  const router = useRouter();
  const [langOpen, setLangOpen] = useState(false);

  const logoSrc = ulbData?.ulbLogo || "/images/Thane Municipal Corporation - ठाणे____.png";
  const title = ulbData?.ulbName || "Thane Municipal Corporation";
  // Assuming a static subtitle or we could add it to ULB Master if needed later. keeping default for now or using ulbNameLocal if it maps well.
  // The original subtitle was "Property Tax Department | ...". This seems more like app-specific text than Council specific.
  // However, the "ठाणे महानगर पालिका" part (assuming it was there) could be ulbData.ulbNameLocal. 
  // Wait, the previous code had:
  /*
    <h1 ...>Thane Municipal Corporation</h1>
    <p ...>Property Tax Department...</p>
  */
  // So the Main Title is the Council Name.

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* BACKGROUND BAR */}
      <div className="relative h-20 w-full bg-[#4b70a6] shadow-2xl border-b border-white/10">

        {/* FLOATING PARTICLES (hidden on very small screens) */}
        <div className="pointer-events-none absolute inset-0 hidden sm:block opacity-30">
          <div className="absolute left-[10%] top-4 h-16 w-16 rounded-full bg-orange-400 blur-xl animate-particle-float" />
          <div
            className="absolute left-[30%] top-8 h-12 w-12 rounded-full bg-blue-400 blur-xl animate-particle-float-slow"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute right-[25%] top-6 h-20 w-20 rounded-full bg-purple-400 blur-xl animate-particle-float"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute right-[10%] top-10 h-14 w-14 rounded-full bg-pink-400 blur-xl animate-particle-float-slow"
            style={{ animationDelay: "0.5s" }}
          />
          <div className="absolute left-[50%] top-2 h-24 w-24 rotate-45 border-2 border-white/20 animate-particle-float-slow" />
          <div className="absolute left-[70%] top-4 h-16 w-16 rounded-full border-2 border-orange-300/20 animate-particle-float" />
        </div>

        {/* MAIN HEADER CONTENT */}
        <div className="relative flex h-full w-full items-center justify-between px-4 md:px-6">

          {/* LEFT — LOGO + TEXT */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative flex h-10 w-10 md:h-14 md:w-14 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-white/30 blur-xl opacity-70" />
              <div className="relative h-full w-full overflow-hidden rounded-full bg-white ring-2 ring-white/40 shadow-xl animate-pendulum">

                {ulbData?.ulbLogo ? (
                  <img
                    src={logoSrc}
                    alt={`${title} Logo`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Image
                    src={logoSrc}
                    alt={`${title} Logo`}
                    width={85}
                    height={85}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
            </div>

            <div className="leading-tight">
              <h1
                className="text-sm sm:text-base md:text-2xl font-extrabold text-white"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif', letterSpacing: "0.5px" }}
              >
                {title}
              </h1>

              <p className="mt-1 flex flex-wrap gap-1 text-[10px] sm:text-xs md:text-sm text-gray-200">
                <span>Property Tax Department</span>
                <span className="hidden sm:inline-block text-yellow-400">|</span>
                <span className="font-medium text-yellow-300">
                  Property Tax Assessment & Management System
                </span>
              </p>
            </div>
          </div>

          {/* RIGHT — LANGUAGE + USER */}
          <div className="flex items-center gap-2 md:gap-4">

            {/* LANGUAGE DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="
                  flex items-center gap-2 rounded-2xl border border-white/20
                  bg-gradient-to-r from-[#0052D4] via-[#4364F7] to-[#6FB1FC]
                  px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm 
                  font-semibold text-white shadow-lg 
                  transition-all duration-300 hover:brightness-110
                "
              >
                🌐 Language
                <svg
                  className={`h-4 w-4 transition-transform ${langOpen ? "rotate-180" : "rotate-0"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* FIXED DROPDOWN MENU */}
              {langOpen && (
                <div
                  className="
                    absolute right-0 mt-2 w-44 rounded-xl dropdown-z
                    border border-white/20 bg-[#0C1B48]/90 
                    backdrop-blur-xl shadow-xl
                    z-[9999]   /* IMPORTANT FIX */
                  "
                >
                  {["English", "मराठी (Marathi)", "हिन्दी (Hindi)"].map((lang) => (
                    <button
                      key={lang}
                      className="w-full px-4 py-2 text-left text-xs sm:text-sm text-white hover:bg-white/10 transition"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* FULL USER CARD (desktop only) */}
            <div className="hidden md:flex items-center gap-4 rounded-3xl border border-white/20 bg-gradient-to-br from-[#243B7C]/90 to-[#0C1B48]/90 px-3 py-2 shadow-lg backdrop-blur-xl text-white">
              <div className="relative flex items-center">
                <div className="absolute inset-0 rounded-full bg-white/20 blur-xl" />
                <div className="relative h-11 w-11 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center ring-2 ring-white/40 shadow-xl">
                  <UserCircleIcon className="h-7 w-7 text-white" />
                </div>
              </div>

              <div className="leading-tight">
                <p className="text-sm font-semibold">{username || "User"}</p>

              </div>

              <div className="h-8 w-px bg-white/30" />

              <div className="flex items-center gap-2">

                <button
                  className="rounded-full p-2 hover:bg-red-500/20 transition"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* MOBILE USER ICON */}
            <button className="flex h-9 w-9 md:hidden items-center justify-center rounded-full text-white bg-white/10 border border-white/20 shadow-md">
              <UserCircleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
