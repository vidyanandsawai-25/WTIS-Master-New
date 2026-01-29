// Status type for active/inactive values
type Status = "Active" | "Inactive";

// Updated WaterRate type for RateMaster columns
export interface WaterRate {
  id: number; // RateID
  zoneID: number;
  wardID: number;
  pipeSizeID: number;
  connectionTypeID: number;
  connectionCategoryID: number;
  minReading: number;
  maxReading: number;
  perLiter: number;
  rate: number;
  minimumCharge: number;
  meterOffPenalty: number;
  remark: string;
  sequenceNo: number;
  isActive: boolean;
  createdBy: number;
  createdDate: string;
  updatedBy?: number;
  updatedDate?: string;
}
/**
 * Custom Hook for Master Data Management
 * Manages categories, connection types, and tap sizes
 */

import { useState, useEffect } from "react";
import {
  categoryActions,
  connectionTypeActions,
  tapSizeActions,
  waterRateActions,
} from "@/app/water-master/waterRateActions";
import apiService from "@/lib/api/apiService";
import { toast } from "react-toastify";

export interface CategoryObj {
  ConnectionCategoryID: number;
  Description: string;
  DescriptionEnglish: string;
  SequenceNo: number;
  IsActive: boolean;
  CreatedBy: number;
  CreatedDate: string;
  UpdatedBy?: number;
  UpdatedDate?: string;
}

export interface TypeObj {
  ConnectionTypeID: number;
  Description: string;
  DescriptionEnglish: string;
  SequenceNo: number;
  IsActive: boolean;
  CreatedBy: number;
  CreatedDate: string;
  UpdatedBy?: number;
  UpdatedDate?: string;
}

interface TapSizeObj {
  PipeSizeID: number;
  DiameterMM: number;
  Description: string;
  DescriptionEnglish: string;
  SequenceNo: number;
  IsActive: boolean;
  CreatedBy: number;
  CreatedDate: string;
  UpdatedBy?: number;
  UpdatedDate?: string;
}

interface UseMasterDataReturn {
  categories: CategoryObj[];
  connectionTypes: TypeObj[];
  tapSizes: TapSizeObj[];
  isLoading: boolean;
  deleteRate?: (id: number) => Promise<void>;
  addRate?: (rate: Omit<WaterRate, "id"> & { tapSize: string; ratePerKL: number; annualFlatRate: number }) => Promise<void>;
  updateRate?: (id: number, updates: Partial<WaterRate>) => Promise<void>;
  addCategory: (description: string, descriptionEnglish: string, sequenceNo: number, isActive: boolean) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  addConnectionType: (data: { Description: string; DescriptionEnglish: string; SequenceNo: number; IsActive: boolean; CreatedBy: number }) => Promise<void>;
  updateConnectionType: (data: { ConnectionTypeID: number | string; Description: string; DescriptionEnglish: string; SequenceNo: number; IsActive: boolean; UpdatedBy: number }) => Promise<void>;
  deleteConnectionType: (id: number) => Promise<void>;
  addTapSize: (data: { Description: string; DescriptionEnglish: string; SequenceNo: number; DiameterMM: number; IsActive: boolean }) => Promise<void>;
  deleteTapSize: (id: number) => Promise<void>;
  addZone: (zoneName: string) => Promise<void>;
  deleteZone: (id: number) => Promise<void>;
  addWard: (description: string, descriptionEnglish: string, ZoneID: number, IsActive: boolean, sequenceNo: number) => Promise<void>;
  editWard: (id: number, description: string, descriptionEnglish: string, ZoneID: number, sequenceNo: number, IsActive: boolean) => Promise<void>;
  deleteWard: (id: number) => Promise<void>;
  refreshAll: () => Promise<void>;
  editZone: (id: number, zoneName: string, zoneCode: string, isActive: boolean) => Promise<void>;
}

export function useMasterData(): UseMasterDataReturn {
    // CRUD for RateMaster
    const addRate = async (rate: Omit<WaterRate, "id"> & { tapSize: string; ratePerKL: number; annualFlatRate: number }) => {
      setIsLoading(true);
      try {
        // Only include properties defined in WaterRate (except id)
        const {
          zoneID,
          wardID,
          pipeSizeID,
          connectionTypeID,
          connectionCategoryID,
          minReading,
          maxReading,
          perLiter,
          rate: rateValue,
          minimumCharge,
          meterOffPenalty,
          remark,
          sequenceNo,
          isActive,
          createdBy,
          createdDate,
          updatedBy,
          updatedDate,
          tapSize,
          ratePerKL,
          annualFlatRate,
        } = rate;

        const payload = {
          zoneID,
          wardID,
          pipeSizeID,
          connectionTypeID,
          connectionCategoryID,
          minReading,
          maxReading,
          perLiter,
          rate: rateValue,
          minimumCharge,
          meterOffPenalty,
          remark,
          sequenceNo,
          isActive,
          createdBy,
          createdDate,
          updatedBy,
          updatedDate,
          tapSize,
          ratePerKL,
          annualFlatRate,
          zoneNo: zoneID ? String(zoneID) : "",
          wardNo: wardID ? String(wardID) : "",
          status: isActive ? ("Active" as Status) : ("Inactive" as Status),
          category: String(connectionCategoryID),
          connectionType: String(connectionTypeID),
        };

        const result = await waterRateActions.createRate(payload);
        if (result.success) {
          toast.success("Rate added successfully!");
          await refreshAll();
        } else {
          toast.error("Failed to add rate.");
        }
      } catch (error: any) {
        toast.error(error?.message || "An error occurred while adding the rate.");
      } finally {
        setIsLoading(false);
      }
    };

    const updateRate = async (id: number, updates: Partial<WaterRate>) => {
      setIsLoading(true);
      try {
        const result = await waterRateActions.updateRate(id, updates);
        if (result.success) {
          toast.success("Rate updated successfully!");
          await refreshAll();
        } else {
          toast.error("Failed to update rate.");
        }
      } catch (error: any) {
        toast.error(error?.message || "An error occurred while updating the rate.");
      } finally {
        setIsLoading(false);
      }
    };
  const [categories, setCategories] = useState<CategoryObj[]>([]);
  const [connectionTypes, setConnectionTypes] = useState<TypeObj[]>([]);
  const [tapSizes, setTapSizes] = useState<TapSizeObj[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all master data on mount
  useEffect(() => {
    refreshAll();
  }, []);

  const refreshAll = async () => {
    setIsLoading(true);
    const [categoriesResult, typesResult, sizesResult] = await Promise.all([
      categoryActions.fetchCategories(),
      connectionTypeActions.fetchConnectionTypes(),
      tapSizeActions.fetchTapSizes(),
    ]);
    if (categoriesResult.success && categoriesResult.data) {
      setCategories(
        categoriesResult.data.map((item: any) => ({
          ConnectionCategoryID: item.ConnectionCategoryID ?? item.CategoryID ?? item.id,
          Description: item.Description ?? "",
          DescriptionEnglish: item.DescriptionEnglish ?? "",
          SequenceNo: item.SequenceNo ?? 0,
          IsActive: item.IsActive ?? true,
          CreatedBy: item.CreatedBy ?? 0,
          CreatedDate: item.CreatedDate ?? "",
          UpdatedBy: item.UpdatedBy,
          UpdatedDate: item.UpdatedDate,
        }))
      );
    }
    if (typesResult.success && typesResult.data) {
      setConnectionTypes(
        typesResult.data.map((item: any) => ({
          ConnectionTypeID: item.ConnectionTypeID ?? item.connectionTypeID ?? item.id,
          Description: item.Description ?? item.description ?? "",
          DescriptionEnglish: item.DescriptionEnglish ?? item.descriptionEnglish ?? "",
          SequenceNo: item.SequenceNo ?? item.sequenceNo ?? 0,
          IsActive: item.IsActive ?? item.isActive ?? true,
          CreatedBy: item.CreatedBy ?? item.createdBy ?? 0,
          CreatedDate: item.CreatedDate ?? item.createdDate ?? "",
          UpdatedBy: item.UpdatedBy ?? item.updatedBy,
          UpdatedDate: item.UpdatedDate ?? item.updatedDate,
        }))
      );
    }
    if (sizesResult.success && sizesResult.data) {
      setTapSizes(
        sizesResult.data.map((item: any) => ({
          PipeSizeID: item.PipeSizeID ?? item.id ?? 0,
          DiameterMM: item.DiameterMM ?? item.diameterMM ?? 0,
          Description: item.Description ?? item.name ?? "",
          DescriptionEnglish: item.DescriptionEnglish ?? "",
          SequenceNo: item.SequenceNo ?? 0,
          IsActive: item.IsActive ?? item.isActive ?? true,
          CreatedBy: item.CreatedBy ?? 0,
          CreatedDate: item.CreatedDate ?? "",
          UpdatedBy: item.UpdatedBy ?? undefined,
          UpdatedDate: item.UpdatedDate ?? undefined,
        }))
      );
    }
    setIsLoading(false);
  };


  const editWard = async (
    id: number,
    Description: string,
    DescriptionEnglish: string,
    ZoneID: number,
    SqquenceNo: number,
    IsActive: boolean
  ) => {
    setIsLoading(true);
    try {
      await apiService.updateWard(id, {
        Description: Description,
        DescriptionEnglish: DescriptionEnglish,
        ZoneID: ZoneID,
        SequenceNo: SqquenceNo,
        IsActive: IsActive,
      });
      toast.success("Ward updated successfully!");
      // Optionally refresh wards here
    } catch (error: any) {
      toast.error(error?.message || "An error occurred while updating the ward.");
    } finally {
      setIsLoading(false);
    }
  };

//deleteRate action
const deleteRate = async (id: number) => {
  setIsLoading(true);
  try {
    const result = await waterRateActions.deleteRate(id);
    if (result.success) {
      // Optionally, refresh the rates list or remove from local state if you keep it
      toast.success("Rate deleted successfully!");
      await refreshAll(); // Refresh all master data, or just rates if you have a separate state
    } else {
      toast.error("Failed to delete rate.");
    }
  } catch (error: any) {
    toast.error(error?.message || "An error occurred while deleting the rate.");
  } finally {
    setIsLoading(false);
  }
};
  // Category operations
  const addCategory = async (
    description: string,
    descriptionEnglish: string,
    sequenceNo: number,
    isActive: boolean
  ) => {
    setIsLoading(true);
    const result = await categoryActions.addCategory({
      Description: description,
      DescriptionEnglish: descriptionEnglish,
      SequenceNo: sequenceNo,
      IsActive: isActive,
      CreatedBy: 1, // Replace with actual user ID if available
    });
    if (result.success && result.data) {
      await refreshAll();
    }
    setIsLoading(false);
  };

  const deleteCategory = async (id: number) => {
    setIsLoading(true);
    const result = await categoryActions.deleteCategory(id);
    if (result.success) {
      setCategories((prev) => prev.filter((c) => c.ConnectionCategoryID !== id));
    }
    setIsLoading(false);
  };


  // Connection Type operations
  const addConnectionType = async (data: { Description: string; DescriptionEnglish: string; SequenceNo: number; IsActive: boolean; CreatedBy: number }) => {
    setIsLoading(true);
    const result = await connectionTypeActions.addConnectionType(data.Description);
    if (result.success) {
      await refreshAll();
    }
    setIsLoading(false);
  };

  const updateConnectionType = async (data: { ConnectionTypeID: number | string; Description: string; DescriptionEnglish: string; SequenceNo: number; IsActive: boolean; }) => {
    setIsLoading(true);
    const result = await connectionTypeActions.updateConnectionType(
      Number(data.ConnectionTypeID),
      data.Description,
      data.DescriptionEnglish,
      Number(data.SequenceNo),
      data.IsActive
    );
    if (result.success) {
      await refreshAll();
    }
    setIsLoading(false);
  };

  const deleteConnectionType = async (id: number) => {
    setIsLoading(true);
    const result = await connectionTypeActions.deleteConnectionType(id);
    if (result.success) {
      setConnectionTypes((prev) => prev.filter((t) => t.ConnectionTypeID !== id));
    }
    setIsLoading(false);
  };


  // Tap Size operations
  const addTapSize = async (data: { Description: string; DescriptionEnglish: string; SequenceNo: number; DiameterMM: number; IsActive: boolean }) => {
    setIsLoading(true);
    const result = await tapSizeActions.addTapSize(data);
    if (result.success && result.data) {
      await refreshAll();
    }
    setIsLoading(false);
  };

  const deleteTapSize = async (id: number) => {
    setIsLoading(true);
    const result = await tapSizeActions.deleteTapSize(id);
    if (result.success) {
      setTapSizes((prev) => prev.filter((s) => s.PipeSizeID !== id));
    }
    setIsLoading(false);
  };
  // Add Zone
  const addZone = async (zoneName: string) => {
    try {
      await apiService.createZone({
        Description: zoneName,
        DescriptionEnglish: zoneName,
        SequenceNo: 1,
        IsActive: true,
        CreatedBy: 1,
      });
    } finally {
      setIsLoading(false);
    }
    // Optionally refresh zones here
  };
  // Delete Zone
  const deleteZone = async (id: number) => {
    setIsLoading(true);
    try {
      await apiService.deleteZone(id); // Ensure the correct API endpoint is used
      toast.success("Zone deleted successfully!");
      // Optionally refresh zones here
    } catch (error: any) {
      toast.error(error?.message || "An error occurred while deleting the zone.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add Ward
  const addWard = async (
    description: string,
    descriptionEnglish: string,
    ZoneID: number,
    IsActive: boolean,
    sequenceNo: number
  ) => {
    setIsLoading(true);
    try {
      await apiService.createWard({
        description: description,
        descriptionEnglish: descriptionEnglish,
        ZoneID: ZoneID,
        IsActive: IsActive,
        SequenceNo: sequenceNo,
      });
      // Optionally refresh wards here
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Ward
  const deleteWard = async (id: number) => {
    setIsLoading(true);
    try {
      await apiService.deleteWard(id); // Ensure this API call is correct
      toast.success("Ward deleted successfully!");
      // Optionally refresh wards here
    } catch (error) {
      toast.error("Failed to delete ward.");
    } finally {
      setIsLoading(false);
    }
  };

  const editZone = async (id: number, zoneName: string, zoneCode: string, isActive: boolean) => {
    setIsLoading(true);
    try {
      await apiService.updateZone(id, {
        Description: zoneName,
        DescriptionEnglish: zoneCode,
        IsActive: isActive,
        UpdatedBy: 1, // or use the appropriate user ID
      });
      toast.success("Zone updated successfully!");
      // Optionally refresh zones here
    } catch (error: any) {
      toast.error(error?.message || "An error occurred while updating the zone.");
    } finally {
      setIsLoading(false);
    }   
  }

  return {
    categories,
    connectionTypes,
    tapSizes,
    isLoading,
    editZone,
    deleteRate,
    addRate,
    updateRate,
    addCategory,
    deleteCategory,
    addConnectionType,
    updateConnectionType,
    deleteConnectionType,
    addTapSize,
    deleteTapSize,
    addZone,
    deleteZone,
    addWard,
    editWard,
    deleteWard,
    refreshAll,
  };
}
