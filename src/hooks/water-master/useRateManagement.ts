/**
 * Custom Hook for Water Rate Management
 * Extracts all business logic from component
 * Uses actions layer for all data operations
 */

import { useState, useMemo, useEffect } from "react";
import { WaterRate } from "@/lib/constants/waterRates";
import { waterRateActions } from "@/app/water-master/waterRateActions";
import { toast } from "sonner";

interface UseRateManagementReturn {
  rates: WaterRate[];
  filteredRates: WaterRate[];
  paginatedRates: WaterRate[];
  stats: {
    total: number;
    meter: number;
    nonMeter: number;
    active: number;
  };
  currentPage: number;
  totalPages: number;
  entriesPerPage: number;
  selectedRows: number[];
  searchQuery: string;
  selectedCategory: string;
  selectedConnectionType: string;
  selectedTapSize: string;
  isLoading: boolean;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedConnectionType: (type: string) => void;
  setSelectedTapSize: (size: string) => void;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  setEntriesPerPage: (entries: number) => void;
  setSelectedRows: (rows: number[] | ((prev: number[]) => number[])) => void;
  addRate: (rate: Omit<WaterRate, "id">) => Promise<void>;
  updateRate: (id: number, rate: Partial<WaterRate>) => Promise<void>;
  deleteRate: (id: number) => Promise<void>;
  deleteSelectedRates: () => Promise<void>;
  toggleStatus: (id: number) => Promise<void>;
  clearFilters: () => void;
  selectAllOnPage: () => void;
  selectRow: (id: number) => void;
  refreshRates: () => Promise<void>;
  exportToCSV: () => Promise<void>;
}

export function useRateManagement(): UseRateManagementReturn {
  const [rates, setRates] = useState<WaterRate[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedConnectionType, setSelectedConnectionType] = useState("");
  const [selectedTapSize, setSelectedTapSize] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
    // Use WaterRate from constants, which includes all required fields

  // Memoized filtered rates
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

  // Memoized stats
  const stats = useMemo(() => {
    const activeRates = rates.filter((r) => r.status === "Active");
    const avgRate = rates.length > 0 
      ? Math.round(rates.reduce((sum, r) => sum + r.ratePerKL, 0) / rates.length)
      : 0;
    const uniqueCategories = new Set(rates.map(r => r.category));
    
    return {
      total: rates.length,
      meter: rates.filter((r) => r.connectionType === "Meter").length,
      nonMeter: rates.filter((r) => r.connectionType === "No Meter").length,
      active: activeRates.length,
      avgRate,
      categories: uniqueCategories.size,
    };
  }, [rates]);

  // Fetch rates on mount
  useEffect(() => {
    refreshRates();
  }, []);

  // Refresh rates from API
  const refreshRates = async () => {
    setIsLoading(true);
    const result = await waterRateActions.fetchRates();
    if (result.success && result.data) {
      setRates(result.data);
    }
    setIsLoading(false);
  };

  // Pagination
  const totalPages = Math.ceil(filteredRates.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedRates = filteredRates.slice(startIndex, startIndex + entriesPerPage);

  // Rate operations using actions
  // CRUD for RateMaster
  const addRate = async (rate: Omit<WaterRate, "id">) => {
    setIsLoading(true);
    const result = await waterRateActions.createRate(rate);
    if (result.success && result.data) {
      setRates((prev) => [...prev, result.data!]);
      await refreshRates();
    }
    setIsLoading(false);
  };

  const updateRate = async (id: number, updates: Partial<WaterRate>) => {
    setIsLoading(true);
    const result = await waterRateActions.updateRate(id, updates);
    if (result.success && result.data) {
      setRates((prev) => prev.map((rate) => (rate.id === id ? result.data! : rate)));
      await refreshRates();
    }
    setIsLoading(false);
  };

  const deleteRate = async (id: number) => {
    setIsLoading(true);
    const result = await waterRateActions.deleteRate(id);
    if (result.success) {
      setRates((prev) => prev.filter((rate) => rate.id !== id));
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
    }
    setIsLoading(false);
  };

  const deleteSelectedRates = async () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one record");
      return;
    }
    setIsLoading(true);
    const result = await waterRateActions.deleteMultipleRates(selectedRows);
    if (result.success) {
      setRates((prev) => prev.filter((rate) => !selectedRows.includes(rate.id)));
      setSelectedRows([]);
    }
    setIsLoading(false);
  };

  const toggleStatus = async (id: number) => {
    setIsLoading(true);
    const result = await waterRateActions.toggleRateStatus(id);
    if (result.success && result.data) {
      setRates((prev) =>
        prev.map((rate) => (rate.id === id ? result.data! : rate))
      );
    }
    setIsLoading(false);
  };

  const exportToCSV = async () => {
    setIsLoading(true);
    await waterRateActions.exportToCSV(filteredRates);
    setIsLoading(false);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedConnectionType("");
    setSelectedTapSize("");
    setSearchQuery("");
    setCurrentPage(1);
    toast.info("All filters cleared");
  };

  const selectAllOnPage = () => {
    if (selectedRows.length === paginatedRates.length && paginatedRates.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedRates.map((r) => r.id));
    }
  };

  const selectRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return {
    rates,
    filteredRates,
    paginatedRates,
    stats,
    currentPage,
    totalPages,
    entriesPerPage,
    selectedRows,
    searchQuery,
    selectedCategory,
    selectedConnectionType,
    selectedTapSize,
    isLoading,
    setSearchQuery,
    setSelectedCategory,
    setSelectedConnectionType,
    setSelectedTapSize,
    setCurrentPage,
    setEntriesPerPage,
    setSelectedRows,
    addRate,
    updateRate,
    deleteRate,
    deleteSelectedRates,
    toggleStatus,
    clearFilters,
    selectAllOnPage,
    selectRow,
    refreshRates,
    exportToCSV,
  };
}
