
// Department Submodule Registry
// Defines all available submodules for each department

export interface Submodule {
    id: string;
    name: string;
    code: string;
    description: string;
    category: 'payment' | 'collection' | 'approval' | 'mobile' | 'reporting' | 'integration' | 'citizen-portal' | 'field-operations';
    isDefaultActive: boolean;
    requiresIntegration?: string[]; // Dependencies on other submodules
    icon: string;
}

export interface DepartmentSubmodules {
    departmentId: string;
    departmentName: string;
    submodules: Submodule[];
}

export const DEPARTMENT_SUBMODULES: DepartmentSubmodules[] = [
    {
        departmentId: '1',
        departmentName: 'Property Tax',
        submodules: [
            {
                id: 'pt-counter-payment',
                name: 'Counter Payment',
                code: 'PT-CP',
                description: 'Manual counter-based payment collection',
                category: 'payment',
                isDefaultActive: true,
                icon: 'Store'
            },
            {
                id: 'pt-approval-module',
                name: 'Approval Workflow',
                code: 'PT-APPR',
                description: 'Multi-level approval for assessment and mutations',
                category: 'approval',
                isDefaultActive: true,
                icon: 'CheckSquare'
            },
            {
                id: 'pt-mobile-collection',
                name: 'Mobile Tax Collection',
                code: 'PT-MCOLL',
                description: 'Mobile-based door-to-door tax collection',
                category: 'mobile',
                isDefaultActive: false,
                requiresIntegration: ['pt-counter-payment'],
                icon: 'Smartphone'
            },
            {
                id: 'pt-citizen-portal',
                name: 'Citizen Self-Service Portal',
                code: 'PT-CSP',
                description: 'Online portal for citizens to view and pay taxes',
                category: 'citizen-portal',
                isDefaultActive: true,
                icon: 'Users'
            }
        ]
    },
    {
        departmentId: '2',
        departmentName: 'Water Tax',
        submodules: [
            {
                id: 'wt-counter-payment',
                name: 'Counter Payment',
                code: 'WT-CP',
                description: 'Manual counter-based bill payment',
                category: 'payment',
                isDefaultActive: true,
                icon: 'Store'
            },
            {
                id: 'wt-mobile-reading',
                name: 'Mobile Meter Reading',
                code: 'WT-MMR',
                description: 'Mobile app for meter reading',
                category: 'mobile',
                isDefaultActive: false,
                icon: 'Smartphone'
            },
            {
                id: 'wt-approval-workflow',
                name: 'Connection Approval',
                code: 'WT-APPR',
                description: 'Multi-level approval for new connections',
                category: 'approval',
                isDefaultActive: true,
                icon: 'CheckSquare'
            },
            {
                id: 'wt-citizen-portal',
                name: 'Citizen Portal',
                code: 'WT-CP',
                description: 'Online portal for connection requests and bill payment',
                category: 'citizen-portal',
                isDefaultActive: true,
                icon: 'Users'
            },
            {
                id: 'wt-sms-alerts',
                name: 'SMS Bill Alerts',
                code: 'WT-SMS',
                description: 'SMS notifications for bill generation',
                category: 'integration',
                isDefaultActive: false,
                icon: 'MessageSquare'
            },
            {
                id: 'wt-auto-billing',
                name: 'Auto Bill Generation',
                code: 'WT-ABILL',
                description: 'Automated monthly bill generation',
                category: 'collection',
                isDefaultActive: true,
                icon: 'Zap'
            }
        ]
    },
    {
        departmentId: '3',
        departmentName: 'Trade License',
        submodules: [
            {
                id: 'tl-counter-payment',
                name: 'Counter Payment',
                code: 'TL-CP',
                description: 'Manual counter-based fee payment',
                category: 'payment',
                isDefaultActive: true,
                icon: 'Store'
            },
            {
                id: 'tl-approval-workflow',
                name: 'Multi-Level Approval',
                code: 'TL-APPR',
                description: 'Multi-level approval for license issuance',
                category: 'approval',
                isDefaultActive: true,
                icon: 'CheckSquare'
            },
            {
                id: 'tl-mobile-inspection',
                name: 'Mobile Inspection',
                code: 'TL-MINSP',
                description: 'Mobile app for field inspections',
                category: 'mobile',
                isDefaultActive: false,
                icon: 'Smartphone'
            },
            {
                id: 'tl-citizen-portal',
                name: 'Online Application Portal',
                code: 'TL-OAP',
                description: 'Online portal for license applications',
                category: 'citizen-portal',
                isDefaultActive: true,
                icon: 'Users'
            },
            {
                id: 'tl-renewal-alerts',
                name: 'Renewal Alerts',
                code: 'TL-RA',
                description: 'Automatic renewal reminder notifications',
                category: 'integration',
                isDefaultActive: true,
                icon: 'Bell'
            },
            {
                id: 'tl-qr-verification',
                name: 'QR Code Verification',
                code: 'TL-QR',
                description: 'QR code based license verification',
                category: 'integration',
                isDefaultActive: false,
                icon: 'QrCode'
            }
        ]
    },
    {
        departmentId: '4',
        departmentName: 'Building Plan Approval',
        submodules: [
            {
                id: 'bp-counter-payment',
                name: 'Counter Payment',
                code: 'BP-CP',
                description: 'Manual counter-based fee payment',
                category: 'payment',
                isDefaultActive: true,
                icon: 'Store'
            },
            {
                id: 'bp-approval-workflow',
                name: 'Multi-Department Approval',
                code: 'BP-APPR',
                description: 'Multi-department approval workflow',
                category: 'approval',
                isDefaultActive: true,
                icon: 'CheckSquare'
            },
            {
                id: 'bp-mobile-inspection',
                name: 'Mobile Site Inspection',
                code: 'BP-MINSP',
                description: 'Mobile app for site inspections',
                category: 'mobile',
                isDefaultActive: false,
                icon: 'Smartphone'
            },
            {
                id: 'bp-citizen-portal',
                name: 'Online Submission Portal',
                code: 'BP-OSP',
                description: 'Online portal for plan submission',
                category: 'citizen-portal',
                isDefaultActive: true,
                icon: 'Users'
            },
            {
                id: 'bp-cad-integration',
                name: 'CAD Integration',
                code: 'BP-CAD',
                description: 'AutoCAD integration for plan scrutiny',
                category: 'integration',
                isDefaultActive: false,
                icon: 'Layout'
            }
        ]
    },
    {
        departmentId: '5',
        departmentName: 'Birth & Death Registration',
        submodules: [
            {
                id: 'bd-counter-payment',
                name: 'Counter Payment',
                code: 'BD-CP',
                description: 'Manual counter-based fee payment',
                category: 'payment',
                isDefaultActive: true,
                icon: 'Store'
            },
            {
                id: 'bd-approval-workflow',
                name: 'Approval Workflow',
                code: 'BD-APPR',
                description: 'Approval workflow for registrations',
                category: 'approval',
                isDefaultActive: true,
                icon: 'CheckSquare'
            },
            {
                id: 'bd-mobile-registration',
                name: 'Mobile Registration',
                code: 'BD-MREG',
                description: 'Mobile app for field registrations',
                category: 'mobile',
                isDefaultActive: false,
                icon: 'Smartphone'
            },
            {
                id: 'bd-citizen-portal',
                name: 'Online Application Portal',
                code: 'BD-OAP',
                description: 'Online portal for certificate applications',
                category: 'citizen-portal',
                isDefaultActive: true,
                icon: 'Users'
            },
            {
                id: 'bd-hospital-integration',
                name: 'Hospital Integration',
                code: 'BD-HOSP',
                description: 'Direct integration with hospitals',
                category: 'integration',
                isDefaultActive: false,
                icon: 'Building'
            },
            {
                id: 'bd-digital-certificate',
                name: 'Digital Certificates',
                code: 'BD-DCERT',
                description: 'Digital certificate issuance with e-signature',
                category: 'integration',
                isDefaultActive: false,
                icon: 'Award'
            }
        ]
    },
    {
        departmentId: '6',
        departmentName: 'Asset Management',
        submodules: [
            {
                id: 'am-approval-workflow',
                name: 'Asset Approval Workflow',
                code: 'AM-APPR',
                description: 'Multi-level approval for asset acquisition',
                category: 'approval',
                isDefaultActive: true,
                icon: 'CheckSquare'
            },
            {
                id: 'am-mobile-tracking',
                name: 'Mobile Asset Tracking',
                code: 'AM-MTRK',
                description: 'Mobile app for asset tracking and verification',
                category: 'mobile',
                isDefaultActive: false,
                icon: 'Smartphone'
            },
            {
                id: 'am-barcode-scanning',
                name: 'Barcode/QR Scanning',
                code: 'AM-SCAN',
                description: 'Barcode and QR code based asset tracking',
                category: 'integration',
                isDefaultActive: false,
                icon: 'QrCode'
            },
            {
                id: 'am-depreciation',
                name: 'Auto Depreciation',
                code: 'AM-DEPR',
                description: 'Automated depreciation calculation',
                category: 'reporting',
                isDefaultActive: true,
                icon: 'TrendingDown'
            },
            {
                id: 'am-maintenance',
                name: 'Maintenance Scheduling',
                code: 'AM-MAINT',
                description: 'Asset maintenance scheduling and tracking',
                category: 'field-operations',
                isDefaultActive: true,
                icon: 'Wrench'
            }
        ]
    },
    {
        departmentId: '7',
        departmentName: 'Solid Waste Management',
        submodules: [
            {
                id: 'swm-mobile-tracking',
                name: 'Vehicle Tracking',
                code: 'SWM-VTRK',
                description: 'GPS-based vehicle tracking',
                category: 'mobile',
                isDefaultActive: false,
                icon: 'Smartphone'
            },
            {
                id: 'swm-citizen-complaints',
                name: 'Citizen Complaint Portal',
                code: 'SWM-COMP',
                description: 'Online portal for waste collection complaints',
                category: 'citizen-portal',
                isDefaultActive: true,
                icon: 'Users'
            },
            {
                id: 'swm-route-optimization',
                name: 'Route Optimization',
                code: 'SWM-ROUTE',
                description: 'AI-based route optimization for waste collection',
                category: 'integration',
                isDefaultActive: false,
                icon: 'Map'
            },
            {
                id: 'swm-attendance',
                name: 'Field Staff Attendance',
                code: 'SWM-ATT',
                description: 'GPS-based attendance for sanitation workers',
                category: 'field-operations',
                isDefaultActive: true,
                icon: 'UserCheck'
            },
            {
                id: 'swm-payment',
                name: 'User Charge Collection',
                code: 'SWM-PAY',
                description: 'Collection of solid waste user charges',
                category: 'payment',
                isDefaultActive: false,
                icon: 'CreditCard'
            }
        ]
    },
    {
        departmentId: '8',
        departmentName: 'Street Light',
        submodules: [
            {
                id: 'sl-mobile-complaints',
                name: 'Mobile Complaint Tracking',
                code: 'SL-MCOMP',
                description: 'Mobile app for street light complaints',
                category: 'mobile',
                isDefaultActive: true,
                icon: 'Smartphone'
            },
            {
                id: 'sl-citizen-portal',
                name: 'Citizen Complaint Portal',
                code: 'SL-CP',
                description: 'Online portal for reporting issues',
                category: 'citizen-portal',
                isDefaultActive: true,
                icon: 'Users'
            },
            {
                id: 'sl-approval-workflow',
                name: 'Work Order Approval',
                code: 'SL-APPR',
                description: 'Approval workflow for repair work orders',
                category: 'approval',
                isDefaultActive: true,
                icon: 'CheckSquare'
            },
            {
                id: 'sl-gps-mapping',
                name: 'GPS Mapping',
                code: 'SL-GPS',
                description: 'GPS-based mapping of all street lights',
                category: 'integration',
                isDefaultActive: false,
                icon: 'Map'
            },
            {
                id: 'sl-smart-control',
                name: 'Smart Control Integration',
                code: 'SL-SMART',
                description: 'IoT-based smart street light control',
                category: 'integration',
                isDefaultActive: false,
                icon: 'Lightbulb'
            }
        ]
    },
    {
        departmentId: '9',
        departmentName: 'Fire NOC',
        submodules: [
            {
                id: 'fnoc-counter-payment',
                name: 'Counter Payment',
                code: 'FNOC-CP',
                description: 'Manual counter-based fee payment',
                category: 'payment',
                isDefaultActive: true,
                icon: 'Store'
            },
            {
                id: 'fnoc-approval-workflow',
                name: 'Multi-Level Approval',
                code: 'FNOC-APPR',
                description: 'Multi-level approval for NOC issuance',
                category: 'approval',
                isDefaultActive: true,
                icon: 'CheckSquare'
            },
            {
                id: 'fnoc-mobile-inspection',
                name: 'Mobile Inspection',
                code: 'FNOC-MINSP',
                description: 'Mobile app for fire safety inspections',
                category: 'mobile',
                isDefaultActive: false,
                icon: 'Smartphone'
            },
            {
                id: 'fnoc-citizen-portal',
                name: 'Online Application Portal',
                code: 'FNOC-OAP',
                description: 'Online portal for NOC applications',
                category: 'citizen-portal',
                isDefaultActive: true,
                icon: 'Users'
            },
            {
                id: 'fnoc-renewal-alerts',
                name: 'Renewal Alerts',
                code: 'FNOC-RA',
                description: 'Automatic renewal reminder notifications',
                category: 'integration',
                isDefaultActive: true,
                icon: 'Bell'
            }
        ]
    },
    {
        departmentId: '10',
        departmentName: 'Advertisement Tax',
        submodules: [
            {
                id: 'at-counter-payment',
                name: 'Counter Payment',
                code: 'AT-CP',
                description: 'Manual counter-based tax payment',
                category: 'payment',
                isDefaultActive: true,
                icon: 'Store'
            },
            {
                id: 'at-approval-workflow',
                name: 'License Approval',
                code: 'AT-APPR',
                description: 'Multi-level approval for advertisement licenses',
                category: 'approval',
                isDefaultActive: true,
                icon: 'CheckSquare'
            },
            {
                id: 'at-mobile-survey',
                name: 'Mobile Survey',
                code: 'AT-MSURVEY',
                description: 'Mobile app for advertisement board survey',
                category: 'mobile',
                isDefaultActive: false,
                icon: 'Smartphone'
            },
            {
                id: 'at-citizen-portal',
                name: 'Online Application Portal',
                code: 'AT-OAP',
                description: 'Online portal for advertisement applications',
                category: 'citizen-portal',
                isDefaultActive: true,
                icon: 'Users'
            },
            {
                id: 'at-gps-mapping',
                name: 'GPS Location Mapping',
                code: 'AT-GPS',
                description: 'GPS-based mapping of advertisement boards',
                category: 'integration',
                isDefaultActive: false,
                icon: 'Map'
            }
        ]
    },
    {
        departmentId: '11',
        departmentName: 'Property Mutation',
        submodules: [
            {
                id: 'pm-counter-payment',
                name: 'Counter Payment',
                code: 'PM-CP',
                description: 'Manual counter-based fee payment',
                category: 'payment',
                isDefaultActive: true,
                icon: 'Store'
            },
            {
                id: 'pm-approval-workflow',
                name: 'Multi-Level Approval',
                code: 'PM-APPR',
                description: 'Multi-level approval for mutation requests',
                category: 'approval',
                isDefaultActive: true,
                icon: 'CheckSquare'
            },
            {
                id: 'pm-mobile-verification',
                name: 'Mobile Field Verification',
                code: 'PM-MVER',
                description: 'Mobile app for field verification',
                category: 'mobile',
                isDefaultActive: false,
                icon: 'Smartphone'
            },
            {
                id: 'pm-citizen-portal',
                name: 'Online Application Portal',
                code: 'PM-OAP',
                description: 'Online portal for mutation applications',
                category: 'citizen-portal',
                isDefaultActive: true,
                icon: 'Users'
            },
            {
                id: 'pm-document-verification',
                name: 'Digital Document Verification',
                code: 'PM-DOC',
                description: 'Automated document verification system',
                category: 'integration',
                isDefaultActive: false,
                icon: 'FileCheck'
            }
        ]
    },
    {
        departmentId: '12',
        departmentName: 'Drainage & Sewerage',
        submodules: [
            {
                id: 'ds-mobile-complaints',
                name: 'Mobile Complaint Tracking',
                code: 'DS-MCOMP',
                description: 'Mobile app for drainage complaints',
                category: 'mobile',
                isDefaultActive: true,
                icon: 'Smartphone'
            },
            {
                id: 'ds-citizen-portal',
                name: 'Citizen Complaint Portal',
                code: 'DS-CP',
                description: 'Online portal for reporting drainage issues',
                category: 'citizen-portal',
                isDefaultActive: true,
                icon: 'Users'
            },
            {
                id: 'ds-approval-workflow',
                name: 'Work Order Approval',
                code: 'DS-APPR',
                description: 'Approval workflow for repair work orders',
                category: 'approval',
                isDefaultActive: true,
                icon: 'CheckSquare'
            },
            {
                id: 'ds-gps-mapping',
                name: 'Drainage Network Mapping',
                code: 'DS-GPS',
                description: 'GPS-based mapping of drainage network',
                category: 'integration',
                isDefaultActive: false,
                icon: 'Map'
            },
            {
                id: 'ds-maintenance',
                name: 'Preventive Maintenance',
                code: 'DS-MAINT',
                description: 'Scheduled maintenance tracking',
                category: 'field-operations',
                isDefaultActive: true,
                icon: 'Wrench'
            }
        ]
    },
    {
        departmentId: '13',
        departmentName: 'Town Planning',
        submodules: [
            {
                id: 'tp-approval-workflow',
                name: 'Plan Approval Workflow',
                code: 'TP-APPR',
                description: 'Multi-level approval for town planning',
                category: 'approval',
                isDefaultActive: true,
                icon: 'CheckSquare'
            },
            {
                id: 'tp-citizen-portal',
                name: 'Citizen Portal',
                code: 'TP-CP',
                description: 'Online portal for planning queries',
                category: 'citizen-portal',
                isDefaultActive: true,
                icon: 'Users'
            },
            {
                id: 'tp-master-plan',
                name: 'Master Plan Repository',
                code: 'TP-MP',
                description: 'Digital master plan management',
                category: 'reporting',
                isDefaultActive: true,
                icon: 'FolderOpen'
            }
        ]
    },
    {
        departmentId: '14',
        departmentName: 'Marriage Registration',
        submodules: [
            {
                id: 'mr-counter-payment',
                name: 'Counter Payment',
                code: 'MR-CP',
                description: 'Manual counter-based fee payment',
                category: 'payment',
                isDefaultActive: true,
                icon: 'Store'
            },
            {
                id: 'mr-approval-workflow',
                name: 'Approval Workflow',
                code: 'MR-APPR',
                description: 'Approval workflow for registrations',
                category: 'approval',
                isDefaultActive: true,
                icon: 'CheckSquare'
            },
            {
                id: 'mr-citizen-portal',
                name: 'Online Appointment Portal',
                code: 'MR-OAP',
                description: 'Online portal for appointment booking',
                category: 'citizen-portal',
                isDefaultActive: true,
                icon: 'Users'
            },
            {
                id: 'mr-digital-certificate',
                name: 'Digital Certificates',
                code: 'MR-DCERT',
                description: 'Digital certificate issuance with e-signature',
                category: 'integration',
                isDefaultActive: false,
                icon: 'Award'
            },
            {
                id: 'mr-sms-alerts',
                name: 'SMS Notifications',
                code: 'MR-SMS',
                description: 'SMS alerts for appointments and certificates',
                category: 'integration',
                isDefaultActive: true,
                icon: 'MessageSquare'
            }
        ]
    },
    {
        departmentId: '15',
        departmentName: 'Health & Sanitation',
        submodules: [
            {
                id: 'hs-mobile-inspection',
                name: 'Mobile Health Inspection',
                code: 'HS-MINSP',
                description: 'Mobile app for health inspections',
                category: 'mobile',
                isDefaultActive: true,
                icon: 'Smartphone'
            },
            {
                id: 'hs-citizen-complaints',
                name: 'Citizen Complaint Portal',
                code: 'HS-COMP',
                description: 'Online portal for health complaints',
                category: 'citizen-portal',
                isDefaultActive: true,
                icon: 'Users'
            },
            {
                id: 'hs-approval-workflow',
                name: 'License Approval Workflow',
                code: 'HS-APPR',
                description: 'Approval workflow for health licenses',
                category: 'approval',
                isDefaultActive: true,
                icon: 'CheckSquare'
            },
            {
                id: 'hs-disease-tracking',
                name: 'Disease Surveillance',
                code: 'HS-SURV',
                description: 'Disease outbreak tracking and reporting',
                category: 'reporting',
                isDefaultActive: false,
                icon: 'Activity'
            },
            {
                id: 'hs-vaccination',
                name: 'Vaccination Management',
                code: 'HS-VAC',
                description: 'Vaccination camp and tracking management',
                category: 'field-operations',
                isDefaultActive: false,
                icon: 'Syringe'
            }
        ]
    },
    {
        departmentId: '16',
        departmentName: 'Vehicle Tax',
        submodules: [
            {
                id: 'vt-counter-payment',
                name: 'Counter Payment',
                code: 'VT-CP',
                description: 'Manual counter-based tax payment',
                category: 'payment',
                isDefaultActive: true,
                icon: 'Store'
            },
            {
                id: 'vt-mobile-collection',
                name: 'Mobile Tax Collection',
                code: 'VT-MCOLL',
                description: 'Mobile-based vehicle tax collection',
                category: 'mobile',
                isDefaultActive: false,
                icon: 'Smartphone'
            },
            {
                id: 'vt-citizen-portal',
                name: 'Citizen Portal',
                code: 'VT-CP',
                description: 'Online portal for tax payment and queries',
                category: 'citizen-portal',
                isDefaultActive: true,
                icon: 'Users'
            },
            {
                id: 'vt-sms-alerts',
                name: 'SMS Payment Reminders',
                code: 'VT-SMS',
                description: 'SMS alerts for tax due dates',
                category: 'integration',
                isDefaultActive: true,
                icon: 'MessageSquare'
            }
        ]
    }
];

// Helper function to get submodules by department ID
export const getSubmodulesByDepartmentId = (departmentId: string): Submodule[] => {
    const dept = DEPARTMENT_SUBMODULES.find(d => d.departmentId === departmentId);
    return dept?.submodules || [];
};

// Helper function to get submodules by department name
export const getSubmodulesByDepartmentName = (departmentName: string): Submodule[] => {
    const dept = DEPARTMENT_SUBMODULES.find(d => d.departmentName === departmentName);
    return dept?.submodules || [];
};

// Category colors for UI
export const SUBMODULE_CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; icon: string }> = {
    'payment': {
        bg: 'bg-emerald-50 dark:bg-emerald-950/20',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-900',
        icon: 'text-emerald-600 dark:text-emerald-500'
    },
    'collection': {
        bg: 'bg-blue-50 dark:bg-blue-950/20',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-900',
        icon: 'text-blue-600 dark:text-blue-500'
    },
    'approval': {
        bg: 'bg-violet-50 dark:bg-violet-950/20',
        text: 'text-violet-700 dark:text-violet-400',
        border: 'border-violet-200 dark:border-violet-900',
        icon: 'text-violet-600 dark:text-violet-500'
    },
    'mobile': {
        bg: 'bg-cyan-50 dark:bg-cyan-950/20',
        text: 'text-cyan-700 dark:text-cyan-400',
        border: 'border-cyan-200 dark:border-cyan-900',
        icon: 'text-cyan-600 dark:text-cyan-500'
    },
    'reporting': {
        bg: 'bg-amber-50 dark:bg-amber-950/20',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-900',
        icon: 'text-amber-600 dark:text-amber-500'
    },
    'integration': {
        bg: 'bg-indigo-50 dark:bg-indigo-950/20',
        text: 'text-indigo-700 dark:text-indigo-400',
        border: 'border-indigo-200 dark:border-indigo-900',
        icon: 'text-indigo-600 dark:text-indigo-500'
    },
    'citizen-portal': {
        bg: 'bg-rose-50 dark:bg-rose-950/20',
        text: 'text-rose-700 dark:text-rose-400',
        border: 'border-rose-200 dark:border-rose-900',
        icon: 'text-rose-600 dark:text-rose-500'
    },
    'field-operations': {
        bg: 'bg-orange-50 dark:bg-orange-950/20',
        text: 'text-orange-700 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-900',
        icon: 'text-orange-600 dark:text-orange-500'
    }
};
