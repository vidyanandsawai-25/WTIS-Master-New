"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Activity,
  X,
} from "lucide-react";
import { Edit2 } from "lucide-react";
import { Trash2 } from "lucide-react";
import { confirmDeleteToast } from "@/components/common/confirmDeleteToast";
import { Button } from "@/components/common/Button";
import { EditButton, DeleteButton } from "@/components/common/ActionButtons";
import { ToggleSwitch } from "@/components/common/ToggleSwitch";
import { Language } from "@/app/water-master/page";
import { toast } from "sonner";
// Use direct service call for billing cycles fetch for reliability
import apiService from "@/services/water-master/apiService";
import { billingCycleActions, categoryActions } from "@/app/water-master/waterRateActions";
// Types for master data
interface ZoneMaster {
  ZoneID: number;
  Description: string;
  DescriptionEnglish: string;
}
interface CategoryMaster {
  connectionCategoryID: number;
  categoryName: string;
}

interface BillingCycle {
  id: number;
  ZoneID: number;
  Description: string;
  DescriptionEnglish: string;
  connectionCategoryID: number;
  categoryName: string;
  cycleType: string;
  financialYear: number;
  billGenerationDate: string;
  billPeriodStartDate: string;
  billPeriodEndDate: string;
  currentPenaltyPercent: number;
  currentPenaltyStartDate?: string;
  currentPenaltyEndDate?: string;
  pendingPenaltyPercent: number;
  pendingPenaltyStartDate?: string;
  pendingPenaltyEndDate?: string;
  status: "Active" | "Inactive";
}

interface BillingCycleMasterProps {
  language: Language;
}

export default function BillingCycleMaster({ language }: BillingCycleMasterProps) {
  // Master data state (must be inside component)
  const [zones, setZones] = useState<ZoneMaster[]>([]);
  const [categories, setCategories] = useState<CategoryMaster[]>([]);
  useEffect(() => {
    apiService.getZones?.({ pageNumber: 1, pageSize: 100 })
      .then((res: any) => setZones(res.items || []))
      .catch(() => setZones([]));

    // Fetch categories using categoryActions to match RateMaster logic
    categoryActions.fetchCategories()
      .then((result: any) => {
        if (result.success && Array.isArray(result.data)) {
          // Map to expected format for dropdown
          const mapped = result.data.map((cat: any) => ({
            connectionCategoryID: cat.id,
            categoryName: cat.name
          }));
          setCategories(mapped);
        } else {
          setCategories([]);
        }
      })
      .catch(() => setCategories([]));
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState("all");
  const [selectedCycleType, setSelectedCycleType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingCycle, setEditingCycle] = useState<BillingCycle | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [cycles, setCycles] = useState<BillingCycle[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch billing cycles from API (refactored for reuse)
  const fetchBillingCycles = useCallback(() => {
    setLoading(true);
    apiService.getBillingCyclesMaster({ pageNumber: 1, pageSize: 100 })
      .then((res: any) => setCycles(res.items || []))
      .catch(() => toast.error("Failed to fetch billing cycles"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchBillingCycles();
  }, [fetchBillingCycles]);

  // Filter logic (map IDs to names for search)
  const filteredCycles = useMemo(() => cycles.filter((cycle) => {
    const zone = zones.find(z => z.ZoneID === cycle.ZoneID);
    const category = categories.find(c => c.connectionCategoryID === cycle.connectionCategoryID);
    const matchesSearch =
      (zone?.Description ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category?.categoryName ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cycle.cycleType ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cycle.financialYear?.toString() ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }), [cycles, zones, categories, searchQuery]);

  // Pagination
  const totalPages = useMemo(() => Math.ceil(filteredCycles.length / itemsPerPage), [filteredCycles.length, itemsPerPage]);
  const startIndex = useMemo(() => (currentPage - 1) * itemsPerPage, [currentPage, itemsPerPage]);
  const paginatedCycles = useMemo(() => filteredCycles.slice(startIndex, startIndex + itemsPerPage), [filteredCycles, startIndex, itemsPerPage]);

  // Modal state
  const [formData, setFormData] = useState({
    zoneID: 0,
    cycleType: "Quarterly",
    financialYear: "2024-25",
    billGenerationDate: "",
    billPeriodStart: "",
    billPeriodEnd: "",
    currentPenaltyPercent: 5,
    currentPenaltyStartDate: "",
    currentPenaltyEndDate: "",
    pendingPenaltyPercent: 10,
    pendingPenaltyStartDate: "",
    pendingPenaltyEndDate: "",
    status: "Active" as "Active" | "Inactive",
    connectionCategoryID: 0,
    categoryName: "",
  });

  const handleAddNew = useCallback(() => {
    setEditingCycle(null);
    setFormData({
      zoneID: zones.length > 0 ? zones[0].ZoneID : 0,
      cycleType: "Quarterly",
      financialYear: "2024-25",
      billGenerationDate: "",
      billPeriodStart: "",
      billPeriodEnd: "",
      currentPenaltyPercent: 5,
      currentPenaltyStartDate: "",
      currentPenaltyEndDate: "",
      pendingPenaltyPercent: 10,
      pendingPenaltyStartDate: "",
      pendingPenaltyEndDate: "",
      status: "Active",
      categoryName: "",
      connectionCategoryID: 0,
    });
    setShowModal(true);
  }, [zones, setEditingCycle, setFormData, setShowModal]);

  const handleEdit = useCallback((cycle: BillingCycle) => {
    setEditingCycle(cycle);
    setFormData({
      zoneID: cycle.ZoneID,
      cycleType: cycle.cycleType,
      financialYear: cycle.financialYear.toString(),
      billGenerationDate: cycle.billGenerationDate,
      billPeriodStart: cycle.billPeriodStartDate,
      billPeriodEnd: cycle.billPeriodEndDate,
      currentPenaltyPercent: cycle.currentPenaltyPercent,
      currentPenaltyStartDate: cycle.currentPenaltyStartDate || "",
      currentPenaltyEndDate: cycle.currentPenaltyEndDate || "",
      pendingPenaltyPercent: cycle.pendingPenaltyPercent,
      pendingPenaltyStartDate: cycle.pendingPenaltyStartDate || "",
      pendingPenaltyEndDate: cycle.pendingPenaltyEndDate || "",
      status: cycle.status,
      categoryName: cycle.categoryName,
      connectionCategoryID: cycle.connectionCategoryID ?? 0,
    });
    setShowModal(true);
  }, [setEditingCycle, setFormData, setShowModal]);

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      const selectedCat = categories.find(cat => cat.connectionCategoryID === formData.connectionCategoryID);
      if (editingCycle) {
        // Update: Use backend field names and required fields only (match create payload structure)
        const updatePayload = {
          zoneID: formData.zoneID,
          connectionCategoryID: formData.connectionCategoryID,
          cycleType: formData.cycleType,
          financialYear: Number(formData.financialYear),
          billGenerationDate: formData.billGenerationDate,
          billPeriodStartDate: formData.billPeriodStart,
          billPeriodEndDate: formData.billPeriodEnd,
          currentPenaltyStartDate: formData.currentPenaltyStartDate,
          currentPenaltyEndDate: formData.currentPenaltyEndDate,
          pendingPenaltyStartDate: formData.pendingPenaltyStartDate,
          pendingPenaltyEndDate: formData.pendingPenaltyEndDate,
          currentPenaltyPercent: formData.currentPenaltyPercent,
          pendingPenaltyPercent: formData.pendingPenaltyPercent,
          isActive: formData.status === "Active",
          updatedBy: 1,
        };
        await billingCycleActions.updateBillingCycle(editingCycle.id, updatePayload);
        toast.success("Billing cycle updated successfully");
        fetchBillingCycles();
      } else {
        // Validate required fields for backend
        const requiredFields = [
          formData.zoneID,
          formData.connectionCategoryID,
          formData.cycleType,
          formData.financialYear,
          formData.billGenerationDate,
          formData.billPeriodStart,
          formData.billPeriodEnd,
        ];
        if (requiredFields.some(f => f === undefined || f === null || f === "")) {
          toast.error("Please fill all required fields.");
          setLoading(false);
          return;
        }
        // Ensure financialYear is a valid number
        let fy = Number(formData.financialYear);
        if (isNaN(fy) || fy < 2000) fy = new Date().getFullYear();
        const createPayload = {
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString(),
          createdBy: 1,
          updatedBy: 1,
          zoneID: formData.zoneID,
          connectionCategoryID: formData.connectionCategoryID,
          cycleType: formData.cycleType,
          financialYear: fy,
          billGenerationDate: formData.billGenerationDate,
          billPeriodStartDate: formData.billPeriodStart,
          billPeriodEndDate: formData.billPeriodEnd,
          currentPenaltyStartDate: formData.currentPenaltyStartDate,
          currentPenaltyEndDate: formData.currentPenaltyEndDate,
          pendingPenaltyStartDate: formData.pendingPenaltyStartDate,
          pendingPenaltyEndDate: formData.pendingPenaltyEndDate,
          currentPenaltyPercent: formData.currentPenaltyPercent,
          pendingPenaltyPercent: formData.pendingPenaltyPercent,
          isReadingApproved: false,
          numberOfCycles: 1,
          isActive: formData.status === "Active",
        };
        await billingCycleActions.createBillingCycle(createPayload);
        toast.success("Billing cycle added successfully");
        fetchBillingCycles();
      }
      setShowModal(false);
    } catch {
      toast.error("Failed to save billing cycle");
    } finally {
      setLoading(false);
    }
  }, [editingCycle, formData, categories, fetchBillingCycles, setShowModal, setLoading, toast]);

  const handleDelete = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await billingCycleActions.deleteBillingCycle(id);
      toast.success("Billing cycle deleted successfully");
      fetchBillingCycles();
    } catch {
      toast.error("Failed to delete billing cycle");
    } finally {
      setLoading(false);
    }
  }, [fetchBillingCycles, setLoading, toast]);

  const toggleStatus = useCallback((id: number) => {
    setCycles(
      cycles.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" }
          : c
      )
    );
  }, [cycles, setCycles]);

  // Helper to format date as YYYY-MM-DD
  function formatDate(dateString: string | undefined) {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toISOString().slice(0, 10);
  }

  return (
    <div className="flex-1 bg-[#F5F9FC] p-2 sm:p-2 lg:p-2">
      {/* Summary Cards (modern flat style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Total Cycles Card */}
        <div className="bg-white rounded-xl shadow-md flex items-center px-4 py-2 min-h-[60px]">
          <div className="flex flex-col flex-1">
            <span className="text-blue-800 font-semibold text-sm">Total Cycles</span>
            <span className="text-3xl font-bold text-blue-900 mt-1">{cycles.length}</span>
            <span className="text-xs text-gray-400 mt-1">&nbsp;</span>
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
            <Calendar className="h-5 w-5 text-blue-500 opacity-80" />
          </div>
        </div>
        {/* Active Cycles Card */}
        <div className="bg-white rounded-xl shadow-md flex items-center px-4 py-2 min-h-[60px]">
          <div className="flex flex-col flex-1">
            <span className="text-green-800 font-semibold text-sm">Active Cycles</span>
            <span className="text-3xl font-bold text-green-900 mt-1">{cycles.filter((c) => c.status === 'Active').length}</span>
            <span className="text-xs text-gray-400 mt-1">&nbsp;</span>
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100">
            <CheckCircle2 className="h-5 w-5 text-green-500 opacity-80" />
          </div>
        </div>
        {/* Pending Cycles Card */}
        <div className="bg-white rounded-xl shadow-md flex items-center px-4 py-2 min-h-[60px]">
          <div className="flex flex-col flex-1">
            <span className="text-orange-700 font-semibold text-sm">Pending Cycles</span>
            <span className="text-3xl font-bold text-orange-900 mt-1">0</span>
            <span className="text-xs text-gray-400 mt-1">&nbsp;</span>
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100">
            <TrendingUp className="h-5 w-5 text-orange-400 opacity-80" />
          </div>
        </div>
        {/* Completed Cycles Card */}
        <div className="bg-white rounded-xl shadow-md flex items-center px-4 py-2 min-h-[60px]">
          <div className="flex flex-col flex-1">
            <span className="text-purple-700 font-semibold text-sm">Completed Cycles</span>
            <span className="text-3xl font-bold text-purple-900 mt-1">2</span>
            <span className="text-xs text-gray-400 mt-1">&nbsp;</span>
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100">
            <Activity className="h-5 w-5 text-purple-400 opacity-80" />
          </div>
        </div>
      </div>
      {/* Table rendering: map IDs to names */}

      {/* Action Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by zone / class / financial year"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={formData.zoneID}
              onChange={(e) => setFormData({ ...formData, zoneID: Number(e.target.value) })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >

              <option value={0}>Select Zone</option>
              {zones.map((zone) => (
                <option key={zone.ZoneID} value={zone.ZoneID}>{zone.DescriptionEnglish}</option>
              ))}
            </select>
            <select
              value={selectedCycleType}
              onChange={(e) => setSelectedCycleType(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="all">All Cycle Types</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Half-Yearly">Half-Yearly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          {/* Add Button */}
          <button
            onClick={handleAddNew}
            className="bg-[#005A9C] text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-shadow flex items-center gap-2 justify-center whitespace-nowrap"
          >
            <Plus className="h-5 w-5" />
            Add New Cycle
          </button>
        </div>
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#005A9C] to-[#0077CC] text-white">
              <tr>
                <th className="px-4 py-4 text-left text-sm border-r border-gray-200">Zone</th>
                <th className="px-4 py-4 text-left text-sm border-r border-gray-200">Cycle Type</th>
                <th className="px-4 py-4 text-left text-sm border-r border-gray-200">Financial Year</th>
                <th className="px-4 py-4 text-left text-sm border-r border-gray-200">Bill Generation Date</th>
                <th className="px-4 py-4 text-left text-sm border-r border-gray-200">Bill Period Start</th>
                <th className="px-4 py-4 text-left text-sm border-r border-gray-200">Bill Period End</th>
                <th className="px-4 py-4 text-center text-sm border-r border-gray-200">Current Penalty %</th>
                <th className="px-4 py-4 text-center text-sm border-r border-gray-200">Pending Penalty %</th>
                <th className="px-4 py-4 text-center text-sm border-r border-gray-200">Status</th>
                <th className="px-4 py-4 text-center text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedCycles.map((cycle, index) => (
                <tr
                  key={cycle.id}
                  className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="px-3 py-2 text-gray-900 border-r border-gray-200">{cycle.Description}</td>
                  <td className="px-3 py-2 text-gray-700 border-r border-gray-200">{cycle.cycleType}</td>
                  <td className="px-3 py-2 text-gray-700 border-r border-gray-200">{cycle.financialYear}</td>
                  <td className="px-3 py-2 text-gray-700 border-r border-gray-200">{formatDate(cycle.billGenerationDate)}</td>
                  <td className="px-3 py-2 text-gray-700 border-r border-gray-200">{formatDate(cycle.billPeriodStartDate)}</td>
                  <td className="px-3 py-2 text-gray-700 border-r border-gray-200">{formatDate(cycle.billPeriodEndDate)}</td>
                  <td className="px-3 py-2 text-center border-r border-gray-200">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 border border-green-300">
                      {cycle.currentPenaltyPercent}%
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center border-r border-gray-200">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-800 border border-orange-300">
                      {cycle.pendingPenaltyPercent}%
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center border-r border-gray-200">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${cycle.status === "Active" ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}`}>
                      {cycle.status === "Active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-2">
                      {/* <EditButton onClick={() => handleEdit(cycle)} title="Edit" /> */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(cycle)}
                        className="h-7 px-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      {/* <DeleteButton onClick={() => handleDelete(cycle.id)} title="Delete" /> */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {

                          confirmDeleteToast(() => handleDelete(cycle.id));


                        }
                        }
                        className="h-7 px-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCycles.length)} of {filteredCycles.length} cycles
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#005A9C] to-[#0077CC] px-6 py-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {editingCycle ? "Edit Cycle" : "Add New Cycle"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Row 1: Zone, Connection Category, Cycle Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Zone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zone</label>
                  <select
                    value={formData.zoneID}
                    onChange={(e) => setFormData({ ...formData, zoneID: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value={0}>Select Zone</option>
                    {zones.map((zone) => (
                      <option key={zone.ZoneID} value={zone.ZoneID}>{zone.DescriptionEnglish}</option>
                    ))}
                  </select>
                </div>
                {/* Connection Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Connection Category</label>
                  <select
                    value={formData.connectionCategoryID}
                    onChange={(e) => {
                      const selectedId = Number(e.target.value);
                      const selectedCat = categories.find(cat => cat.connectionCategoryID === selectedId);
                      setFormData({
                        ...formData,
                        connectionCategoryID: selectedId,
                        categoryName: selectedCat ? selectedCat.categoryName : ""
                      });
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value={0}>Select Category</option>
                    {/* <option value={1}>Metered</option>
                    <option value={2}>Non-Meter</option>
                    <option value={3}>Domestic</option> */}

                    {categories.map((cat) => (
                      <option key={cat.connectionCategoryID} value={cat.connectionCategoryID}>{cat.categoryName}</option>
                    ))}
                  </select>
                </div>
                {/* Cycle Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cycle Type</label>
                  <select
                    value={formData.cycleType}
                    onChange={(e) => setFormData({ ...formData, cycleType: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >

                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half-Yearly">Half-Yearly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>
              {/* Row 2: Financial Year, Current Penalty %, Pending Penalty % */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Financial Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Financial Year</label>
                  <select
                    value={formData.financialYear}
                    onChange={(e) => setFormData({ ...formData, financialYear: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="2023-24">2023-24</option>
                    <option value="2024-25">2024-25</option>
                    <option value="2025-26">2025-26</option>
                  </select>
                </div>
                {/* Current Penalty % */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Penalty %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.currentPenaltyPercent}
                    onChange={(e) => setFormData({ ...formData, currentPenaltyPercent: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                {/* Pending Penalty % */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pending Penalty %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.pendingPenaltyPercent}
                    onChange={(e) => setFormData({ ...formData, pendingPenaltyPercent: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              {/* Row 3: Bill Generation Date, Bill Period Start, Bill Period End */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Bill Generation Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bill Generation Date</label>
                  <input
                    type="date"
                    value={formData.billGenerationDate}
                    onChange={(e) => setFormData({ ...formData, billGenerationDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                {/* Bill Period Start */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bill Period Start</label>
                  <input
                    type="date"
                    value={formData.billPeriodStart}
                    onChange={(e) => setFormData({ ...formData, billPeriodStart: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                {/* Bill Period End */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bill Period End</label>
                  <input
                    type="date"
                    value={formData.billPeriodEnd}
                    onChange={(e) => setFormData({ ...formData, billPeriodEnd: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              {/* Row 4: Current Penalty Start Date, Current Penalty End Date, Pending Penalty Start Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Current Penalty Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Penalty Start Date</label>
                  <input
                    type="date"
                    value={formData.currentPenaltyStartDate}
                    onChange={(e) => setFormData({ ...formData, currentPenaltyStartDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                {/* Current Penalty End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Penalty End Date</label>
                  <input
                    type="date"
                    value={formData.currentPenaltyEndDate}
                    onChange={(e) => setFormData({ ...formData, currentPenaltyEndDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                {/* Pending Penalty Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pending Penalty Start Date</label>
                  <input
                    type="date"
                    value={formData.pendingPenaltyStartDate}
                    onChange={(e) => setFormData({ ...formData, pendingPenaltyStartDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              {/* Row 5: Pending Penalty End Date, Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Pending Penalty End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pending Penalty End Date</label>
                  <input
                    type="date"
                    value={formData.pendingPenaltyEndDate}
                    onChange={(e) => setFormData({ ...formData, pendingPenaltyEndDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="flex pt-2">
                    <ToggleSwitch
                      checked={formData.status === "Active"}
                      onChange={() => setFormData({ ...formData, status: formData.status === "Active" ? "Inactive" : "Active" })}
                      label={formData.status === "Active" ? "Active" : "Inactive"}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-[#005A9C] text-white rounded-lg hover:shadow-lg transition-shadow"
              >
                Save Cycle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
