// All static and mock data removed. Please use API service for dynamic data.

export type Status = "Active" | "Inactive";

export interface WaterRate {
	id: number;
	zoneNo: string;
	wardNo: string;
	category: string;
	connectionType: string;
	tapSize: string;
	ratePerKL: number;
	annualFlatRate: number;
	minimumCharge: number;
	meterOffPenalty: number;
	status: Status;
}
