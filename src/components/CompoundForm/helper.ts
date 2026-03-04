import { convertDatesToUnix, fileToBase64 } from "../../utils/utils";

/**
 * Flattens a stored drug record (nested sections) into
 * the flat key map the form expects.
 */
export const flattenDrug = (drug: any): any => {
    if (!drug) return {};
    return {
        // Executive Summary (plain string)
        executiveSummary: drug.ExecutiveSummary ?? "",

        // Product Overview
        version: drug.ProductOverview?.version ?? "",
        drugName: drug.ProductOverview?.drugName ?? "",
        apiName: drug.ProductOverview?.apiName ?? "",
        mechanismOfAction: drug.ProductOverview?.mechanismOfAction ?? "",
        companyName: drug.ProductOverview?.companyName ?? "",
        approvedIndications: drug.ProductOverview?.approvedIndications ?? "",
        firstApprovedDate: drug.ProductOverview?.firstApprovedDate ?? "",
        firstApprovedRegion: drug.ProductOverview?.firstApprovedRegion ?? "",
        dosageForms: drug.ProductOverview?.dosageForms ?? "",
        lossOfExclusivity: drug.ProductOverview?.lossOfExclusivity ?? "",
        globalAnnualRevenue: drug.ProductOverview?.globalAnnualRevenue ?? "",

        // Regulatory Insights
        regulatoryInsights: drug.RegulatoryInsights?.regulatoryInsights ?? "",
        regionalApproval: drug.RegulatoryInsights?.regionalApproval ?? "",
        approvalDetails: drug.RegulatoryInsights?.approvalDetails ?? [],
        specialDesignations: drug.RegulatoryInsights?.specialDesignations ?? [],
        drugPatents: drug.RegulatoryInsights?.drugPatents ?? [],
        additionalInfo: drug.RegulatoryInsights?.additionalInfo ?? [],

        // Generic Entrants
        genericEntrants: drug.GenericEntrants?.genericEntrants ?? [],
        genericsApprovedByEma: drug.GenericEntrants?.genericsApprovedByEma ?? [],

        // Physical & Chemical Properties
        innName: drug.PhysicalChemicalProperties?.innName ?? "",
        synonyms: drug.PhysicalChemicalProperties?.synonyms ?? "",
        iupacName: drug.PhysicalChemicalProperties?.iupacName ?? "",
        molecularWeight: drug.PhysicalChemicalProperties?.molecularWeight ?? "",
        molecularFormula: drug.PhysicalChemicalProperties?.molecularFormula ?? "",
        bcsClass: drug.PhysicalChemicalProperties?.bcsClass ?? "",
        monoisotopicMass: drug.PhysicalChemicalProperties?.monoisotopicMass ?? "",
        structure: drug.PhysicalChemicalProperties?.structure ?? "",
        stereochemistry: drug.PhysicalChemicalProperties?.stereochemistry ?? "",
        solubility: drug.PhysicalChemicalProperties?.solubility ?? "",
        pka: drug.PhysicalChemicalProperties?.pka ?? "",
        logp: drug.PhysicalChemicalProperties?.logp ?? "",
        logd: drug.PhysicalChemicalProperties?.logd ?? "",
        individualSolvent: drug.PhysicalChemicalProperties?.individualSolvent ?? [],

        // Drug Substance
        availableDmfVendors: drug.DrugSubstance?.availableDmfVendors ?? [],
        manufacturingRoutes: drug.DrugSubstance?.manufacturingRoutes ?? [],
        dsImpurities: drug.DrugSubstance?.dsImpurities ?? [],
        genotoxicImpurities: drug.DrugSubstance?.genotoxicImpurities ?? [],
        stability: drug.DrugSubstance?.stability ?? "",
        nitrosaminesAssessment: drug.DrugSubstance?.nitrosaminesAssessment ?? "",
        otherInformation: drug.DrugSubstance?.otherInformation ?? "",
        regulatoryStartingMaterials: drug.DrugSubstance?.regulatoryStartingMaterials ?? "",
        drugSubstanceSpecifications: drug.DrugSubstance?.drugSubstanceSpecifications ?? "",
        stableAndCommerciallyUsedPolymorphicForm: drug.DrugSubstance?.stableAndCommerciallyUsedPolymorphicForm ?? "",

        // Drug Product Information
        dosageFormAndStrength: drug.DrugProductInformation?.dosageFormAndStrength ?? [],
        supplyChain: drug.DrugProductInformation?.supplyChain ?? [],
        shelfLife: drug.DrugProductInformation?.shelfLife ?? [],
        manufacturingProcess: drug.DrugProductInformation?.manufacturingProcess ?? [],
        dissolutionStudies: drug.DrugProductInformation?.dissolutionStudies ?? [],
        pharmacokinetics: drug.DrugProductInformation?.pharmacokinetics ?? [],
        formulationChallenges: drug.DrugProductInformation?.formulationChallenges ?? "",
        stabilityStudies: drug.DrugProductInformation?.stabilityStudies ?? "",
        maximumDailyDose: drug.DrugProductInformation?.maximumDailyDose ?? "",
        excipientsGrade: drug.DrugProductInformation?.excipientsGrade ?? "",
        storageAndShippingConditions: drug.DrugProductInformation?.storageAndShippingConditions ?? "",
        unmetClinicalNeed: drug.DrugProductInformation?.unmetClinicalNeed ?? "",

        // Labeling
        labelingInformation: drug.LabelingInformation?.labelingInformation ?? [],

        // BA/BE Studies
        baBeStudies: drug.BaBeStudies?.baBeStudies ?? [],
        biowaiverRequest: drug.BaBeStudies?.biowaiverRequest ?? "",
        dissolutionTestMethodAndSamplingTimes: drug.BaBeStudies?.dissolutionTestMethodAndSamplingTimes ?? "",

        // Sources / Glossary / Appendices
        sources: drug.Sources?.sources ?? (typeof drug.Sources === 'string' ? drug.Sources : ""),
        glossary: drug.Glossary?.glossary ?? (typeof drug.Glossary === 'string' ? drug.Glossary : ""),
        appendices: drug.Appendices?.appendices ?? [],
    };
};

/**
 * Recursively scans the object for File objects and converts them to Base64 ImageObjects.
 */
async function processImagesToBase64(data: any): Promise<any> {
    if (!data || typeof data !== 'object') return data;

    if (Array.isArray(data)) {
        return Promise.all(data.map(item => processImagesToBase64(item)));
    }

    const result: any = {};
    for (const key in data) {
        const val = data[key];

        if (val instanceof File) {
            // Convert single File to ImageObject
            const base64 = await fileToBase64(val);
            result[key] = {
                fileName: val.name,
                contentType: val.type,
                imageData: base64
            };
        } else if (Array.isArray(val) && val.length > 0 && val[0] instanceof File) {
            // Convert Array of Files
            result[key] = await Promise.all(val.map(async (file: File) => ({
                fileName: file.name,
                contentType: file.type,
                imageData: await fileToBase64(file)
            })));
        } else if (typeof val === 'object') {
            result[key] = await processImagesToBase64(val);
        } else {
            result[key] = val;
        }
    }
    return result;
}

export const formatCreatedDrug = async (formData: any) => {
    const rawResult = {
        ExecutiveSummary: formData.executiveSummary,
        ProductOverview: {
            version: formData.version,
            drugName: formData.drugName,
            apiName: formData.apiName,
            mechanismOfAction: formData.mechanismOfAction,
            companyName: formData.companyName,
            approvedIndications: formData.approvedIndications,
            firstApprovedDate: formData.firstApprovedDate,
            firstApprovedRegion: formData.firstApprovedRegion,
            dosageForms: formData.dosageForms,
            lossOfExclusivity: formData.lossOfExclusivity,
            globalAnnualRevenue: formData.globalAnnualRevenue,
        },
        RegulatoryInsights: {
            regulatoryInsights: formData.regulatoryInsights,
            regionalApproval: formData.regionalApproval,
            approvalDetails: formData.approvalDetails,
            specialDesignations: formData.specialDesignations,
            drugPatents: formData.drugPatents,
            additionalInfo: formData.additionalInfo,
        },
        GenericEntrants: {
            genericEntrants: formData.genericEntrants,
            genericsApprovedByEma: formData.genericsApprovedByEma,
        },
        PhysicalChemicalProperties: {
            innName: formData.innName,
            synonyms: formData.synonyms,
            iupacName: formData.iupacName,
            molecularWeight: formData.molecularWeight,
            molecularFormula: formData.molecularFormula,
            bcsClass: formData.bcsClass,
            monoisotopicMass: formData.monoisotopicMass,
            structure: formData.structure,
            stereochemistry: formData.stereochemistry,
            solubility: formData.solubility,
            pka: formData.pka,
            logp: formData.logp,
            logd: formData.logd,
            individualSolvent: formData.individualSolvent,
        },
        DrugSubstance: {
            availableDmfVendors: formData.availableDmfVendors,
            manufacturingRoutes: formData.manufacturingRoutes,
            dsImpurities: formData.dsImpurities,
            genotoxicImpurities: formData.genotoxicImpurities,
            stability: formData.stability,
            nitrosaminesAssessment: formData.nitrosaminesAssessment,
            otherInformation: formData.otherInformation,
            regulatoryStartingMaterials: formData.regulatoryStartingMaterials,
            drugSubstanceSpecifications: formData.drugSubstanceSpecifications,
            stableAndCommerciallyUsedPolymorphicForm: formData.stableAndCommerciallyUsedPolymorphicForm,
        },
        DrugProductInformation: {
            dosageFormAndStrength: formData.dosageFormAndStrength,
            supplyChain: formData.supplyChain,
            shelfLife: formData.shelfLife,
            manufacturingProcess: formData.manufacturingProcess,
            dissolutionStudies: formData.dissolutionStudies,
            pharmacokinetics: formData.pharmacokinetics,
            formulationChallenges: formData.formulationChallenges,
            stabilityStudies: formData.stabilityStudies,
            maximumDailyDose: formData.maximumDailyDose,
            excipientsGrade: formData.excipientsGrade,
            storageAndShippingConditions: formData.storageAndShippingConditions,
            unmetClinicalNeed: formData.unmetClinicalNeed,
        },
        LabelingInformation: {
            labelingInformation: formData.labelingInformation,
        },
        BaBeStudies: {
            baBeStudies: formData.baBeStudies,
            biowaiverRequest: formData.biowaiverRequest,
            dissolutionTestMethodAndSamplingTimes: formData.dissolutionTestMethodAndSamplingTimes,
        },
        Sources: formData.sources,
        Glossary: formData.glossary,
        Appendices: {
            appendices: formData.appendices,
        }
    };

    // First convert images to Base64 strings
    const withImages = await processImagesToBase64(rawResult);

    // Then convert dates to Unix
    return convertDatesToUnix(withImages);
};
