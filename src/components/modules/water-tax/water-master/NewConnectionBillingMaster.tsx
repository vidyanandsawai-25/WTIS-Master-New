'use client';

import React, { useEffect, useState } from 'react';
import { feeHeadActions } from '@/app/water-master/feeHeadActions';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    CheckCircle2,
    X,
    List,
    TrendingUp,
    IndianRupee,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useMasterData } from '@/hooks/water-master/useMasterData';




const NewConnectionBillingMaster = () => {
    // Add state for categories (moved inside component)
    //const [categories, setCategories] = useState<any[]>([]);

    const [feeHeads, setFeeHeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 10;


    const [feeHeadRates, setFeeHeadRates] = useState<any[]>([]);
    const [loadingRates, setLoadingRates] = useState(false);
    const [errorRates, setErrorRates] = useState('');
    const [searchRate, setSearchRate] = useState('');
    const [currentRatePage, setCurrentRatePage] = useState(1);
    const rateEntriesPerPage = 10;
    const {
        categories,
        connectionTypes,
         tapSizes,
    } = useMasterData();

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setLoadingRates(true);
        setError('');
        setErrorRates('');

        Promise.all([
            feeHeadActions.fetchFeeHeads(),
            feeHeadActions.fetchFeeHeadRates()
        ])
            .then(([feeHeadsData, feeHeadRatesData]) => {
                if (!isMounted) return;
                if (feeHeadsData && typeof feeHeadsData === 'object' && 'items' in feeHeadsData) {
                    setFeeHeads(Array.isArray(feeHeadsData.items) ? feeHeadsData.items : []);
                } else {
                    setFeeHeads([]);
                }
                if (feeHeadRatesData && typeof feeHeadRatesData === 'object' && 'items' in feeHeadRatesData) {
                    setFeeHeadRates(Array.isArray(feeHeadRatesData.items) ? feeHeadRatesData.items : []);
                } else {
                    setFeeHeadRates([]);
                }
            })
            .catch(() => {
                if (!isMounted) return;
                setError('Error fetching data');
                setErrorRates('Error fetching data');
            })
            .finally(() => {
                if (!isMounted) return;
                setLoading(false);
                setLoadingRates(false);
            });

        return () => { isMounted = false; };
    }, []);

    // Filtered and paginated data
    const filteredFeeHeads = feeHeads.filter(fh =>
        (fh.descriptionEnglish || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (fh.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalPages = Math.ceil(filteredFeeHeads.length / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const paginatedFeeHeads = filteredFeeHeads.slice(startIndex, startIndex + entriesPerPage);

    // Statistics
    const stats = {
        totalFeeHeads: feeHeads.length,
        activeFeeHeads: feeHeads.filter(f => f.isActive).length,
        totalRates: feeHeadRates.length,
        activeRates: feeHeadRates.filter(r => r.IsActive).length,
    };

    // Modal state
    const [showFeeHeadModal, setShowFeeHeadModal] = useState(false);
    const [showRateModal, setShowRateModal] = useState(false);


    // Fee Head Modal form state
    const [feeHeadForm, setFeeHeadForm] = useState({
        feeHeadID: null,
        descriptionEnglish: '',
        feeHeadCode: '',
        isActive: true,
        description: '',
    });
    const [feeHeadModalMode, setFeeHeadModalMode] = useState<'add' | 'edit'>('add');
    const [feeHeadModalLoading, setFeeHeadModalLoading] = useState(false);
    const [feeHeadModalError, setFeeHeadModalError] = useState('');

    // Modal Fee Head Table (local state for instant update)
    const [modalFeeHeads, setModalFeeHeads] = useState<any[]>([]);

    // Sync modalFeeHeads with feeHeads when modal opens
    useEffect(() => {
        if (showFeeHeadModal) setModalFeeHeads(feeHeads);
    }, [showFeeHeadModal, feeHeads]);

    // Reset form when opening modal in add mode
    const openAddFeeHeadModal = () => {
        setFeeHeadForm({ feeHeadID: null, descriptionEnglish: '', feeHeadCode: '', isActive: true, description: '' });
        setFeeHeadModalMode('add');
        setShowFeeHeadModal(true);
        setFeeHeadModalError('');
    };

    // Handle Add or Update
    const handleAddOrUpdateFeeHead = async () => {
        setFeeHeadModalLoading(true);
        setFeeHeadModalError('');
        try {
            if (feeHeadModalMode === 'add') {
                const payload = {
                    descriptionEnglish: feeHeadForm.descriptionEnglish,
                    feeHeadCode: feeHeadForm.feeHeadCode,
                    isActive: feeHeadForm.isActive,
                    description: feeHeadForm.description,
                };
                await feeHeadActions.createFeeHead(payload);
            } else if (feeHeadModalMode === 'edit' && feeHeadForm.feeHeadID) {
                const payload = {
                    descriptionEnglish: feeHeadForm.descriptionEnglish,
                    feeHeadCode: feeHeadForm.feeHeadCode,
                    isActive: feeHeadForm.isActive,
                    description: feeHeadForm.description,
                };
                await feeHeadActions.updateFeeHead(feeHeadForm.feeHeadID, payload);
            }
            // Refresh list
            const data = await feeHeadActions.fetchFeeHeads();
            setFeeHeads((data as { items?: any[] }).items || []);
            setModalFeeHeads((data as { items?: any[] }).items || []);
            setFeeHeadForm({ feeHeadID: null, descriptionEnglish: '', feeHeadCode: '', isActive: true, description: '' });
            setFeeHeadModalMode('add');
        } catch (err: any) {
            setFeeHeadModalError(err.message || 'Error saving Fee Head');
        }
        setFeeHeadModalLoading(false);
    };

    // Handle Edit
    const handleEditFeeHead = (fh: any) => {
        setFeeHeadForm({
            feeHeadID: fh.feeHeadID,
            descriptionEnglish: fh.descriptionEnglish,
            feeHeadCode: fh.feeHeadCode,
            isActive: fh.isActive,
            description: fh.description,
        });
        setFeeHeadModalMode('edit');
        setFeeHeadModalError('');
    };

    // Handle Delete
    const handleDeleteFeeHead = async (id: string | number) => {
        if (!window.confirm('Are you sure you want to delete this Fee Head?')) return;
        setFeeHeadModalLoading(true);
        try {
            await feeHeadActions.deleteFeeHead(id);
            const data = await feeHeadActions.fetchFeeHeads();
            if (
                typeof data === 'object' &&
                data !== null &&
                'items' in data &&
                Array.isArray((data as { items?: unknown }).items)
            ) {
                setFeeHeads((data as { items: any[] }).items);
                setModalFeeHeads((data as { items: any[] }).items);
            } else {
                setFeeHeads([]);
                setModalFeeHeads([]);
            }
        } catch (err: any) {
            setFeeHeadModalError(err.message || 'Error deleting Fee Head');
        }
        setFeeHeadModalLoading(false);
    };


    // Fee Rate Modal CRUD state
    const [rateForm, setRateForm] = useState({
        feeHead: '',
        category: '',
        connectionType: '',
        pipeSize: '15mm',
        rateAmount: 0,
        effectiveFrom: '',
        effectiveTo: '',
        feeHeadRateID: null,
        isActive: true,
        remark: '',
    });
    const [rateModalMode, setRateModalMode] = useState<'add' | 'edit'>('add');
    const [rateModalLoading, setRateModalLoading] = useState(false);
    const [rateModalError, setRateModalError] = useState('');
    const [modalFeeHeadRates, setModalFeeHeadRates] = useState<any[]>([]);

    // Sync modalFeeHeadRates with feeHeadRates when modal opens
    useEffect(() => {
        if (showRateModal) setModalFeeHeadRates(feeHeadRates);
    }, [showRateModal, feeHeadRates]);

    // Reset form when opening modal in add mode
    const openAddRateModal = () => {
        setRateForm({
            feeHead: '',
            category: '',
            connectionType: '',
            pipeSize: '15mm',
            rateAmount: 0,
            effectiveFrom: '',
            effectiveTo: '',
            feeHeadRateID: null,
            isActive: true,
            remark: '',
        });
        setRateModalMode('add');
        setShowRateModal(true);
        setRateModalError('');
    };

    // Add or Update Fee Rate
    const handleAddOrUpdateRate = async () => {
        setRateModalLoading(true);
        setRateModalError('');
        try {
            if (rateModalMode === 'add') {
                const payload = {
                    feeHeadID: rateForm.feeHead,
                    ConnectionCategoryID: rateForm.category,
                    ConnectionTypeID: rateForm.connectionType,
                    PipeSizeID: rateForm.pipeSize,
                    rateAmount: rateForm.rateAmount,
                    effectiveFromDate: rateForm.effectiveFrom,
                    effectiveToDate: rateForm.effectiveTo,
                    isActive: rateForm.isActive,
                    remark: rateForm.remark,
                };
                await feeHeadActions.createFeeHeadRate(payload);
            } else if (rateModalMode === 'edit' && rateForm.feeHeadRateID) {
                const payload = {
                    feeHeadID: rateForm.feeHead,
                    ConnectionCategoryID: rateForm.category,
                    ConnectionTypeID: rateForm.connectionType,
                    PipeSizeID: rateForm.pipeSize,
                    rateAmount: rateForm.rateAmount,
                    effectiveFromDate: rateForm.effectiveFrom,
                    effectiveToDate: rateForm.effectiveTo,
                    isActive: rateForm.isActive,
                    remark: rateForm.remark,
                };
                await feeHeadActions.updateFeeHeadRate(rateForm.feeHeadRateID, payload);
            }
            // Refresh list
            const data = await feeHeadActions.fetchFeeHeadRates();
            if (
                typeof data === 'object' &&
                data !== null &&
                'items' in data &&
                Array.isArray((data as { items?: unknown }).items)
            ) {
                setFeeHeadRates((data as { items: any[] }).items);
                setModalFeeHeadRates((data as { items: any[] }).items);
            } else {
                setFeeHeadRates([]);
                setModalFeeHeadRates([]);
            }
            setRateForm({
                feeHead: '',
                category: '',
                connectionType: '',
                pipeSize: '15mm',
                rateAmount: 0,
                effectiveFrom: '',
                effectiveTo: '',
                feeHeadRateID: null,
                isActive: true,
                remark: '',
            });
            setRateModalMode('add');
        } catch (err: any) {
            setRateModalError(err.message || 'Error saving Fee Rate');
        }
        setRateModalLoading(false);
    };

    // Edit Fee Rate
    const handleEditRate = (rate: any) => {
        setRateForm({
            feeHead: rate.feeHeadID || '',
            category: rate.ConnectionCategoryID || '',
            connectionType: rate.ConnectionTypeID || '',
            pipeSize: rate.PipeSizeID || '15mm',
            rateAmount: rate.rateAmount || 0,
            effectiveFrom: rate.effectiveFromDate ? rate.effectiveFromDate.slice(0, 10) : '',
            effectiveTo: rate.effectiveToDate ? rate.effectiveToDate.slice(0, 10) : '',
            feeHeadRateID: rate.feeHeadRateID || null,
            isActive: rate.isActive !== undefined ? rate.isActive : true,
            remark: rate.remark || '',
        });
        setRateModalMode('edit');
        setRateModalError('');
    };

    // Delete Fee Rate
    const handleDeleteRate = async (id: string | number) => {
        if (!window.confirm('Are you sure you want to delete this Fee Rate?')) return;
        setRateModalLoading(true);
        try {
            await feeHeadActions.deleteFeeHeadRate(id);
            const data = await feeHeadActions.fetchFeeHeadRates();
            if (
                typeof data === 'object' &&
                data !== null &&
                'items' in data &&
                Array.isArray((data as { items?: unknown }).items)
            ) {
                setFeeHeadRates((data as { items: any[] }).items);
                setModalFeeHeadRates((data as { items: any[] }).items);
            } else {
                setFeeHeadRates([]);
                setModalFeeHeadRates([]);
            }
        } catch (err: any) {
            setRateModalError(err.message || 'Error deleting Fee Rate');
        }
        setRateModalLoading(false);
    };

    return (
        <div className="space-y-2">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
                {/* Total Fee Heads Card */}
                <div className="bg-white rounded-lg shadow-lg p-2 border-l-4 border-[#005A9C] relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-50 opacity-60"></div>
                    <div className="relative z-10 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="bg-[#005A9C] p-1 rounded shadow-sm">
                                <List className="h-3 w-3 text-white" />
                            </div>
                            <p className="text-[10px] text-gray-700 font-semibold leading-tight">Total Fee Heads</p>
                        </div>
                        <p className="text-2xl text-[#005A9C] mb-0 leading-none font-bold">{stats.totalFeeHeads}</p>
                    </div>
                </div>
                {/* Active Fee Heads Card */}
                <div className="bg-white rounded-lg shadow-lg p-2 border-l-4 border-green-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-green-50 opacity-60"></div>
                    <div className="relative z-10 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="bg-green-500 p-1 rounded shadow-sm">
                                <CheckCircle2 className="h-3 w-3 text-white" />
                            </div>
                            <p className="text-[10px] text-gray-700 font-semibold leading-tight">Active Fee Heads</p>
                        </div>
                        <p className="text-2xl text-green-600 mb-0 leading-none font-bold">{stats.activeFeeHeads}</p>
                    </div>
                </div>
                {/* Total Rates Card */}
                <div className="bg-white rounded-lg shadow-lg p-2 border-l-4 border-orange-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-orange-50 opacity-60"></div>
                    <div className="relative z-10 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="bg-orange-500 p-1 rounded shadow-sm">
                                <TrendingUp className="h-3 w-3 text-white" />
                            </div>
                            <p className="text-[10px] text-gray-700 font-semibold leading-tight">Total Rates</p>
                        </div>
                        <p className="text-2xl text-orange-600 mb-0 leading-none font-bold">{stats.totalRates}</p>
                    </div>
                </div>
                {/* Active Rates Card */}
                <div className="bg-white rounded-lg shadow-lg p-2 border-l-4 border-purple-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-purple-50 opacity-60"></div>
                    <div className="relative z-10 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="bg-purple-500 p-1 rounded shadow-sm">
                                <IndianRupee className="h-3 w-3 text-white" />
                            </div>
                            <p className="text-[10px] text-gray-700 font-semibold leading-tight">Active Rates</p>
                        </div>
                        <p className="text-2xl text-purple-600 mb-0 leading-none font-bold">{stats.activeRates}</p>
                    </div>
                </div>
            </div>
            {/* Action Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                <div className="flex flex-col lg:flex-row gap-2">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Fee Head Name / Description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                            />
                        </div>
                    </div>
                    {/* Add Buttons */}
                    <div className="flex gap-2">
                        <button
                            className="bg-[#005A9C] text-white px-4 py-2 rounded-lg hover:bg-[#004578] transition-colors flex items-center gap-2 justify-center whitespace-nowrap text-sm"
                            onClick={() => setShowFeeHeadModal(true)}
                        >
                            <Plus className="h-4 w-4" /> Add Fee Head
                        </button>
                        <button
                            className="bg-[#005A9C] text-white px-4 py-2 rounded-lg hover:bg-[#004578] transition-colors flex items-center gap-2 justify-center whitespace-nowrap text-sm"
                            onClick={openAddRateModal}
                        >
                            <Plus className="h-4 w-4" /> Add Rates
                        </button>
                    </div>
                    {/* Fee Head Modal */}
                    {showFeeHeadModal && (
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                {/* Modal Header */}
                                <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-start justify-between z-10">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-[#005A9C] p-2 rounded-lg">
                                            <Plus className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">Manage Fee Head</h2>
                                            <p className="text-xs text-gray-600 mt-1">Manage fee code, related name and description</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowFeeHeadModal(false)}
                                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-12 gap-3">
                                        <div className="col-span-7">
                                            <label className="block text-xs text-gray-700 mb-1.5 font-medium">Fee Head Name</label>
                                            <input
                                                type="text"
                                                value={feeHeadForm.descriptionEnglish}
                                                onChange={e => setFeeHeadForm(f => ({ ...f, descriptionEnglish: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                                placeholder="Security Deposit"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs text-gray-700 mb-1.5 font-medium">Fee Head Code</label>
                                            <input
                                                type="text"
                                                value={feeHeadForm.feeHeadCode}
                                                onChange={e => setFeeHeadForm(f => ({ ...f, feeHeadCode: e.target.value.toUpperCase() }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                                placeholder="SD"
                                                maxLength={10}
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <label className="block text-xs text-gray-700 mb-1.5 font-medium">Status</label>
                                            <div className="flex items-center h-10">
                                                <button
                                                    type="button"
                                                    onClick={() => setFeeHeadForm(f => ({ ...f, isActive: !f.isActive }))}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${feeHeadForm.isActive ? "bg-green-500" : "bg-gray-300"}`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${feeHeadForm.isActive ? "translate-x-6" : "translate-x-1"}`}
                                                    />
                                                </button>
                                                <span className={`ml-2 text-xs font-medium ${feeHeadForm.isActive ? "text-green-700" : "text-gray-600"}`}>{feeHeadForm.isActive ? "Active" : "Inactive"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-700 mb-1.5 font-medium">Description</label>
                                        <input
                                            type="text"
                                            value={feeHeadForm.description}
                                            onChange={e => setFeeHeadForm(f => ({ ...f, description: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            placeholder="Refundable security deposit for new water connection"
                                        />
                                    </div>
                                    {feeHeadModalError && <div className="text-red-500 text-xs mb-2">{feeHeadModalError}</div>}
                                    <button
                                        className="w-full bg-[#005A9C] text-white py-3 rounded-lg hover:bg-[#004578] transition-colors flex items-center justify-center gap-2 font-medium"
                                        onClick={handleAddOrUpdateFeeHead}
                                        disabled={feeHeadModalLoading}
                                    >
                                        <Plus className="h-4 w-4" />
                                        {feeHeadModalMode === 'add' ? 'Add Fee Head' : 'Update Fee Head'}
                                    </button>
                                    {/* Existing Fee Heads Table */}
                                    <div className="mt-6">
                                        <h3 className="text-sm font-semibold mb-2">Existing Fee Heads ({modalFeeHeads.length})</h3>
                                        <table className="w-full text-xs border">
                                            <thead className="bg-[#005A9C] text-white">
                                                <tr>
                                                    <th className="px-2 py-2 border border-gray-200">Sr. No.</th>
                                                    <th className="px-2 py-2 border border-gray-200">Fee Head Code</th>
                                                    <th className="px-2 py-2 border border-gray-200">Description</th>
                                                    <th className="px-2 py-2 border border-gray-200">Status</th>
                                                    <th className="px-2 py-2 border border-gray-200">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {modalFeeHeads.map((rate, idx) => { 
                                                    const feeHead = feeHeads.find(fh => fh.feeHeadID === rate.feeHeadID);
                                                    return (
                                                    <tr key={rate.feeHeadID || idx} className="border-b">
                                                        <td className="px-2 py-2 text-center border border-gray-200">{idx + 1}</td>
                                                        <td key={feeHead.feeHeadID} className="px-2 py-2 font-bold text-center border border-gray-200">{rate.description}</td>
                                                        <td className="px-2 py-2 text-center border border-gray-200">{rate.descriptionEnglish}</td>
                                                        <td className="px-2 py-2 border border-gray-200">
                                                            {rate.isActive ? <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold border border-gray-200">Active</span> : <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">Inactive</span>}
                                                        </td>
                                                        <td className="px-2 py-2 flex gap-2 justify-center border border-gray-200">
                                                            <button title="Edit" onClick={() => handleEditFeeHead(rate)} className="text-blue-600 hover:text-blue-900"><Edit2 className="w-4 h-4" /></button>
                                                            <button title="Delete" onClick={() => handleDeleteFeeHead(rate.feeHeadID)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                                                        </td>
                                                    </tr>
                                                )})}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end">
                                    <button
                                        onClick={() => setShowFeeHeadModal(false)}
                                        className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Fee Rate Modal */}
                    {showRateModal && (
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                                {/* Modal Header */}
                                <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-start justify-between z-10">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-[#005A9C] p-2 rounded-lg">
                                            <Plus className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">Manage Fee Rates</h2>
                                            <p className="text-xs text-gray-600 mt-1">Manage rates for different Pipe Sizes</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowRateModal(false)}
                                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-700 mb-1.5 font-medium">Select Fee Head</label>
                                            <select
                                                value={rateForm.feeHead}
                                                onChange={e => setRateForm(f => ({ ...f, feeHead: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            >
                                                <option value="">Select Fee Head</option>
                                                {feeHeads.filter(f => f.isActive).map(fh => (
                                                    <option key={fh.feeHeadID} value={fh.feeHeadID}>{fh.feeHeadCode} - {fh.descriptionEnglish}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-700 mb-1.5 font-medium">Category</label>
                                            <select
                                                value={rateForm.category}
                                                onChange={e => setRateForm(f => ({ ...f, category: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat.ConnectionCategoryID} value={cat.ConnectionCategoryID}>{cat.Description}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-700 mb-1.5 font-medium">Connection Type</label>
                                            <select
                                                value={rateForm.connectionType}
                                                onChange={e => setRateForm(f => ({ ...f, connectionType: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            >
                                                <option value="">Select Type</option>
                                                {connectionTypes.map(cat => (
                                                    <option key={cat.ConnectionTypeID} value={cat.ConnectionTypeID}>{cat.DescriptionEnglish}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-12 gap-3 items-end">
                                        <div className="col-span-2">
                                            <label className="block text-xs text-gray-700 mb-1.5 font-medium">Pipe Size</label>
                                            <select
                                                value={rateForm.pipeSize}
                                                onChange={e => setRateForm(f => ({ ...f, pipeSize: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            >
                                                <option value="">Select Size</option>
                                              {tapSizes.map(size => (
                                                    <option key={size.PipeSizeID} value={size.PipeSizeID}>{size.DiameterMM}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs text-gray-700 mb-1.5 font-medium">Rate Amount (₹)</label>
                                            <input
                                                type="number"
                                                value={rateForm.rateAmount}
                                                onChange={e => setRateForm(f => ({ ...f, rateAmount: parseFloat(e.target.value) || 0 }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                                placeholder="0"
                                                min="0"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <label className="block text-xs text-gray-700 mb-1.5 font-medium">Effective From Date</label>
                                            <input
                                                type="date"
                                                value={rateForm.effectiveFrom}
                                                onChange={e => setRateForm(f => ({ ...f, effectiveFrom: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <label className="block text-xs text-gray-700 mb-1.5 font-medium">Effective To Date</label>
                                            <input
                                                type="date"
                                                value={rateForm.effectiveTo}
                                                onChange={e => setRateForm(f => ({ ...f, effectiveTo: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            />
                                        </div>
                                        <div className="col-span-2 flex gap-2">
                                            <button
                                                className="w-full bg-[#005A9C] text-white py-2 rounded-lg hover:bg-[#004578] transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                                                onClick={handleAddOrUpdateRate}
                                                disabled={rateModalLoading}
                                            >
                                                <Plus className="h-4 w-4" />
                                                {rateModalMode === 'add' ? 'Add' : 'Update'}
                                            </button>
                                            {rateModalMode === 'edit' && (
                                                <button
                                                    className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                                                    onClick={openAddRateModal}
                                                    disabled={rateModalLoading}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {rateModalError && <div className="text-red-500 text-xs mb-2">{rateModalError}</div>}
                                    {/* Existing Fee Rates Table */}
                                    <div className="mt-6">
                                        <h3 className="text-sm font-semibold mb-2">Existing Fee Rates ({modalFeeHeadRates.length})</h3>
                                        <table className="w-full text-xs border">
                                            <thead className="bg-[#005A9C] text-white">
                                                <tr>
                                                    <th className="px-2 py-2 border border-gray-200">Sr. No.</th>
                                                    <th className="px-2 py-2 border border-gray-200">Fee Head Code</th>
                                                    <th className="px-2 py-2 border border-gray-200">Fee Head Name</th>
                                                    <th className="px-2 py-2 border border-gray-200">Diameter MM</th>
                                                    <th className="px-2 py-2 border border-gray-200">Category Name</th>
                                                    <th className="px-2 py-2 border border-gray-200">Connection Type Name</th>
                                                    <th className="px-2 py-2 border border-gray-200">Rate Amount (₹)</th>
                                                    <th className="px-2 py-2 border border-gray-200">Effective From</th>
                                                    <th className="px-2 py-2 border border-gray-200">Effective To</th>
                                                    <th className="px-2 py-2 border border-gray-200">Description</th>
                                                    <th className="px-2 py-2 border border-gray-200">Status</th>
                                                    <th className="px-2 py-2 border border-gray-200">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {modalFeeHeadRates.map((rate, idx) => {
                                                    const feeHead = feeHeads.find(fh => fh.feeHeadID === rate.feeHeadID);
                                                    return (
                                                        <tr key={rate.feeHeadRateID || idx} className="border-b">
                                                            <td className="px-2 py-2 text-center border border-gray-200">{idx + 1}</td>
                                                            <td key={feeHead.feeHeadID} className="px-2 py-2 text-center border border-gray-200">{feeHead.feeHeadCode || feeHead.description || '-'}</td>
                                                            <td className="px-2 py-2 text-center border border-gray-200">{rate.feeHeadDescription || '-'}</td>
                                                            <td className="px-2 py-2 text-center border border-gray-200">{rate.pipeSizeDescription || '-'}</td>
                                                            <td className="px-2 py-2 text-center border border-gray-200">{rate.connectionCategoryDescription || '-'}</td>
                                                            <td className="px-2 py-2 text-center border border-gray-200">{rate.connectionTypeDescription || '-'}</td>
                                                            <td className="px-2 py-2 text-center border border-gray-200">{rate.rateAmount || '-'}</td>
                                                            <td className="px-2 py-2 text-center border border-gray-200">{rate.effectiveFromDate ? new Date(rate.effectiveFromDate).toLocaleDateString() : '-'}</td>
                                                            <td className="px-2 py-2 text-center border border-gray-200">{rate.effectiveToDate ? new Date(rate.effectiveToDate).toLocaleDateString() : '-'}</td>
                                                            <td className="px-2 py-2 text-center border border-gray-200">{rate.remark || '-'}</td>
                                                            <td className="px-2 py-2 border border-gray-200">
                                                                {rate.isActive ? <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold border border-gray-200">Active</span> : <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">Inactive</span>}
                                                            </td>
                                                            <td className="px-2 py-2 flex gap-2 justify-center border border-gray-200">
                                                                <button title="Edit" onClick={() => handleEditRate(rate)} className="text-blue-600 hover:text-blue-900"><Edit2 className="w-4 h-4" /></button>
                                                                <button title="Delete" onClick={() => handleDeleteRate(rate.feeHeadRateID)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end">
                                    <button
                                        onClick={() => setShowRateModal(false)}
                                        className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Table: Fee Head Rate Master (with new header) */}

            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto mt-6">
                {loadingRates ? (
                    <div className="flex items-center justify-center py-10 text-gray-400">Loading...</div>
                ) : errorRates ? (
                    <div className="flex items-center justify-center py-10 text-red-500">{errorRates}</div>
                ) : (
                    <>
                        <table className="w-full min-w-[1200px] ">
                            <thead className="bg-[#005A9C] text-white">
                                <tr>
                                    <th className="px-2 py-3 text-center text-xs border border-gray-200">Sr. No.</th>
                                    <th className="px-2 py-3 text-center text-xs border border-gray-200">Fee Head Code</th>
                                    <th className="px-2 py-3 text-center text-xs border border-gray-200">Fee Head Name</th>
                                    <th className="px-2 py-3 text-center text-xs border border-gray-200">Diameter MM</th>
                                    <th className="px-2 py-3 text-center text-xs border border-gray-200">Category Name</th>
                                    <th className="px-2 py-3 text-center text-xs border border-gray-200">Connection Type Name</th>
                                    <th className="px-2 py-3 text-center text-xs border border-gray-200">Rate Amount (₹)</th>
                                    <th className="px-2 py-3 text-center text-xs border border-gray-200">Effective From</th>
                                    <th className="px-2 py-3 text-center text-xs border border-gray-200">Effective To</th>
                                    <th className="px-2 py-3 text-center text-xs border border-gray-200">Description</th>
                                    <th className="px-2 py-3 text-center text-xs border border-gray-200">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {(() => {
                                    // Pagination logic for feeHeadRates
                                    const filteredRates = feeHeadRates; // add filter if needed
                                    const totalRatePages = Math.ceil(filteredRates.length / rateEntriesPerPage);
                                    const startRateIndex = (currentRatePage - 1) * rateEntriesPerPage;
                                    const paginatedRates = filteredRates.slice(startRateIndex, startRateIndex + rateEntriesPerPage);
                                    return paginatedRates.map((rate, idx) => {
                                        const feeHead = feeHeads.find(fh => fh.feeHeadID === rate.feeHeadID);
                                        return (
                                            <tr key={rate.feeHeadRateID || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-2 py-3 text-center text-xs border border-gray-200">{startRateIndex + idx + 1}</td>
                                                <td className="px-2 py-3 text-center text-xs border border-gray-200">{feeHead.description}</td>
                                                <td className="px-2 py-3 text-center text-xs border border-gray-200">{feeHead ? feeHead.descriptionEnglish : rate.feeHeadDescription || '-'}</td>
                                                <td className="px-2 py-3 text-center text-xs border border-gray-200">{rate.pipeSizeDescription || '-'}</td>
                                                <td className="px-2 py-3 text-center text-xs border border-gray-200">{rate.connectionCategoryDescription || '-'}</td>
                                                <td className="px-2 py-3 text-center text-xs border border-gray-200">{rate.connectionTypeDescription || '-'}</td>
                                                <td className="px-2 py-3 text-center text-xs border border-gray-200">{rate.rateAmount || '-'}</td>
                                                <td className="px-2 py-3 text-center text-xs border border-gray-200">{rate.effectiveFromDate ? new Date(rate.effectiveFromDate).toLocaleDateString() : '-'}</td>
                                                <td className="px-2 py-3 text-center text-xs border border-gray-200">{rate.effectiveToDate ? new Date(rate.effectiveToDate).toLocaleDateString() : '-'}</td>
                                                <td className="px-2 py-3 text-center text-xs border border-gray-200">{rate.remark || '-'}</td>
                                                <td className="px-2 py-3 text-center text-xs border border-gray-200">{rate.isActive ? (
                                                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 border border-green-300 font-semibold">Active</span>
                                                ) : (
                                                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800 border border-red-300 font-semibold">Inactive</span>
                                                )}</td>
                                            </tr>
                                        );
                                    });
                                })()}
                            </tbody>
                        </table>
                        {/* Pagination Controls */}
                        <div className="flex justify-end items-center gap-2 mt-2 mb-2 mr-2">
                            <button
                                className="px-2 py-1 rounded border text-xs bg-white hover:bg-gray-100"
                                onClick={() => setCurrentRatePage(p => Math.max(1, p - 1))}
                                disabled={currentRatePage === 1}
                            >
                                <ChevronLeft className="inline w-4 h-4" />
                            </button>
                            <span className="text-xs">Page {currentRatePage} of {Math.ceil(feeHeadRates.length / rateEntriesPerPage) || 1}</span>
                            <button
                                className="px-2 py-1 rounded border text-xs bg-white hover:bg-gray-100"
                                onClick={() => setCurrentRatePage(p => Math.min(Math.ceil(feeHeadRates.length / rateEntriesPerPage) || 1, p + 1))}
                                disabled={currentRatePage === (Math.ceil(feeHeadRates.length / rateEntriesPerPage) || 1)}
                            >
                                <ChevronRight className="inline w-4 h-4" />
                            </button>
                        </div>
                    </>
                )}
            </div>



        </div>
    );
};

export default NewConnectionBillingMaster;
