/**
 * Initialize lookup maps from backend data
 */
export async function initializeLookupMaps() {
  // Zones
  const zonesRes = await apiService.getZones({ pageNumber: 1, pageSize: 100, IsActive: true });
  if (zonesRes.items) {
    lookupMaps.zones = new Map(zonesRes.items.map((z: any) => [z.zoneCode || z.zoneName, z.zoneID]));
  }
  // Wards
  const wardsRes = await apiService.getWards({ pageNumber: 1, pageSize: 100, isActive: true });
  if (wardsRes.items) {
    lookupMaps.wards = new Map(wardsRes.items.map((w: any) => [w.wardCode || w.wardName, w.wardID]));
  }
  // Categories
  const catsRes = await apiService.getConnectionCategories({ pageNumber: 1, pageSize: 100, isActive: true });
  if (catsRes.items) {
    lookupMaps.categories = new Map(catsRes.items.map((c: any) => [c.categoryName, c.connectionCategoryID]));
  }
  // Connection Types
  const typesRes = await apiService.getConnectionTypes({ pageNumber: 1, pageSize: 100, isActive: true });
  if (typesRes.items) {
    lookupMaps.connectionTypes = new Map(typesRes.items.map((t: any) => [t.connectionTypeName, t.connectionTypeID]));
  }
  // Tap Sizes
  const tapSizesRes = await apiService.getPipeSizes({ pageNumber: 1, pageSize: 100, isActive: true });
  if (tapSizesRes.items) {
    lookupMaps.tapSizes = new Map(tapSizesRes.items.map((ts: any) => [ts.Description, ts]));
  }
}
/**
 * Billing Cycle Actions
 */
export const billingCycleActions = {
  fetchBillingCycles: async (params: any): Promise<any> => {
    try {
      const response = await apiService.getBillingCyclesMaster(params);
      return response;
    } catch (error) {
      toast.error("❌ Failed to fetch billing cycles");
      throw error;
    }
  },
  fetchBillingCycleById: async (id: number): Promise<any> => {
    try {
      const response = await apiService.getBillingCycleById(id);
      return response;
    } catch (error) {
      toast.error("❌ Failed to fetch billing cycle");
      throw error;
    }
  },
  createBillingCycle: async (data: any): Promise<any> => {
    try {
      const response = await apiService.createBillingCycleMaster(data);
      return response;
    } catch (error) {
      toast.error("❌ Failed to create billing cycle");
      throw error;
    }
  },
  updateBillingCycle: async (id: number, data: any): Promise<any> => {
    try {
      const response = await apiService.updateBillingCycleMaster(id, data);
      return response;
    } catch (error) {
      toast.error("❌ Failed to update billing cycle");
      throw error;
    }
  },
  deleteBillingCycle: async (id: number): Promise<void> => {
    try {
      await apiService.deleteBillingCycleMaster(id);
    } catch (error) {
      toast.error("❌ Failed to delete billing cycle");
      throw error;
    }
  },
};
/**
 * Zone Actions
 */
  
export const zoneActions = {
  fetchZones: async (): Promise<ActionResult<{ id: number; name: string }[]>> => {
    try {
      const response = await apiService.getZones({
        pageNumber: 1,
        pageSize: 100,
        IsActive: true,
      });
      const zones = response.items.map((zone: any, idx: number) => ({
        id: zone.zoneID ?? zone.id ?? idx + 1,
        name: zone.zoneName ?? zone.name ?? ''
      }));
      return { success: true, data: zones };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch zones";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },

  addZone: async (name: string, code: string = ""): Promise<ActionResult<string>> => {
    try {
      if (!name || !name.trim()) {
        throw new Error("Zone name is required");
      }
      const response = await apiService.createZone({
          Description: name.trim(),
          DescriptionEnglish: code.trim() || name.trim(),
          SequenceNo: 1, // TODO: Replace with actual sequence logic if needed
          IsActive: true,
          CreatedBy: CURRENT_USER_ID,
      });
      toast.success("✅ Zone added successfully");
      return { success: true, data: response.items?.Description ?? name };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add zone";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },

  deleteZone: async (id: number): Promise<ActionResult<void>> => {
    try {
      await apiService.deleteZone(id);
      toast.success("✅ Zone deleted successfully");
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete zone";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },
};

/**
 * Ward Actions
 */
export const wardActions = {
  fetchWards: async (): Promise<ActionResult<{ id: number; name: string }[]>> => {
    try {
      const response = await apiService.getWards({
        pageNumber: 1,
        pageSize: 100,
        isActive: true,
      });
      const wards = response.items.map((ward: any, idx: number) => ({
        id: ward.wardID ?? ward.id ?? idx + 1,
        name: ward.wardName ?? ward.name ?? ''
      }));
      return { success: true, data: wards };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch wards";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },

  addWard: async (
    name: string,
    code: string = "",
    ZoneID: number = 1,
    isActive: boolean = true,
    sequenceNo: number = 1
  ): Promise<ActionResult<string>> => {
    try {
      if (!name || !name.trim()) {
        throw new Error("Ward name is required");
      }
      const response = await apiService.createWard({
        description: name.trim(),
        descriptionEnglish: code.trim() || name.trim(),
        ZoneID,
        IsActive: isActive,
        SequenceNo: sequenceNo,
      });
      toast.success("✅ Ward added successfully");
      return { success: true, data: response.items?.wardName ?? name };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add ward";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },

  deleteWard: async (id: number): Promise<ActionResult<void>> => {
    try {
      await apiService.deleteWard(id);
      toast.success("✅ Ward deleted successfully");
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete ward";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },
};
/**
 * Water Rate Actions
 * Business logic layer integrating with real WTIS Backend API
 * Handles validation, error handling, and data transformation
 */

import apiService, { type BackendRate } from "@/lib/api/apiService";
import { type WaterRate } from "@/lib/constants/waterRates";
import { Description } from "@radix-ui/react-dialog";
import { it } from "node:test";
import { toast } from "sonner";

// Current user ID (should come from auth context in production)
const CURRENT_USER_ID = 1;
const CURRENT_YEAR = new Date().getFullYear();

// Lookup maps (should be loaded from API on app init)
const lookupMaps = {
  zones: new Map<string, number>(),
  wards: new Map<string, number>(),
  categories: new Map<string, number>(),
  connectionTypes: new Map<string, number>(),
  tapSizes: new Map<string, { PipeSizeID: number; DiameterMM: number; Description: string; DescriptionEnglish: string; SequenceNo: number; IsActive: boolean; CreatedBy: number; CreatedDate: string; UpdatedBy?: number; UpdatedDate?: string }>(),
};

/**
 * Action result type
 */
type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Map backend rate to frontend format
function mapBackendToFrontend(backendRate: BackendRate): WaterRate {
  return {
    id: backendRate.rateID,
    zoneNo: backendRate.zoneDescription || backendRate.zoneName || backendRate.zoneCode || '',
    wardNo: backendRate.wardDescription || backendRate.wardName || backendRate.wardCode || '',
    category: (backendRate.connectionCategoryDescription || backendRate.categoryName || 'Unknown') as any,
    connectionType: (backendRate.connectionTypeDescription || backendRate.connectionTypeName || 'Unknown') as any,
    tapSize: backendRate.pipeSizeDescription || backendRate.tapSize || '',
    ratePerKL: backendRate.perLiter || 0,
    annualFlatRate: backendRate.rate || 0,
    minimumCharge: backendRate.minimumCharge || 0,
    meterOffPenalty: backendRate.meterOffPenalty || 0,
    status: backendRate.isActive ? "Active" : "Inactive",
  };
}

// Map frontend rate to backend format for creation
export function mapFrontendToBackendCreate(rate: Omit<WaterRate, "id">): any {
  return {
    zoneID: Number(rate.zoneNo),
    wardID: Number(rate.wardNo),
    tapSizeID: Number(rate.tapSize),
    connectionTypeID: Number(rate.connectionType),
    connectionCategoryID: Number(rate.category),
    minReading: 0,
    maxReading: 99999,
    perLiter: rate.ratePerKL,
    minimumCharge: rate.minimumCharge,
    meterOffPenalty: rate.meterOffPenalty,
    rate: rate.annualFlatRate,
    year: CURRENT_YEAR,
    remark: `${rate.category} - ${rate.connectionType}`,
    isActive: rate.status === "Active",
    CreatedBy: CURRENT_USER_ID,
    PipeSizeID: Number(rate.tapSize),
  };
}

/**
 * Water Rate Actions
 */
export const waterRateActions = {
  /**
   * Fetch all water rates
   */
  fetchRates: async (): Promise<ActionResult<WaterRate[]>> => {
    try {
      const response = await apiService.getRates({
        pageNumber: 1,
        pageSize: 1000, // Get all rates
        isActive: undefined, // Include both active and inactive
      });
      const rates = response.items.map(mapBackendToFrontend);
      return { success: true, data: rates };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch rates";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },

  /**
   * Fetch single rate by ID
   */
  fetchRateById: async (id: number): Promise<ActionResult<WaterRate>> => {
    try {
      const backendRate = await apiService.getRateById(id);
      const rate = mapBackendToFrontend(backendRate);
      return { success: true, data: rate };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch rate";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },

  /**
   * Create new rate
   */
  createRate: async (rate: Omit<WaterRate, "id">): Promise<ActionResult<WaterRate>> => {
    try {
      // Validation
      if (!rate.zoneNo || !rate.wardNo) {
        throw new Error("Zone and Ward are required");
      }
      if (!rate.category || !rate.connectionType) {
        throw new Error("Category and Connection Type are required");
      }
      if (rate.ratePerKL < 0 || rate.minimumCharge < 0) {
        throw new Error("Rates must be positive numbers");
      }

      const backendData = mapFrontendToBackendCreate(rate);
      const createdRate = await apiService.createRate(backendData);

      const newRate = mapBackendToFrontend(createdRate);
      toast.success("✅ Rate created successfully");
      return { success: true, data: newRate };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create rate";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },

  /**
   * Update existing rate
   */
  updateRate: async (
    id: number,
    updates: Partial<WaterRate>
  ): Promise<ActionResult<WaterRate>> => {
    try {
      // Fetch current rate to get all fields
      const currentRate = await apiService.getRateById(id);

      // Build complete backend update payload with all required fields
      const backendUpdates: any = {
        zoneID: currentRate.zoneID,
        wardID: currentRate.wardID,
        tapSizeID: currentRate.tapSizeID,
        connectionTypeID: currentRate.connectionTypeID,
        connectionCategoryID: currentRate.connectionCategoryID,
        minReading: currentRate.minReading,
        maxReading: currentRate.maxReading,
        year: currentRate.year,
        remark: currentRate.remark,
        updatedBy: CURRENT_USER_ID,
      };

      // Apply updates
      backendUpdates.perLiter = updates.ratePerKL !== undefined ? updates.ratePerKL : currentRate.perLiter;
      backendUpdates.rate = updates.annualFlatRate !== undefined ? updates.annualFlatRate : currentRate.rate;
      backendUpdates.minimumCharge = updates.minimumCharge !== undefined ? updates.minimumCharge : currentRate.minimumCharge;
      backendUpdates.meterOffPenalty = updates.meterOffPenalty !== undefined ? updates.meterOffPenalty : currentRate.meterOffPenalty;
      backendUpdates.isActive = updates.status !== undefined ? updates.status === "Active" : currentRate.isActive;

      const response = await apiService.updateRate(id, backendUpdates);

      const updatedRate = mapBackendToFrontend(response);
      toast.success("✅ Rate updated successfully");
      return { success: true, data: updatedRate };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update rate";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },

  /**
   * Delete rate
   */
  deleteRate: async (id: number): Promise<ActionResult<void>> => {
    try {
      await apiService.deleteRate(id);

      toast.success("✅ Rate deleted successfully");
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete rate";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },

  /**
   * Delete multiple rates
   */
  deleteMultipleRates: async (ids: number[]): Promise<ActionResult<void>> => {
    try {
      if (ids.length === 0) {
        throw new Error("No rates selected");
      }

      await apiService.deleteMultipleRates(ids);

      toast.success(`✅ ${ids.length} rate(s) deleted successfully`);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete rates";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },

  /**
   * Toggle rate status
   */
  toggleRateStatus: async (id: number): Promise<ActionResult<WaterRate>> => {
    try {
      // First fetch current rate to get current status
      const currentRate = await apiService.getRateById(id);
      
      // Toggle the status
      const newStatus = !currentRate.isActive;
      
      const response = await apiService.updateRate(id, {
        isActive: newStatus,
        updatedBy: CURRENT_USER_ID,
      });

      const updatedRate = mapBackendToFrontend(response);
      toast.info(`Status changed to ${newStatus ? "Active" : "Inactive"}`);
      return { success: true, data: updatedRate };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to toggle status";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },

  /**
   * Export rates to CSV
   */
  exportToCSV: async (rates: WaterRate[]): Promise<ActionResult<void>> => {
    try {
      const headers = [
        "ID",
        "Zone",
        "Ward",
        "Category",
        "Connection Type",
        "Tap Size",
        "Rate per KL",
        "Annual Flat Rate",
        "Minimum Charge",
        "Meter Off Penalty",
        "Status",
      ];

      const rows = rates.map((rate) => [
        rate.id,
        rate.zoneNo,
        rate.wardNo,
        rate.category,
        rate.connectionType,
        rate.tapSize,
        rate.ratePerKL,
        rate.annualFlatRate,
        rate.minimumCharge,
        rate.meterOffPenalty,
        rate.status,
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `water-rates-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success("✅ CSV exported successfully");
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to export CSV";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },
};

/**
 * Category Actions
 */
export const categoryActions = {
    updateCategory: async (
      id: number,
      data: {
        Description: string;
        DescriptionEnglish: string;
        SequenceNo: number;
        IsActive: boolean;
        UpdatedBy: number;
      }
    ): Promise<ActionResult<string>> => {
      try {
        if (!id) throw new Error("Category ID is required");
        if (!data.Description || !data.Description.trim()) throw new Error("Description is required");
        if (!data.DescriptionEnglish || !data.DescriptionEnglish.trim()) throw new Error("Description (English) is required");
        if (!data.SequenceNo || isNaN(Number(data.SequenceNo))) throw new Error("Valid Sequence No is required");
        const response = await apiService.updateConnectionCategory(id, {
          Description: data.Description.trim(),
          DescriptionEnglish: data.DescriptionEnglish.trim(),
          SequenceNo: data.SequenceNo,
          IsActive: data.IsActive,
          UpdatedBy: data.UpdatedBy,
        });
        toast.success("✅ Category updated successfully");
        return { success: true, data: response.Description };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update category";
        toast.error(`❌ ${message}`);
        return { success: false, error: message };
      }
    },
  fetchCategories: async (): Promise<ActionResult<any[]>> => {
    try {
      const response = await apiService.getConnectionCategories({
        pageNumber: 1,
        pageSize: 100,
        isActive: true,
      });
      let items = Array.isArray(response.items)
        ? response.items
        : Array.isArray(response)
          ? response
          : [];
      if (items.length === 0 && Array.isArray(response)) {
        items = response;
      }
      // Normalize backend fields for modal
      const categories = items.map((cat: any) => ({
        ConnectionCategoryID: cat.ConnectionCategoryID ?? cat.connectionCategoryID ?? cat.CategoryID ?? cat.id,
        Description: cat.Description ?? cat.description ?? cat.name ?? cat.categoryName ?? '',
        DescriptionEnglish: cat.DescriptionEnglish ?? cat.descriptionEnglish ?? '',
        SequenceNo: cat.SequenceNo ?? cat.sequenceNo ?? '',
        IsActive: typeof cat.IsActive !== 'undefined' ? cat.IsActive : (typeof cat.isActive !== 'undefined' ? cat.isActive : true),
      }));
      return { success: true, data: categories };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch categories";
      toast.error(`\u274c ${message}`);
      return { success: false, error: message };
    }
  },

  addCategory: async (data: {
    Description: string;
    DescriptionEnglish: string;
    SequenceNo: number;
    IsActive: boolean;
    CreatedBy: number;
  }): Promise<ActionResult<string>> => {
    try {
      if (!data.Description || !data.Description.trim()) {
        throw new Error("Description is required");
      }
      if (!data.DescriptionEnglish || !data.DescriptionEnglish.trim()) {
        throw new Error("Description (English) is required");
      }
      if (!data.SequenceNo || isNaN(Number(data.SequenceNo))) {
        throw new Error("Valid Sequence No is required");
      }
      // Legacy usage of createdBy: CURRENT_USER_ID removed
      const response = await apiService.createConnectionCategory({
        Description: data.Description.trim(),
        DescriptionEnglish: data.DescriptionEnglish.trim(),
        SequenceNo: data.SequenceNo,
        IsActive: data.IsActive,
        CreatedBy: data.CreatedBy, // All fields now passed as CreatedBy
      });
      toast.success("✅ Category added successfully");
      return { success: true, data: response.Description };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add category";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },

  deleteCategory: async (id: number): Promise<ActionResult<void>> => {
    try {
      await apiService.deleteConnectionCategory(id);
      toast.success("✅ Category deleted successfully");
      return { success: true };
      // Note: Backend doesn't support delete by name, only by ID
      // In production, you'd call the backend with the id
      toast.info("Category deletion requires ID - feature pending");
      return { success: false, error: "Not implemented" };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete category";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },
};

/**
 * Connection Type Actions
 */
export const connectionTypeActions = {
  fetchConnectionTypes: async (): Promise<ActionResult<{ id: number; Description: string; DescriptionEnglish: string; SequenceNo: number; isActive: boolean;}[]>> => {
    try {
      const response = await apiService.getConnectionTypes({
        pageNumber: 1,
        pageSize: 100,
        isActive: true,
      });
      // Map backend to { id, name, description, isActive }
      const types = response.items.map((type: any) => ({
        id: type.connectionTypeID,
        Description: type.description,
        DescriptionEnglish: type.descriptionEnglish ?? "",
        SequenceNo: type.sequenceNo,
        isActive: type.isActive ?? true,
      }));
      return { success: true, data: types };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch connection types";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },

  addConnectionType: async (name: string): Promise<ActionResult<string>> => {
    try {
      if (!name || !name.trim()) {
        throw new Error("Connection type name is required");
      }

      // Use real API endpoint
      const response = await apiService.createConnectionType({
          Description: name.trim(),
          DescriptionEnglish: `${name.trim()} connection`,
          IsActive: true,
          SequenceNo: 1,
      });
      toast.success("✅ Connection type added successfully");
      return { success: true, data: response.Description ?? response.ConnectionTypeID ?? "" };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add connection type";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },

  updateConnectionType: async (id: number, Description: string, DescriptionEnglish: string,SequenceNo: number, isActive: boolean): Promise<ActionResult<string>> => {
    try {
      if (!Description || !Description.trim()) {
        throw new Error("Connection type name is required");
      } 
      const response = await apiService.updateConnectionType(id, {
        Description: Description.trim(),
        DescriptionEnglish: DescriptionEnglish.trim(),  
        SequenceNo: SequenceNo,
        IsActive: isActive,
      
      });
      toast.success("✅ Connection type updated successfully");
      return { success: true, data: response.Description ?? response.ConnectionTypeID ?? "" };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update connection type";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    } 
  },

  deleteConnectionType: async (id: number): Promise<ActionResult<void>> => {
    try {
      await apiService.deleteConnectionType(id);
      toast.success("✅ Connection type deleted successfully");
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete connection type";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },
};


// ...existing code...

export const tapSizeActions = {
  // Fetch all pipe sizes
  fetchTapSizes: async (): Promise<ActionResult<any[]>> => {
    try {
      const response = await apiService.getPipeSizes({
        pageNumber: 1,
        pageSize: 100,
        isActive: true,
      });
      const sizes = response.items.map((item: any) => ({
        id: item.pipeSizeID ?? item.PipeSizeID,
        Description: item.Description ?? item.sizeName ?? item.SizeName ?? item.description ?? '',
        DescriptionEnglish: item.DescriptionEnglish ?? item.descriptionEnglish ?? '',
        SequenceNo: item.SequenceNo ?? item.sequenceNo ?? 0,
        DiameterMM: item.diameterMM ?? item.DiameterMM ?? 0,
        IsActive: item.isActive ?? item.IsActive ?? true,
      }));
      return { success: true, data: sizes };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch pipe sizes";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },

  // Add a new pipe size
  addTapSize: async (data: { Description: string; DescriptionEnglish: string; SequenceNo: number; DiameterMM: number; IsActive: boolean }) => {
    try {
      if (!data.Description || !data.DiameterMM) {
        throw new Error("Description and Diameter are required");
      }
      const response = await apiService.createPipeSize({
        Description: data.Description.trim(),
        DescriptionEnglish: data.DescriptionEnglish?.trim() ?? '',
        SequenceNo: data.SequenceNo ?? 0,
        DiameterMM: data.DiameterMM,
        IsActive: data.IsActive,
        CreatedBy: CURRENT_USER_ID,
      });
      toast.success("✅ Pipe size added successfully");
      return { success: true, data: response };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add pipe size";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },

  // Get a single pipe size by ID
  fetchTapSizeById: async (id: number): Promise<ActionResult<any>> => {
    try {
      const response = await apiService.getPipeSizeById(id);
      return {
        success: true,
        data: {
          id: response.pipeSizeID ?? response.PipeSizeID,
          Description: response.Description ?? response.sizeName ?? response.description ??'',
          DescriptionEnglish: response.DescriptionEnglish ?? response.descriptionEnglish ?? '',
          SequenceNo: response.SequenceNo ?? response.sequenceNo,
          DiameterMM: response.diameterMM ?? response.DiameterMM ?? 0,
          IsActive: response.isActive ?? response.IsActive ?? true,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch pipe size";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },

  // Update a pipe size by ID
  updateTapSize: async (id: number, data: { Description: string; DescriptionEnglish: string; SequenceNo: number; DiameterMM: number; IsActive: boolean }) => {
    try {
      const response = await apiService.updatePipeSize(id, {
        Description: data.Description.trim(),
        DescriptionEnglish: data.DescriptionEnglish?.trim() ?? '',
        SequenceNo: data.SequenceNo ?? 0,
        DiameterMM: data.DiameterMM,
        IsActive: data.IsActive,
        UpdatedBy: CURRENT_USER_ID,
      });
      toast.success("✅ Pipe size updated successfully");
      return { success: true, data: response };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update pipe size";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },

  // Delete a pipe size by ID
  deleteTapSize: async (id: number): Promise<ActionResult<void>> => {
    try {
      await apiService.deletePipeSize(id);
      toast.success("✅ Pipe size deleted successfully");
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete pipe size";
      toast.error(`❌ ${message}`);
      return { success: false, error: message };
    }
  },
};



