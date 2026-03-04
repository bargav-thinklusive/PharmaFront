import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const { postData } = usePost();
    const { saveDraft, loadDraft, clearDraft } = useDraft();
    const { refetchDrugs } = useUser();

    const [formData, setFormData] = useState<any>({});
    const [currentStep, setCurrentStep] = useState(0);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Draft restore state
    const [draftRestored, setDraftRestored] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);

    const formDataRef = useRef<any>(formData);

    // Keep ref in sync with state
    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    // ── On mount: restore draft if one exists ─────────────────────────────────
    useEffect(() => {
        const draft = loadDraft();
        if (draft && draft.formData && Object.keys(draft.formData).length > 0) {
            formDataRef.current = draft.formData;
            setFormData(draft.formData);
            setCurrentStep(draft.currentStep ?? 0);
            setDraftRestored(true);
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
            saveDraft(formDataRef.current, currentStep);
            setDraftRestored(true);
            toast.success("✅ Section saved! Your progress is safe.", { autoClose: 2500 });
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

    const handleDone = async () => {
        if (validateCurrentStep()) {
            try {
                const formattedData = await formatCreatedDrug(formDataRef.current);
                await postData(drugService.createDrug(), formattedData);
                clearDraft();
                await refetchDrugs(); // refresh so new drug appears in search immediately
                toast.success("Drug Entry successfully submitted");
                navigate("/home");
            } catch (error) {
                console.error(error);
                toast.error("Failed to submit drug entry. Please try again.");
            }
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

            {draftRestored && (
                <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm">
                    ✅ <strong>Draft restored</strong>
                </div>
            )}

            {/* Progress Indicator - Tab Style */}
            <header className="mb-8 border-b border-gray-200">
                <nav className="flex flex-wrap gap-1 pb-0">
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
                                    } else {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                }}
                                className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-all duration-150 whitespace-nowrap border-b-2 flex items-center gap-2 ${isActive
                                    ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                                    : isCompleted
                                        ? 'border-transparent text-blue-500 hover:text-blue-700 hover:bg-blue-50/30'
                                        : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isActive ? 'bg-blue-600 text-white' : isCompleted ? 'bg-blue-200 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                                    {index + 1}
                                </span>
                                {step.title}
                            </button>
                        );
                    })}
                </nav>
            </header>

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
                        Back
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
        </div>
    );
};

export default DrugForm;