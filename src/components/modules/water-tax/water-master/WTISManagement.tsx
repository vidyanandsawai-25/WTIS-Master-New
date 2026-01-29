"use client";
import { initializeLookupMaps, mapFrontendToBackendCreate } from "@/app/water-master/waterRateActions";
  // Ensure lookup maps are initialized before allowing add/edit
  
  
import AddCategoryModal from "./modals/AddCategoryModal";
import AddSizeModal from "./modals/AddSizeModal";
import AddZoneModal from "./modals/AddZoneModal";
import { categoryActions } from "@/app/water-master/waterRateActions";
import AddTypeModal from "./modals/AddTypeModal";
import type { BackendRate } from "@/lib/api/apiService";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { RateMaster } from "./RateMaster";
import wtisEn from "../../../../locales/wtis-en.json";
import { confirmDeleteToast } from "@/components/common/confirmDeleteToast";
import { connectionTypeActions } from "@/app/water-master/waterRateActions";

import { toast } from "sonner";
import AddWardModal from "./modals/AddWardModal";
import { ToggleSwitch } from "@/components/common/ToggleSwitch";
import {
  Search,
  Plus,
  Edit2,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  ChevronRight,
  Droplet,
  TrendingUp,
  CheckCircle2,
  X,
  Download,
  BarChart3,
  Zap,
  Settings,
  Trash2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Label } from "@/components/common/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/common/dialog";
import { Badge } from "@/components/common/badge";
import { Checkbox } from "@/components/common/water-master/checkbox";
import { motion } from "framer-motion";
import { useRateManagement } from "@/hooks/water-master/useRateManagement";
import { useMasterData } from "@/hooks/water-master/useMasterData";
import { useZones } from "@/hooks/water-master/useZones";
import { useWards } from "@/hooks/water-master/useWards";
import type { WaterRate } from "@/lib/constants/waterRates";
import type { Zone } from "@/hooks/water-master/useZones";
import { waterRateActions } from "@/app/water-master/waterRateActions";
import type { Ward } from "@/hooks/water-master/useWards";
import apiService from "@/lib/api/apiService";
import BillingCycleMaster from "@/components/modules/water-tax/water-master/BillingCycleMaster";
import NewConnectionBillingMaster from "@/components/modules/water-tax/water-master/NewConnectionBillingMaster";
import type { Language } from "@/app/water-master/page"; // Adjust the import path as needed


interface WTISManagementProps {
  language: string;
  waterRates: any[];
}

export default function WTISManagement({ language, waterRates }: WTISManagementProps) {

  const [lookupsReady, setLookupsReady] = useState(false);
  useEffect(() => {
    initializeLookupMaps().then(() => setLookupsReady(true));
  }, []);

  // Use custom hooks
  const [categorySearch, setCategorySearch] = useState("");
  const [typeSearch, setTypeSearch] = useState("");
  const [sizeSearch, setSizeSearch] = useState("");
  // Rates state, always fetched from backend
  const [rates, setRates] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedConnectionType, setSelectedConnectionType] = useState("");
  const [selectedTapSize, setSelectedTapSize] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingRate, setEditingRate] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    zoneNo: "",
    wardNo: "",
    category: "",
    connectionType: "",
    tapSize: "",
    ratePerKL: "",
    annualFlatRate: "",
    minimumCharge: "",
    meterOffPenalty: "",
    status: "Active",
  });
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newTypeName, setNewTypeName] = useState("");
  const [newSizeName, setNewSizeName] = useState("");
  const [newDiameter, setNewDiameter] = useState("");

  const [newStatus, setNewStatus] = useState(true); // true = Active, false = Inactive
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [showAddSizeModal, setShowAddSizeModal] = useState(false);
  const [rateChartType, setRateChartType] = useState<string>("total");
  const [showRateChartModal, setShowRateChartModal] = useState(false);
  const [reloadZonesWards, setReloadZonesWards] = useState(0);

  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);

  // Localization usage
  const t = wtisEn;

  const translateCategory = (name: string) => name;
  const translateConnectionType = (name: string) => name;
  // Filtering logic
  const filteredRates = useMemo(() => {
    return rates.filter((rate) => {
      const matchesSearch =
        (rate.category?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (rate.connectionType?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (rate.tapSize?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || rate.category === selectedCategory;
      const matchesConnectionType = !selectedConnectionType || rate.connectionType === selectedConnectionType;
      const matchesTapSize = !selectedTapSize || rate.tapSize === selectedTapSize;
      return matchesSearch && matchesCategory && matchesConnectionType && matchesTapSize;
    });
  }, [rates, searchQuery, selectedCategory, selectedConnectionType, selectedTapSize]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRates.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedRates = filteredRates.slice(startIndex, endIndex);


  // Fetch rates from backend
  // (Removed duplicate fetchRates declaration to resolve redeclaration error)

  // Add Rate
  const addRate = async (rate: any) => {
    setIsLoading(true);
    try {
      const res = await waterRateActions.createRate(rate);
      if (res.success) {
        toast.success("Rate added successfully");
        fetchRates();
      } else {
        toast.error(res.error || "Failed to add rate");
      }
    } catch {
      toast.error("Failed to add rate");
    } finally {
      setIsLoading(false);
    }
  };

  // Update Rate
  const updateRate = async (id: number, rate: any) => {
    setIsLoading(true);
    try {
      const res = await waterRateActions.updateRate(id, rate);
      if (res.success) {
        toast.success("Rate updated successfully");
        fetchRates();
      } else {
        toast.error(res.error || "Failed to update rate");
      }
    } catch {
      toast.error("Failed to update rate");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Selected Rates
  // (Removed duplicate deleteSelectedRates declaration to resolve redeclaration error)

  // Toggle status (active/inactive)
  const toggleStatus = async (id: number) => {
    // Implement as needed, e.g., call updateRate with toggled status
    const rate = rates.find(r => r.id === id);
    if (!rate) return;
    await updateRate(id, { ...rate, status: rate.status === "Active" ? "Inactive" : "Active" });
  };




  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedConnectionType("");
    setSelectedTapSize("");
  };
  const selectAllOnPage = () => {
    setSelectedRows(paginatedRates.map((rate) => rate.id));
  };
  const selectRow = (id: number) => {
    setSelectedRows((prev) => prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]);
  };
  const exportToCSV = async () => {
    // Implement CSV export logic
  };

  const {
    deleteSelectedRates
    , } = useRateManagement();

  const {
    categories,
    connectionTypes,
    tapSizes,
    addCategory,
    deleteRate,
    addConnectionType,
    addTapSize,
    deleteCategory,
    deleteConnectionType,
    deleteTapSize,
    editZone,
    editWard,  
      addZone,
    deleteZone, // Ensure deleteZone is included
    addWard,
    deleteWard, // Ensure deleteWard is included
    refreshAll,
  } = useMasterData();

  const [zonesReloadKey, setZonesReloadKey] = useState(0);
  const [typeReloadKey, setTypeReloadKey] = useState(0);
  const { zones: fetchedZones, loading: zonesLoading } = useZones(zonesReloadKey);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);

  // Ensure zones state is updated with fetchedZones having correct properties
  useEffect(() => {
    if (Array.isArray(fetchedZones)) {
      setZones(
        fetchedZones.map((zone: any) => ({
          ZoneID: zone.ZoneID ?? zone.zoneID ?? zone.id ?? "",
          Description: zone.Description ?? zone.description ?? zone.zoneName ?? zone.name ?? "",
          DescriptionEnglish: zone.DescriptionEnglish ?? zone.descriptionEnglish ?? "",
          SequenceNo: zone.SequenceNo ?? zone.sequenceNo ?? 0,
          IsActive: typeof zone.IsActive === 'boolean' ? zone.IsActive : !!zone.isActive,
        }))
      );
    }
  }, [fetchedZones]);
  const [wardsReloadKey, setWardsReloadKey] = useState(0);
  const { wards, loading: wardsLoading } = useWards(wardsReloadKey);


  const fetchRates = useCallback(() => {
    setLoading(true);
    waterRateActions.fetchRates()
     .then((res: any) => {
    console.log("Backend fetchRates response:", res);
    if (res.success && Array.isArray(res.data)) {
      setRates(res.data);
      console.log("Rates set in state:", res.data);
    } else {
      setRates([]);
    }
      })
      .catch(() => toast.error("Failed to fetch rates"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);



  const handleSave = useCallback(async () => {
    if (!lookupsReady) {
      toast.error("Reference data not loaded. Please wait.");
      return;
    }
    setLoading(true);
    try {
      // Build frontend rate object for mapping
      const frontendRate = {
        id: editingRate?.id ?? undefined,
        zoneNo: formData.zoneNo ,
        wardNo: formData.wardNo ,
        category: formData.category,
        connectionType: formData.connectionType,
        tapSize: formData.tapSize,
        ratePerKL: formData.ratePerKL,
        annualFlatRate: formData.annualFlatRate,
        minimumCharge: formData.minimumCharge,
        meterOffPenalty: formData.meterOffPenalty,
        status: formData.status,
      };
          // const frontendRate = {
          //   id: editingRate?.id ?? undefined,
          //   zoneNo: formData.zoneNo,
          //   wardNo: formData.wardNo,
          //   category: formData.category,
          //   connectionType: formData.connectionType,
          //   tapSize: formData.tapSize,
          //   ratePerKL: formData.ratePerKL,
          //   annualFlatRate: formData.annualFlatRate,
          //   minimumCharge: formData.minimumCharge,
          //   meterOffPenalty: formData.meterOffPenalty,
          //   status: formData.status,
          // };
      // Map to backend payload
      const backendPayload = mapFrontendToBackendCreate(frontendRate);
      console.log("[DEBUG] handleSave backendPayload:", backendPayload);
      let res;
      if (editingRate) {
        // Update
        res = await waterRateActions.updateRate(editingRate.id, frontendRate);
      } else {
        // Create
        res = await waterRateActions.createRate(frontendRate);
      }
      if (res.success) {
        toast.success(editingRate ? "Rate updated successfully" : "Rate added successfully");
        fetchRates();
        setReloadZonesWards((r) => r + 1);
        setShowModal(false);
      } else {
        // Show backend error, handle duplicate gracefully
        if (res.error && res.error.toLowerCase().includes("already exists")) {
          toast.error("A rate with these details already exists.");
        } else {
          toast.error(res.error || "Failed to save rate");
        }
      }
    } catch (err) {
      console.error("[ERROR] handleSave:", err);
      toast.error("Failed to save rate");
    } finally {
      setLoading(false);
    }
  }, [editingRate, formData, selectedZone, selectedWard, fetchRates, setShowModal, lookupsReady]);


  const handleEditWard = (ward: any) => {
    setEditingWardId(ward.wardID);
    setEditingWardValue(ward.wardName || ward.description || "");
    setEditingDescriptionEnglish(ward.wardCode || ward.descriptionEnglish || "");
    setEditingSequenceNo((ward.sequenceNo !== undefined && ward.sequenceNo !== null) ? ward.sequenceNo.toString() : "");
    setSelectedZoneID((ward.zoneID !== undefined && ward.zoneID !== null) ? ward.zoneID.toString() : "");
    setNewWardActive(ward.isActive);
  };

  const handleSaveEditWard = async () => {
    if (!editingWardValue.trim()) {
      toast.error("Ward name cannot be empty");
      return;
    }
    try {
      if (!selectedZoneID) {
        toast.error("Please select a zone");
        return;
      }

      if (editingWardId === null) {
        toast.error("No ward selected for editing.");
        return;
      }
      await editWard(
        editingWardId,
        editingWardValue.trim(),
        editingDescriptionEnglish.trim(),
        Number(editingSequenceNo) || 0,
        Number(selectedZoneID),
        newWardActive
      );
      toast.success("Ward updated successfully");
      setEditingWardId(null);
      setEditingWardValue("");
      setSelectedZoneID("");
      setEditingSequenceNo("");
      setNewWardActive(true);
      setWardsReloadKey(prev => prev + 1);
      if (typeof refreshAll === 'function') await refreshAll();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update ward.");
    }
  };

  const handleCancelEditWard = () => {
    setEditingWardId(null);
    setEditingWardValue("");
    setSelectedZoneID("");
    setNewWardActive(true);
  };

  const handleDeleteWard = async (id: number) => {
    try {
      await deleteWard(id);
      toast.success("Ward deleted successfully");
      setWardsReloadKey(prev => prev + 1);
      if (typeof refreshAll === 'function') await refreshAll();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete ward.");
    }
  };
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [showAddWardModal, setShowAddWardModal] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newDescriptionEnglish, setNewDescriptionEnglish] = useState("");
  const [newSequenceNo, setNewSequenceNo] = useState("");
  const [newZoneActive, setNewZoneActive] = useState(true);
  const [zoneSearch, setZoneSearch] = useState("");
  const [editingZoneId, setEditingZoneId] = useState<number | null>(null);
  const [editingDescription, setEditingDescription] = useState("");
  const [editingDescriptionEnglish, setEditingDescriptionEnglish] = useState("");
  const [editingSequenceNo, setEditingSequenceNo] = useState("");
  const [editingZoneActive, setEditingZoneActive] = useState(true);
  const [newWardName, setNewWardName] = useState("");
  const [newWardActive, setNewWardActive] = useState(true);
  const [wardSearch, setWardSearch] = useState("");
  const [editingWardId, setEditingWardId] = useState<number | null>(null);
  const [editingWardValue, setEditingWardValue] = useState("");
  const [selectedZoneID, setSelectedZoneID] = useState(""); // Add this line

  const [statsData, setStatsData] = useState({
    totalRates: 0,
    meterRates: 0,
    nonMeterRates: 0,
    activeRates: 0,
  });

  // BackendRate type imported from types
  const [listData, setListData] = useState<BackendRate[]>([]);
  const [showListModal, setShowListModal] = useState(false);
  const [listTitle, setListTitle] = useState("");

  const fetchStats = async () => {
    try {
      const [totalRates, meterRates, nonMeterRates, activeRates] = await Promise.all([
        apiService.getRates({ isActive: true }), // Total rates
        apiService.getRates({ connectionTypeID: 11 }), // Meter rates
        apiService.getRates({ connectionTypeID: 12 }), // Non-meter rates
        apiService.getRates({ isActive: false }), // Inactive rates
      ]);

      setStatsData({
        totalRates: totalRates.items.length,
        meterRates: meterRates.items.length,
        nonMeterRates: nonMeterRates.items.length,
        activeRates: activeRates.items.length,
      });
    } catch (error: any) {
      console.error("Error fetching stats data:", error); // Log the error details
      toast.error("Failed to fetch stats data. Please check the console for details.");
    }
  };

  const fetchListData = async (queryParams: Record<string, any>, title: string) => {
    try {
      // Use getRates or the appropriate method from your apiService
      const response = await apiService.getRates(queryParams);
      setListData(response.items || []);
      setListTitle(title);
      setShowListModal(true);
    } catch (error: any) {
      console.error(`Error fetching list data:`, error); // Log the error details
      toast.error("Failed to fetch list data. Please check the console for details.");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleAddZone = async () => {
    if (!newDescription.trim()) {
      toast.error("Please enter description");
      return;
    }
    if (!newDescriptionEnglish.trim()) {
      toast.error("Please enter description (English)");
      return;
    }
    if (!newSequenceNo.trim() || isNaN(Number(newSequenceNo))) {
      toast.error("Please enter a valid sequence number");
      return;
    }

    try {
      await addZone(newDescription.trim());
      toast.success(`Zone "${newDescription}" added successfully!`);
      setNewDescription("");
      setNewDescriptionEnglish("");
      setNewSequenceNo("");
      setNewZoneActive(true);
      setShowAddZoneModal(false);
      setZonesReloadKey(prev => prev + 1); // Trigger zones reload
      if (typeof refreshAll === 'function') await refreshAll();
    } catch (err: any) {
      toast.error(err?.message || "Failed to add zone.");
    }
  };

  const handleEditZone = (zone: any) => {
    setEditingZoneId(zone.ZoneID);
    setEditingDescription(zone.Description);
    setEditingDescriptionEnglish(zone.DescriptionEnglish);
    setEditingSequenceNo((zone.SequenceNo !== undefined && zone.SequenceNo !== null) ? zone.SequenceNo.toString() : "");
    setEditingZoneActive(zone.IsActive);
  };

  const handleSaveEditZone = async () => {
    if (!editingDescription.trim()) {
      toast.error("Description cannot be empty");
      return;
    }
    if (!editingDescriptionEnglish.trim()) {
      toast.error("Description (English) cannot be empty");
      return;
    }
    if (!editingSequenceNo.trim() || isNaN(Number(editingSequenceNo))) {
      toast.error("Please enter a valid sequence number");
      return;
    }
    try {
      if (editingZoneId === null) {
        toast.error("No zone selected for editing.");
        return;
      }
      await editZone(editingZoneId, editingDescription.trim(), editingDescriptionEnglish.trim(), editingZoneActive);
      toast.success("Zone updated successfully");
      setEditingZoneId(null);
      setEditingDescription("");
      setEditingDescriptionEnglish("");
      setEditingSequenceNo("");
      setEditingZoneActive(true);
      setZonesReloadKey(prev => prev + 1); // Trigger zones reload
      if (typeof refreshAll === 'function') await refreshAll();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update zone.");
    }
  };

  const handleCancelEditZone = () => {
    setEditingZoneId(null);
    setEditingDescription("");
    setEditingDescriptionEnglish("");
    setEditingSequenceNo("");
    setEditingZoneActive(true);
  };

  const handleDeleteZone = async (id: number) => {
    try {
      await deleteZone(id);
      toast.success("Zone deleted successfully");
      setZonesReloadKey(prev => prev + 1); // Trigger zones reload
      if (typeof refreshAll === 'function') await refreshAll();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete zone.");
    }
  };

  const handleAddWard = async () => {
    if (!selectedZoneID) {
      toast.error("Please select a zone for the ward.");
      return;
    }
    if (!newDescription.trim()) {
      toast.error("Please enter description.");
      return;
    }
    if (!newDescriptionEnglish.trim()) {
      toast.error("Please enter description (English).");
      return;
    }
    if (!newSequenceNo.trim() || isNaN(Number(newSequenceNo))) {
      toast.error("Please enter a valid sequence number.");
      return;
    }
    // Check if ward already exists in the selected zone
    const exists = wards.some(
      ward =>
        ward?.description?.trim().toLowerCase() === newDescription.trim().toLowerCase() &&
        Number(ward?.zoneID) === Number(selectedZoneID)
    );
    if (exists) {
      toast.error("Ward already exists in this zone.");
      return;
    }
    try {
      await addWard(
        newDescription.trim(), // wardName
        newDescriptionEnglish.trim(), // wardCode
        Number(selectedZoneID), // zoneID
        newWardActive, // isActive
        Number(newSequenceNo) // sequenceNo
      );
      toast.success(`Ward "${newDescription}" added successfully!`);
      setNewDescription("");
      setNewDescriptionEnglish("");
      setNewSequenceNo("");
      setShowAddWardModal(false);
      setWardsReloadKey(prev => prev + 1); // Ensure wards are refetched
      if (typeof refreshAll === 'function') await refreshAll();
    } catch (err: any) {
      toast.error(err?.message || "Failed to add ward.");
    }
  };
  // Delete handlers for modals
  const handleDeleteCategory = async (id: number) => {
    await deleteCategory(id);
  };
  const handleDeleteConnectionType = async (id: number) => {
    await deleteConnectionType(id);
  };
  const handleDeleteTapSize = async (id: number) => {
    await deleteTapSize(id);
  };

  // Unique tap sizes for filter dropdown
  const uniqueTapSizes = Array.from(
    new Set(
      tapSizes.map((size: any) =>
        typeof size === "object" && "name" in size ? size.name : size
      )
    )
  );

  // Handler stub for editing category (to be implemented)
  // Inline edit states for category, type, tap size
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState("");
  const [editingTypeId, setEditingTypeId] = useState<number | null>(null);
  const [editingTypeValue, setEditingTypeValue] = useState("");
  const [editingTypeDescription, setEditingTypeDescription] = useState("");

  const [editingSizeId, setEditingSizeId] = useState<number | null>(null);
  const [editingSizeValue, setEditingSizeValue] = useState("");
  const [editingDiameter, setEditingDiameter] = useState("");
  const [editingStatus, setEditingStatus] = useState(true);

  const handleEditCategory = (cat: any) => {
    setEditingCategoryId(cat.id);
    setEditingCategoryValue(cat.name);
  };
  const handleSaveEditCategory = async () => {
    if (!editingCategoryValue.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    // TODO: Replace with actual update logic
    setEditingCategoryId(null);
    setEditingCategoryValue("");
    toast.success("Category updated successfully");
  };
  const handleCancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryValue("");
  };

  const handleEditType = (type: any) => {
    setEditingTypeId(type.id);
    setEditingTypeValue(type.name);
    setEditingTypeDescription(type.description || "");
  };
  const handleSaveEditType = async () => {
    if (!editingTypeValue.trim()) {
      toast.error("Type name cannot be empty");
      return;
    }
    if (editingTypeId == null) {
      toast.error("No type selected for editing.");
      return;
    }
    try {
      await connectionTypeActions.updateConnectionType(
        editingTypeId,
        editingTypeValue.trim(),
        editingTypeDescription,
        Number(editingSequenceNo), // 1 for active, 0 for inactive
        editingStatus, // Replace 1 with the actual user ID if available
      );
      toast.success("Type updated successfully");
      setEditingTypeId(null);
      setEditingTypeValue("");
      setEditingTypeDescription("");
      setTimeout(() => setTypeReloadKey(prev => prev + 1), 300);
      if (typeof refreshAll === 'function') await refreshAll();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update type.");
    }
  };
  const handleCancelEditType = () => {
    setEditingTypeId(null);
    setEditingTypeValue("");
    setEditingTypeDescription("");
  };

  const handleEditSize = (size: any) => {
    setEditingSizeId(size.id);
    setEditingSizeValue(size.name);
    setEditingDiameter((size.diameterMM !== undefined && size.diameterMM !== null) ? size.diameterMM.toString() : "");
    setEditingStatus(size.status === "Active");
  };
  const handleSaveEditSize = async () => {
    if (!editingSizeValue.trim()) {
      toast.error("Size name cannot be empty");
      return;
    }
    if (!editingDiameter.trim()) {
      toast.error("Diameter cannot be empty");
      return;
    }
    // TODO: Replace with actual update logic (call updateTapSize API if available)
    setEditingSizeId(null);
    setEditingSizeValue("");
    setEditingDiameter("");
    setEditingStatus(true);
    toast.success("Tap size updated successfully");
  };
  const handleCancelEditSize = () => {
    setEditingSizeId(null);
    setEditingSizeValue("");
    setEditingDiameter("");
    setEditingStatus(true);
  };
  // Handler stub for editing zone (to be implemented)
  // const handleEditZone = (zone: any) => {
  //   toast.info(`Edit zone: ${zone.zoneName}`);
  // };
  // Handler stub for editing ward (to be implemented)
  // const handleEditWard = (ward: any) => {
  //   toast.info(`Edit ward: ${ward.wardName}`);
  // };

  const handleAddNew = () => {
    setEditingRate(null);
    setFormData({
      zoneID: 0,
      wardID: 0,
      category: "Residential",
      connectionType: "Meter",
      tapSize: "",
      ratePerKL: 0,
      annualFlatRate: 0,
      minimumCharge: 0,
      meterOffPenalty: 0,
      status: "Active",
    });
    setSelectedZone(null);
    setSelectedWard(null);
    setShowModal(true);
  };

  const handleEdit = (rate: any) => {
    setEditingRate(rate);
    setFormData({
      zoneNo: rate.zoneNo?.toString() || rate.zoneID?.toString() || "",
      wardNo: rate.wardNo?.toString() || rate.wardID?.toString() || "",
      category: rate.category?.toString() || rate.connectionCategoryID?.toString() || "",
      connectionType: rate.connectionType?.toString() || rate.connectionTypeID?.toString() || "",
      tapSize: rate.tapSize?.toString() || rate.tapSizeID?.toString() || "",
      ratePerKL: rate.ratePerKL,
      annualFlatRate: rate.annualFlatRate,
      minimumCharge: rate.minimumCharge,
      meterOffPenalty: rate.meterOffPenalty,
      status: rate.status,
    });
    setShowModal(true);
  };

  // const handleAddWard = async () => {
  //   if (!selectedZoneID) {
  //     toast.error("Please select a zone");
  //     return;
  //   }
  //   if (!newWardName.trim()) {
  //     toast.error("Please enter ward name");
  //     return;
  //   }
  //   try {
  //     await addWard(newWardName.trim(), Number(selectedZoneID));
  //     toast.success(`Ward \"${newWardName}\" added successfully!`);
  //     setNewWardName("");
  //     setNewWardActive(true);
  //     setTimeout(() => setWardsReloadKey(prev => prev + 1), 300); // Ensure reload after backend update
  //     if (typeof refreshAll === 'function') await refreshAll();
  //   } catch (err: any) {
  //     toast.error(err?.message || "Failed to add ward.");
  //   }
  // };
  const handleAddType = async () => {
    if (!newTypeName.trim()) {
      toast.error("Please enter type name");
      return;
    }
    await addConnectionType({
      Description: newTypeName.trim(),
      DescriptionEnglish: newTypeName.trim(),
      SequenceNo: 1,
      IsActive: true,
      CreatedBy: 1, // Replace with actual user ID if available
    });
    // TODO: Replace with actual add logic (call addTapSize API if available)
    setNewTypeName("");
    setShowAddTypeModal(false);
    toast.success("Type added successfully");
  };

  const handleAddSize = async () => {
    if (!newSizeName.trim()) {
      toast.error("Please enter size name");
      return;
    }
    if (!newDiameter.trim() || isNaN(Number(newDiameter))) {
      toast.error("Please enter a valid diameter");
      return;
    }
    await addTapSize({
      Description: newSizeName.trim(),
      DescriptionEnglish: newSizeName.trim(),
      DiameterMM: Number(newDiameter),
      IsActive: newStatus,
      SequenceNo: 1,
      
    });
    setNewSizeName("");
    setNewDiameter("");
    setNewStatus(true);
    setShowAddSizeModal(false);
    if (typeof refreshAll === 'function') await refreshAll();
  };

  const handleCardClick = (filterType: string) => {
    setRateChartType(filterType);
    setShowRateChartModal(true);
  };

  const handleDownloadRateChart = () => {
    exportToCSV();
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedConnectionType,
    selectedTapSize,
    searchQuery,
  ].filter((f) => f).length;

  const getRateChartTitle = () => {
    if (rateChartType === "total") return t.totalRates;
    if (rateChartType === "meter") return t.meterRates;
    if (rateChartType === "nonMeter") return t.nonMeterRates;
    if (rateChartType === "active") return t.activeRates;
    return t.rateChartTitle;
  };




  const [activeTab, setActiveTab] = React.useState<'rate' | 'billing' | 'newconnection'>('rate');

  if (loading && rates.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex-1 h-screen overflow-auto p-2 md:p-3 bg-gradient-to-br from-[#F8FBFF] via-[#EEF5FC] to-[#E9F1FA]">
      <div className="max-w-[1800px] mx-auto w-full">
        {/* Header with Gradient and Tabs */}
        <div className="relative bg-gradient-to-r from-[#005A9C] via-[#0077CC] to-[#005A9C] text-white p-1.5 md:p-2 rounded-lg mb-2 md:mb-3 shadow-xl overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-1.5">
            <div className="flex items-center gap-2">
              <motion.div
                className="bg-white/20 backdrop-blur-sm p-1 rounded-lg shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Settings className="h-3 w-3 md:h-4 md:w-4" />
              </motion.div>
              <div>
                <h1 className="text-xs md:text-sm mb-0">{t.title}</h1>
                <p className="text-[10px] md:text-xs text-blue-100">{t.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-1.5 py-0.5 shadow-lg text-[10px] md:text-xs">
                  <Zap className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" />
                  {t.filtersActive}: {activeFiltersCount}
                </Badge>
              )}
            </div>
            <div className="mt-2 flex gap-2">
              <button
                className={`px-4 py-1.5 rounded-t-lg font-semibold text-xs md:text-sm transition-colors duration-150 ${activeTab === 'rate' ? 'bg-white text-[#005A9C] shadow' : 'bg-white/10 text-white hover:bg-white/20'}`}
                onClick={() => setActiveTab('rate')}
                type="button"
              >
                Rate Master
              </button>
              <button
                className={`px-4 py-1.5 rounded-t-lg font-semibold text-xs md:text-sm transition-colors duration-150 ${activeTab === 'billing' ? 'bg-white text-[#005A9C] shadow' : 'bg-white/10 text-white hover:bg-white/20'}`}
                onClick={() => setActiveTab('billing')}
                type="button"
              >
                Billing Cycle Master
              </button>
              <button
                className={`px-4 py-1.5 rounded-t-lg font-semibold text-xs md:text-sm transition-colors duration-150 ${activeTab === 'newconnection' ? 'bg-white text-[#005A9C] shadow' : 'bg-white/10 text-white hover:bg-white/20'}`}
                onClick={() => setActiveTab('newconnection')}
                type="button"
              >
                New Connection Billing Master
              </button>
            </div>
          </div>
          {/* Tabs */}
          {/* <div className="mt-2 flex gap-2">
            <button
              className={`px-4 py-1.5 rounded-t-lg font-semibold text-xs md:text-sm transition-colors duration-150 ${activeTab === 'rate' ? 'bg-white text-[#005A9C] shadow' : 'bg-white/10 text-white hover:bg-white/20'}`}
              onClick={() => setActiveTab('rate')}
              type="button"
            >
              Rate Master
            </button>
            <button
              className={`px-4 py-1.5 rounded-t-lg font-semibold text-xs md:text-sm transition-colors duration-150 ${activeTab === 'billing' ? 'bg-white text-[#005A9C] shadow' : 'bg-white/10 text-white hover:bg-white/20'}`}
              onClick={() => setActiveTab('billing')}
              type="button"
            >
              Billing Cycle Master
            </button>
          </div> */}
        </div>

        {/* Tab Content */}
        {activeTab === 'rate' && (
          <>
            {/* Statistics Cards - Compact & Attractive Design */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 mb-2">
              <motion.div
                whileHover={{ y: -2, scale: 1.01 }}
                onClick={() => fetchListData({ isActive: true }, t.totalRates)}
                className="bg-white rounded-lg shadow-lg p-2 border-l-4 border-[#005A9C] relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-60"></div>
                <div className="absolute top-0 right-0 opacity-10">
                  <BarChart3 className="h-12 w-12 text-[#005A9C]" />
                </div>
                <div className="relative z-10 text-left">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="bg-gradient-to-br from-[#005A9C] to-[#0077CC] p-1 rounded shadow-sm">
                      <BarChart3 className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-[10px] text-gray-700 font-semibold leading-tight">
                      {t.totalRates}
                    </p>
                  </div>
                  <p className="text-2xl text-[#005A9C] mb-0 leading-none font-bold">
                    {statsData.totalRates}
                  </p>
                  <p className="text-[9px] text-gray-500 mt-0.5">
                    {t.viewRateChart}
                  </p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ y: -2, scale: 1.01 }}
                onClick={() => fetchListData({ connectionTypeID: 11 }, t.meterRates)}
                className="bg-white rounded-lg shadow-lg p-2 border-l-4 border-green-500 relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-60"></div>
                <div className="absolute top-0 right-0 opacity-10">
                  <TrendingUp className="h-12 w-12 text-green-500" />
                </div>
                <div className="relative z-10 text-left">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-1 rounded shadow-sm">
                      <TrendingUp className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-[10px] text-gray-700 font-semibold leading-tight">
                      {t.meterRates}
                    </p>
                  </div>
                  <p className="text-2xl text-green-600 mb-0 leading-none font-bold">
                    {statsData.meterRates}
                  </p>
                  <p className="text-[9px] text-gray-500 mt-0.5">
                    {t.viewRateChart}
                  </p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ y: -2, scale: 1.01 }}
                onClick={() => fetchListData({ connectionTypeID: 12 }, t.nonMeterRates)}
                className="bg-white rounded-lg shadow-lg p-2 border-l-4 border-orange-500 relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-60"></div>
                <div className="absolute top-0 right-0 opacity-10">
                  <Droplet className="h-12 w-12 text-orange-500" />
                </div>
                <div className="relative z-10 text-left">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-1 rounded shadow-sm">
                      <Droplet className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-[10px] text-gray-700 font-semibold leading-tight">
                      {t.nonMeterRates}
                    </p>
                  </div>
                  <p className="text-2xl text-orange-600 mb-0 leading-none font-bold">
                    {statsData.nonMeterRates}
                  </p>
                  <p className="text-[9px] text-gray-500 mt-0.5">
                    {t.viewRateChart}
                  </p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ y: -2, scale: 1.01 }}
                onClick={() => fetchListData({ isActive: false }, t.activeRates)}
                className="bg-white rounded-lg shadow-lg p-2 border-l-4 border-purple-500 relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-60"></div>
                <div className="absolute top-0 right-0 opacity-10">
                  <CheckCircle2 className="h-12 w-12 text-purple-500" />
                </div>
                <div className="relative z-10 text-left">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-1 rounded shadow-sm">
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-[10px] text-gray-700 font-semibold leading-tight">
                      {t.activeRates}
                    </p>
                  </div>
                  <p className="text-2xl text-purple-600 mb-0 leading-none font-bold">
                    {statsData.activeRates}
                  </p>
                  <p className="text-[9px] text-gray-500 mt-0.5">
                    {t.viewRateChart}
                  </p>
                </div>
              </motion.div>
            </div>
            {/* Filters and Search Bar - Compact */}

            {/* Selected Rows Actions */}
            {/* {selectedRows.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border border-amber-300 rounded-lg p-2 mb-2 flex items-center justify-between"
              >
                <span className="text-xs text-amber-800">
                  {t.selectedCount}: {selectedRows.length}
                </span>
                <Button
                  onClick={deleteSelectedRates}
                  size="sm"
                  variant="danger"
                  className="h-7 px-3 text-xs bg-red-500 hover:bg-red-600"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  {t.deleteSelected}
                </Button>
              </motion.div>
            )} */}
            {/* Table */}
            {/* <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"> */}
            {/* ...existing table code... */}
            {/* </div> */}
            {/* List Modal */}
            <Dialog open={showListModal} onOpenChange={setShowListModal}>
              <DialogContent className="max-w-4xl bg-white">
                <DialogHeader>
                  <DialogTitle>{listTitle}</DialogTitle>
                </DialogHeader>
                <div className="py-4 overflow-y-auto max-h-[70vh]">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        {listData.length > 0 &&
                          Object.keys(listData[0]).map((key) => (
                            <th
                              key={key}
                              className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700"
                            >
                              {key}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {listData.map((row, index) => (
                        <tr key={row.rateID ?? index} className="hover:bg-gray-50">
                          {Object.entries(row).map(([key, value]) => (
                            <td
                              key={key + '-' + (row.rateID ?? index)}
                              className="border border-gray-300 px-3 py-2 text-xs text-gray-600"
                            >
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={() => setShowListModal(false)}
                    variant="outline"
                    className="h-8 px-4 text-xs"
                  >
                    {t.close}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Filters and Search Bar - Compact */}
            <div className="bg-white rounded-lg shadow-md p-2 mb-2 border border-gray-200">
              <div className="flex flex-col lg:flex-row gap-1.5 items-stretch lg:items-center w-full justify-between">
                {/* Search */}
                <div className="relative w-full lg:flex-shrink-0 lg:w-[200px]">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-7 h-8 text-xs border-gray-300 focus:border-[#005A9C] focus:ring-[#005A9C] w-full"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-1.5 flex-1 items-center justify-end">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="h-8 text-xs w-[110px] border-gray-300">
                      <SelectValue placeholder={t.category} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-categories">{t.allTypes}</SelectItem>
                      {categories.filter(cat => cat.Description && cat.Description !== '').map((cat) => (
                        <SelectItem key={cat.ConnectionCategoryID ?? `cat-${cat.Description}`} value={cat.Description}>
                          {translateCategory(cat.Description)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedConnectionType}
                    onValueChange={setSelectedConnectionType}
                  >
                    <SelectTrigger className="h-8 text-xs w-[120px] border-gray-300">
                      <SelectValue placeholder={t.connectionType} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-types">{t.allTypes}</SelectItem>
                      {connectionTypes
                        .filter((type) =>
                          type && typeof type === 'object' && 'Description' in type && type.Description
                        )
                        .map((type, idx) => (
                          <SelectItem
                            key={type.ConnectionTypeID ?? idx}
                            value={type.Description}
                          >
                            {type.Description}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedTapSize} onValueChange={setSelectedTapSize}>
                    <SelectTrigger className="h-8 text-xs w-[95px] border-gray-300">
                      <SelectValue placeholder={t.tapSize} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-sizes">{t.allSizes}</SelectItem>
                      {uniqueTapSizes.filter(size => (typeof size === 'object' && size.name) || (typeof size === 'string' && size)).map((size, idx) => (
                        <SelectItem key={typeof size === 'object' ? size.id ?? `size-${size.name}` : size || idx} value={typeof size === 'object' ? size.name : size}>
                          {typeof size === 'object' ? size.name : size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {activeFiltersCount > 0 && (
                    <Button
                      onClick={clearFilters}
                      size="sm"
                      className="h-8 px-3 text-xs bg-red-500 text-white hover:bg-red-600"
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      {t.clearFilters}
                    </Button>
                  )}

                  {/* Add Buttons - Responsive Design */}
                  <div className="hidden xl:flex gap-1.5">
                    <Button
                      onClick={() => setShowAddZoneModal(true)}
                      size="sm"
                      className="h-8 px-3 text-xs bg-[#005A9C] text-white  whitespace-nowrap"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Zone
                    </Button>
                    <Button
                      onClick={() => setShowAddWardModal(true)}
                      size="sm"
                      className="h-8 px-3 text-xs bg-[#005A9C] text-white  whitespace-nowrap"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Ward
                    </Button>
                    {/* Add Zone Modal */}
                    <AddZoneModal
                      open={showAddZoneModal}
                      onOpenChange={setShowAddZoneModal}
                      newDescription={newDescription}
                      setNewDescription={setNewDescription}
                      newDescriptionEnglish={newDescriptionEnglish}
                      setNewDescriptionEnglish={setNewDescriptionEnglish}
                      newSequenceNo={newSequenceNo}
                      setNewSequenceNo={setNewSequenceNo}
                      newZoneActive={newZoneActive}
                      setNewZoneActive={setNewZoneActive}
                      handleAddZone={handleAddZone}
                      zones={zones}
                      editingZoneId={editingZoneId}
                      setEditingZoneId={setEditingZoneId}
                      editingDescription={editingDescription}
                      setEditingDescription={setEditingDescription}
                      editingDescriptionEnglish={editingDescriptionEnglish}
                      setEditingDescriptionEnglish={setEditingDescriptionEnglish}
                      editingSequenceNo={editingSequenceNo}
                      setEditingSequenceNo={setEditingSequenceNo}
                      editingZoneActive={editingZoneActive}
                      setEditingZoneActive={setEditingZoneActive}
                      handleEditZone={handleEditZone}
                      handleSaveEditZone={handleSaveEditZone}
                      handleCancelEditZone={handleCancelEditZone}
                      deleteZone={handleDeleteZone}
                      toast={toast}
                      confirmDeleteToast={confirmDeleteToast}
                      refreshAll={refreshAll}
                    />

                    {/* Add Ward Modal */}
                    <AddWardModal
                      open={showAddWardModal}
                      onOpenChange={setShowAddWardModal}
                      selectedZoneID={selectedZoneID}
                      setSelectedZoneID={setSelectedZoneID}
                      newDescription={newDescription}
                      setNewDescription={setNewDescription}
                      newDescriptionEnglish={newDescriptionEnglish}
                      setNewDescriptionEnglish={setNewDescriptionEnglish}
                      newSequenceNo={newSequenceNo}
                      setNewSequenceNo={setNewSequenceNo}
                      newWardActive={newWardActive}
                      setNewWardActive={setNewWardActive}
                      handleAddWard={handleAddWard}
                      zones={zones.map(zone => ({
                        zoneID: zone.ZoneID ?? zone.ZoneID ?? zone.ZoneID ?? "",
                        zoneName: zone.Description ?? zone.Description ?? zone.Description ?? "",
                        ...zone,
                      }))}
                      wards={wards}
                      wardSearch={wardSearch}
                      editingWardId={editingWardId}
                      setEditingWardId={setEditingWardId}
                      editingWardValue={editingWardValue}
                      setEditingWardValue={setEditingWardValue}
                      handleEditWard={handleEditWard}
                      handleSaveEditWard={handleSaveEditWard}
                      handleCancelEditWard={handleCancelEditWard}
                      refreshAll={refreshAll}
                      toast={toast}
                      confirmDeleteToast={confirmDeleteToast}
                      deleteWard={handleDeleteWard}
                      setShowAddWardModal={setShowAddWardModal}
                      t={t}
                      editingWardDescriptionEnglish={editingDescriptionEnglish}
                      setEditingWardDescriptionEnglish={setEditingDescriptionEnglish}
                      editingWardSequenceNo={editingSequenceNo}
                      setEditingWardSequenceNo={setEditingSequenceNo}
                      editingWardActive={editingZoneActive}
                      setEditingWardActive={setEditingZoneActive}
                    />
                    <Button
                      data-testid="add-category-btn"
                      onClick={() => setShowAddCategoryModal(true)}
                      size="sm"
                      className="h-8 px-3 text-xs bg-[#005A9C] text-white  whitespace-nowrap"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Category
                    </Button>

                    <Button
                      onClick={() => setShowAddTypeModal(true)}
                      size="sm"
                      className="h-8 px-3 text-xs bg-[#005A9C] text-white  whitespace-nowrap"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      {t.connectionType}
                    </Button>

                    <Button
                      onClick={() => setShowAddSizeModal(true)}
                      size="sm"
                      className="h-8 px-3 text-xs bg-[#005A9C] text-white  whitespace-nowrap"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      {t.tapSize}
                    </Button>

                    <Button
                      data-testid="add-rate-btn"
                      onClick={handleAddNew}
                      size="sm"
                      className="h-8 px-3 text-xs bg-[#005A9C] text-white  whitespace-nowrap"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Rate
                    </Button>
                  </div>

                  {/* Medium screens: Icon + short text */}
                  <div className="hidden lg:flex xl:hidden gap-1.5">
                    <Button
                      data-testid="add-category-btn-md"
                      onClick={() => setShowAddCategoryModal(true)}
                      size="sm"
                      className="h-8 px-2 text-xs bg-blue-500 text-white hover:bg-blue-600"
                      title="Add Category"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      onClick={() => setShowAddTypeModal(true)}
                      size="sm"
                      className="h-8 px-2 text-xs bg-green-500 text-white hover:bg-green-600"
                      title={t.addNewType}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      data-testid="add-rate-btn-md"
                      onClick={handleAddNew}
                      size="sm"
                      className="h-8 px-3 text-xs bg-[#005A9C] text-white hover:bg-[#004080] whitespace-nowrap"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Rate
                    </Button>
                  </div>

                  {/* Mobile: Icon only buttons */}
                  <div className="flex lg:hidden gap-1">
                    <Button
                      onClick={() => setShowAddCategoryModal(true)}
                      size="sm"
                      className="h-8 px-2 text-xs bg-blue-500 text-white hover:bg-blue-600"
                      title={t.addNewCategory}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      onClick={() => setShowAddTypeModal(true)}
                      size="sm"
                      className="h-8 px-2 text-xs bg-green-500 text-white hover:bg-green-600"
                      title={t.addNewType}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      onClick={() => setShowAddSizeModal(true)}
                      size="sm"
                      className="h-8 px-2 text-xs bg-purple-500 text-white hover:bg-purple-600"
                      title={t.addNewSize}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      onClick={handleAddNew}
                      size="sm"
                      className="h-8 px-2 text-xs bg-[#005A9C] text-white hover:bg-[#004080]"
                      title={t.addNewRate}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Rows Actions */}
            {selectedRows.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border border-amber-300 rounded-lg p-2 mb-2 flex items-center justify-between"
              >
                <span className="text-xs text-amber-800">
                  {t.selectedCount}: {selectedRows.length}
                </span>
                <Button
                  onClick={deleteSelectedRates}
                  size="sm"
                  variant="danger"
                  className="h-7 px-3 text-xs bg-red-500 hover:bg-red-600"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  {t.deleteSelected}
                </Button>
              </motion.div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              {/* Table Header - Entries per page */}
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-gray-600">{t.showEntries}:</Label>
                  <Select
                    value={entriesPerPage.toString()}
                    onValueChange={(v) => {
                      setEntriesPerPage(parseInt(v));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-7 text-xs w-[80px] border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-gray-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredRates.length)} of{" "}
                  {filteredRates.length} entries
                </p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#005A9C] to-[#0077CC] text-white">
                    <tr>
                      <th className="px-3 py-2.5 text-center text-xs w-12 border border-gray-200">
                        <Checkbox
                          checked={
                            paginatedRates.length > 0 &&
                            selectedRows.length === paginatedRates.length
                          }
                          onCheckedChange={selectAllOnPage}
                          className="border-white"
                        />
                      </th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold border border-gray-200">
                        {t.zoneNo}
                      </th>
                      {/* <th className="px-3 py-2.5 text-left text-xs font-semibold border border-gray-200">
                        {t.zoneCode}
                      </th> */}
                      <th className="px-3 py-2.5 text-left text-xs font-semibold border border-gray-200">
                        {t.wardNo}
                      </th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold border border-gray-200">
                        {t.category}
                      </th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold border border-gray-200">
                        {t.connectionType}
                      </th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold border border-gray-200">
                        {t.tapSize}
                      </th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold border border-gray-200">
                        {t.ratePerKL}
                      </th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold border border-gray-200">
                        {t.annualFlatRate}
                      </th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold border border-gray-200">
                        {t.minimumCharge}
                      </th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold border border-gray-200">
                        {t.meterOffPenalty}
                      </th>
                      <th className="px-3 py-2.5 text-center text-xs font-semibold border border-gray-200">
                        {t.status}
                      </th>
                      <th className="px-3 py-2.5 text-center text-xs font-semibold border border-gray-200">
                        {t.actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedRates.map((rate, index) => (
                      <motion.tr
                        key={rate.id ?? index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="px-3 py-2.5 text-center border border-gray-200">
                          <Checkbox
                            checked={selectedRows.includes(rate.id)}
                            onCheckedChange={() => selectRow(rate.id)}
                          />
                        </td>
                        <td className="px-3 py-2.5 text-xs text-gray-900 font-medium border border-gray-200">
                          {rate.zoneNo}
                        </td>
                        {/* <td className="px-3 py-2.5 text-xs text-gray-900 font-medium border border-gray-200">
                          {rate.zoneCode}
                        </td> */}
                        <td className="px-3 py-2.5 text-xs text-gray-900 font-medium border border-gray-200">
                          {rate.wardNo}
                        </td>
                        <td className="px-3 py-2.5 text-xs text-gray-700 border border-gray-200">
                          {rate.category}
                        </td>
                        <td className="px-3 py-2.5 text-xs text-gray-700 border border-gray-200">
                          {rate.connectionType}
                        </td>
                        <td className="px-3 py-2.5 text-xs text-gray-700 border border-gray-200">
                          {rate.tapSize}
                        </td>
                        <td className="px-3 py-2.5 text-xs text-left font-medium text-gray-900 border border-gray-200">
                          ₹{rate.ratePerKL}
                        </td>
                        <td className="px-3 py-2.5 text-xs text-right font-medium text-gray-900 border border-gray-200">
                          ₹{rate.annualFlatRate}
                        </td>
                        <td className="px-3 py-2.5 text-xs text-left font-medium text-gray-900 border border-gray-200">
                          ₹{rate.minimumCharge}
                        </td>
                        <td className="px-3 py-2.5 text-xs text-left font-medium text-gray-900 border border-gray-200">
                          ₹{rate.meterOffPenalty}
                        </td>
                        <td className="px-3 py-2.5 text-center border border-gray-200">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleStatus(rate.id)}
                            className="h-7 px-2 hover:bg-gray-100"
                          >
                            {rate.status === "Active" ? (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-200 text-[10px] px-1.5 py-0.5">
                                {t.active}
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-[10px] px-1.5 py-0.5">
                                {t.inactive}
                              </Badge>
                            )}
                          </Button>
                        </td>
                        <td className="px-3 py-2.5 text-center border border-gray-200">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(rate)}
                              className="h-7 px-2 text-blue-600 hover:bg-blue-50"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                if (typeof deleteRate === "function") {
                                  confirmDeleteToast(() => deleteRate(rate.id));
                                } else {
                                  toast.error("Delete function is not available.");
                                }
                              }}
                              className="h-7 px-2 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <Button
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-7 px-3 text-xs"
                  variant="outline"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  Previous
                </Button>
                <span className="text-xs text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-7 px-3 text-xs"
                  variant="outline"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>


            {/* Add/Edit Rate Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogContent className="max-w-2xl bg-white">
                <DialogHeader>
                  <DialogTitle>
                    {editingRate ? t.editRate : t.addRate}
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the details for the water rate
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-xs">{t.zoneNo}</Label>
                    <Select
                      value={formData.zoneNo?.toString() || ""}
                      onValueChange={v => { setFormData({ ...formData, zoneNo: v }); setSelectedZone(Number(v)); }}
                      disabled={zonesLoading}
                    >
                      <SelectTrigger className="h-9 text-xs border rounded-md">
                        <SelectValue placeholder={zonesLoading ? "Loading..." : "Select zone"} />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.map((zone: Zone) => (
                          <SelectItem key={zone.ZoneID} value={zone.ZoneID?.toString() || ""} className="text-xs">
                            {zone.Description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">{t.wardNo}</Label>
                    <Select
                      value={formData.wardNo?.toString() || ""}
                      onValueChange={v => { setFormData({ ...formData, wardNo: v }); setSelectedWard(Number(v)); }}
                      disabled={wardsLoading || !formData.zoneNo}
                    >
                      <SelectTrigger className="h-9 text-xs border rounded-md">
                        <SelectValue placeholder={wardsLoading ? "Loading..." : (!formData.zoneNo ? "Select zone first" : "Select ward")} />
                      </SelectTrigger>
                      <SelectContent>
                        {wards
                          .filter((ward: Ward) => formData.zoneNo && String(ward.zoneID) === String(formData.zoneNo))
                          .map((ward: Ward) => (
                            <SelectItem key={ward.wardID} value={ward.wardID?.toString() || ""} className="text-sm">
                              {ward.description}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">{t.category}</Label>
                    <Select
                      value={formData.category?.toString() || ""}
                      onValueChange={v => setFormData({ ...formData, category: v })}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={`cat-${cat.ConnectionCategoryID}`} value={cat.ConnectionCategoryID?.toString() || ""}>
                            {translateCategory(cat.Description)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">{t.connectionType}</Label>
                    <Select
                      value={formData.connectionType?.toString() || ""}
                      onValueChange={v => setFormData({ ...formData, connectionType: v })}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {connectionTypes
                          .filter(type => type && typeof type === 'object' && 'ConnectionTypeID' in type)
                          .map((type, idx) => (
                            <SelectItem key={type.ConnectionTypeID ?? idx} value={type.ConnectionTypeID?.toString() || ""}>
                              {type.Description}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">{t.tapSize}</Label>
                    <Select
                      value={formData.tapSize?.toString() || ""}
                      onValueChange={v => setFormData({ ...formData, tapSize: v })}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">
                          {t.SelectSize}
                        </SelectItem>
                        {tapSizes.map((size) => (
                          <SelectItem key={`size-${size.PipeSizeID}`} value={size.PipeSizeID?.toString() || ""}>
                            {size.Description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">{t.ratePerKL}</Label>
                    <Input
                      type="number"
                      value={formData.ratePerKL}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ratePerKL: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">{t.annualFlatRate}</Label>
                    <Input
                      type="number"
                      value={formData.annualFlatRate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          annualFlatRate: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">{t.minimumCharge}</Label>
                    <Input
                      type="number"
                      value={formData.minimumCharge}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minimumCharge: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">{t.meterOffPenalty}</Label>
                    <Input
                      type="number"
                      value={formData.meterOffPenalty}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          meterOffPenalty: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">{t.status}</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v: any) =>
                        setFormData({ ...formData, status: v })
                      }
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">{t.active}</SelectItem>
                        <SelectItem value="Inactive">{t.inactive}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="h-8 px-4 text-xs"
                  >
                    {t.cancel}
                  </Button>
                  <Button
                    onClick={handleSave}

                    className="h-8 px-4 text-xs bg-[#005A9C] hover:bg-[#004080]"
                  >
                    {t.save}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>



            <AddCategoryModal
              open={showAddCategoryModal}
              onOpenChange={setShowAddCategoryModal}
              newDescription={newDescription}
              setNewDescription={setNewDescription}
              newDescriptionEnglish={newDescriptionEnglish}
              setNewDescriptionEnglish={setNewDescriptionEnglish}
              newSequenceNo={newSequenceNo}
              setNewSequenceNo={setNewSequenceNo}
              newStatus={newStatus}
              setNewStatus={setNewStatus}
              addCategory={async (desc, descEng, seqNo, isActive) => {
                await addCategory(desc, descEng, seqNo, isActive);
              }}
              updateCategory={async (id, data) => {
                // data: { Description, DescriptionEnglish, SequenceNo, IsActive, UpdatedBy }
                const res = await categoryActions.updateCategory(id, data);
                if (res.success) {
                  toast.success("Category updated successfully");
                  if (typeof refreshAll === 'function') await refreshAll();
                } else {
                  toast.error(res.error || "Failed to update category");
                }
              }}
              refreshAll={refreshAll}
              categories={categories}
              handleDeleteCategory={handleDeleteCategory}
              toast={toast}
            />



            {/* Add Type Modal */}
            <AddTypeModal
              open={showAddTypeModal}
              onOpenChange={setShowAddTypeModal}
              typeSearch={typeSearch}
              setTypeSearch={setTypeSearch}
              connectionTypes={connectionTypes}
              editingTypeId={editingTypeId}
              editingTypeValue={editingTypeValue}
              setEditingTypeValue={setEditingTypeValue}
              editingTypeDescription={editingTypeDescription}
              setEditingTypeDescription={setEditingTypeDescription}
              handleEditType={handleEditType}
              handleSaveEditType={handleSaveEditType}
              handleCancelEditType={handleCancelEditType}
              confirmDeleteToast={confirmDeleteToast}
              handleDeleteConnectionType={async (id) => {
                await handleDeleteConnectionType(id);
                setTimeout(() => setTypeReloadKey(prev => prev + 1), 300);
                if (typeof refreshAll === 'function') await refreshAll();
              }}
              t={t}
            />
            {/* Add Size Modal - */}
            <AddSizeModal
              open={showAddSizeModal}
              onOpenChange={setShowAddSizeModal}
              newSizeName={newSizeName}
              setNewSizeName={setNewSizeName}
              newDiameter={newDiameter}
              setNewDiameter={setNewDiameter}
              newStatus={newStatus}
              setNewStatus={setNewStatus}
              handleAddSize={handleAddSize}
              tapSizes={tapSizes
                .filter((size: any) => size && typeof size === "object")
                .map((size: any) => ({
                  ...size,
                  PipeSizeID: size.PipeSizeID ?? size.id ?? "",
                  DiameterMM: size.DiameterMM ?? size.diameterMM ?? "",
                  Description: size.Description ?? size.name ?? "",
                  DescriptionEnglish: size.DescriptionEnglish ?? "",
                  SequenceNo: size.SequenceNo ?? "",
                  IsActive: size.IsActive ?? size.isActive ?? true,
                  CreatedBy: size.CreatedBy ?? "",
                  CreatedDate: size.CreatedDate ?? "",
                  UpdatedBy: size.UpdatedBy ?? "",
                  UpdatedDate: size.UpdatedDate ?? "",
                }))
              }
              sizeSearch={sizeSearch}
              editingSizeId={editingSizeId}
              editingSizeValue={editingSizeValue}
              setEditingSizeValue={setEditingSizeValue}
              editingDiameter={editingDiameter}
              setEditingDiameter={setEditingDiameter}
              editingStatus={editingStatus}
              setEditingStatus={setEditingStatus}
              handleEditSize={handleEditSize}
              handleSaveEditSize={handleSaveEditSize}
              handleCancelEditSize={handleCancelEditSize}
              confirmDeleteToast={confirmDeleteToast}
              handleDeleteTapSize={handleDeleteTapSize}
              t={t}
            />

            {/* Rate Chart Modal */}
            <Dialog open={showRateChartModal} onOpenChange={setShowRateChartModal}>
              <DialogContent className="max-w-4xl bg-white">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>{getRateChartTitle()}</span>
                    <Button
                      size="sm"
                      onClick={handleDownloadRateChart}
                      className="h-8 px-3 text-xs bg-[#005A9C] hover:bg-[#004080]"
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />
                      {t.download}
                    </Button>
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-gray-600">
                    Rate chart visualization coming soon...
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
        {activeTab === 'billing' && (
          <BillingCycleMaster
            language={language as any as Language}
          />
        )}
        {activeTab === 'newconnection' && (
          <NewConnectionBillingMaster />
        )}
      </div>

    </div>

  );
}



// Edit ward implementation: calls addWard for new, or updates existing ward via API/service
async function editWard(
  editingWardId: number | null,
  wardName: string,
  descriptionEnglish: string,
  sequenceNo: number,
  zoneID: number,
  isActive: boolean
) {
  if (editingWardId == null) throw new Error("No ward selected for editing.");
  if (typeof apiService.updateWard === "function") {
    await apiService.updateWard(editingWardId, {
      Description: wardName,
      DescriptionEnglish: descriptionEnglish,
      SequenceNo: sequenceNo,
      ZoneID: zoneID,
      IsActive: isActive,
    });
  } else {
    throw new Error("Ward update service not available.");
  }
}

