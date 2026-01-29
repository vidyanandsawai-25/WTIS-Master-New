"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Search,
    FileText,
    Users,
    BarChart3,
    Menu,
    X,
    Map,
    ArrowLeft,
    Database,
    ClipboardCheck,
    Wrench,
    LayoutGrid,
    ChevronDown,
    ChevronRight,
} from "lucide-react";

interface SubMenuItem {
    name: string;
    href: string;
    className?: string;
}

interface MenuItem {
    name: string;
    nameHi: string;
    icon: any;
    href: string;
    subItems?: SubMenuItem[];
}

// Menu items matching the design in the image
const menuItems: MenuItem[] = [
    { name: "WTIS Master", nameHi: "डब्ल्यूटीआयएस मास्टर", icon: Database, href: "/water-master" },
    { name: "Data Analytics", nameHi: "डेटा विश्लेषण", icon: BarChart3, href: "/analytics" },
    { name: "Search Property", nameHi: "मालमत्ता शोध", icon: Search, href: "/search-property" },
    { name: "PTIS", nameHi: "पी.टी.आय.एस.", icon: LayoutDashboard, href: "/dashboard" },
    {
        name: "Assessment Process",
        nameHi: "करनिर्धारण प्रक्रिया",
        icon: ClipboardCheck,
        href: "/assessment",
        subItems: [
            { name: "Data Center", href: "/assessment/data-center" },
            { name: "ULB Approval", href: "/assessment/ulb-approval" },
            { name: "Hearing Application", href: "/assessment/hearing-application" },
            { name: "Auto Appeal", href: "/assessment/auto-appeal" },
            { name: "Hearing Approval", href: "/assessment/hearing-approval" },
        ]
    },
    { name: "Report Engine", nameHi: "अहवाल इंजिन", icon: FileText, href: "/report-engine" },
    {
        name: "Utility",
        nameHi: "उपयोगिता",
        icon: Wrench,
        href: "/utility",
        subItems: [
            { name: "Lock Property", href: "/utility/lock-property" },
            { name: "Add Taxes", href: "/utility/add-taxes" },
            { name: "Auto Ward Entry", href: "/utility/auto-ward-entry" },
            { name: "Update Common Details", href: "/utility/update-common-details" },
            { name: "Delete Property", href: "/utility/delete-property" },
            { name: "QR Generation", href: "/utility/qr-generation" },
            { name: "Data Import", href: "/utility/data-import" },
        ]
    },
    {
        name: "Services",
        nameHi: "सेवा",
        icon: LayoutGrid,
        href: "/services",
        subItems: [
            { name: "Pay Property Tax", href: "/services/pay-property-tax" },
            { name: "Pay Water Tax", href: "/services/pay-water-tax" },
            { name: "Pay Trade Licence Fee", href: "/services/pay-trade-license" },
            { name: "RTS", href: "/services/rts" },
            { name: "RTI", href: "/services/rti" },
            { name: "IGR", href: "/services/igr" },
            { name: "Aaple Sarkar", href: "/services/aaple-sarkar" },
        ]
    },
    { name: "GIS", nameHi: "जी.आय.एस.", icon: Map, href: "/gis" },
    { name: "Master", nameHi: "मास्टर", icon: Database, href: "/master" },
    { name: "User Management", nameHi: "वापरकर्ता व्यवस्थापन", icon: Users, href: "/user-management" },
];

export function Sidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(true);
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

    // ✔ FIX 1: Only close the MOBILE menu on route change. 
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // ✔ FIX 2: Auto-expand sidebar when Mobile Menu is opened
    useEffect(() => {
        if (open) {
            setCollapsed(false);
        }
    }, [open]);

    // Toggle body class for layout adjustments
    useEffect(() => {
        if (!collapsed) {
            document.body.classList.add('sidebar-expanded');
        } else {
            document.body.classList.remove('sidebar-expanded');
        }
        return () => document.body.classList.remove('sidebar-expanded');
    }, [collapsed]);

    return (
        <>
            {/* MOBILE TOGGLE BUTTON */}
            <button
                onClick={() => setOpen(!open)}
                className="
          lg:hidden fixed top-4 left-4 z-[9999]
          bg-[#4b70a6] backdrop-blur-xl
          p-3 rounded-xl border border-white/30 shadow-lg
        "
            >
                {open ? <X className="h-7 w-7 text-white" /> : <Menu className="h-7 w-7 text-white" />}
            </button>

            {/* BACKDROP */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setOpen(false)}
                ></div>
            )}

            {/* SIDEBAR */}
            <aside
                onMouseEnter={() => setCollapsed(false)}
                onMouseLeave={() => setCollapsed(true)}
                className={`
          fixed top-20 left-0
          h-[calc(100vh-80px)]
          z-50
          bg-slate-200
          shadow-xl flex flex-col
          overflow-hidden
          transition-all duration-300 ease-in-out
          border-r border-gray-200
          
          /* Slide in/out logic */
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          
          /* Width logic */
          ${collapsed ? "w-20" : "w-64"}
        `}
            >
                {/* Sidebar Header */}
                <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-[#4b70a6] to-[#3d5a8a] shadow-lg shrink-0">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div
                            className={`
                                transition-all duration-300 ease-in-out overflow-hidden
                                ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
                            `}
                        >
                            <h2 className="text-lg font-bold text-gray-800 whitespace-nowrap">Property Tax</h2>
                            <p className="text-xs text-gray-500 whitespace-nowrap">मालमत्ता कर विभाग</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-2 px-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                    <div className="space-y-0.5">
                        {menuItems.map((item) => {
                            const active = pathname === item.href;
                            const hasSubItems = item.subItems && item.subItems.length > 0;
                            const isExpanded = expandedMenu === item.name;
                            return (
                                <div key={item.name}>
                                    <div
                                        onClick={(e) => {
                                            if (hasSubItems) {
                                                e.preventDefault();
                                                // Toggle expansion
                                                if (isExpanded) {
                                                    setExpandedMenu(null);
                                                } else {
                                                    setExpandedMenu(item.name);
                                                    setCollapsed(false); // Ensure sidebar opens when expanding menu
                                                }
                                            }
                                        }}
                                        className={`
                                            relative
                                            transition-all duration-300
                                        `}
                                    >
                                        <Link
                                            href={hasSubItems ? "#" : item.href} // Prevent navigation for parents
                                            className={`
                                                flex items-center gap-2.5 px-3 py-2
                                                rounded-xl text-[15px] font-medium
                                                transition-all duration-300
                                                cursor-pointer
                                                ${active && !hasSubItems
                                                    ? "bg-gradient-to-r from-[#4b70a6] to-[#5a82b8] text-white shadow-md"
                                                    : isExpanded
                                                        ? "bg-gray-100 text-[#4b70a6]"
                                                        : "text-gray-700 hover:bg-gray-100"
                                                }
                                            `}
                                        >
                                            <item.icon
                                                className={`h-5 w-5 shrink-0 ${active && !hasSubItems ? "text-white" : isExpanded ? "text-[#4b70a6]" : "text-gray-500"}`}
                                            />

                                            <div
                                                className={`
                                                    transition-all duration-300 ease-in-out overflow-hidden flex-1
                                                    ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
                                                `}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="block whitespace-nowrap text-[15px] font-medium leading-tight">
                                                            {item.name}
                                                        </span>
                                                        <span className={`block whitespace-nowrap text-[11px] ${active && !hasSubItems ? "text-white/70" : "text-gray-400"}`}>
                                                            {item.nameHi}
                                                        </span>
                                                    </div>
                                                    {hasSubItems && (
                                                        <div className="text-gray-400">
                                                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>

                                    {/* Submenu Items */}
                                    <div
                                        className={`
                                            transition-all duration-300 ease-in-out
                                            ${isExpanded && !collapsed
                                                ? "max-h-60 opacity-100 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
                                                : "max-h-0 opacity-0 overflow-hidden"
                                            }
                                        `}
                                    >
                                        <div className="ml-5 border-l-2 border-gray-200 pl-2 space-y-1 my-1">
                                            {item.subItems?.map((sub) => (
                                                <Link
                                                    key={sub.name}
                                                    href={sub.href}
                                                    className={`
                                                        block px-3 py-1.5 rounded-lg text-[14px] font-medium
                                                        transition-colors duration-200
                                                        hover:bg-gray-50
                                                        ${sub.className || "text-gray-600"}
                                                    `}
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </nav>

                {/* Back to Home Button */}
                <div className="px-2 mt-auto mb-2">
                    <Link
                        href="/dashboard"
                        className={`
                            flex items-center gap-2.5 px-3 py-2
                            rounded-xl text-[15px] font-semibold
                            transition-all duration-300
                            bg-gradient-to-r from-[#4b70a6] to-[#3d5a8a] hover:from-[#3d5a8a] hover:to-[#2e466e]
                            text-white shadow-md hover:shadow-lg hover:-translate-y-0.5
                            border border-white/20
                        `}
                    >
                        <ArrowLeft className={`h-5 w-5 shrink-0 ${collapsed ? "mx-auto" : ""}`} />

                        <div
                            className={`
                                transition-all duration-300 ease-in-out overflow-hidden flex flex-col items-start
                                ${collapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"}
                            `}
                        >
                            <span className="block whitespace-nowrap leading-tight">Back to Dashboard</span>
                            <span className="block whitespace-nowrap text-[11px] text-blue-100 font-normal">डॅशबोर्ड</span>
                        </div>
                    </Link>
                </div>

                {/* Sidebar Footer */}
                <div
                    className={`
                        px-4 py-3 border-t border-gray-200 text-center
                        transition-all duration-300 ease-in-out overflow-hidden
                        ${collapsed ? "h-0 opacity-0 py-0" : "h-auto opacity-100"}
                    `}
                >
                    <p className="text-xs text-gray-400 whitespace-nowrap">© 2025 TMC Property Tax</p>
                </div>
            </aside>
        </>
    );
}
