export interface DrugEntry {
  marketInformation: {
    version: string;
    brandName: string;
    indication: string;
    approvedFor: string;
    approvedCountries: string;
    approvedDate: string;
    genericName: string;
    genericApprovedDate: string;
    potentialGenericAvailability: string;
    specialStatus: string;
    patentExclusivityInfo: string;
  };
  drugSubstance: {
    physicalAndChemicalProperties: {
      chemicalName: string;
      chemicalStructure: File | null;
      potencyClassification: string;
      elementalFormula: string;
      bcsClass: string;
      molecularWeight: string;
      averageIsotopicMass: string;
      structureName: string;
      solubility: string;
      pka: string;
      logp: string;
    };
    processDevelopment: {
      availableDmfVendors: string;
      vendorReference: string;
      potencyClassification: string;
      manufacturingSites: string;
      manufacturingRoute: string;
      polymorphStudies: string;
      regulatoryStartingMaterials: string;
      rsmAndIntermediateSpecifications: string;
      drugSubstanceSpecifications: string;
      forcedDegradationStudies: string;
      impurityQualification: string;
      genotoxicImpuritiesAssessment: string;
      nitrosaminesAssessment: string;
      fateOfImpurities: string;
      cppsAndCqaStudies: string;
      otherInformation: string;
    };
    analyticalDevelopment: {
      rsmMethods: string;
      ipcTestMethods: string;
      finalApiMethods: string;
      residualSolventRiskAssessment: string;
      rsmSynthesis: string;
      dsImpurityMethods: string;
    };
    stabilityOfDrugSubstance: string;
    drugSubstanceSites: string;
    dsImpurities: string;
  };
  drugProduct: {
    information: {
      dosageForms: string;
      strengths: string;
      targetPopulation: string;
      maximumDailyDose: string;
      storageAndShippingConditions: string;
      developmentProgramDesignation: string;
      dpFormulation: string;
      unmetClinicalNeed: string;
      manufacturingProcess: string;
      excipientsGrade: string;
      impurities: string;
      specification: string;
      testMethods: string;
      residualSolventsRiskAssessment: string;
      nitrosamineRiskAssessment: string;
      stabilityStudies: string;
      dissolutionStudies: string;
      baBeStudies: string;
      foodStudyReports: string;
      currentLabel: string;
      dpEmbossingDebossingInfo: string;
      currentExpirationDating: string;
      foodInteractions: string;
      drugDrugInteractions: string;
      packagingAndStorageConditions: string;
      labeling: string;
      developmentProgramDesignationDetails: string;
      dosingTable: string;
    };
  };
  appendices: {
    appendix1: string;
    appendix2: string;
    appendix3: string;
    appendix4: File[];
    appendix5: string;
    appendix6: string;
  };
  references?: { title: string; url: string }[];
}
