import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import DynamicFormBuilder from "../shared";
import { addExecutiveSummary, addProductOverview, addPhysicalChemicalProperties, addDrugSubstance, addDrugProductInformation, addAppendices, addRegulatoryInsights, addLabelingInformation, addGenericEntrants, addBaBeStudies, addSources, addGlossary } from "./columns";
import { formatCreatedDrug } from "./helper";
import usePost from "../../hooks/usePost";
import DrugService from "../../services/DrugService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useDraft from "../../hooks/useDraft";
import { useUser } from "../../context/UserContext";
import { FiChevronLeft, FiChevronRight, FiCheck, FiSave, FiX, FiAlertTriangle } from "react-icons/fi";

const drugService = new DrugService();

const DrugForm = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { postData } = usePost();
    const { saveDraft, loadDraft, clearDraft } = useDraft();
    const { refetchDrugs } = useUser();

    const draftId = searchParams.get("draftId");

    const [formData, setFormData] = useState<any>({});
    const [currentStep, setCurrentStep] = useState(0);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSaveDraftConfirm, setShowSaveDraftConfirm] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    // Auto-save state
    const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
    const [secondsSinceSave, setSecondsSinceSave] = useState<number>(0);

    const formDataRef = useRef<any>(formData);

    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    const initialDraftId = useRef(searchParams.get("draftId"));
    useEffect(() => {
        if (initialDraftId.current) {
            const draft = loadDraft(initialDraftId.current);
            if (draft && draft.formData && Object.keys(draft.formData).length > 0) {
                formDataRef.current = draft.formData;
                setFormData(draft.formData);
                setCurrentStep(draft.currentStep ?? 0);
                setLastSavedTime(new Date());
            } else {
                setSearchParams({}, { replace: true });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const steps = [
        { title: "Executive Summary",           fields: addExecutiveSummary },
        { title: "Product Overview",             fields: addProductOverview },
        { title: "Regulatory Insights",          fields: addRegulatoryInsights },
        { title: "Generic Entrants",             fields: addGenericEntrants },
        { title: "Physical & Chemical Properties", fields: addPhysicalChemicalProperties },
        { title: "Drug Substance",               fields: addDrugSubstance },
        { title: "Drug Product Information",    fields: addDrugProductInformation },
        { title: "Labeling Information",         fields: addLabelingInformation },
        { title: "BA/BE Studies",                fields: addBaBeStudies },
        { title: "Sources",                      fields: addSources },
        { title: "Glossary",                     fields: addGlossary },
        { title: "Appendices",                   fields: addAppendices },
    ];

    const validateCurrentStep = () => {
        const currentFields = steps[currentStep].fields;
        const newErrors: { [key: string]: string } = {};
        let isValid = true;
        currentFields.forEach((field) => {
            if (field.required) {
                const value = formDataRef.current[field.key];
                if (!value || (typeof value === "string" && value.trim() === "")) {
                    newErrors[field.key] = "Required";
                    isValid = false;
                }
            }
        });
        setErrors(newErrors);
        return isValid;
    };

    const executeSaveDraft = () => {
        setIsSavingDraft(true);
        try {
            const newDraftId = saveDraft(formDataRef.current, currentStep, draftId);
            if (!draftId) setSearchParams({ draftId: newDraftId }, { replace: true });
            setLastSavedTime(new Date());
            setSecondsSinceSave(0);
            toast.success("✅ Draft saved successfully!", { autoClose: 3000 });
        } catch (err) {
            console.error("Save draft error:", err);
            toast.error("Failed to save draft. Please try again.");
        } finally {
            setIsSavingDraft(false);
        }
    };

    // Auto-save logic
    useEffect(() => {
        if (draftId) {
            setLastSavedTime(new Date());
            setSecondsSinceSave(0);
        }
    }, [draftId]);

    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsSinceSave((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            if (Object.keys(formDataRef.current).length > 0) {
                try {
                    const newDraftId = saveDraft(formDataRef.current, currentStep, draftId);
                    if (!draftId) setSearchParams({ draftId: newDraftId }, { replace: true });
                    setLastSavedTime(new Date());
                    setSecondsSinceSave(0);
                } catch (e) {
                    console.error("Background auto-save failed:", e);
                }
            }
        }, 30000); // auto-save every 30s
        return () => clearInterval(autoSaveInterval);
    }, [currentStep, draftId]);

    const handleSaveDraftClick = () => {
        setShowSaveDraftConfirm(true);
    };

    useEffect(() => {
        (window as any).executeSaveDraftGlobal = () => {
            executeSaveDraft();
        };
        return () => {
            delete (window as any).executeSaveDraftGlobal;
        };
    }, [currentStep, draftId]);

    const handleNext = () => {
        if (validateCurrentStep()) {
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
                setErrors({});
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setErrors({});
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const submitForm = async () => {
        try {
            const formattedData = await formatCreatedDrug(formDataRef.current);
            await postData(drugService.createDrug(), formattedData);
            if (draftId) clearDraft(draftId);
            await refetchDrugs();
            toast.success("Drug Entry successfully submitted");
            navigate("/home");
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 400) {
                const responseData = error.response.data;
                let reason = "Submission Failed (400): ";
                if (responseData) {
                    if (typeof responseData === "string") reason += responseData;
                    else if (responseData.message)
                        reason += Array.isArray(responseData.message)
                            ? responseData.message.join(", ")
                            : responseData.message;
                    else if (responseData.detail) reason += responseData.detail;
                    else if (responseData.error) reason += responseData.error;
                    else reason += JSON.stringify(responseData);
                } else {
                    reason += "Invalid input data. Please check your entries.";
                }
                toast.error(reason, { autoClose: 6000 });
            } else {
                toast.error("Failed to submit drug entry. Please try again.");
            }
        }
    };

    const handleDone = () => {
        if (validateCurrentStep()) setShowConfirm(true);
        else window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const formWithErrors = {
        ...formData,
        getFieldValue: (key: string) => formDataRef.current[key],
        getFieldsValue: () => formDataRef.current,
        setFieldsValue: (values: any) => {
            formDataRef.current = { ...formDataRef.current, ...values };
            setFormData((prev: any) => ({ ...prev, ...values }));
        },
        getFieldError: (key: string) => errors[key],
    };

    const progressPct = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 100;
    const isLastStep = currentStep === steps.length - 1;

    // Field completion stats helper
    const currentFields = steps[currentStep].fields.filter(f => f.type !== "header" && f.type !== "dynamic");
    const totalFieldsCount = currentFields.length;
    const completedFieldsCount = currentFields.filter(f => {
        const val = formData[f.key];
        if (Array.isArray(val)) return val.length > 0;
        return val !== undefined && val !== null && String(val).trim() !== "";
    }).length;

    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-page font-sans">
            {/* ── Left Sidebar Stepper ── */}
            <div className={`w-full ${isSidebarExpanded ? "lg:w-72" : "lg:w-20"} bg-[#0b1329] text-white flex flex-col flex-shrink-0 border-r border-slate-800 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] overflow-y-auto transition-all duration-300`}>
                {/* Sidebar Header / Toggle Trigger */}
                <div
                    onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                    className="p-6 border-b border-slate-800 flex flex-col items-center cursor-pointer hover:bg-slate-800/20 transition-colors"
                >
                    <div className="w-full flex items-center justify-between">
                        {isSidebarExpanded ? (
                            <>
                                <span className="text-xs font-bold tracking-wider uppercase font-display text-slate-400">
                                    Progress
                                </span>
                                <FiChevronLeft className="w-4 h-4 text-slate-500" />
                            </>
                        ) : (
                            <div className="w-full flex justify-center">
                                <FiChevronRight className="w-5 h-5 text-slate-400 animate-pulse-slow" />
                            </div>
                        )}
                    </div>
                    
                    {isSidebarExpanded && (
                        <>
                            {/* Circular Progress SVG */}
                            <div className="relative w-28 h-28 flex items-center justify-center mt-4 mb-3">
                                <svg className="w-full h-full transform -rotate-90">
                                    {/* Background Circle */}
                                    <circle
                                        cx="56"
                                        cy="56"
                                        r="42"
                                        stroke="#1e293b"
                                        strokeWidth="6.5"
                                        fill="transparent"
                                    />
                                    {/* Progress Circle */}
                                    <circle
                                        cx="56"
                                        cy="56"
                                        r="42"
                                        stroke="#0e8a67"
                                        strokeWidth="6.5"
                                        fill="transparent"
                                        strokeDasharray="263.89"
                                        strokeDashoffset={263.89 - (progressPct / 100) * 263.89}
                                        strokeLinecap="round"
                                        className="transition-all duration-500 ease-in-out"
                                    />
                                </svg>
                                <span className="absolute text-xl font-extrabold text-white font-display">
                                    {Math.round(progressPct)}%
                                </span>
                            </div>

                            <span className="text-xs font-semibold text-slate-400">
                                Step {currentStep + 1} of {steps.length}
                            </span>
                        </>
                    )}
                </div>

                {/* Steps List */}
                {!isSidebarExpanded ? (
                    /* Collapsed steps list */
                    <nav className="hidden lg:flex flex-col items-center py-6 px-2 space-y-3">
                        {steps.map((step, index) => {
                            const isActive = index === currentStep;
                            const isCompleted = index < currentStep;
                            
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (index < currentStep || validateCurrentStep()) {
                                            setCurrentStep(index);
                                            setErrors({});
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }
                                    }}
                                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                                        isActive
                                            ? "bg-[#1e293b] text-white shadow-sm ring-1 ring-white/10"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/30"
                                    }`}
                                    title={step.title}
                                >
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all flex-shrink-0 ${
                                            isActive
                                                ? "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-500/20"
                                                : isCompleted
                                                ? "bg-green-600 border-green-600 text-white"
                                                : "bg-transparent border-slate-700 text-slate-500"
                                        }`}
                                    >
                                        {isCompleted ? <FiCheck className="w-3.5 h-3.5" /> : index + 1}
                                    </div>
                                </button>
                            );
                        })}
                    </nav>
                ) : (
                    /* Expanded steps list */
                    <nav className="flex-1 py-6 px-4 space-y-1.5">
                        {steps.map((step, index) => {
                            const isActive = index === currentStep;
                            const isCompleted = index < currentStep;
                            
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                        if (index < currentStep || validateCurrentStep()) {
                                            setCurrentStep(index);
                                            setErrors({});
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }
                                    }}
                                    className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-medium transition-all text-left cursor-pointer group ${
                                        isActive
                                            ? "bg-[#1e293b] text-white shadow-sm ring-1 ring-white/10"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/30"
                                    }`}
                                >
                                    {/* Step status circle indicator */}
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all flex-shrink-0 ${
                                            isActive
                                                ? "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-500/20"
                                                : isCompleted
                                                ? "bg-green-600 border-green-600 text-white"
                                                : "bg-transparent border-slate-700 text-slate-500 group-hover:border-slate-500 group-hover:text-slate-300"
                                        }`}
                                    >
                                        {isCompleted ? <FiCheck className="w-3.5 h-3.5" /> : index + 1}
                                    </div>

                                    <span className="truncate leading-none py-1">{step.title}</span>
                                </button>
                            );
                        })}
                    </nav>
                )}
            </div>

            {/* ── Right Content Area ── */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Custom Breadcrumb/Top Header */}
                <div className="bg-white border-b border-border-main py-4 px-6 sm:px-8 flex items-center justify-between sticky top-16 z-30 shadow-sm">
                    {/* Left path info */}
                    <div className="min-w-0">
                        <div
                            onClick={() => navigate("/drugslist")}
                            className="inline-flex items-center gap-1 text-xs text-body hover:text-primary mb-1.5 cursor-pointer font-semibold transition-colors"
                        >
                            <FiChevronLeft className="w-3.5 h-3.5" />
                            Drug Database
                        </div>
                        <div className="flex items-center gap-2.5 min-w-0">
                            <h2 className="text-xl font-bold text-main font-display truncate leading-tight py-0.5">
                                {formData.drugName || "New Drug Entry"}
                            </h2>
                            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2 py-0.5 rounded-md flex-shrink-0 shadow-sm">
                                Draft
                            </span>
                        </div>
                    </div>

                    {/* Right action details */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold bg-green-50 px-3 py-1.5 rounded-xl border border-green-100 shadow-sm">
                            <FiCheck className="w-3.5 h-3.5 text-green-600" />
                            {lastSavedTime ? `Auto-saved ${secondsSinceSave}s ago` : "Saving draft..."}
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border-main bg-white text-body text-xs font-bold hover:bg-alt transition-colors cursor-pointer shadow-sm"
                        >
                            <FiX className="w-3.5 h-3.5" />
                            Cancel
                        </button>
                    </div>
                </div>

                {/* Form main card body */}
                <div className="flex-1 p-6 sm:p-8 bg-page overflow-y-auto">
                    <div className="max-w-5xl mx-auto">
                        {steps[currentStep].fields.some((f) => f.type === "header") ? (
                            <DynamicFormBuilder
                                fields={steps[currentStep].fields}
                                form={formWithErrors}
                                columns={currentStep === 1 ? 4 : 5}
                            />
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-border-main overflow-hidden">
                                {/* Card header */}
                                <div className="px-6 sm:px-8 py-5 border-b border-border-main flex items-center justify-between bg-alt/10">
                                    <div>
                                        <h2 className="text-lg font-bold text-main font-display">
                                            {steps[currentStep].title}
                                        </h2>
                                    </div>
                                    <div className="text-xs font-semibold text-body bg-alt px-3 py-1.5 rounded-full border border-border-main shadow-xs">
                                        {completedFieldsCount} of {totalFieldsCount} fields completed
                                    </div>
                                </div>

                                {/* Form fields */}
                                <div className="p-6 sm:p-8">
                                    <DynamicFormBuilder
                                        fields={steps[currentStep].fields}
                                        form={formWithErrors}
                                        columns={5}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="bg-[#0b1329] border-t border-slate-800 px-6 sm:px-8 py-5 flex items-center justify-between sticky bottom-0 z-20">
                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            currentStep === 0
                                ? "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50 border-0"
                                : "bg-transparent border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 cursor-pointer shadow-sm"
                        }`}
                    >
                        <FiChevronLeft className="w-4 h-4" />
                        Previous
                    </button>

                    <button
                        type="button"
                        onClick={handleSaveDraftClick}
                        disabled={isSavingDraft}
                        className="flex items-center gap-1.5 px-5 py-2.5 text-slate-300 hover:text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer bg-transparent border-0"
                    >
                        <FiSave className="w-4 h-4" />
                        {isSavingDraft ? "Saving…" : "Save Draft"}
                    </button>

                    {!isLastStep ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-all duration-200 shadow-md cursor-pointer hover:-translate-y-0.5"
                        >
                            Save & Continue
                            <FiChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleDone}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all duration-200 shadow-md cursor-pointer hover:-translate-y-0.5"
                        >
                            <FiCheck className="w-4 h-4" />
                            Submit
                        </button>
                    )}
                </div>
            </div>

            {/* ── Confirmation Modal ── */}
            {showConfirm && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in text-left">
                    <div className="bg-white rounded-2xl shadow-2xl border border-border-main max-w-md w-full overflow-hidden animate-scale-up">
                        {/* Modal header */}
                        <div className="px-6 pt-6 pb-4 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 animate-pulse-slow">
                                <FiAlertTriangle className="w-6 h-6 text-amber-500" />
                            </div>
                            <div className="flex-1 min-w-0 pr-6">
                                <h3 className="text-lg font-bold text-main font-display mb-1">
                                    Review & Submit
                                </h3>
                                <p className="text-sm text-body leading-relaxed">
                                    Please review all your entries before submitting. This action will create a new drug record. Are you sure you want to proceed?
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowConfirm(false)}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-body hover:text-main hover:bg-alt transition-colors cursor-pointer border-0"
                                aria-label="Close"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal actions */}
                        <div className="px-6 pb-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowConfirm(false)}
                                className="px-5 py-2.5 rounded-xl border border-border-main bg-white text-main text-sm font-semibold hover:bg-alt transition-colors cursor-pointer shadow-sm"
                            >
                                Go Back
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowConfirm(false); submitForm(); }}
                                className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all duration-200 shadow-md hover:-translate-y-0.5 cursor-pointer"
                            >
                                Yes, Submit
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* ── Save Draft Confirmation Modal ── */}
            {showSaveDraftConfirm && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in text-left">
                    <div className="bg-white rounded-2xl shadow-2xl border border-border-main max-w-md w-full overflow-hidden animate-scale-up">
                        {/* Modal header */}
                        <div className="px-6 pt-6 pb-4 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 animate-pulse-slow">
                                <FiSave className="w-6 h-6 text-amber-500" />
                            </div>
                            <div className="flex-1 min-w-0 pr-6">
                                <h3 className="text-lg font-bold text-main font-display mb-1">
                                    Save Draft
                                </h3>
                                <p className="text-sm text-body leading-relaxed">
                                    Are you sure you want to save this draft? You can reload your draft anytime from the header menu.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowSaveDraftConfirm(false)}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-body hover:text-main hover:bg-alt transition-colors cursor-pointer border-0"
                                aria-label="Close"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal actions */}
                        <div className="px-6 pb-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowSaveDraftConfirm(false)}
                                className="px-5 py-2.5 rounded-xl border border-border-main bg-white text-main text-sm font-semibold hover:bg-alt transition-colors cursor-pointer shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowSaveDraftConfirm(false); executeSaveDraft(); }}
                                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-all duration-200 shadow-md hover:-translate-y-0.5 cursor-pointer"
                            >
                                Yes, Save
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default DrugForm;