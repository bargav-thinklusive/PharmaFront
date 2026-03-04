import { CustomForm, type FieldConfig } from "../shared";

// Step 1: Executive Summary
export const addExecutiveSummary: FieldConfig[] = [
    {
        key: "executiveSummary",
        label: "Executive Summary",
        type: "textarea",
        required: false,
        placeholder: "Enter Executive Summary",
    },
];
// Step 2: Product Overview & Basic Details
export const addProductOverview: FieldConfig[] = [
    {
        key: "version",
        label: "Version",
        type: "text",
        required: false,
        placeholder: "Enter Version",
    },
    {
        key: "drugName",
        label: "Drug Name",
        type: "text",
        required: false,
        placeholder: "Enter Drug Name",
    },
    {
        key: "apiName",
        label: "API Name",
        type: "text",
        required: false,
        placeholder: "Enter API Name",
    },
    {
        key: "mechanismOfAction",
        label: "Mechanism of Action",
        // type: "dropdown",
        type: "text",
        required: false,
        placeholder: "Select Mechanism of Action",
    },
    {
        key: "companyName",
        label: "Company Name",
        type: "text",
        required: false,
        placeholder: "Enter Company Name",
    },
    {
        key: "approvedIndications",
        label: "Approved Indications",
        type: "text",
        required: false,
        placeholder: "Enter Approved Indications",
    },
    {
        key: "firstApprovedDate",
        label: "First Approved Date",
        type: "datepicker",
        required: false,
        placeholder: "Select First Approved Date",
    },
    {
        key: "firstApprovedRegion",
        label: "First Approved Region",
        type: "textarea",
        required: false,
        placeholder: "Enter First Approved Region",
    }, {
        key: "dosageForms",
        label: "Dosage Forms",
        type: "text",
        required: false,
        placeholder: "Enter Dosage Forms",
    }, {
        key: "lossOfExclusivity",
        label: "Loss Of Exclusivity",
        type: "datepicker",
        required: false,
        placeholder: "Enter Loss Of Exclusivity",
    },
    {
        key: "globalAnnualRevenue",
        label: "Global Annual Revenue",
        type: "text",
        required: false,
        placeholder: "Enter Global Annual Revenue",
    },
];

// Step 5: Physical & Chemical Properties
export const addPhysicalChemicalProperties: FieldConfig[] = [
    {
        key: "innName",
        label: "INN Name",
        type: "text",
        required: false,
        placeholder: "Enter INN Name",
    },
    {
        key: "synonyms",
        label: "Synonyms",
        type: "textarea",
        required: false,
        placeholder: "Enter Synonyms",
    },
    {
        key: "iupacName",
        label: "IUPAC Name",
        type: "text",
        required: false,
        placeholder: "Enter IUPAC Name",
    },
    {
        key: "molecularWeight",
        label: "Molecular Weight(g/mol)",
        // type: "dropdown",
        type: "text",
        required: false,
        placeholder: "Select Molecular Weight",
    },
    {
        key: "molecularFormula",
        label: "Molecular Formula",
        type: "text",
        required: false,
        placeholder: "Enter Molecular Formula",
    },
    {
        key: "bcsClass",
        label: "BCS Class",
        // type: "dropdown",
        type: "text",
        required: false,
        placeholder: "Select BCS Class",
    },
    {
        key: "monoisotopicMass",
        label: "Monoisotopic Mass(g/mol)",
        // type: "dropdown",
        type: "text",
        required: false,
        placeholder: "Select Monoisotopic Mass",
    },
    {
        key: "structure",
        label: "Structure",
        type: "file",
        required: false,
        placeholder: "Upload Structure Image",
    },
    {
        key: "stereochemistry",
        label: "Stereochemistry",
        type: "text",
        required: false,
        placeholder: "Enter Stereochemistry",
    },
    {
        key: "solubility",
        label: "Solubility",
        // type: "dropdown",
        type: "text",
        required: false,
        placeholder: "Select Solubility",
    },
    {
        key: "pka",
        label: "pKa",
        type: "text",
        required: false,
        placeholder: "Enter pKa",
    },
    {
        key: "logp",
        label: "logP",
        // type: "dropdown",
        type: "text",
        required: false,
        placeholder: "Select logP",
    }, {
        key: "logd",
        label: "logD",
        // type: "dropdown",
        type: "text",
        required: false,
        placeholder: "Select logD",
    }, {
        key: "individualSolvent",
        label: "Individual Solvent",
        type: "dynamic",
        required: false,
        singleFieldInRow: true,
        dynamicComponent: (key: string, field: any, form: any) => (
            <CustomForm key={key} field={field} form={form} />
        ),
        dynamicFields: [
            {
                key: "solvent",
                label: "Solvent",
                type: "text",
                required: false,
                placeholder: "Enter Solvent",
            },
            {
                key: "solubility",
                label: "Solubility(mg/mL)",
                type: "text",
                required: false,
                placeholder: "Enter Solubility",
            },
        ],
    },
];

// Step 3: Regulatory Insights
export const addRegulatoryInsights: FieldConfig[] = [
    {
        key: "regulatoryInsights",
        label: "Regulatory Insights",
        type: "text",
        required: false,
        placeholder: "Enter Regulatory Insights",
    },
    {
        key: "regionalApproval",
        label: "Regional Approval",
        type: "text",
        required: false,
        placeholder: "Enter Regional Approval",
    },
    {
        key: "approvalDetails",
        label: "Approval Details",
        type: "dynamic",
        required: false,
        singleFieldInRow: true,
        dynamicComponent: (key: string, field: any, form: any) => (
            <CustomForm key={key} field={field} form={form} />
        ),
        dynamicFields: [
            {
                key: "drugName",
                label: "Drug Name",
                type: "text",
                required: false,
                placeholder: "Enter Drug Name",
            },
            {
                key: "region",
                label: "Region",
                type: "text",
                required: false,
                placeholder: "Enter Region",
            },
            {
                key: "indication",
                label: "Indication",
                type: "text",
                required: false,
                placeholder: "Enter Indication",
            },
            {
                key: "patientSegments",
                label: "Patient Segments",
                type: "text",
                required: false,
                placeholder: "Enter Patient Segments",
            },
            {
                key: "dosageForm",
                label: "Dosage Form",
                type: "text",
                required: false,
                placeholder: "Enter Dosage Form",
            },
            {
                key: "dose",
                label: "Dose or Strength",
                type: "text",
                required: false,
                placeholder: "Enter Dose or Strength",
            },
            {
                key: "approvedDate",
                label: "Approved Date",
                type: "datepicker",
                required: false,
                placeholder: "Enter Approved Date",
            },
            {
                key: "regulatoryBodies",
                label: "Regulatory Bodies",
                type: "text",
                required: false,
                placeholder: "Enter Regulatory Bodies",
            },
        ],
    },
    {
        key: "specialDesignations",
        label: "Special Designations",
        type: "dynamic",
        required: false,
        singleFieldInRow: true,
        dynamicComponent: (key: string, field: any, form: any) => (
            <CustomForm key={key} field={field} form={form} />
        ),
        dynamicFields: [
            {
                key: "designationType",
                label: "Designation Type",
                type: "text",
                required: false,
                placeholder: "Enter Designation Type",
            },
            {
                key: "regulatorBody",
                label: "Regulator Body",
                type: "text",
                required: false,
                placeholder: "Enter Regulator Body",
            },
            {
                key: "indication",
                label: "Indication",
                type: "text",
                required: false,
                placeholder: "Enter Indication",
            },
            {
                key: "dateGranted",
                label: "Date Granted",
                type: "datepicker",
                required: false,
                placeholder: "Enter Date Granted",
            },
        ],
    },
    {
        key: "drugPatents",
        label: "Drug Patents/Exclusivity Info",
        type: "dynamic",
        required: false,
        singleFieldInRow: true,
        dynamicComponent: (key: string, field: any, form: any) => (
            <CustomForm key={key} field={field} form={form} />
        ),
        dynamicFields: [
            {
                key: "designationType",
                label: "Designation Type/Exclusivity code",
                type: "text",
                required: false,
                placeholder: "Enter Designation Type",
            },
            {
                key: "expiryDate",
                label: "Expiry Date/Regulator Body",
                type: "datepicker",
                required: false,
                placeholder: "Enter Expiry Date",
            },
        ],
    },
    {
        key: "additionalInfo",
        label: "Additional Information",
        type: "dynamic",
        required: false,
        singleFieldInRow: true,
        dynamicComponent: (key: string, field: any, form: any) => (
            <CustomForm key={key} field={field} form={form} />
        ),
        dynamicFields: [
            {
                key: "consideration",
                label: "Consideration",
                type: "text",
                required: false,
                placeholder: "Enter Consideration",
            },
            {
                key: "impactForGenericFilers",
                label: "Impact For Generic Filers",
                type: "text",
                required: false,
                placeholder: "Enter Impact For Generic Filers",
            },
        ],
    },
];

// Step 4: Generic Entrants
export const addGenericEntrants: FieldConfig[] = [
    {
        key: "genericEntrants",
        label: "Generic Entrants (ANDAs Approved by the US FDA)",
        type: "dynamic",
        required: false,
        singleFieldInRow: true,
        dynamicComponent: (key: string, field: any, form: any) => (
            <CustomForm key={key} field={field} form={form} />
        ),
        dynamicFields: [
            {
                key: "anda",
                label: "ANDA",
                type: "text",
                required: false,
                placeholder: "Enter ANDA",
            },
            {
                key: "companyName",
                label: "Company Name",
                type: "text",
                required: false,
                placeholder: "Enter Company Name",
            },
            {
                key: "dosageDetails",
                label: "Dosage Details",
                type: "text",
                required: false,
                placeholder: "Enter Dosage Details",
            },
            {
                key: "approvalType",
                label: "Approval Type",
                type: "text",
                required: false,
                placeholder: "Enter Approval Type",
            },
            {
                key: "andaSubmissionDate",
                label: "ANDA Submission Date",
                type: "datepicker",
                required: false,
                placeholder: "Enter ANDA Submission Date",
            },
            {
                key: "tentativeApprovalDate",
                label: "Tentative Approval Date",
                type: "datepicker",
                required: false,
                placeholder: "Enter Tentative Approval Date",
            },
            {
                key: "finalApprovalDate",
                label: "Final Approval Date",
                type: "datepicker",
                required: false,
                placeholder: "Enter Final Approval Date",
            },
            {
                key: "ftfExclusivity",
                label: "FTF Exclusivity",
                type: "text",
                required: false,
                placeholder: "Enter FTF Exclusivity",
            },
        ],
    },
    {
        key: "genericsApprovedByEma",
        label: "Generics Approved By EMA",
        type: "dynamic",
        required: false,
        singleFieldInRow: true,
        dynamicComponent: (key: string, field: any, form: any) => (
            <CustomForm key={key} field={field} form={form} />
        ),
        dynamicFields: [
            {
                key: "companyName",
                label: "Company Name",
                type: "text",
                required: false,
                placeholder: "Enter Company Name",
            },
            {
                key: "drugName",
                label: "Drug Name",
                type: "text",
                required: false,
                placeholder: "Enter Drug Name",
            },
            {
                key: "dosageDetails",
                label: "Dosage Details",
                type: "textarea",
                required: false,
                placeholder: "Enter Dosage Details",
            },
            {
                key: "chmpOpinion",
                label: "CHMP Opinion",
                type: "text",
                required: false,
                placeholder: "Enter CHMP Opinion",
            },
            {
                key: "ecDecision",
                label: "EC Decision",
                type: "text",
                required: false,
                placeholder: "Enter EC Decision",
            },
            {
                key: "ecApprovalDate",
                label: "EC Approval Date",
                type: "datepicker",
                required: false,
                placeholder: "Enter EC Approval Date",
            },
        ],
    },
];

// Step 6: Drug Substance
export const addDrugSubstance: FieldConfig[] = [
    {
        key: "availableDmfVendors",
        label: "Available DMF Vendors",
        type: "dynamic",
        required: false,
        singleFieldInRow: true,
        dynamicComponent: (key: string, field: any, form: any) => (
            <CustomForm key={key} field={field} form={form} />
        ),
        dynamicFields: [
            {
                key: "dmf",
                label: "DMF",
                type: "text",
                required: false,
                placeholder: "Enter DMF",
            },
            {
                key: "regulatoryBody",
                label: "Regulatory Body",
                // type: "dropdown",
                type: "text",
                required: false,
                placeholder: "Select Regulatory Body",
            },
            {
                key: "status",
                label: "Status",
                // type: "dropdown",
                type: "text",
                required: false,
                placeholder: "Select Status",
            },
            {
                key: "type",
                label: "Type",
                // type: "dropdown",
                type: "text",
                required: false,
                placeholder: "Select Type",
            },
            {
                key: "submissionDate",
                label: "Submission Date",
                type: "datepicker",
                required: false,
                placeholder: "Enter Submission Date",
            },
            {
                key: "holder",
                label: "Holder",
                type: "text",
                required: false,
                placeholder: "Enter Holder",
            },
            {
                key: "apiForm",
                label: "API Form",
                type: "text",
                required: false,
                placeholder: "Enter API Form",
            },
        ],
    },
    {
        key: "manufacturingRoutes",
        label: "Manufacturing Routes",
        type: "dynamic",
        required: false,
        singleFieldInRow: true,
        dynamicComponent: (key: string, field: any, form: any) => (
            <CustomForm key={key} field={field} form={form} />
        ),
        dynamicFields: [
            {
                key: "step",
                label: "Step",
                type: "textarea",
                required: false,
                placeholder: "Enter Step",
            },
        ],
    },

    {
        key: "dsImpurities",
        label: "DS Impurities",
        type: "dynamic",
        required: false,
        singleFieldInRow: true,
        dynamicComponent: (key: string, field: any, form: any) => (
            <CustomForm key={key} field={field} form={form} />
        ),
        dynamicFields: [
            {
                key: "nameOfImpurities",
                label: "Impurities",
                type: "text",
                required: false,
                placeholder: "Enter Impurities",
            },
            {
                key: "specifiedUnspecifiedImpurities",
                label: "Specified/Unspecified Impurities",
                // type: "dropdown",
                type: "text",
                required: false,
                placeholder: "Select Specified/Unspecified Impurities",
            },
            {
                key: "image",
                label: "Image",
                type: "file",
                required: false,
                placeholder: "Select Image",
            },
        ],
    },
    {
        key: "genotoxicImpurities",
        label: "Genotoxic Impurities",
        type: "dynamic",
        required: false,
        singleFieldInRow: true,
        dynamicComponent: (key: string, field: any, form: any) => (
            <CustomForm key={key} field={field} form={form} />
        ),
        dynamicFields: [
            {
                key: "genotoxicImpurities",
                label: "Genotoxic Impurities",
                type: "text",
                required: false,
                placeholder: "Enter Genotoxic Impurities",
            },
            {
                key: "classOfImpurity",
                label: "Class of Impurity",
                // type: "dropdown",
                type: "text",
                required: false,
                placeholder: "Select Class of Impurity",
            },
        ],
    },
    {
        key: "stability",
        label: "Stability",
        // type: "dropdown",
        type: "text",
        required: false,
        placeholder: "Select Stability",
    },
    {
        key: "nitrosaminesAssessment",
        label: "Nitrosamines Assessment",
        type: "textarea",
        required: false,
        placeholder: "Enter Nitrosamines Assessment",
    },
    {
        key: "otherInformation",
        label: "Other Information",
        type: "textarea",
        required: false,
        placeholder: "Enter Other Information",
    },
    {
        key: "regulatoryStartingMaterials",
        label: "Regulatory Starting Materials",
        type: "textarea",
        required: false,
        placeholder: "Enter Regulatory Starting Materials",
    },
    {
        key: "drugSubstanceSpecifications",
        label: "Drug Substance Specifications",
        type: "textarea",
        required: false,
        placeholder: "Enter Drug Substance Specifications",
    }, {
        key: "stableAndCommerciallyUsedPolymorphicForm",
        label: "Stable and Commercially Used Polymorphic Form",
        type: "text",
        required: false,
        placeholder: "Enter Stable and Commercially Used Polymorphic Form",
    },
];


// Step 5: Drug Product Information
export const addDrugProductInformation: FieldConfig[] = [
    {
        key: "dosageFormAndStrength",
        label: "Dosage Form and Strength",
        type: "dynamic",
        required: false,
        singleFieldInRow: true,
        dynamicComponent: (key: string, field: any, form: any) => (
            <CustomForm key={key} field={field} form={form} />
        ),
        dynamicFields: [
            {
                key: "strength",
                label: "Strength",
                type: "text",
                required: false,
                placeholder: "Enter Strength",
            },
            {
                key: "dosageForm",
                label: "Dosage Form",
                // type: "dropdown",
                type: "text",
                required: false,
                placeholder: "Select Dosage Form",
            },
            {
                key: "size",
                label: "Size",
                type: "text",
                required: false,
                placeholder: "Enter Size",
            },
            {
                key: "color",
                label: "Color",
                type: "text",
                required: false,
                placeholder: "Enter Color",
            },
            {
                key: "imprinting",
                label: "Imprinting",
                type: "text",
                required: false,
                placeholder: "Enter Imprinting",
            },
            {
                key: "weight",
                label: "Weight(mg)",
                type: "text",
                required: false,
                placeholder: "Enter Weight",
            },
            {
                key: "packaging",
                label: "Packaging",
                type: "text",
                required: false,
                placeholder: "Enter Packaging",
            },
            {
                key: "ndcCode",
                label: "NDC Code",
                type: "text",
                required: false,
                placeholder: "Enter NDC Code",
            },
            {
                key: "images",
                label: "Images",
                type: "file",
                required: false,
                placeholder: "Enter Images",
            },
        ],
    },
    {
        key: "supplyChain",
        label: "Supply Chain",
        type: "dynamic",
        required: false,
        singleFieldInRow: true,
        dynamicComponent: (key: string, field: any, form: any) => (
            <CustomForm key={key} field={field} form={form} />
        ),

        dynamicFields: [
            {
                key: "apiManufacturingAndAnalysis",
                label: "API Manufacturing and Analysis",
                type: "text",
                required: false,
                placeholder: "Enter Manufacturing and Analysis",
            },
            {
                key: "company",
                label: "Company",
                type: "text",
                required: false,
                placeholder: "Enter Company",
            },
            {
                key: "location",
                label: "Location",
                // type: "dropdown",
                type: "text",
                required: false,
                placeholder: "Select Location",
            }, {
                key: "reference",
                label: "Reference",
                type: "text",
                required: false,
                placeholder: "Enter Reference",
            },
            {
                key: "phaseOfProgram",
                label: "Phase of Program",
                // type: "dropdown",
                type: "text",
                required: false,
                placeholder: "Select Phase of Program",
            },
        ],
    },
    {
        key: "shelfLife",
        label: "Shelf Life",
        type: "dynamic",
        required: false,
        singleFieldInRow: true,
        dynamicComponent: (key: string, field: any, form: any) => (
            <CustomForm key={key} field={field} form={form} />
        ),
        dynamicFields: [
            {
                key: "currentExpirationDate",
                label: "Current Expiration Date",
                type: "datepicker",
                required: false,
                placeholder: "Select Current Expiration Date",
            },
            {
                key: "strength",
                label: "Strength",
                type: "text",
                required: false,
                placeholder: "Enter Strength",
            },
            {
                key: "expiryDate",
                label: "Expiry Date",
                type: "datepicker",
                required: false,
                placeholder: "Enter Expiry Date",
            },
        ],
    },
    {
        key: "manufacturingProcess",
        label: "Manufacturing Process",
        type: "dynamic",
        required: false,
        singleFieldInRow: true,
        dynamicComponent: (key: string, field: any, form: any) => (
            <CustomForm key={key} field={field} form={form} />
        ),
        dynamicFields: [
            {
                key: "dsImpurities",
                label: "DS Impurities",
                type: "text",
                required: false,
                placeholder: "Enter DS Impurities",
            },
            {
                key: "knownImpurities",
                label: "Known Impurities",
                // type: "dropdown",
                type: "text",
                required: false,
                placeholder: "Select Known Impurities",
            },
            {
                key: "specifiedImpurities",
                label: "Specified",
                // type: "dropdown",
                type: "text",
                required: false,
                placeholder: "Select Specified",
            },
            {
                key: "unknownImpurities",
                label: "Unknown Impurities/Unspecified Impurities",
                // type: "dropdown",
                type: "text",
                required: false,
                placeholder: "Select Unknown Impurities/Unspecified",
            },
        ],
    },
    {
        key: "dissolutionStudies",
        label: "Dissolution Studies",
        type: "dynamic",
        required: false,
        singleFieldInRow: true,
        dynamicComponent: (key: string, field: any, form: any) => (
            <CustomForm key={key} field={field} form={form} />
        ),
        dynamicFields: [
            {
                key: "studyType",
                label: "Study Type",
                type: "text",
                required: false,
                placeholder: "Enter Study Type",
            },
            {
                key: "uspApparatus",
                label: "USP Apparatus",
                // type: "dropdown",
                type: "text",
                required: false,
                placeholder: "Select USP Apparatus",
            },
            {
                key: "rotationSpeed",
                label: "Rotation Speed",
                // type: "dropdown",
                type: "text",
                required: false,
                placeholder: "Select Rotation Speed",
            },
            {
                key: "dissolutionMedium",
                label: "Dissolution Medium",
                // type: "dropdown",
                type: "text",
                required: false,
                placeholder: "Select Dissolution Medium",
            },
            {
                key: "temperature",
                label: "Temperature",
                // type: "dropdown",
                type: "text",
                required: false,
                placeholder: "Select Temperature",
            },
            {
                key: "acceptanceCriteria",
                label: "Acceptance Criteria",
                // type: "dropdown",
                type: "text",
                required: false,
                placeholder: "Select Acceptance Criteria",
            },
        ],
    },
    {
        key: "pharmacokinetics",
        label: "Pharmacokinetics",
        type: "dynamic",
        required: false,
        singleFieldInRow: true,
        dynamicComponent: (key: string, field: any, form: any) => (
            <CustomForm key={key} field={field} form={form} />
        ),
        dynamicFields: [
            {
                key: "absorption",
                label: "Absorption (Tmax)",
                type: "text",
                required: false,
                placeholder: "Enter Absorption (Tmax)",
            },
            {
                key: "volumeOfDistribution",
                label: "Volume of Distribution",
                // type: "dropdown",
                type: "text",
                required: false,
                placeholder: "Select Known Impurities",
            },
            {
                key: "metabolism",
                label: "Metabolism",
                // type: "dropdown",
                type: "text",
                required: false,
                placeholder: "Select Metabolism",
            },
            {
                key: "excretion",
                label: "Excretion",
                type: "text",
                required: false,
                placeholder: "Select Excretion",
            },
            {
                key: "halfLife",
                label: "Half Life",
                type: "text",
                required: false,
                placeholder: "Select Half Life",
            },
            {
                key: "steadyState",
                label: "Steady State",
                type: "text",
                required: false,
                placeholder: "Select Steady State",
            },
            {
                key: "foodInteractions",
                label: "Food Interactions",
                type: "textarea",
                required: false,
                placeholder: "Enter Food Interactions",
            },
            {
                key: "drugInteractions",
                label: "Drug Interactions",
                type: "textarea",
                required: false,
                placeholder: "Enter Drug Interactions",
            },
        ],
    },
    {
        key: "formulationChallenges",
        label: "Formulation Challenges",
        type: "textarea",
        required: false,
        placeholder: "Enter Formulation Challenges",
    },
    {
        key: "stabilityStudies",
        label: "Stability Studies",
        // type: "dropdown",
        type: "text",
        required: false,
        placeholder: "Select Stability Studies",
    },
    {
        key: "maximumDailyDose",
        label: "Maximum Daily Dose",
        type: "textarea",
        required: false,
        placeholder: "Enter Maximum Daily Dose",
    }, {
        key: "excipientsGrade",
        label: "Excipients Grade",
        type: "text",
        required: false,
        placeholder: "Enter Excipients Grade",
    },
    {
        key: "storageAndShippingConditions",
        label: "Storage and Shipping Conditions",
        type: "textarea",
        required: false,
        placeholder: "Enter Storage and Shipping Conditions",
    },
    {
        key: "unmetClinicalNeed",
        label: "Unmet Clinical Need",
        type: "textarea",
        required: false,
        placeholder: "Enter Unmet Clinical Need",
    },
];

// Labeling Information (separate section)
export const addLabelingInformation: FieldConfig[] = [
    {
        key: "labelingInformation",
        label: "Labeling Information",
        type: "dynamic",
        required: false,
        singleFieldInRow: true,
        dynamicComponent: (key: string, field: any, form: any) => (
            <CustomForm key={key} field={field} form={form} />
        ),
        dynamicFields: [
            {
                key: "image",
                label: "Image",
                type: "file",
                required: false,
                placeholder: "Upload Label Image",
            },
        ],
    },
];

// BA/BE Studies (separate section)
export const addBaBeStudies: FieldConfig[] = [
    {
        key: "baBeStudies",
        label: "BA/BE Studies",
        type: "dynamic",
        required: false,
        singleFieldInRow: true,
        dynamicComponent: (key: string, field: any, form: any) => (
            <CustomForm key={key} field={field} form={form} />
        ),
        dynamicFields: [
            {
                key: "studyType",
                label: "Study Type",
                type: "text",
                required: false,
                placeholder: "Enter Study Type",
            },
            {
                key: "dosageForm",
                label: "Dosage Form",
                type: "text",
                required: false,
                placeholder: "Enter Dosage Form",
            },
            {
                key: "dosageStrength",
                label: "Dosage Strength",
                type: "text",
                required: false,
                placeholder: "Enter Dosage Strength",
            },
            {
                key: "studyDesign",
                label: "Study Design",
                type: "text",
                required: false,
                placeholder: "Enter Study Design",
            },
            {
                key: "studyCondition",
                label: "Study Condition",
                type: "text",
                required: false,
                placeholder: "Enter Study Condition",
            },
            {
                key: "additionalDetails",
                label: "Additional Details",
                type: "textarea",
                required: false,
                placeholder: "Enter Additional Details",
            },
            {
                key: "endPoint",
                label: "End Point",
                type: "text",
                required: false,
                placeholder: "Enter End Point",
            },
        ],
    },
    {
        key: "biowaiverRequest",
        label: "Biowaiver Request",
        type: "text",
        required: false,
        placeholder: "Enter Biowaiver Request",
    },
    {
        key: "dissolutionTestMethodAndSamplingTimes",
        label: "Dissolution Test Method and Sampling Times",
        type: "textarea",
        required: false,
        placeholder: "Enter Dissolution Test Method and Sampling Times",
    },
];

// Sources (separate section)
export const addSources: FieldConfig[] = [
    {
        key: "sources",
        label: "Sources",
        type: "textarea",
        required: false,
        placeholder: "Enter Sources",
    },
];

// Glossary (separate section)
export const addGlossary: FieldConfig[] = [
    {
        key: "glossary",
        label: "Glossary",
        type: "textarea",
        required: false,
        placeholder: "Enter Glossary",
    },
];

// Step 6: Appendices & References
export const addAppendices: FieldConfig[] = [
    {
        key: "appendices",
        label: "Appendices",
        type: "dynamic",
        required: false,
        singleFieldInRow: true,
        dynamicComponent: (key: string, field: any, form: any) => (
            <CustomForm key={key} field={field} form={form} />
        ),
        dynamicFields: [
            {
                key: "appendix",
                label: "Appendix",
                type: "textarea",
                required: false,
                placeholder: "Enter Appendix",

            },
        ],
    },
];

