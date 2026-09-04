import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import DynamicFormBuilder from "../shared";
import { addExecutiveSummary, addProductOverview, addPhysicalChemicalProperties, addDrugSubstance, addDrugProductInformation, addAppendices, addRegulatoryInsights, addLabelingInformation, addGenericEntrants, addBaBeStudies, addSources, addGlossary } from "./columns";
import { formatCreatedDrug, flattenDrug } from "./helper";
import usePost from "../../hooks/usePost";
import usePut from "../../hooks/usePut";
import DrugService from "../../services/DrugService";
import { toast } from "react-toastify";
import useDraft from "../../hooks/useDraft";
import axiosInstance from "../../services/shared/AxiosService";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchDrugs, setSelectedList } from "../../store/slices/drugsSlice";
import { fetchDrafts } from "../../store/slices/draftsSlice";
import { fetchMasterData } from "../../store/slices/masterDataSlice";
import { CompoundFormHeader } from "./CompoundFormHeader";
import { CompoundFormSidebar } from "./CompoundFormSidebar";
import { CompoundFormActions } from "./CompoundFormActions";
import { ConfirmModal } from "../shared/ConfirmModal";
import { FiSave, FiSend } from "react-icons/fi";
import { therapeuticAreasData } from "../../data/therapeuticAreasData";
import { findExistingDraft } from "../../utils/utils";

const drugService = new DrugService();

const stepDescriptions: { [key: string]: string } = {
    "Executive Summary": "Provide a high-level summary of the drug, its therapeutic use, market potential, and key insights.",
    "Product Overview": "Provide basic drug details, regulatory indications, global revenue, and commercial information.",
    "Regulatory Insights": "Provide regulatory approval status, designations, patents, and other compliance related information.",
    "Generic Entrants": "Provide generic alternatives, ANDA numbers, approval types, and commercial details.",
    "Physical & Chemical Properties": "Provide molecular formula, structure, solubility, and other properties.",
    "Drug Substance": "Provide active pharmaceutical ingredient details, manufacturers, and synthesis pathways.",
    "Drug Product Information": "Provide dosage strengths, formulations, packaging, and shelf-life details.",
    "Labeling Information": "Provide package inserts, warnings, precautions, and FDA approved labels.",
    "BA/BE Studies": "Provide bioequivalence data, clinical trial outcomes, and comparative studies.",
    "Sources": "List all references, databases, and scientific papers used for this drug entry.",
    "Glossary": "Define key terms, abbreviations, and clinical jargon used in this entry.",
    "Appendices": "Attach additional files, charts, raw data, or supplementary materials.",
};

const CompoundForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useAppDispatch();
    const drafts = useAppSelector((state) => state.drafts.drafts);
    const masterData = useAppSelector((state) => state.masterData);
    const currentUser = useAppSelector((state) => state.user.user?.data || state.user.user);
    const currentUserName = currentUser?.name || currentUser?.email || "testadmin";

    const { postData } = usePost();
    const { putData } = usePut();
    const { saveDraft, loadDraft, clearDraft } = useDraft();

    const refetchDrugs = () => dispatch(fetchDrugs());
    const refetchDrafts = () => dispatch(fetchDrafts());
    const refetchMasterData = () => dispatch(fetchMasterData());

    const draftId = searchParams.get("draftId");

    const [formData, setFormData] = useState<any>({});
    const [currentStep, setCurrentStep] = useState(0);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSaveDraftConfirm, setShowSaveDraftConfirm] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [loadedDraftId, setLoadedDraftId] = useState<string | null>(null);

    const formDataRef = useRef<any>(formData);

    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    const drugId = searchParams.get("drugId") || searchParams.get("id");
    const lastFetchedDrugIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (location.state?.initialData && Object.keys(location.state.initialData).length > 0) {
            const flattened = flattenDrug(location.state.initialData);
            formDataRef.current = flattened;
            setFormData(flattened);
            return;
        }

        if (drugId && lastFetchedDrugIdRef.current !== drugId) {
            lastFetchedDrugIdRef.current = drugId;
            axiosInstance.get(drugService.getDrugById(drugId)).then((res: any) => {
                const data = res?.data?.data || res?.data || res;
                if (data) {
                    const flattened = flattenDrug(data);
                    formDataRef.current = flattened;
                    setFormData(flattened);
                }
            }).catch((err: any) => {
                console.error("Error fetching drug details for edit:", err);
            });
            return;
        }

        if (!draftId) {
            setLoadedDraftId(null);
            return;
        }
        if (draftId === loadedDraftId) return;

        const draft = loadDraft(draftId);
        if (draft && draft.formData && Object.keys(draft.formData).length > 0) {
            const flattened = flattenDrug(draft.formData);
            formDataRef.current = flattened;
            setFormData(flattened);
            if (draft.currentStep !== undefined) {
                setCurrentStep(draft.currentStep);
            }
            setLoadedDraftId(draftId);
        }
    }, [draftId, drugId, drafts, loadDraft, loadedDraftId, location.state]);

    const steps = [
        { title: "Product Overview", fields: addProductOverview },
        { title: "Executive Summary", fields: addExecutiveSummary },
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
                if (!value || (typeof value === "string" && value.trim() === "")) {
                    newErrors[field.key] = "Required";
                    isValid = false;
                }
            }
        });
        setErrors(newErrors);
        return isValid;
    };

    const validateRequiredFieldsForDraft = () => {
        const newErrors: { [key: string]: string } = {};
        let isValid = true;

        // Mandatory identification fields required for a valid draft
        const requiredDraftFields = [
            { key: "drugName", label: "Drug Name" },
            { key: "apiName", label: "API Name" },
        ];

        requiredDraftFields.forEach(({ key }) => {
            const val = formDataRef.current[key];
            if (!val || (typeof val === "string" && val.trim() === "")) {
                newErrors[key] = "Required";
                isValid = false;
            }
        });

        // Also check required fields of the current step
        const currentStepRequired = steps[currentStep].fields.filter((f) => f.required);
        currentStepRequired.forEach((field) => {
            const val = formDataRef.current[field.key];
            if (!val || (typeof val === "string" && val.trim() === "")) {
                newErrors[field.key] = "Required";
                isValid = false;
            }
        });

        if (!isValid) {
            setErrors(newErrors);
            if ((newErrors["drugName"] || newErrors["apiName"]) && currentStep !== 0) {
                setCurrentStep(0);
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        return isValid;
    };

    const executeSaveDraft = async (): Promise<boolean> => {
        if (!validateRequiredFieldsForDraft()) {
            toast.error("Please fill in the required fields (Drug Name & API Name) before saving a draft.", { autoClose: 5000 });
            return false;
        }

        setIsSavingDraft(true);
        try {
            const newDraftId = await saveDraft(formDataRef.current, currentStep, draftId);
            if (!draftId) setSearchParams({ draftId: newDraftId }, { replace: true });
            toast.success("Draft saved successfully!", { autoClose: 3000 });
            return true;
        } catch (err) {
            console.error("Save draft error:", err);
            toast.error("Failed to save draft. Please try again.");
            return false;
        } finally {
            setIsSavingDraft(false);
        }
    };

    const handleSaveDraftClick = () => {
        if (!validateRequiredFieldsForDraft()) {
            toast.error("Please fill in the required fields (Drug Name & API Name) before saving a draft.", { autoClose: 5000 });
            return;
        }
        setShowSaveDraftConfirm(true);
    };

    useEffect(() => {
        (window as any).executeSaveDraftGlobal = async () => {
            return await executeSaveDraft();
        };
        return () => {
            delete (window as any).executeSaveDraftGlobal;
        };
    }, [currentStep, draftId, formData]);



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
            
            const originalId = formDataRef.current._id || formDataRef.current.original_id || formDataRef.current.id;
            const originalVersion = formDataRef.current.originalVersion;
            const currentVersion = formattedData.ProductOverview?.version || formDataRef.current.version;

            // Scenario 1: If version is NOT updated/changed, overwrite existing drug (PUT).
            // Scenario 2: If version IS updated/changed, save as a new drug record (POST).
            let isUpdate = false;
            if (originalId) {
                if (!originalVersion || String(currentVersion).trim() === String(originalVersion).trim()) {
                    isUpdate = true;
                }
            }

            if (isUpdate && originalId) {
                await putData(drugService.updateDrug(originalId), formattedData);
            } else {
                await postData(drugService.createDrug(), formattedData);
            }

            const matchingDraft = (draftId && drafts.find((d: any) => d.id === draftId)) ||
                                  findExistingDraft(drafts, formDataRef.current);
            if (matchingDraft?.id) {
                await clearDraft(matchingDraft.id);
            } else if (draftId) {
                await clearDraft(draftId);
            }
            dispatch(setSelectedList('cmcintel'));
            if (refetchDrugs) await refetchDrugs();
            if (refetchDrafts) await refetchDrafts();
            toast.success(isUpdate ? "Drug entry successfully updated" : "Drug entry successfully submitted");
            navigate("/drugsList/cmcintel");
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

    useEffect(() => {
        if (!masterData?.therapeuticAreas || Object.keys(masterData.therapeuticAreas).length === 0) {
            refetchMasterData?.();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const activeTherapeuticAreas = (masterData?.therapeuticAreas && Object.keys(masterData.therapeuticAreas).length > 0)
        ? masterData.therapeuticAreas
        : therapeuticAreasData;

    const selectedTherapeuticArea = formData.therapeuticArea || formData.ProductOverview?.therapeuticArea;

    const availableIndications = selectedTherapeuticArea && activeTherapeuticAreas[selectedTherapeuticArea]
        ? activeTherapeuticAreas[selectedTherapeuticArea]
        : [];

    const activeRegionsCountries = masterData?.regionsCountries || {};
    const activeAuthorities: any[] = masterData?.regulatoryAuthorities || [];

    const allCountries = Array.from(
        new Set([
            ...activeAuthorities.map((r: any) => r.country || r.region),
            ...Object.keys(activeRegionsCountries),
            ...Object.values(activeRegionsCountries).flat(),
        ].filter((c): c is string => typeof c === 'string' && Boolean(c.trim())))
    ).sort();

    const selectedCountry = formData.country || formData.firstApprovedRegion;
    const filteredAuthorities = (selectedCountry && selectedCountry.trim())
        ? activeAuthorities.filter((r: any) => r.country?.toLowerCase() === selectedCountry.trim().toLowerCase())
        : activeAuthorities;

    const dynamicOptions: Record<string, { label: string; value: string }[]> = {
        therapeuticArea: Object.keys(activeTherapeuticAreas).map((ta) => ({ label: ta, value: ta })),
        approvedIndications: availableIndications.map((ind: string) => ({ label: ind, value: ind })),
        firstApprovedRegion: allCountries.map((c: string) => ({ label: c, value: c })),
        region: Object.keys(activeRegionsCountries).map((r) => ({ label: r, value: r })),
        country: allCountries.map((c: string) => ({ label: c, value: c })),
        regulatoryBody: filteredAuthorities.map((r: any) => ({
            label: `${r.abbreviation ? `${r.abbreviation} - ` : ''}${r.authority}`,
            value: r.abbreviation ? `${r.authority} (${r.abbreviation})` : r.authority
        })),
    };

    const getStepStatus = (stepIndex: number) => {
        const stepFields = steps[stepIndex].fields.filter(f => f.type !== "header");
        if (stepFields.length === 0) return "Not Started";

        let filledCount = 0;
        let totalCount = 0;
        let requiredCount = 0;
        let filledRequiredCount = 0;

        stepFields.forEach(f => {
            const val = formData[f.key];
            totalCount++;
            let isFilled = false;
            if (f.type === "dynamic" || Array.isArray(val)) {
                if (Array.isArray(val) && val.length > 0) isFilled = true;
            } else {
                if (val !== undefined && val !== null && String(val).trim() !== "") isFilled = true;
            }

            if (isFilled) filledCount++;
            if (f.required) {
                requiredCount++;
                if (isFilled) filledRequiredCount++;
            }
        });

        if (filledCount === 0) return "Not Started";
        if (requiredCount > 0) {
            if (filledRequiredCount === requiredCount) return "Completed";
            return "In Progress";
        }
        return "Completed";
    };

    const getSubsectionStats = (stepIndex: number) => {
        const fields = steps[stepIndex].fields;
        const hasHeaders = fields.some(f => f.type === "header");

        let complete = 0;
        let inProgress = 0;
        let notStarted = 0;

        if (hasHeaders) {
            // Group fields by header
            const groups: { header: any; fields: any[] }[] = [];
            let currentGroup: { header: any; fields: any[] } = { header: null, fields: [] };
            fields.forEach(field => {
                if (field.type === "header") {
                    if (currentGroup.fields.length > 0 || currentGroup.header) {
                        groups.push(currentGroup);
                    }
                    currentGroup = { header: field, fields: [] };
                } else {
                    currentGroup.fields.push(field);
                }
            });
            if (currentGroup.fields.length > 0 || currentGroup.header) {
                groups.push(currentGroup);
            }

            groups.forEach(g => {
                if (!g.header) return;
                let filled = 0;
                let total = 0;
                g.fields.forEach(f => {
                    const val = formData[f.key];
                    total++;
                    if (Array.isArray(val)) {
                        if (val.length > 0) filled++;
                    } else if (val !== undefined && val !== null && String(val).trim() !== "") {
                        filled++;
                    }
                });

                if (filled === 0) notStarted++;
                else if (filled === total) complete++;
                else inProgress++;
            });
        } else {
            // Check dynamic fields as subsections
            const dynamicFields = fields.filter(f => f.type === "dynamic");
            if (dynamicFields.length > 0) {
                dynamicFields.forEach(f => {
                    const tableRows = formData[f.key] || [];
                    const hasRows = tableRows.length > 0;
                    if (hasRows) complete++;
                    else notStarted++;
                });
            }
        }

        return { complete, inProgress, notStarted, hasSubsections: hasHeaders || fields.some(f => f.type === "dynamic") };
    };

    const completedStepsCount = steps.filter((_, idx) => getStepStatus(idx) === "Completed").length;
    const overallProgressPct = steps.length > 0 ? Math.round((completedStepsCount / steps.length) * 100) : 0;
    const isLastStep = currentStep === steps.length - 1;

    // Field completion stats helper
    const currentFields = steps[currentStep].fields.filter(f => f.type !== "header" && f.type !== "dynamic");
    const totalFieldsCount = currentFields.length;
    const completedFieldsCount = currentFields.filter(f => {
        const val = formData[f.key];
        if (Array.isArray(val)) return val.length > 0;
        return val !== undefined && val !== null && String(val).trim() !== "";
    }).length;

    const drugCreator = formData.createdByName || 
                        formData.createdByEmail || 
                        (formData.createdBy && String(formData.createdBy).trim()) || 
                        formData.ProductOverview?.createdByName || 
                        formData.ProductOverview?.createdByEmail || 
                        (formData.ProductOverview?.createdBy && String(formData.ProductOverview?.createdBy).trim()) || 
                        currentUserName;

    const displayCid = formData.cid || 
                       formData.ProductOverview?.cid || 
                       (searchParams.get("cid")) || 
                       (drugId && !/^[0-9a-fA-F]{24}$/.test(drugId) ? drugId : null) || 
                       formData.drugId || 
                       formData._id || 
                       "D001";

    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[#f8fafc] font-sans p-6 sm:p-8">
            <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
                {/* ── Full-Width Top Header Card ── */}
                <CompoundFormHeader
                    drugName={formData.drugName || formData.ProductOverview?.drugName}
                    drugId={formData.drugId || formData._id}
                    cid={displayCid}
                    version={formData.version || formData.ProductOverview?.version}
                    createdBy={drugCreator}
                    lastUpdated={
                        loadedDraftId
                            ? (loadDraft(loadedDraftId)?.lastModified)
                            : (
                                formData.updatedAt ||
                                formData.ProductOverview?.updatedAt ||
                                formData.createdAt ||
                                formData.ProductOverview?.createdAt ||
                                formData.lastModified ||
                                (() => {
                                    const id = formData._id || formData.id || formData.drugId;
                                    if (id && typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)) {
                                        return parseInt(id.substring(0, 8), 16) * 1000;
                                    }
                                    return undefined;
                                })()
                            )
                    }
                    overallProgressPct={overallProgressPct}
                    completedStepsCount={completedStepsCount}
                    totalStepsCount={steps.length}
                />

                {/* ── Main Two-Column Layout ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Sidebar Stepper */}
                    <CompoundFormSidebar
                        steps={steps}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        isSidebarExpanded={isSidebarExpanded}
                        setIsSidebarExpanded={setIsSidebarExpanded}
                        getStepStatus={getStepStatus}
                        getSubsectionStats={getSubsectionStats}
                        validateCurrentStep={validateCurrentStep}
                        setErrors={setErrors}
                    />

                    {/* Right Column: Form content */}
                    <div className={isSidebarExpanded ? "lg:col-span-9 flex flex-col gap-6" : "lg:col-span-11 flex flex-col gap-6"}>
                        {/* Section Level Header */}
                        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-xl font-bold text-main font-display">
                                    {steps[currentStep].title}
                                </h1>
                                <p className="text-xs text-body mt-1">
                                    {stepDescriptions[steps[currentStep].title] || "Please fill in the details for this section."}
                                </p>
                            </div>
                        </div>

                        {steps[currentStep].fields.some((f) => f.type === "header" || f.type === "dynamic") ? (
                            <DynamicFormBuilder
                                fields={steps[currentStep].fields}
                                form={formWithErrors}
                                dynamicOptions={dynamicOptions}
                                columns={1}
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
                                        dynamicOptions={dynamicOptions}
                                        columns={1}
                                    />
                                </div>
                            </div>
                        )}
                        {/* Bottom Actions Bar */}
                        <CompoundFormActions
                            currentStep={currentStep}
                            isLastStep={isLastStep}
                            isSavingDraft={isSavingDraft}
                            isEdit={Boolean(drugId || formDataRef.current._id || formDataRef.current.id || formDataRef.current.original_id)}
                            handleBack={handleBack}
                            handleSaveDraftClick={handleSaveDraftClick}
                            handleNext={handleNext}
                            handleDone={handleDone}
                        />
                    </div>
                </div>
            </div>

            {/* ── Confirmation Modal ── */}
            <ConfirmModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={() => {
                    setShowConfirm(false);
                    submitForm();
                }}
                title="Submit Drug Data"
                description="Are you sure you want to submit this drug entry? Please review all steps before proceeding."
                confirmText="Yes, Submit"
                icon={<FiSend className="w-6 h-6 text-primary" />}
                iconBgColor="bg-primary-light border-primary/30"
                confirmButtonColor="bg-primary hover:bg-primary-hover"
            />

            {/* ── Save Draft Confirmation Modal ── */}
            <ConfirmModal
                isOpen={showSaveDraftConfirm}
                onClose={() => setShowSaveDraftConfirm(false)}
                onConfirm={() => {
                    setShowSaveDraftConfirm(false);
                    executeSaveDraft();
                }}
                title="Save Draft"
                description="Are you sure you want to save this draft? You can reload your draft anytime from the header menu."
                confirmText="Yes, Save"
                icon={<FiSave className="w-6 h-6 text-amber-500" />}
                iconBgColor="bg-amber-50 border-amber-200"
                confirmButtonColor="bg-amber-500 hover:bg-amber-600"
            />
        </div>
    );
};

export default CompoundForm;