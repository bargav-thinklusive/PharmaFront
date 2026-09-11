import { convertDatesToUnix, fileToBase64 } from "../../utils/utils";
import {
    formatDateForInput,
    extractSources,
    extractGlossary,
    extractAppendices,
} from "../../utils/formUtils";

export { formatDateForInput, extractSources, extractGlossary, extractAppendices };

/**
 * Flattens a stored drug record (nested sections) into
 * the flat key map the form expects.
 */
export const flattenDrug = (drug: any): any => {
    if (!drug) return {};
    const existingId = drug._id || drug.id || drug.original_id;
    const existingVersion = drug.ProductOverview?.version || drug.version || drug.originalVersion || "1.0";
    
    const loeList = drug.ProductOverview?.lossOfExclusivity || drug.lossOfExclusivity || [];
    const firstLoe = Array.isArray(loeList) && loeList.length > 0 ? loeList[0] : {};

    return {
        _id: existingId,
        original_id: existingId,
        originalVersion: existingVersion,
        cid: drug.cid ?? drug.ProductOverview?.cid ?? "",
        createdBy: drug.createdBy ?? drug.ProductOverview?.createdBy ?? "",
        createdByName: drug.createdByName ?? drug.ProductOverview?.createdByName ?? "",
        createdByEmail: drug.createdByEmail ?? drug.ProductOverview?.createdByEmail ?? "",
        createdAt: drug.createdAt ?? drug.ProductOverview?.createdAt ?? (existingId && typeof existingId === 'string' && /^[0-9a-fA-F]{24}$/.test(existingId) ? parseInt(existingId.substring(0, 8), 16) * 1000 : ""),
        updatedAt: drug.updatedAt ?? drug.ProductOverview?.updatedAt ?? drug.createdAt ?? (existingId && typeof existingId === 'string' && /^[0-9a-fA-F]{24}$/.test(existingId) ? parseInt(existingId.substring(0, 8), 16) * 1000 : ""),
        updatedBy: drug.updatedBy ?? "",
        updatedByName: drug.updatedByName ?? "",
        updatedByEmail: drug.updatedByEmail ?? "",

        // Executive Summary
        executiveSummary: typeof drug.ExecutiveSummary === 'object' && drug.ExecutiveSummary !== null
            ? (drug.ExecutiveSummary.executiveSummary ?? drug.ExecutiveSummary.ExecutiveSummary ?? Object.values(drug.ExecutiveSummary)[0] ?? "")
            : (drug.ExecutiveSummary ?? drug.executiveSummary ?? ""),

        // Product Overview
        version: existingVersion,
        drugName: drug.ProductOverview?.drugName ?? drug.drugName ?? drug.name ?? "",
        apiName: drug.ProductOverview?.apiName ?? drug.apiName ?? "",
        mechanismOfAction: drug.ProductOverview?.mechanismOfAction ?? drug.mechanismOfAction ?? "",
        companyName: drug.ProductOverview?.companyName ?? drug.companyName ?? drug.innovator ?? "",
        approvedIndications: drug.ProductOverview?.approvedIndications ?? drug.approvedIndications ?? "",
        therapeuticArea: drug.ProductOverview?.therapeuticArea ?? drug.therapeuticArea ?? "",
        firstApprovedDate: formatDateForInput(drug.ProductOverview?.firstApprovedDate ?? drug.firstApprovedDate ?? drug.ProductOverview?.firstApprovedYear ?? drug.firstApprovedYear),
        firstApprovedRegion: drug.ProductOverview?.firstApprovedRegion ?? drug.firstApprovedRegion ?? "",
        dosageForms: drug.ProductOverview?.dosageForms ?? drug.dosageForms ?? "",
        lossOfExclusivity: loeList,
        exclusivityCode: firstLoe.exclusivityCode ?? drug.ProductOverview?.exclusivityCode ?? drug.exclusivityCode ?? "",
        country: firstLoe.country ?? drug.ProductOverview?.country ?? drug.country ?? "",
        regulatoryBody: firstLoe.regulatoryBody ?? drug.ProductOverview?.regulatoryBody ?? drug.regulatoryBody ?? "",
        expiredDate: formatDateForInput(firstLoe.expiredDate ?? drug.ProductOverview?.expiredDate ?? drug.expiredDate),
        globalAnnualRevenue: drug.ProductOverview?.globalAnnualRevenue ?? drug.globalAnnualRevenue ?? "",

        // Regulatory Insights
        regulatoryInsights: drug.RegulatoryInsights?.regulatoryInsights ?? drug.regulatoryInsights ?? "",
        regionalApproval: drug.RegulatoryInsights?.regionalApproval ?? drug.regionalApproval ?? "",
        approvalDetails: drug.RegulatoryInsights?.approvalDetails ?? drug.approvalDetails ?? [],
        specialDesignations: drug.RegulatoryInsights?.specialDesignations ?? drug.specialDesignations ?? [],
        drugPatents: drug.RegulatoryInsights?.drugPatents ?? drug.drugPatents ?? [],
        additionalInfo: drug.RegulatoryInsights?.additionalInfo ?? drug.additionalInfo ?? [],

        // Generic Entrants
        genericEntrants: drug.GenericEntrants?.genericEntrants ?? drug.genericEntrants ?? [],
        genericsApprovedByEma: drug.GenericEntrants?.genericsApprovedByEma ?? drug.genericsApprovedByEma ?? [],

        // Physical & Chemical Properties
        innName: drug.PhysicalChemicalProperties?.innName ?? drug.innName ?? "",
        synonyms: drug.PhysicalChemicalProperties?.synonyms ?? drug.synonyms ?? "",
        iupacName: drug.PhysicalChemicalProperties?.iupacName ?? drug.iupacName ?? "",
        molecularWeight: drug.PhysicalChemicalProperties?.molecularWeight ?? drug.molecularWeight ?? "",
        molecularFormula: drug.PhysicalChemicalProperties?.molecularFormula ?? drug.molecularFormula ?? "",
        bcsClass: drug.PhysicalChemicalProperties?.bcsClass ?? drug.bcsClass ?? "",
        monoisotopicMass: drug.PhysicalChemicalProperties?.monoisotopicMass ?? drug.monoisotopicMass ?? "",
        structure: drug.PhysicalChemicalProperties?.structure ?? drug.structure ?? "",
        stereochemistry: drug.PhysicalChemicalProperties?.stereochemistry ?? drug.stereochemistry ?? "",
        solubility: drug.PhysicalChemicalProperties?.solubility ?? drug.solubility ?? "",
        pka: drug.PhysicalChemicalProperties?.pka ?? drug.pka ?? "",
        logp: drug.PhysicalChemicalProperties?.logp ?? drug.logp ?? "",
        logd: drug.PhysicalChemicalProperties?.logd ?? drug.logd ?? "",
        individualSolvent: drug.PhysicalChemicalProperties?.individualSolvent ?? drug.individualSolvent ?? [],

        // Drug Substance
        availableDmfVendors: drug.DrugSubstance?.availableDmfVendors ?? drug.availableDmfVendors ?? [],
        manufacturingRoutes: drug.DrugSubstance?.manufacturingRoutes ?? drug.manufacturingRoutes ?? [],
        dsImpurities: drug.DrugSubstance?.dsImpurities ?? drug.dsImpurities ?? [],
        genotoxicImpurities: drug.DrugSubstance?.genotoxicImpurities ?? drug.genotoxicImpurities ?? [],
        stability: drug.DrugSubstance?.stability ?? drug.stability ?? [],
        nitrosaminesAssessment: drug.DrugSubstance?.nitrosaminesAssessment ?? drug.nitrosaminesAssessment ?? "",
        otherInformation: drug.DrugSubstance?.otherInformation ?? drug.otherInformation ?? "",
        regulatoryStartingMaterials: drug.DrugSubstance?.regulatoryStartingMaterials ?? drug.regulatoryStartingMaterials ?? "",
        drugSubstanceSpecifications: drug.DrugSubstance?.drugSubstanceSpecifications ?? drug.drugSubstanceSpecifications ?? [],
        stableAndCommerciallyUsedPolymorphicForm: drug.DrugSubstance?.stableAndCommerciallyUsedPolymorphicForm ?? drug.stableAndCommerciallyUsedPolymorphicForm ?? "",

        // Drug Product Information
        dosageFormAndStrength: drug.DrugProductInformation?.dosageFormAndStrength ?? drug.dosageFormAndStrength ?? [],
        supplyChain: drug.DrugProductInformation?.supplyChain ?? drug.supplyChain ?? [],
        shelfLife: drug.DrugProductInformation?.shelfLife ?? drug.shelfLife ?? [],
        manufacturingProcess: drug.DrugProductInformation?.manufacturingProcess ?? drug.manufacturingProcess ?? [],
        dissolutionStudies: drug.DrugProductInformation?.dissolutionStudies ?? drug.dissolutionStudies ?? [],
        pharmacokinetics: drug.DrugProductInformation?.pharmacokinetics ?? drug.pharmacokinetics ?? [],
        formulationChallenges: drug.DrugProductInformation?.formulationChallenges ?? drug.formulationChallenges ?? "",
        stabilityStudies: drug.DrugProductInformation?.stabilityStudies ?? drug.stabilityStudies ?? [],
        maximumDailyDose: drug.DrugProductInformation?.maximumDailyDose ?? drug.maximumDailyDose ?? "",
        excipientsGrade: drug.DrugProductInformation?.excipientsGrade ?? drug.excipientsGrade ?? "",
        storageAndShippingConditions: drug.DrugProductInformation?.storageAndShippingConditions ?? drug.storageAndShippingConditions ?? "",
        unmetClinicalNeed: drug.DrugProductInformation?.unmetClinicalNeed ?? drug.unmetClinicalNeed ?? "",

        // Labeling
        labelingInformation: drug.LabelingInformation?.labelingInformation ?? (Array.isArray(drug.LabelingInformation) ? drug.LabelingInformation : (drug.labelingInformation ?? [])),

        // BA/BE Studies
        baBeStudies: drug.BaBeStudies?.baBeStudies ?? drug.baBeStudies ?? [],
        biowaiverRequest: drug.BaBeStudies?.biowaiverRequest ?? drug.biowaiverRequest ?? "",
        dissolutionTestMethodAndSamplingTimes: drug.BaBeStudies?.dissolutionTestMethodAndSamplingTimes ?? drug.dissolutionTestMethodAndSamplingTimes ?? "",

        // Sources / Glossary / Appendices
        sources: extractSources(drug.Sources ?? drug.sources),
        glossary: extractGlossary(drug.Glossary ?? drug.glossary),
        appendices: extractAppendices(drug.Appendices ?? drug.appendices),
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
            const converted = await Promise.all(val.map(async (file: File) => ({
                fileName: file.name,
                contentType: file.type,
                imageData: await fileToBase64(file)
            })));
            result[key] = converted.length === 1 ? converted[0] : converted;
        } else if (typeof val === 'object') {
            result[key] = await processImagesToBase64(val);
        } else {
            result[key] = val;
        }
    }
    return result;
}

/**
 * Formats flat form data into sectioned MongoDB drug structure.
 */
export const formatCreatedDrug = async (formData: any): Promise<any> => {
    const rawResult = {
        _id: formData._id,
        original_id: formData.original_id,
        cid: formData.cid,
        createdBy: formData.createdBy,
        createdByName: formData.createdByName,
        createdByEmail: formData.createdByEmail,
        createdAt: formData.createdAt,
        updatedAt: formData.updatedAt,
        version: formData.version || "1.0",
        ExecutiveSummary: formData.executiveSummary,
        ProductOverview: {
            version: formData.version || "1.0",
            drugName: formData.drugName,
            apiName: formData.apiName,
            mechanismOfAction: formData.mechanismOfAction,
            companyName: formData.companyName,
            approvedIndications: formData.approvedIndications,
            therapeuticArea: formData.therapeuticArea,
            firstApprovedDate: formData.firstApprovedDate,
            firstApprovedRegion: formData.firstApprovedRegion,
            dosageForms: formData.dosageForms,
            globalAnnualRevenue: formData.globalAnnualRevenue,
            createdBy: formData.createdBy,
            createdByName: formData.createdByName,
            createdByEmail: formData.createdByEmail,
            lossOfExclusivity: formData.exclusivityCode || formData.country || formData.regulatoryBody || formData.expiredDate ? [
                {
                    exclusivityCode: formData.exclusivityCode,
                    country: formData.country,
                    regulatoryBody: formData.regulatoryBody,
                    expiredDate: formData.expiredDate,
                }
            ] : (formData.lossOfExclusivity || []),
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
        LabelingInformation: formData.labelingInformation,
        BaBeStudies: {
            baBeStudies: formData.baBeStudies,
            biowaiverRequest: formData.biowaiverRequest,
            dissolutionTestMethodAndSamplingTimes: formData.dissolutionTestMethodAndSamplingTimes,
        },
        Sources: formData.sources,
        Glossary: formData.glossary,
        Appendices: formData.appendices,
    };

    // First convert images to Base64 strings
    const withImages = await processImagesToBase64(rawResult);

    // Then convert dates to Unix
    return convertDatesToUnix(withImages);
};
