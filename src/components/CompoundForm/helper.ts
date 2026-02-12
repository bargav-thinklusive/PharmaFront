import { convertDatesToUnix } from "../../utils/utils";

export const formatCreatedDrug = (formData: any) => {
    const result = {
        MarketInformation: {
            version: formData.version,
            drugName: formData.drugName,
            apiName: formData.apiName,
            mechanismOfAction: formData.mechanismOfAction,
            companyName: formData.companyName,
            firstApprovedDate: formData.firstApprovedDate,
            firstApprovedRegion: formData.firstApprovedRegion,
        },
        PhysicalChemicalProperties: {
            innName: formData.innName,
            synonyms: formData.synonyms,
            iupacName: formData.iupacName,
            molecularWeight: formData.molecularWeight,
            molecularFormula: formData.molecularFormula,
            bcsClass: formData.bcsClass,
            monoisotopicMass: formData.monoisotopicMass,
            structureName: formData.structureName,
            stereochemistry: formData.stereochemistry,
            solubility: formData.solubility,
            pka: formData.pka,
            logp: formData.logp,
            regulatoryInsights: formData.regulatoryInsights,
            regionalApproval: formData.regionalApproval,
            additionalInfo: formData.additionalInfo,
            drugPatents: formData.drugPatents,
            genericEntrants: formData.genericEntrants,
            genericsApprovedByEma: formData.genericsApprovedByEma,
        },
        ProcessDevelopment: {
            availableDmfVendors: formData.availableDmfVendors,
            manufacturingRoutes: formData.manufacturingRoutes,
            dsImpurities: formData.dsImpurities,
            genotoxicImpurities: formData.genotoxicImpurities,
            stability: formData.stability,
            nitrosaminesAssessment: formData.nitrosaminesAssessment,
            otherInformation: formData.otherInformation,
            regulatoryStartingMaterials: formData.regulatoryStartingMaterials,
            drugSubstanceSpecifications: formData.drugSubstanceSpecifications,
        },
        AnalyticalDevelopment: {
            dosageFormAndStrength: formData.dosageFormAndStrength,
            supplyChain: formData.supplyChain,
            manufacturingProcess: formData.manufacturingProcess,
            baBeStudies: formData.baBeStudies,
            shelfLife: formData.shelfLife,
            stabilityStudies: formData.stabilityStudies,
            biowaiverRequest: formData.biowaiverRequest,
            dissolutionTestMethodAndSamplingTimes: formData.dissolutionTestMethodAndSamplingTimes,
            formulationChallenges: formData.formulationChallenges,
        },
        DrugProductInformation: {
            labelingInformation: formData.labelingInformation,
            unmetClinicalNeed: formData.unmetClinicalNeed,
            glossary: formData.glossary,
        },
        Appendices: {
            appendices: formData.appendices,
        }
    };

    return convertDatesToUnix(result);
};
