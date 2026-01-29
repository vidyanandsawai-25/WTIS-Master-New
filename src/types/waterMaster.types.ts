// Types/interfaces for WTISManagement and related water master entities

export type Language = "en" | "hi" | "mr";

export interface WTISManagementProps {
  language: Language;
}

export type ward = { id: number; wardName: string; zoneID: number };

export interface BackendRate {
  [key: string]: any;
}
