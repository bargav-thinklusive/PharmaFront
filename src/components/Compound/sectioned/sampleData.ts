
export const sampleDrugData = {
    cid: 'sample-full-details',
    version: 1,
    name: 'Aspirin (Complete Demo Record)',
    description: 'A comprehensive sample record containing every field defined in the ChemBank2 drug form to demonstrate full data depth.',

    // Step 1: Market Information
    marketInformation: {
        version: '1.0.0',
        drugName: 'Aspirin Gold',
        apiName: 'Acetylsalicylic Acid',
        mechanismOfAction: 'Irreversible inhibition of cyclooxygenase enzymes (COX-1 and COX-2).',
        companyName: 'ChemBank Pharmaceuticals',
        firstApprovedDate: '1899-03-06',
        firstApprovedRegion: 'Germany',
        status: 'Approved'
    },

    // Step 2: Physical & Chemical Properties
    physicalAndChemicalProperties: {
        innName: 'Acetylsalicylic Acid',
        synonyms: '2-Acetoxybenzoic acid; ASA; o-acetylsalicylic acid; Polopiryn',
        iupacName: '2-acetyloxybenzoic acid',
        molecularWeight: '180.16 g/mol',
        molecularFormula: 'C9H8O4',
        bcsClass: 'BCS Class I',
        monoisotopicMass: '180.04 g/mol',
        structureName: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Aspirin-skeletal.svg/400px-Aspirin-skeletal.svg.png',
        stereochemistry: 'Achiral',
        solubility: 'Soluble in ethanol (1 in 5), ether (1 in 17), and water (1 in 300).',
        pka: '3.5',
        logp: '1.19',
        regulatoryInsights: 'Widely used analgesic and antipyretic. Essential medicine status.',
        regionalApproval: 'Approved in USA, EU, Japan, China, India, and 150+ other countries.',

        // Dynamic Fields for Step 2
        additionalInfo: [
            {
                drugName: 'Aspirin Protective',
                region: 'USA',
                indication: 'Reduction of risk of death and nonfatal stroke',
                patientSegments: 'Adults with prior history',
                dosageForm: 'Enteric Coated Tablet',
                strength: '81 mg',
                approvedDate: '1980-01-01',
                regulatoryBodies: 'US FDA'
            },
            {
                drugName: 'Aspirin Flush',
                region: 'Global',
                indication: 'Acute pain relief',
                patientSegments: 'General population',
                dosageForm: 'Effervescent Tablet',
                strength: '325 mg',
                approvedDate: '1995-12-31',
                regulatoryBodies: 'Various'
            }
        ],
        drugPatents: [
            {
                designationType: 'Drug Product',
                expiryDate: '2035-10-15',
                regulatoryBody: 'USPTO',
                exclusivityConsideration: 'New formulation',
                impactForGenericFilers: 'High'
            }
        ],
        genericEntrants: [
            {
                anda: 'ANDA 012345',
                companyName: 'GenPharma Inc.',
                dosageDetails: '325mg IR Tablets',
                approvalType: 'Final Approval',
                andaSubmissionDate: '2010-05-05',
                tentativeApprovalDate: '2012-06-06',
                finalApprovalDate: '2013-07-07',
                ftfExclusivity: 'No'
            }
        ],
        genericsApprovedByEma: [
            {
                companyName: 'EuroGenerics Ltd.',
                drugName: 'Acetasal EU',
                dosageDetails: '500mg Film Coated',
                chmpOpinion: 'Positive',
                ecDecision: 'Approved',
                ecApprovalDate: '2015-09-20'
            }
        ]
    },

    // Step 4: Analytical Development (Merged with Manufacturing for demo)
    analyticalDevelopment: {
        dosageFormAndStrength: [
            {
                strength: '500 mg',
                dosageForm: 'Film-coated Tablet',
                size: '12mm',
                color: 'White',
                imprinting: 'ASP-500',
                weight: '550mg',
                packaging: 'Blister Pack',
                ndcCode: '0001-0002-03',
                images: 'https://via.placeholder.com/600x400?text=Tablet+Visual+QC'
            }
        ],
        supplyChain: [
            { apiManufacturingAndAnalysis: 'Analysis', company: 'QualityFirst Labs', location: 'UK', reference: 'REF-AN-001', phaseOfProgram: 'Phase III' },
            { apiManufacturingAndAnalysis: 'Labeling', company: 'PrintPharma', location: 'Germany', reference: 'REF-LB-99', phaseOfProgram: 'Commercial' },
            { apiManufacturingAndAnalysis: 'Distribution', company: 'Global Logistics', location: 'Singapore', reference: 'REF-DT-22' }
        ],
        manufacturingProcess: [
            {
                dsImpurities: 'Salicylic Acid',
                knownImpurities: '0.1%',
                specified: 'Yes',
                unknownImpurities: '<0.05%'
            }
        ],
        baBeStudies: [
            {
                studyType: 'Fasting Study',
                dosageForm: 'Tablets',
                dosageStrength: '500mg',
                studyDesign: 'Crossover',
                studyCondition: 'Fasted',
                additionalDetails: 'Standard BE study for generic submission.',
                endPoint: 'Cmax, AUC'
            }
        ],
        shelfLife: [
            { currentExpirationDate: '2027-12-31', strength: '500mg', expiryDate: '2027-12-31' }
        ],
        stabilityStudies: 'Established 36 months stability at 25°C/60% RH.',
        biowaiverRequest: 'Requested based on BCS Class I profile.',
        dissolutionTestMethodAndSamplingTimes: 'USP <711> Apparatus 2, 50 rpm, 900 mL 0.1N HCl. Times: 5, 15, 30, 45 min.',
        formulationChallenges: 'High sensitivity to moisture; direct compression preferred.'
    },

    // Step 5: Drug Product Information
    drugProductInformation: {
        labelingInformation: [
            { image: 'https://via.placeholder.com/600x400?text=Outer+Carton+Aspirin' },
            { image: 'https://via.placeholder.com/600x400?text=Bottle+Label+81mg' }
        ],
        unmetClinicalNeed: 'Need for safer chronic low-dose options for geriatric patients.',
        glossary: 'ASA (Acetylsalicylic Acid); OTC (Over-the-Counter); BE (Bioequivalence).'
    },

    // Step 6: Appendices
    appendices: {
        appendices: [
            { appendix: 'Stability Report Summary', content: 'Samples stored at 25°C/60% RH for 36 months remained within specifications. Moisture content increased slightly but did not impact dissolution.' },
            { appendix: 'Analytical Validation Log', content: 'The assay method was validated according to ICH Q2(R1) guidelines. Linearity R2 > 0.999.' }
        ]
    }
};
