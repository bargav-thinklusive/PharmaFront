import { convertDatesToUnix } from "../../utils/utils";

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
        sources: drug.Sources?.sources ?? "",
        glossary: drug.Glossary?.glossary ?? "",
        appendices: drug.Appendices?.appendices ?? [],
    };
};

export const formatCreatedDrug = (formData: any) => {
    const result = {
        ExecutiveSummary: formData.executiveSummary,
        ProductOverview: {
            version: formData.version,
            drugName: formData.drugName,
            apiName: formData.apiName,
            mechanismOfAction: formData.mechanismOfAction,
            companyName: formData.companyName,
            firstApprovedDate: formData.firstApprovedDate,
            firstApprovedRegion: formData.firstApprovedRegion,
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
        Sources: {
            sources: formData.sources,
        },
        Glossary: {
            glossary: formData.glossary,
        },
        Appendices: {
            appendices: formData.appendices,
        }
    };

    return convertDatesToUnix(result);
};
