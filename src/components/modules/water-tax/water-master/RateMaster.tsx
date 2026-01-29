'use client'

import { useState, useMemo, useCallback, useEffect } from "react";
import { useZones } from "@/hooks/water-master/useZones";
import { useWards } from "@/hooks/water-master/useWards";
import { waterRateActions } from "@/app/water-master/waterRateActions";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Droplet,
  TrendingUp,
  Activity,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { EditButton, DeleteButton } from "@/components/common/ActionButtons";
import { ToggleSwitch } from "@/components/common/ToggleSwitch";
import { Language } from "@/app/water-master/page";
 import translations from "@/locales/water-rate-master";

interface RateMasterProps {
  language: Language;
}


// Updated WaterRate interface to match backend RateMaster columns
interface WaterRate {
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
  status: "Active" | "Inactive"; // Added status property
  ratePerKL?: number; // Added to match usage in table
  annualFlatRate?: number; // Also add this if used elsewhere
}


export function RateMaster({ language }: RateMasterProps) {
  // Zone and Ward state for modal
  const [reloadZonesWards, setReloadZonesWards] = useState(0);
  const { zones } = useZones(reloadZonesWards);
  const { wards } = useWards(reloadZonesWards);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);
  // Filtered wards for selected zone
  const filteredWards = selectedZone ? wards.filter(w => w.zoneID === selectedZone) : [];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedConnectionType, setSelectedConnectionType] = useState("all");
  const [selectedTapSize, setSelectedTapSize] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingRate, setEditingRate] = useState<WaterRate | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Localization import
  const t = translations[language];

  // Data should be provided via props, context, or fetched from an API.
  // Example:
  const [rates, setRates] = useState<WaterRate[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch rates from API
  const fetchRates = useCallback(() => {
    setLoading(true);
    waterRateActions.fetchRates()
      .then((res: any) => {
        if (res.success && Array.isArray(res.data)) {
          setRates(res.data);
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


  
  // Helper functions to map IDs to strings
  const getCategory = (categoryID: number) => {
    switch (categoryID) {
      case 1: return "Residential";
      case 2: return "Commercial";
      case 3: return "Industrial";
      case 4: return "Institutional";
      default: return "";
    }
  };

  const getConnectionType = (connectionTypeID: number) => {
    switch (connectionTypeID) {
      case 1: return "Meter";
      case 2: return "No Meter";
      default: return "";
    }
  };

  const getTapSize = (pipeSizeID: number) => {
    switch (pipeSizeID) {
      case 1: return "15mm";
      case 2: return "20mm";
      case 3: return "25mm";
      case 4: return "40mm";
      case 5: return "50mm";
      default: return "";
    }
  };

  // Filter and search logic
  const filteredRates = useMemo(() =>
    rates.filter((rate) => {
      const category = getCategory(rate.connectionCategoryID);
      const connectionType = getConnectionType(rate.connectionTypeID);
      const tapSize = getTapSize(rate.pipeSizeID);

      const matchesSearch =
        category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        connectionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tapSize.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || category === selectedCategory;
      const matchesConnectionType =
        selectedConnectionType === "all" ||
        connectionType === selectedConnectionType;
      const matchesTapSize =
        selectedTapSize === "all" || tapSize === selectedTapSize;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesConnectionType &&
        matchesTapSize
      );
    })
  , [rates, searchQuery, selectedCategory, selectedConnectionType, selectedTapSize]);

  // Pagination
  const totalPages = useMemo(() => Math.ceil(filteredRates.length / itemsPerPage), [filteredRates.length, itemsPerPage]);
  const startIndex = useMemo(() => (currentPage - 1) * itemsPerPage, [currentPage, itemsPerPage]);
  const paginatedRates = useMemo(() => filteredRates.slice(startIndex, startIndex + itemsPerPage), [filteredRates, startIndex, itemsPerPage]);

  // Statistics
  const stats = useMemo(() => ({
    total: rates.length,
    meter: rates.filter((r) => getConnectionType(r.connectionTypeID) === "Meter").length,
    nonMeter: rates.filter((r) => getConnectionType(r.connectionTypeID) === "No Meter").length,
    active: rates.filter((r) => r.status === "Active").length,
  }), [rates]);

  // Modal state
  // Updated formData to match new columns
  const [formData, setFormData] = useState<{
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
    category: string;
    connectionType?: string;
    tapSize?: string;
    ratePerKL?: number;
    annualFlatRate?: number;
    status?: "Active" | "Inactive";
    // Add any other fields as needed
  }>({
    zoneID: 0,
    wardID: 0,
    pipeSizeID: 0,
    connectionTypeID: 0,
    connectionCategoryID: 0,
    minReading: 0,
    maxReading: 0,
    perLiter: 0,
    rate: 0,
    minimumCharge: 0,
    meterOffPenalty: 0,
    remark: "",
    sequenceNo: 0,
    isActive: true,
    createdBy: 1,
    createdDate: "",
    updatedBy: undefined,
    updatedDate: undefined,
    category: "Residential",
    connectionType: "Meter",
    tapSize: "15mm",
    ratePerKL: 0,
    annualFlatRate: 0,
    status: "Active",
  });

  const handleAddNew = useCallback(() => {
    setEditingRate(null);
    setFormData({
      zoneID: 0,
      wardID: 0,
      pipeSizeID: 0,
      connectionTypeID: 0,
      connectionCategoryID: 0,
      minReading: 0,
      maxReading: 0,
      perLiter: 0,
      rate: 0,
      minimumCharge: 0,
      meterOffPenalty: 0,
      remark: "",
      sequenceNo: 0,
      isActive: true,
      createdBy: 1,
      createdDate: "",
      updatedBy: undefined,
      updatedDate: undefined,
      category: "Residential",
      connectionType: "Meter",
      tapSize: "15mm",
      ratePerKL: 0,
      annualFlatRate: 0,
      status: "Active",
    });
    setSelectedZone(null);
    setSelectedWard(null);
    setShowModal(true);
  }, [setEditingRate, setFormData, setSelectedZone, setSelectedWard, setShowModal, zones]);

  const handleEdit = useCallback((rate: WaterRate) => {
    setEditingRate(rate);
    setFormData({
      zoneID: 0,
      wardID: 0,
      pipeSizeID: 0,
      connectionTypeID: 0,
      connectionCategoryID: 0,
      minReading: 0,
      maxReading: 0,
      perLiter: 0,
      rate: 0,
      minimumCharge: 0,
      meterOffPenalty: 0,
      remark: "",
      sequenceNo: 0,
      isActive: true,
      createdBy: 1,
      createdDate: "",
      updatedBy: undefined,
      updatedDate: undefined,
      category: "Residential",
      connectionType: "Meter",
      tapSize: "15mm",
      ratePerKL: 0,
      annualFlatRate: 0,
      status: "Active",
    });
    setSelectedZone(rate.zoneID);
    setSelectedWard(rate.wardID);
    setShowModal(true);
  }, [setEditingRate, setFormData, setSelectedZone, setSelectedWard, setShowModal]);

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      // Ensure correct types for API
      const status = formData.status === "Active" ? "Active" : "Inactive";
      const zoneNo = selectedZone !== null && selectedZone !== undefined ? String(selectedZone) : "";
      const wardNo = selectedWard !== null && selectedWard !== undefined ? String(selectedWard) : "";
      if (editingRate) {
        // Update
        const res = await waterRateActions.updateRate(editingRate.id, { ...formData, status });
        if (res.success) {
          toast.success("Rate updated successfully");
          fetchRates();
          setReloadZonesWards((r) => r + 1);
        } else {
          toast.error(res.error || "Failed to update rate");
        }
      } else {
        // Create
        const res = await waterRateActions.createRate({
          ...formData,
          status,
          zoneNo,
          wardNo,
          category: formData.category,
          connectionType: formData.connectionType ?? "",
          tapSize: formData.tapSize ?? "",
          ratePerKL: formData.ratePerKL ?? 0,
          annualFlatRate: formData.annualFlatRate ?? 0,
        });
        if (res.success) {
          toast.success("Rate added successfully");
          fetchRates();
          setReloadZonesWards((r) => r + 1);
        } else {
          toast.error(res.error || "Failed to add rate");
        }
      }
      setShowModal(false);
    } catch {
      toast.error("Failed to save rate");
    } finally {
      setLoading(false);
    }
  }, [editingRate, formData, selectedZone, selectedWard, fetchRates, setShowModal]);

  const toggleStatus = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const rate = rates.find(r => r.id === id);
      if (!rate) return;
      const newStatus = rate.status === "Active" ? "Inactive" : "Active";
      const res = await waterRateActions.updateRate(id, { status: newStatus });
      if (res.success) {
        toast.success("Status updated");
        fetchRates();
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  }, [rates, fetchRates]);

  // Delete handler (must be after hooks)
  const handleDelete = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const res = await waterRateActions.deleteRate(id);
      if (res.success) {
        toast.success("Rate deleted successfully");
        fetchRates();
        setReloadZonesWards((r) => r + 1);
      } else {
        toast.error(res.error || "Failed to delete rate");
      }
    } catch {
      toast.error("Failed to delete rate");
    } finally {
      setLoading(false);
    }
  }, [fetchRates]);

  return (
    <div className="flex-1 bg-[#F5F9FC] p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-[#0D47A1] mb-1">{t.title}</h1>
        <p className="text-gray-600 text-sm">{t.subtitle}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Rates Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm mb-1">{t.totalRates}</p>
              {/* <p className="text-3xl text-blue-900">{stats.total}</p> */}
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Droplet className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Meter Rates Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 text-sm mb-1">{t.meterRates}</p>
              <p className="text-3xl text-green-900">{stats.meter}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Non-Meter Rates Card */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-700 text-sm mb-1">{t.nonMeterRates}</p>
              <p className="text-3xl text-orange-900">{stats.nonMeter}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Active Rates Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 text-sm mb-1">{t.activeRates}</p>
              <p className="text-3xl text-purple-900">{stats.active}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="all">{t.allCategories}</option>
              <option value="Residential">{t.residential}</option>
              <option value="Commercial">{t.commercial}</option>
              <option value="Industrial">{t.industrial}</option>
              <option value="Institutional">{t.institutional}</option>
            </select>

            <select
              value={selectedConnectionType}
              onChange={(e) => setSelectedConnectionType(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="all">{t.allTypes}</option>
              <option value="Meter">{t.meter}</option>
              <option value="No Meter">{t.noMeter}</option>
            </select>

            <select
              value={selectedTapSize}
              onChange={(e) => setSelectedTapSize(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="all">{t.allSizes}</option>
              <option value="15mm">15mm</option>
              <option value="20mm">20mm</option>
              <option value="25mm">25mm</option>
              <option value="40mm">40mm</option>
              <option value="50mm">50mm</option>
            </select>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddNew}
            className="bg-gradient-to-r from-[#005AA7] via-[#0077B6] to-[#00C6FF] text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-shadow flex items-center gap-2 justify-center"
          >
            <Plus className="h-5 w-5" />
            {t.addNewRate}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#005AA7] via-[#0077B6] to-[#00C6FF] text-white">
              <tr>
                <th className="px-4 py-4 text-left text-sm">
                  {t.tableCategory}
                </th>
                <th className="px-4 py-4 text-left text-sm">
                  {t.tableConnectionType}
                </th>
                <th className="px-4 py-4 text-left text-sm">
                  {t.tableTapSize}
                </th>
                <th className="px-4 py-4 text-right text-sm">
                  {t.tableRatePerKL}
                </th>
                <th className="px-4 py-4 text-right text-sm">
                  {t.tableAnnualRate}
                </th>
                <th className="px-4 py-4 text-right text-sm">
                  {t.tableMinCharge}
                </th>
                <th className="px-4 py-4 text-right text-sm">
                  {t.tableMeterPenalty}
                </th>
                <th className="px-4 py-4 text-center text-sm">
                  {t.tableStatus}
                </th>
                <th className="px-4 py-4 text-center text-sm">
                  {t.tableActions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedRates.map((rate, index) => (
                <tr
                  key={rate.id}
                  className={`hover:bg-blue-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-4 text-gray-900">{getCategory(rate.connectionCategoryID)}</td>
                  <td className="px-4 py-4 text-gray-700">
                    {getConnectionType(rate.connectionTypeID)}
                  </td>
                  <td className="px-4 py-4 text-gray-700">{getTapSize(rate.pipeSizeID)}</td>
                  <td className="px-4 py-4 text-right text-gray-900">
                    {(rate.ratePerKL ?? 0) > 0 ? `₹${rate.ratePerKL ?? 0}` : "-"}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-900">
                    {(rate.annualFlatRate ?? 0) > 0 ? `₹${rate.annualFlatRate ?? 0}` : "-"}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-900">
                    ₹{rate.minimumCharge}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-900">
                    {rate.meterOffPenalty > 0 ? `₹${rate.meterOffPenalty}` : "-"}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs ${
                        rate.status === "Active"
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-red-100 text-red-800 border border-red-300"
                      }`}
                    >
                      {rate.status === "Active" ? t.active : t.inactive}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <EditButton onClick={() => handleEdit(rate)} title={t.edit} />
                      <DeleteButton onClick={() => handleDelete(rate.id)} title={t.delete} />
                      <ToggleSwitch checked={rate.status === "Active"} onChange={() => toggleStatus(rate.id)} label={rate.status === "Active" ? t.active : t.inactive} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredRates.length)} of{" "}
              {filteredRates.length} rates
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-white px-6 py-5 border-b-2 border-gray-200 flex items-center justify-between">
              <h2 className="text-xl text-[#005AA7]">
                {editingRate ? t.modalTitleEdit : t.modalTitleAdd}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Zone Dropdown */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Zone</label>
                <select
                  value={selectedZone ?? ""}
                  onChange={e => {
                    const val = e.target.value ? Number(e.target.value) : null;
                    setSelectedZone(val);
                    setSelectedWard(null);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select Zone</option>
                  {zones.map(z => (
                    <option key={z.ZoneID} value={z.ZoneID}>{z.Description}</option>
                  ))}
                </select>
              </div>

              {/* Ward Dropdown */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Ward</label>
                <select
                  value={selectedWard ?? ""}
                  onChange={e => setSelectedWard(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={!selectedZone}
                >
                  <option value="">{selectedZone ? "Select Ward" : "Select Zone first"}</option>
                  {filteredWards.map(w => (
                    <option key={w.wardID} value={w.wardID}>{w.description}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {t.categoryLabel}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="Residential">{t.residential}</option>
                  <option value="Commercial">{t.commercial}</option>
                  <option value="Industrial">{t.industrial}</option>
                  <option value="Institutional">{t.institutional}</option>
                </select>
              </div>

              {/* Connection Type */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {t.connectionTypeLabel}
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="connectionType"
                      checked={formData.connectionType === "Meter"}
                      onChange={() =>
                        setFormData({ ...formData, connectionType: "Meter" })
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">{t.meter}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="connectionType"
                      checked={formData.connectionType === "No Meter"}
                      onChange={() =>
                        setFormData({ ...formData, connectionType: "No Meter" })
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">{t.noMeter}</span>
                  </label>
                </div>
              </div>

              {/* Tap Size */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {t.tapSizeLabel}
                </label>
                <select
                  value={formData.tapSize}
                  onChange={(e) =>
                    setFormData({ ...formData, tapSize: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="15mm">15mm</option>
                  <option value="20mm">20mm</option>
                  <option value="25mm">25mm</option>
                  <option value="40mm">40mm</option>
                  <option value="50mm">50mm</option>
                </select>
              </div>

              {/* Rate per KL */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {t.ratePerKLLabel}
                </label>
                <input
                  type="number"
                  value={formData.ratePerKL}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ratePerKL: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="0"
                />
              </div>

              {/* Annual Flat Rate */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {t.annualFlatRateLabel}
                </label>
                <input
                  type="number"
                  value={formData.annualFlatRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      annualFlatRate: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="0"
                />
              </div>

              {/* Minimum Charge */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {t.minimumChargeLabel}
                </label>
                <input
                  type="number"
                  value={formData.minimumCharge}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minimumCharge: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="0"
                />
              </div>

              {/* Meter Off Penalty - Only for Meter connections */}
              {formData.connectionType === "Meter" && (
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    {t.meterOffPenaltyLabel}
                  </label>
                  <input
                    type="number"
                    value={formData.meterOffPenalty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        meterOffPenalty: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="0"
                  />
                </div>
              )}

              {/* Status */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {t.statusLabel}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        status:
                          formData.status === "Active" ? "Inactive" : "Active",
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.status === "Active"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.status === "Active"
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span
                    className={`text-sm ${
                      formData.status === "Active"
                        ? "text-green-700"
                        : "text-gray-600"
                    }`}
                  >
                    {formData.status === "Active" ? t.active : t.inactive}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-gradient-to-r from-[#005AA7] via-[#0077B6] to-[#00C6FF] text-white rounded-lg hover:shadow-lg transition-shadow"
              >
                {t.saveRate}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
