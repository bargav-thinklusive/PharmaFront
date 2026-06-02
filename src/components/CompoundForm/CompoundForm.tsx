import { useEffect, useRef, useState } from "react";
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

    // Draft restore state
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const formDataRef = useRef<any>(formData);

    // Keep ref in sync with state
    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    // ── On mount: restore draft if one exists ─────────────────────────────────
    const initialDraftId = useRef(searchParams.get("draftId"));
    useEffect(() => {
        if (initialDraftId.current) {
            const draft = loadDraft(initialDraftId.current);
            if (draft && draft.formData && Object.keys(draft.formData).length > 0) {
                formDataRef.current = draft.formData;
                setFormData(draft.formData);
                setCurrentStep(draft.currentStep ?? 0);
            } else {
                // Draft not found, clear URL params
                setSearchParams({}, { replace: true });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const steps = [
        { title: "Executive Summary", fields: addExecutiveSummary },
        { title: "Product Overview", fields: addProductOverview },
        { title: "Regulatory Insights", fields: addRegulatoryInsights },
        { title: "Generic Entrants", fields: addGenericEntrants },
        { title: "Physical & Chemical Properties", fields: addPhysicalChemicalProperties },
        { title: "Drug Substance", fields: addDrugSubstance },
        { title: "Drug Product Information", fields: addDrugProductInformation },
        { title: "Labeling Information", fields: addLabelingInformation },
        { title: "BA/BE Studies", fields: addBaBeStudies },
        { title: "Sources", fields: addSources },
        { title: "Glossary", fields: addGlossary },
        { title: "Appendices", fields: addAppendices },
    ];

    const validateCurrentStep = () => {
        const currentFields = steps[currentStep].fields;
        const newErrors: { [key: string]: string } = {};
        let isValid = true;

        currentFields.forEach((field) => {
            if (field.required) {
                const value = formDataRef.current[field.key];
                if (!value || (typeof value === 'string' && value.trim() === '')) {
                    newErrors[field.key] = "Required";
                    isValid = false;
                }
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    // ── Save Section (explicit save button) ───────────────────────────────────
    const handleSaveDraft = async () => {
        setIsSavingDraft(true);
        try {
            const newDraftId = saveDraft(formDataRef.current, currentStep, draftId);
            if (!draftId) {
                setSearchParams({ draftId: newDraftId }, { replace: true });
            }
            toast.success("Draft saved successfully", { autoClose: 2500 });
        } finally {
            setIsSavingDraft(false);
        }
    };

    const handleNext = () => {
        if (validateCurrentStep()) {
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
                setErrors({});
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setErrors({});
        }
    };

    const submitForm = async () => {
        try {
            const formattedData = await formatCreatedDrug(formDataRef.current);
            await postData(drugService.createDrug(), formattedData);
            if (draftId) {
                clearDraft(draftId);
            }
            await refetchDrugs(); // refresh so new drug appears in search immediately
            toast.success("Drug Entry successfully submitted");
            navigate("/home");
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 400) {
                const responseData = error.response.data;
                let reason = "Submission Failed (400): ";
                if (responseData) {
                    if (typeof responseData === "string") {
                        reason += responseData;
                    } else if (responseData.message) {
                        reason += Array.isArray(responseData.message)
                            ? responseData.message.join(", ")
                            : responseData.message;
                    } else if (responseData.detail) {
                        reason += responseData.detail;
                    } else if (responseData.error) {
                        reason += responseData.error;
                    } else {
                        reason += JSON.stringify(responseData);
                    }
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
        if (validateCurrentStep()) {
            setShowConfirm(true);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
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

    return (
        <div className="mt-5 max-w-7xl mx-auto px-4">

            {/* Header with Page Title and Back button */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {draftId ? "Edit Drug Entry" : "New Drug Entry"}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {draftId ? "Modify drug details step by step." : "Fill in drug details step by step."}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Cancel
                </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="mb-16 relative w-full mt-6 px-2">
                {/* Background & Active Line Container */}
                <div className="absolute top-[15px] left-[24px] right-[24px] h-[3px] bg-gray-200 rounded z-0">
                    <div 
                        className="h-full bg-blue-600 rounded transition-all duration-500 ease-in-out" 
                        style={{ width: `${steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 100}%` }}
                    ></div>
                </div>
                
                {/* Steps */}
                <div className="flex items-start justify-between relative z-10">
                    {steps.map((step, index) => {
                        const isActive = index === currentStep;
                        const isCompleted = index < currentStep;
                        return (
                            <div key={index} className="flex flex-col items-center relative w-8">
                                <button
                                    type="button"
                                    title={step.title}
                                    onClick={() => {
                                        if (index < currentStep || validateCurrentStep()) {
                                            setCurrentStep(index);
                                            setErrors({});
                                        } else {
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }
                                    }}
                                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold transition-all duration-300 z-10 ${
                                        isActive ? 'bg-blue-600 border-2 border-blue-600 text-white ring-4 ring-blue-100 shadow-md scale-110' :
                                        isCompleted ? 'bg-blue-600 border-2 border-blue-600 text-white hover:bg-blue-700 shadow-sm' :
                                        'bg-white border-2 border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500'
                                    }`}
                                >
                                    {isCompleted ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        index + 1
                                    )}
                                </button>
                                <div className={`mt-2 absolute top-8 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-medium text-center w-20 sm:w-24 transition-colors duration-300 ${
                                    isActive ? 'text-blue-700 font-bold' :
                                    isCompleted ? 'text-gray-700' :
                                    'text-gray-400'
                                }`}>
                                    <span className="hidden lg:block leading-tight">{step.title}</span>
                                    <span className="block lg:hidden leading-tight">{isActive ? step.title : ""}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Form Content */}
            <form className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <DynamicFormBuilder
                    fields={steps[currentStep].fields}
                    form={formWithErrors}
                    columns={5}
                />

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`px-6 py-2 rounded-md font-medium transition-colors ${currentStep === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        Previous
                    </button>

                    {/* ── Save Section Button ── */}
                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={isSavingDraft}
                        className="px-5 py-2 rounded-md font-medium border border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors flex items-center gap-2 disabled:opacity-50"
                        title="Save your progress for this section"
                    >
                        💾 {isSavingDraft ? "Saving…" : "Save Section"}
                    </button>

                    {currentStep < steps.length - 1 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleDone}
                            className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
                        >
                            Done
                        </button>
                    )}
                </div>
            </form>

            {/* Premium Center-Aligned Submission Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden transform animate-scale-up p-6 relative">
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setShowConfirm(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-50 cursor-pointer border-0 outline-none"
                            aria-label="Close modal"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="flex items-start gap-4">
                            {/* Animated Alert Warning Icon Wrapper */}
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center animate-pulse-slow shadow-sm">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug">
                                    Please Review Your Items
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                    Please review your items before submitting. Are you sure you want to confirm?
                                </p>

                                <div className="flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(false)}
                                        className="px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer transition-all duration-150 shadow-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowConfirm(false);
                                            submitForm();
                                        }}
                                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl cursor-pointer transition-all duration-150 shadow-md shadow-emerald-100 hover:shadow-emerald-200/80"
                                    >
                                        Yes, Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DrugForm;