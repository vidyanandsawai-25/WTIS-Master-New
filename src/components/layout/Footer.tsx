import { UlbMaster } from '@/types/master.types';

interface FooterProps {
  ulbData?: UlbMaster;
}

/**
 * Footer component for the application
 */
export function Footer({ ulbData }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const title = ulbData?.ulbName || "Thane Municipal Corporation";

  return (
    <footer className="relative mt-auto z-30 print:hidden">
      {/* Gold accent line - Refined gradient */}
      <div className="h-0.5 w-full bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 opacity-80" />

      {/* Main Footer Content */}
      <div className="w-full bg-[#4b70a6] text-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs">

            {/* Left Side: Branding & Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 md:gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="font-bold tracking-wide text-xs sm:text-sm text-white"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif', letterSpacing: "0.5px" }}
                >
                  {title}
                </span>
              </div>
              <span className="hidden sm:inline-block text-white/30">|</span>
              <div className="flex items-center gap-1 text-blue-50/80 font-medium">
                <span>Property Tax Department</span>
                <span className="hidden sm:inline mx-1">•</span>
                <span>© {currentYear} All rights reserved.</span>
              </div>
            </div>

            {/* Right Side: Links */}
            <div className="flex items-center gap-4 sm:gap-6 text-blue-100/90">
              <a href="#" className="hover:text-white hover:underline decoration-yellow-400 decoration-1 underline-offset-2 transition-all">Privacy</a>
              <a href="#" className="hover:text-white hover:underline decoration-yellow-400 decoration-1 underline-offset-2 transition-all">Terms</a>
              <a href="#" className="hover:text-white hover:underline decoration-yellow-400 decoration-1 underline-offset-2 transition-all">Support</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
