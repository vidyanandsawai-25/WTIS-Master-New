import apiService from "@/services/water-master/apiService";
import WaterMasterClientPage from "./WaterMasterClientPage";

export type Language = "en" | "mr" | "hi";
export type BackendRate = import("@/lib/api/apiService").BackendRate;

export interface ConsumerData {
  // 1. Consumer Details
  consumerNo: string;
  oldConsumerNo: string;
  wardNo: string;
  propertyNo: string;
  name: string;
  nameMarathi: string;
  address: string;
  addressMarathi: string;
  mobileNo: string;
  emailID: string;
  propertyImage?: string;

  // 2. Connection Details
  connectionType:
    | "Residential"
    | "Commercial"
    | "Industrial"
    | "Govt";
  connectionCategory: "Meter" | "No-Meter";
  connectionStatus: "Active" | "Inactive";
  connectionYear: string;

  // 3. Meter Details
  meterNo: string;
  meterType: string;
  meterSize: string;
  lastReadingDate: string;
  lastReadingValue: string;
  currentReadingDate: string;
  currentReadingValue: string;
  unitsConsumed: number;
  meterImage?: string;

  // 4. Bill Summary
  previousBillPeriodFrom: string;
  previousBillPeriodTo: string;
  currentBillMonth: string;
  currentBillYear: string;
  previousDueAmount: number;
  currentBillAmount: number;
  interestAmount: number;
  discountAmount: number;
  activeDiscountSchemeName: string;
  discountValidTill: string;
  totalPayableAmount: number;
  lastPaymentDate: string;

  // 5. Reading Details
  readingTakenBy: string;
  readingDate: string;
  readingMethod: "Manual" | "Smart Meter" | "Mobile App";
  remarks: string;

  // Legacy fields
  previousDue: number;
  currentBill: number;
  lateFees: number;
  unitsUsed: number;
  lastReading: string;
  currentReading: string;
}

export default async function Home() {
  // Default language for SSR, can be changed by client
  let language: Language = "mr";
  let waterRates: BackendRate[] = [];
  try {
    const response = await apiService.getRates({ pageNumber: 1, pageSize: 100 });
    waterRates = (response.items || []).map((rate: any) => ({
      rateID: rate.rateID ?? 0,
      zoneID: rate.zoneID ?? 0,
      zoneName: rate.zoneName ?? "",
      zoneCode: rate.zoneCode ?? "",
      wardID: rate.wardID ?? 0,
      wardName: rate.wardName ?? "",
      wardCode: rate.wardCode ?? "",
      tapSizeID: rate.tapSizeID ?? 0,
      tapSize: rate.tapSize ?? "",
      diameterMM: rate.diameterMM ?? 0,
      connectionTypeID: rate.connectionTypeID ?? 0,
      connectionTypeName: rate.connectionTypeName ?? "",
      connectionCategoryID: rate.connectionCategoryID ?? 0,
      categoryName: rate.categoryName ?? "",
      minReading: rate.minReading ?? 0,
      maxReading: rate.maxReading ?? 0,
      perLiter: rate.perLiter ?? 0,
      minimumCharge: rate.minimumCharge ?? 0,
      meterOffPenalty: rate.meterOffPenalty ?? 0,
      rate: rate.rate ?? 0,
      year: rate.year ?? 0,
      remark: rate.remark ?? "",
      isActive: rate.isActive ?? false,
      createdBy: rate.createdBy ?? 0,
      createdDate: rate.createdDate ?? "",
      updatedBy: rate.updatedBy ?? 0,
      updatedDate: rate.updatedDate ?? "",
      PipeSizeID: rate.PipeSizeID ?? 0,
      DiameterMM: rate.DiameterMM ?? 0,
      Description: rate.Description ?? "",
      DescriptionEnglish: rate.DescriptionEnglish ?? "",
      SequenceNo: rate.SequenceNo ?? 0,
      IsActive: rate.IsActive ?? false,
      CreatedBy: rate.CreatedBy ?? 0,
      CreatedDate: rate.CreatedDate ?? "",
      UpdatedBy: rate.UpdatedBy ?? "",
      UpdatedDate: rate.UpdatedDate ?? "",
    }));
  } catch (e) {
    waterRates = [];
  }
  return (
    <WaterMasterClientPage language={language} waterRates={waterRates} />
  );
}
