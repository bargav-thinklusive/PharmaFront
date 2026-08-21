import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchDrugs } from '../../store/slices/drugsSlice';
import { flattenDrug } from '../CompoundForm/helper';
import { findExistingDraft, unixToDate, trackDrugSearch } from '../../utils/utils';
import useDraft from '../../hooks/useDraft';
import useDelete from '../../hooks/useDelete';
import DrugService from '../../services/DrugService';
import { toast } from 'react-toastify';
import useRoles from '../../hooks/useRoles';
import {
    FiChevronLeft,
    FiChevronRight,
    FiEdit,
    FiDownload,
    FiMoreHorizontal,
    FiActivity,
    FiFileText,
    FiTarget,
    FiInfo,
    FiCalendar,
    FiDatabase,
    FiBriefcase,
    FiTrash2,
    FiUsers,
    FiBarChart2,
    FiShare2,
} from 'react-icons/fi';
import './SectionedViewDrug.css';

import SectionHeader from './sectioned/SectionHeader';
import SectionContent from './sectioned/SectionContent';
import { ConfirmModal } from '../shared/ConfirmModal';
import { SECTIONS } from './sectioned/sectionsConfig';

const drugService = new DrugService();

export default function SectionedViewDrug() {
    const { cid, version } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const drugsData = useAppSelector((state) => state.drugs.drugsData);
    const drafts = useAppSelector((state) => state.drafts.drafts);
    const refetchDrugs = () => dispatch(fetchDrugs());
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { saveDraft } = useDraft();
    const { deleteData } = useDelete();
    const { canEditDrug, canDeleteDrug } = useRoles();

    const [currentStep, setCurrentStep] = useState(1);
    const [editMenuOpen, setEditMenuOpen] = useState(false);
    const [exportMenuOpen, setExportMenuOpen] = useState(false);
    const [moreMenuOpen, setMoreMenuOpen] = useState(false);

    const editBtnRef = useRef<HTMLDivElement>(null);
    const exportBtnRef = useRef<HTMLDivElement>(null);
    const moreBtnRef = useRef<HTMLDivElement>(null);

    // Find drug data by cid
    const drugToDisplay = useMemo(() => {
        const found = drugsData.find((d: any) => d.cid === cid);
        return found || null;
    }, [cid, drugsData]);

    useEffect(() => {
        if (drugToDisplay) {
            const name = drugToDisplay?.ProductOverview?.drugName || drugToDisplay?.ProductOverview?.brandName || drugToDisplay?.drugName;
            if (name) {
                trackDrugSearch(name);
            }
        }
    }, [drugToDisplay]);

    // Format display data by excluding internal fields
    const displayData = useMemo(() => {
        if (!drugToDisplay) return null;
        return Object.keys(drugToDisplay).reduce((acc: any, key) => {
            if (!['_id', 'cid', 'version', 'createdAt', 'updatedAt', 'references'].includes(key)) {
                acc[key] = drugToDisplay[key];
            }
            return acc;
        }, {});
    }, [drugToDisplay]);

    const flatDrug = useMemo(() => {
        return flattenDrug(drugToDisplay);
    }, [drugToDisplay]);

    // Cleanup dropdown listeners
    useEffect(() => {
        const clickHandler = (e: MouseEvent) => {
            const target = e.target as Node;
            if (editBtnRef.current && !editBtnRef.current.contains(target)) setEditMenuOpen(false);
            if (exportBtnRef.current && !exportBtnRef.current.contains(target)) setExportMenuOpen(false);
            if (moreBtnRef.current && !moreBtnRef.current.contains(target)) setMoreMenuOpen(false);
        };
        document.addEventListener('mousedown', clickHandler);
        return () => document.removeEventListener('mousedown', clickHandler);
    }, []);

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    if (!drugToDisplay) {
        return (
            <div className="sectioned-view-container min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full p-8 text-center bg-white rounded-2xl shadow-sm border border-slate-200">
                    <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-100">
                        <FiInfo className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Drug Not Found</h3>
                    <p className="text-sm text-slate-500 mb-6">
                        No data was found for drug with CID: <span className="font-mono font-bold text-slate-700">{cid}</span>
                    </p>
                    <button
                        onClick={() => navigate('/drugsList')}
                        className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-colors cursor-pointer text-sm shadow-sm"
                    >
                        Back to Database
                    </button>
                </div>
            </div>
        );
    }

    const currentSection = SECTIONS.find(s => s.id === currentStep);

    const handleNavigateById = (id: number) => {
        setCurrentStep(id);
    };

    const handleEdit = async () => {
        try {
            const flatData = flattenDrug(drugToDisplay);
            flatData.original_id = drugToDisplay._id || drugToDisplay.id;
            flatData.originalVersion = flatData.version || drugToDisplay.version || "1.0";
            if (!flatData.version) {
                flatData.version = "1.0";
            }
            const existingDraft = findExistingDraft(drafts, flatData);
            const targetDraftId = existingDraft ? (existingDraft.id || existingDraft._id) : null;
            const newDraftId = await saveDraft(flatData, 0, targetDraftId);
            navigate(`/drug-form?draftId=${newDraftId}`, { state: { initialData: flatData } });
        } catch (err) {
            console.error("Error creating draft for edit:", err);
            toast.error("Failed to edit drug entry.");
        }
    };

    const handleDelete = () => {
        if (!drugToDisplay?._id) return;
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        setShowDeleteModal(false);
        if (!drugToDisplay?._id) return;
        try {
            await deleteData(drugService.deleteDrug(drugToDisplay._id));
            toast.success("Drug record deleted successfully");
            if (refetchDrugs) await refetchDrugs();
            navigate("/drugsList");
        } catch (err) {
            console.error("Error deleting drug:", err);
            toast.error("Failed to delete drug record.");
        }
    };

    const handleExportJson = () => {
        setExportMenuOpen(false);
        try {
            const fileName = (flatDrug.drugName || drugToDisplay.ProductOverview?.drugName || 'drug_entry').replace(/[^a-zA-Z0-9_-]/g, '_');
            const jsonString = JSON.stringify(drugToDisplay, null, 2);
            const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute("download", `${fileName}_metadata.json`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success("Metadata exported as JSON!");
        } catch (err) {
            console.error("JSON Export error:", err);
            toast.error("Failed to export JSON file.");
        }
    };

    const handlePrintPdf = () => {
        setExportMenuOpen(false);
        setTimeout(() => {
            window.print();
        }, 150);
    };

    // Quick Stats Fields
    const therapeuticClass = drugToDisplay.ProductOverview?.therapeuticClass || "Analgesic, Antipyretic";
    const approvedIndications = flatDrug.approvedIndications || "Relief of mild to moderate pain and reduction of fever.";
    const mechanismOfAction = flatDrug.mechanismOfAction || "Inhibits prostaglandin synthesis in the central nervous system.";
    const routeOfAdministration = flatDrug.dosageForms || "Oral";
    const marketAvailability = "Widely available in global markets.";

    const firstApprovedYear = flatDrug.firstApprovedDate
        ? new Date(typeof flatDrug.firstApprovedDate === 'number' ? flatDrug.firstApprovedDate * 1000 : flatDrug.firstApprovedDate).getFullYear()
        : "—";

    const getPatentExpiry = () => {
        if (flatDrug.lossOfExclusivity && flatDrug.lossOfExclusivity.length > 0) {
            return flatDrug.lossOfExclusivity[0].expiredDate || flatDrug.lossOfExclusivity[0].expiryDate || "—";
        }
        if (flatDrug.drugPatents && flatDrug.drugPatents.length > 0) {
            return flatDrug.drugPatents[0].expiryDate || "—";
        }
        return "—";
    };

    const patentExpiry = getPatentExpiry();
    const lastUpdatedDate = drugToDisplay.updatedAt ? unixToDate(drugToDisplay.updatedAt) : "May 20, 2024";

    const getSectionData = (key?: string) => {
        if (!key || !drugToDisplay) return null;
        return drugToDisplay[key] ?? displayData?.[key] ?? null;
    };

    return (
        <div className="sectioned-view-container bg-slate-50/50 min-h-screen text-slate-800">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Breadcrumb Back Link ── */}
                <div className="mb-5 flex justify-start">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                    >
                        <FiChevronLeft className="w-4 h-4 text-slate-500" />
                        Back
                    </button>
                </div>

                {/* ── Sub-Header Info Card ── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Left Pane: Pill and titles */}
                    <div className="flex items-center gap-4 text-left">
                        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0e8a67] flex-shrink-0">
                            <FiActivity className="w-7 h-7" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none">
                                Drug
                            </span>
                            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight font-display my-1 truncate">
                                {flatDrug.drugName || "N/A"}
                            </h2>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="bg-[#e6f4ea] text-[#137333] border border-[#ceead6] text-[10px] font-bold px-2.5 py-0.5 rounded-lg shadow-xs">
                                    CID: {cid || "N/A"}
                                </span>
                                <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-lg shadow-xs">
                                    Current Version: {version || "—"}
                                </span>
                                <span className="bg-primary-light text-primary border border-emerald-100 text-[10px] font-bold px-2.5 py-0.5 rounded-lg shadow-xs">
                                    Status: Published
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Pane: Split actions buttons */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end relative">
                        {/* Edit Split Button */}
                        {canEditDrug(drugToDisplay) && (
                            <div ref={editBtnRef} className="inline-flex rounded-xl shadow-xs relative">
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-colors cursor-pointer border-0 rounded-l-xl"
                                >
                                    <FiEdit className="w-3.5 h-3.5" />
                                    Edit Drug
                                </button>
                                <button
                                    onClick={() => setEditMenuOpen(!editMenuOpen)}
                                    className="px-2 py-2 bg-primary hover:bg-primary-hover text-white border-l border-emerald-700/40 flex items-center justify-center cursor-pointer border-0 rounded-r-xl"
                                >
                                    <FiChevronRight className="w-3.5 h-3.5 rotate-90" />
                                </button>
                                {editMenuOpen && (
                                    <div className="absolute right-0 top-full mt-1.5 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs font-semibold text-slate-700 text-left">
                                        <button
                                            onClick={handleEdit}
                                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-slate-700"
                                        >
                                            <FiEdit className="w-3.5 h-3.5" />
                                            <span>Modify Record</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Export Dropdown Button */}
                        <div ref={exportBtnRef} className="relative">
                            <button
                                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors rounded-xl shadow-xs cursor-pointer"
                            >
                                <FiDownload className="w-3.5 h-3.5 text-slate-500" />
                                Export
                                <FiChevronRight className="w-3.5 h-3.5 rotate-90 text-slate-400" />
                            </button>
                            {exportMenuOpen && (
                                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs font-semibold text-slate-700 text-left">
                                    <button
                                        type="button"
                                        onClick={handleExportJson}
                                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-slate-700"
                                    >
                                        <FiDatabase className="w-3.5 h-3.5" />
                                        <span>Export as JSON</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handlePrintPdf}
                                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-slate-700"
                                    >
                                        <FiFileText className="w-3.5 h-3.5" />
                                        <span>Print / Save PDF</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Meatball Actions Menu */}
                        {canDeleteDrug(drugToDisplay) && (
                            <div ref={moreBtnRef} className="relative">
                                <button
                                    onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                                    className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <FiMoreHorizontal className="w-4 h-4" />
                                </button>
                                {moreMenuOpen && (
                                    <div className="absolute right-0 top-full mt-1.5 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs font-semibold text-slate-700 text-left">
                                        <button
                                            onClick={handleDelete}
                                            className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 hover:text-red-700 flex items-center gap-2 cursor-pointer"
                                        >
                                            <FiTrash2 className="w-3.5 h-3.5" />
                                            <span>Delete Record</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Tabs Navigation ── */}
                <div className="screen-only">
                    <SectionHeader
                        sections={SECTIONS}
                        currentStep={currentStep}
                        onNavigate={handleNavigateById}
                    />
                </div>

                {/* ── Main Tab Content Wrapper (Screen Only) ── */}
                <main className="screen-only min-h-[50vh] animate-fadeIn bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-left mt-6">
                    {currentStep === 1 ? (
                        /* Executive Summary Custom Tab Dashboard */
                        <div className="space-y-8">
                            {/* Heading */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                                <h1 className="text-xl font-bold text-slate-900 font-display">
                                    1. Executive Summary
                                </h1>
                                <button
                                    onClick={() => handleNavigateById(2)}
                                    className="text-xs font-bold text-[#0e8a67] hover:text-[#0a7557] hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-0 self-start sm:self-auto"
                                >
                                    View Product Overview <FiChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* 5 Quick Metrics Info Cards Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                {/* Class Card */}
                                <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-3 bg-white shadow-xs">
                                    <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0e8a67] flex-shrink-0">
                                        <FiBriefcase className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none">
                                            Therapeutic Class
                                        </span>
                                        <p className="text-xs font-bold text-slate-800 leading-tight mt-1.5 truncate" title={therapeuticClass}>
                                            {therapeuticClass}
                                        </p>
                                    </div>
                                </div>

                                {/* Indication Card */}
                                <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-3 bg-white shadow-xs">
                                    <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0e8a67] flex-shrink-0">
                                        <FiTarget className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none">
                                            Indication
                                        </span>
                                        <p className="text-xs font-bold text-slate-800 leading-tight mt-1.5 line-clamp-2" title={approvedIndications}>
                                            {approvedIndications}
                                        </p>
                                    </div>
                                </div>

                                {/* MoA Card */}
                                <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-3 bg-white shadow-xs">
                                    <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0e8a67] flex-shrink-0">
                                        <FiShare2 className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none">
                                            Mechanism of Action
                                        </span>
                                        <p className="text-xs font-bold text-slate-800 leading-tight mt-1.5 line-clamp-2" title={mechanismOfAction}>
                                            {mechanismOfAction}
                                        </p>
                                    </div>
                                </div>

                                {/* Route Card */}
                                <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-3 bg-white shadow-xs">
                                    <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0e8a67] flex-shrink-0">
                                        <FiActivity className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none">
                                            Route of Administration
                                        </span>
                                        <p className="text-xs font-bold text-slate-800 leading-tight mt-1.5 truncate" title={routeOfAdministration}>
                                            {routeOfAdministration}
                                        </p>
                                    </div>
                                </div>

                                {/* Availability Card */}
                                <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-3 bg-white shadow-xs">
                                    <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0e8a67] flex-shrink-0">
                                        <FiBarChart2 className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none">
                                            Market Availability
                                        </span>
                                        <p className="text-xs font-bold text-slate-800 leading-tight mt-1.5 line-clamp-2" title={marketAvailability}>
                                            {marketAvailability}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 3-Column Detailed Data Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                                {/* Column 1: Drug Identifiers */}
                                <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs space-y-4">
                                    <h3 className="text-xs font-extrabold text-[#0e8a67] uppercase tracking-wider flex items-center gap-1.5 font-display border-b border-slate-100 pb-2">
                                        <FiFileText className="w-4 h-4" />
                                        Drug Identifiers
                                    </h3>
                                    <div className="divide-y divide-slate-100/70 text-xs">
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">CID</span>
                                            <span className="font-bold text-slate-800">{cid}</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">Brand Name</span>
                                            <span className="font-bold text-slate-800">{flatDrug.drugName || "—"}</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">API Name</span>
                                            <span className="font-bold text-slate-800">{flatDrug.apiName || "—"}</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">IUPAC Name</span>
                                            <span className="font-bold text-slate-800 text-right max-w-[180px] truncate" title={flatDrug.iupacName}>{flatDrug.iupacName || "—"}</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">CAS Number</span>
                                            <span className="font-bold text-slate-800">{flatDrug.casNumber || "—"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 2: Regulatory & Exclusivity */}
                                <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs space-y-4">
                                    <h3 className="text-xs font-extrabold text-[#0e8a67] uppercase tracking-wider flex items-center gap-1.5 font-display border-b border-slate-100 pb-2">
                                        <FiCalendar className="w-4 h-4" />
                                        Regulatory & Exclusivity
                                    </h3>
                                    <div className="divide-y divide-slate-100/70 text-xs">
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">First Approval</span>
                                            <span className="font-bold text-slate-800">{firstApprovedYear}</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">First Approved Region</span>
                                            <span className="font-bold text-slate-800">{flatDrug.firstApprovedRegion || "USFDA"}</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">Patent / Exclusivity Expiry</span>
                                            <span className="font-bold text-slate-800">{patentExpiry}</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">Generic Status</span>
                                            <span className="font-bold text-slate-800">{flatDrug.genericEntrants && flatDrug.genericEntrants.length > 0 ? "Generic Available" : "Single Source"}</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">Special Designation</span>
                                            <span className="font-bold text-slate-800">{flatDrug.specialDesignations && flatDrug.specialDesignations.length > 0 ? flatDrug.specialDesignations[0].designationType || "Standard" : "Standard"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 3: Commercial & Supply Chain */}
                                <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs space-y-4">
                                    <h3 className="text-xs font-extrabold text-[#0e8a67] uppercase tracking-wider flex items-center gap-1.5 font-display border-b border-slate-100 pb-2">
                                        <FiUsers className="w-4 h-4" />
                                        Commercial & Supply
                                    </h3>
                                    <div className="divide-y divide-slate-100/70 text-xs">
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">Innovator / Company</span>
                                            <span className="font-bold text-slate-800">{flatDrug.companyName || "—"}</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">Global Annual Revenue</span>
                                            <span className="font-bold text-slate-800">{flatDrug.globalAnnualRevenue || "—"}</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">DMF Vendors Count</span>
                                            <span className="font-bold text-slate-800">{flatDrug.availableDmfVendors ? flatDrug.availableDmfVendors.length : 0} Vendors</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">Active Formulations</span>
                                            <span className="font-bold text-slate-800">{flatDrug.dosageFormAndStrength ? flatDrug.dosageFormAndStrength.length : 1} Formulations</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">Last Profile Update</span>
                                            <span className="font-bold text-slate-800">{lastUpdatedDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Executive Summary Rich Text Box */}
                            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 space-y-3">
                                <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider font-display">
                                    Overview & Summary
                                </h3>
                                <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                                    {flatDrug.executiveSummary || `${flatDrug.drugName || "This compound"} is a synthetic small-molecule pharmaceutical drug classified primarily under ${therapeuticClass}. It is approved for ${approvedIndications.toLowerCase()} via ${mechanismOfAction.toLowerCase()}`}
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* Standard Section Content Renderer for Tabs 2 to 12 */
                        <SectionContent
                            section={currentSection}
                            sectionIndex={String(currentStep)}
                            data={getSectionData(currentSection?.key)}
                        />
                    )}
                </main>

                {/* ── Print / PDF Layout (Hidden on Screen, Visible on Print) ── */}
                <div className="print-only hidden print:block space-y-8 bg-white p-4">
                    <div className="border-b border-slate-300 pb-4 mb-6 flex justify-between items-end">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{flatDrug.drugName || "Drug Entry"}</h1>
                            <p className="text-xs text-slate-500">CID: {cid} | Version: {version}</p>
                        </div>
                        <p className="text-xs text-slate-400">CMCIntel Intelligence Report</p>
                    </div>

                    {SECTIONS.map((sec) => (
                        <div key={sec.id} className="page-break-inside-avoid mb-6">
                            <h2 className="text-base font-bold text-[#0e8a67] border-b border-slate-200 pb-2 mb-3">
                                {sec.id}. {sec.title}
                            </h2>
                            <SectionContent section={sec} sectionIndex={String(sec.id)} data={getSectionData(sec.key)} />
                        </div>
                    ))}
                </div>

            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Drug Record"
                description={`Are you sure you want to delete "${flatDrug.drugName || 'this drug entry'}"? This action cannot be undone.`}
                confirmText="Delete Record"
                cancelText="Cancel"
                icon={<FiTrash2 className="w-6 h-6 text-red-500" />}
                iconBgColor="bg-red-50 border-red-200"
                confirmButtonColor="bg-red-600 hover:bg-red-700"
            />
        </div>
    );
}
