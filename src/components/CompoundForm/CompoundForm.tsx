import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DynamicFormBuilder from "../shared";
import { addMarketInformation, addPhysicalChemicalProperties, addProcessDevelopment, addAnalyticalDevelopment, addDrugProductInformation, addAppendices } from "./columns";
import { formatCreatedDrug } from "./helper";
import usePost from "../../hooks/usePost";
import DrugService from "../../services/DrugService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const drugService = new DrugService();

const DrugForm = () => {
    const navigate = useNavigate();
    const { postData } = usePost();

    // Initialize state from localStorage once
    const [formData, setFormData] = useState<any>(() => {
        try {
            const saved = localStorage.getItem("DRUG_FORM_DATA");
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error("Failed to parse form data from localStorage", e);
            return {};
        }
    });

    const [currentStep, setCurrentStep] = useState(() => {
        const saved = localStorage.getItem("DRUG_FORM_STEP");
        const step = saved ? parseInt(saved, 10) : 0;
        return isNaN(step) ? 0 : step;
    });

    const formDataRef = useRef<any>(formData);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Keep ref in sync with state
    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    // Save to localStorage on change
    useEffect(() => {
        if (Object.keys(formData).length > 0 || currentStep > 0) {
            localStorage.setItem("DRUG_FORM_DATA", JSON.stringify(formData));
            localStorage.setItem("DRUG_FORM_STEP", currentStep.toString());
        }
    }, [formData, currentStep]);

    const steps = [
        { title: "Market Information", fields: addMarketInformation },
        { title: "Physical & Chemical Properties", fields: addPhysicalChemicalProperties },
        { title: "Process Development", fields: addProcessDevelopment },
        { title: "Analytical Development", fields: addAnalyticalDevelopment },
        { title: "Drug Product Information", fields: addDrugProductInformation },
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

    const handleNext = () => {
        if (validateCurrentStep()) {
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
                setErrors({}); // Clear errors when moving to next step
            }
        } else {
            // Scroll to top to show errors
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setErrors({}); // Clear errors when going back
        }
    };

    const handleDone = async () => {
        if (validateCurrentStep()) {
            try {
                const formattedData = formatCreatedDrug(formDataRef.current);
                await postData(drugService.createDrug(), formattedData);
                toast.success("Drug Entry successfully submitted");
                localStorage.removeItem("DRUG_FORM_DATA");
                localStorage.removeItem("DRUG_FORM_STEP");
                navigate("/home");
            } catch (error) {
                console.error(error);
                toast.error("Failed to submit drug entry. Please try again.");
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Create a form object with error support
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
            {/* Progress Indicator */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                                }`}>
                                {index + 1}
                            </div>
                            <span className={`ml-2 text-sm ${index <= currentStep ? 'text-blue-600' : 'text-gray-600'}`}>
                                {step.title}
                            </span>
                            {index < steps.length - 1 && <div className="w-12 h-0.5 bg-gray-300 mx-4"></div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Content */}
            <form className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <DynamicFormBuilder
                    fields={steps[currentStep].fields}
                    form={formWithErrors}
                    columns={3}
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