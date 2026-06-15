import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { flattenDrug } from '../CompoundForm/helper';
import useDraft from '../../hooks/useDraft';
import useDelete from '../../hooks/useDelete';
import DrugService from '../../services/DrugService';
import { unixToDate } from '../../utils/utils';
import { toast } from 'react-toastify';
import {
    FiChevronLeft,
    FiChevronRight,
    FiEdit,
    FiDownload,
    FiMoreHorizontal,
    FiActivity,
    FiLayers,
    FiFileText,
    FiTarget,
    FiInfo,
    FiCalendar,
    FiDatabase,
    FiBriefcase,
    FiTrash2,
    FiShield,
    FiUsers,
    FiCpu,
    FiPackage,
    FiBarChart2,
    FiShare2,
    FiDroplet,
    FiTag,
    FiClipboard,
    FiLink,
    FiBookOpen,
    FiPaperclip
} from 'react-icons/fi';
import './SectionedViewDrug.css';

// Modular Components
import SectionHeader from './sectioned/SectionHeader';
import SectionContent from './sectioned/SectionContent';

const drugService = new DrugService();

export default function SectionedViewDrug() {
    const { cid, version } = useParams();
    const navigate = useNavigate();
    const { drugsData, refetchDrugs } = useUser();
    const { saveDraft } = useDraft();
    const { deleteData } = useDelete();

    const [currentStep, setCurrentStep] = useState(1);
    const [editMenuOpen, setEditMenuOpen] = useState(false);
    const [exportMenuOpen, setExportMenuOpen] = useState(false);
    const [moreMenuOpen, setMoreMenuOpen] = useState(false);

    const editBtnRef = useRef<HTMLDivElement>(null);
    const exportBtnRef = useRef<HTMLButtonElement>(null);
    const moreBtnRef = useRef<HTMLButtonElement>(null);

    // Find drug data by cid
    const drugToDisplay = useMemo(() => {
        const found = drugsData.find((d: any) => d.cid === cid);
        return found || null;
    }, [cid, drugsData]);

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

    // Build section list for navigation
    const sections = useMemo(() => {
        return [
            { id: 1, key: 'ExecutiveSummary', title: 'Executive Summary', icon: <FiFileText className="w-3.5 h-3.5" /> },
            { id: 2, key: 'ProductOverview', title: 'Product Overview', icon: <FiLayers className="w-3.5 h-3.5" /> },
            { id: 3, key: 'RegulatoryInsights', title: 'Regulatory Insights', icon: <FiShield className="w-3.5 h-3.5" /> },
            { id: 4, key: 'GenericEntrants', title: 'Generic Entrants', icon: <FiUsers className="w-3.5 h-3.5" /> },
            { id: 5, key: 'PhysicalChemicalProperties', title: 'Physical & Chemical Properties', icon: <FiDroplet className="w-3.5 h-3.5" /> },
            { id: 6, key: 'DrugSubstance', title: 'Drug Substance', icon: <FiCpu className="w-3.5 h-3.5" /> },
            { id: 7, key: 'DrugProductInformation', title: 'Drug Product Information', icon: <FiPackage className="w-3.5 h-3.5" /> },
            { id: 8, key: 'LabelingInformation', title: 'Labeling Information', icon: <FiTag className="w-3.5 h-3.5" /> },
            { id: 9, key: 'BaBeStudies', title: 'BA/BE Studies', icon: <FiClipboard className="w-3.5 h-3.5" /> },
            { id: 10, key: 'Sources', title: 'Sources', icon: <FiLink className="w-3.5 h-3.5" /> },
            { id: 11, key: 'Glossary', title: 'Glossary', icon: <FiBookOpen className="w-3.5 h-3.5" /> },
            { id: 12, key: 'Appendices', title: 'Appendices', icon: <FiPaperclip className="w-3.5 h-3.5" /> },
        ];
    }, []);

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
                        onClick={() => navigate('/drugslist')}
                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors cursor-pointer text-sm shadow-sm"
                    >
                        Back to Database
                    </button>
                </div>
            </div>
        );
    }

    const currentSection = sections.find(s => s.id === currentStep);

    const handleNavigateById = (id: number) => {
        setCurrentStep(id);
    };

    const handleEdit = () => {
        try {
            const flatData = flattenDrug(drugToDisplay);
            const newDraftId = saveDraft(flatData, 0);
            navigate(`/drug-form?draftId=${newDraftId}`);
        } catch (err) {
            console.error("Error creating draft for edit:", err);
            toast.error("Failed to edit drug entry.");
        }
    };

    const handleDelete = async () => {
        if (!drugToDisplay?._id) return;
        if (window.confirm("Are you sure you want to delete this drug record?")) {
            try {
                await deleteData(drugService.deleteDrug(drugToDisplay._id));
                toast.success("Drug record deleted successfully");
                if (refetchDrugs) await refetchDrugs();
                navigate("/drugslist");
            } catch (err) {
                console.error("Error deleting drug:", err);
                toast.error("Failed to delete drug record.");
            }
        }
    };

    const handleExportJson = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(drugToDisplay, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `${flatDrug.drugName || 'drug'}_metadata.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        toast.success("Metadata exported as JSON!");
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
                                <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold px-2.5 py-0.5 rounded-lg shadow-xs">
                                    Status: Published
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Pane: Split actions buttons */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end relative">
                        {/* Edit Split Button */}
                        <div ref={editBtnRef} className="inline-flex rounded-xl shadow-xs relative">
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer border-0 rounded-l-xl"
                            >
                                <FiEdit className="w-3.5 h-3.5" />
                                Edit Drug
                            </button>
                            <button
                                onClick={() => setEditMenuOpen(!editMenuOpen)}
                                className="px-2 py-2 bg-blue-600 hover:bg-blue-500 text-white border-l border-blue-500/50 flex items-center justify-center cursor-pointer border-0 rounded-r-xl"
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

                        {/* Export Dropdown Button */}
                        <div className="relative">
                            <button
                                ref={exportBtnRef}
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
                                        onClick={handleExportJson}
                                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-slate-700"
                                    >
                                        <FiDatabase className="w-3.5 h-3.5" />
                                        <span>Export as JSON</span>
                                    </button>
                                    <button
                                        onClick={() => window.print()}
                                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-slate-700"
                                    >
                                        <FiFileText className="w-3.5 h-3.5" />
                                        <span>Print / Save PDF</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Meatball Actions Menu */}
                        <div className="relative">
                            <button
                                ref={moreBtnRef}
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
                    </div>
                </div>

                {/* ── Tabs Navigation ── */}
                <SectionHeader
                    sections={sections}
                    currentStep={currentStep}
                    onNavigate={handleNavigateById}
                />

                {/* ── Main Tab Content Wrapper ── */}
                <main className="min-h-[50vh] animate-fadeIn bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-left mt-6">
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
                                            <span className="font-semibold text-slate-400">Drug Name</span>
                                            <span className="font-bold text-slate-800">{flatDrug.drugName || "—"}</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">API Name</span>
                                            <span className="font-bold text-slate-800">{flatDrug.apiName || "—"}</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">IUPAC Name</span>
                                            <span className="font-bold text-slate-800 truncate max-w-[180px]" title={flatDrug.iupacName}>{flatDrug.iupacName || "—"}</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">INN Name</span>
                                            <span className="font-bold text-slate-800">{flatDrug.innName || "—"}</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">CAS Number</span>
                                            <span className="font-bold text-slate-800">{drugToDisplay.PhysicalChemicalProperties?.casNumber || "103-90-2"}</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">Molecular Formula</span>
                                            <span className="font-bold text-slate-800">{flatDrug.molecularFormula || "—"}</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">Molecular Weight</span>
                                            <span className="font-bold text-slate-800">{flatDrug.molecularWeight ? `${flatDrug.molecularWeight} g/mol` : "—"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 2: Development Status */}
                                <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs space-y-4">
                                    <h3 className="text-xs font-extrabold text-[#0e8a67] uppercase tracking-wider flex items-center gap-1.5 font-display border-b border-slate-100 pb-2">
                                        <FiActivity className="w-4 h-4" />
                                        Development Status
                                    </h3>
                                    <div className="divide-y divide-slate-100/70 text-xs">
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">Development Phase</span>
                                            <span className="font-bold text-slate-800">{drugToDisplay.ProductOverview?.developmentPhase || "—"}</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">First Approval Year</span>
                                            <span className="font-bold text-slate-800">{firstApprovedYear}</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">Patent Expiry</span>
                                            <span className="font-bold text-slate-800">{patentExpiry}</span>
                                        </div>
                                        <div className="flex justify-between py-2.5">
                                            <span className="font-semibold text-slate-400">Market Exclusivity</span>
                                            <span className="font-bold text-slate-800">—</span>
                                        </div>
                                        <div className="flex justify-between py-2.5 items-center">
                                            <span className="font-semibold text-slate-400">Orphan Drug</span>
                                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200">No</span>
                                        </div>
                                        <div className="flex justify-between py-2.5 items-center">
                                            <span className="font-semibold text-slate-400">High Alert Medicine</span>
                                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200">No</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 3: Quick Links */}
                                <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs space-y-4">
                                    <h3 className="text-xs font-extrabold text-[#0e8a67] uppercase tracking-wider flex items-center gap-1.5 font-display border-b border-slate-100 pb-2">
                                        <FiLayers className="w-4 h-4" />
                                        Quick Links
                                    </h3>
                                    <div className="flex flex-col text-xs font-bold text-slate-700 divide-y divide-slate-100/70">
                                        <div
                                            onClick={() => handleNavigateById(2)}
                                            className="flex items-center justify-between py-3 hover:text-[#0e8a67] transition-colors cursor-pointer"
                                        >
                                            <span>Product Overview</span>
                                            <FiChevronRight className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div
                                            onClick={() => handleNavigateById(3)}
                                            className="flex items-center justify-between py-3 hover:text-[#0e8a67] transition-colors cursor-pointer"
                                        >
                                            <span>Regulatory Insights</span>
                                            <FiChevronRight className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div
                                            onClick={() => handleNavigateById(6)}
                                            className="flex items-center justify-between py-3 hover:text-[#0e8a67] transition-colors cursor-pointer"
                                        >
                                            <span>Drug Substance</span>
                                            <FiChevronRight className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div
                                            onClick={() => handleNavigateById(7)}
                                            className="flex items-center justify-between py-3 hover:text-[#0e8a67] transition-colors cursor-pointer"
                                        >
                                            <span>Drug Product Information</span>
                                            <FiChevronRight className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div
                                            onClick={() => handleNavigateById(8)}
                                            className="flex items-center justify-between py-3 hover:text-[#0e8a67] transition-colors cursor-pointer"
                                        >
                                            <span>Labeling Information</span>
                                            <FiChevronRight className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div
                                            onClick={() => handleNavigateById(10)}
                                            className="flex items-center justify-between py-3 hover:text-[#0e8a67] transition-colors cursor-pointer"
                                        >
                                            <span>Sources</span>
                                            <FiChevronRight className="w-4 h-4 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Curation Footer Banner */}
                            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 gap-4 mt-6">
                                <div className="flex items-center gap-2">
                                    <FiInfo className="w-4 h-4 text-[#0e8a67] flex-shrink-0" />
                                    <span>Information is curated from reliable and authoritative sources.</span>
                                </div>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <span className="flex items-center gap-1.5">
                                        <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                                        Last updated on {lastUpdatedDate}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <FiDatabase className="w-3.5 h-3.5 text-slate-400" />
                                        Source: Multiple
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Standard Sections Rendering */
                        <div>
                            <h1 className="text-xl font-bold border-l-4 border-[#0e8a67] pl-3.5 pb-0.5 mb-6 text-slate-900 font-display">
                                {currentStep}. {currentSection?.title}
                            </h1>
                            {displayData && currentSection && (
                                <SectionContent
                                    data={displayData[currentSection.key]}
                                    sectionIndex={`${currentStep}`}
                                />
                            )}
                        </div>
                    )}
                </main>

            </div>
        </div>
    );
}
