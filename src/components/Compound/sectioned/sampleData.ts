
export const sampleDrugData = {
    "cid": "sample-full-details",
    "version": 1,
    "name": "Aspirin (Complete Demo Record)",
    "description": "A comprehensive sample record containing every field defined in the ChemBank2 drug form.",

    "ExecutiveSummary": "Aspirin (acetylsalicylic acid) is a widely used analgesic, antipyretic, and anti-inflammatory drug with established antiplatelet activity. First approved in 1899, it remains one of the most prescribed medicines globally with a robust generic market and well-understood safety profile.",

    "ProductOverview": {
        "version": "1.0.0",
        "drugName": "Aspirin Gold",
        "apiName": "Acetylsalicylic Acid",
        "mechanismOfAction": "Irreversible inhibition of cyclooxygenase enzymes (COX-1 and COX-2).",
        "companyName": "ChemBank Pharmaceuticals",
        "approvedIndications": "Pain relief, fever reduction, anti-inflammatory, antiplatelet therapy.",
        "firstApprovedDate": "1899-03-06",
        "firstApprovedRegion": "Germany",
        "dosageForms": "Tablet, Enteric-Coated Tablet, Effervescent Tablet, Capsule",
        "lossOfExclusivity": "2030-01-01",
        "globalAnnualRevenue": "$1.2B"
    },

    "RegulatoryInsights": {
        "regulatoryInsights": "Widely used analgesic and antipyretic. Essential medicine status.",
        "regionalApproval": "Approved in USA, EU, Japan, China, India, and 150+ other countries.",
        "approvalDetails": [
            {
                "drugName": "Aspirin Protective",
                "region": "USA",
                "indication": "Reduction of risk of death and nonfatal stroke",
                "patientSegments": "Adults with prior history",
                "dosageForm": "Enteric Coated Tablet",
                "dose": "81 mg",
                "approvedDate": "1980-01-01",
                "regulatoryBodies": "US FDA"
            },
            {
                "drugName": "Aspirin Flush",
                "region": "Global",
                "indication": "Acute pain relief",
                "patientSegments": "General population",
                "dosageForm": "Effervescent Tablet",
                "dose": "325 mg",
                "approvedDate": "1995-12-31",
                "regulatoryBodies": "Various"
            }
        ],
        "specialDesignations": [
            {
                "designationType": "Orphan Drug",
                "regulatorBody": "US FDA",
                "indication": "Antiplatelet therapy",
                "dateGranted": "2000-06-15"
            }
        ],
        "drugPatents": [
            {
                "designationType": "Drug Product",
                "expiryDate": "2035-10-15"
            }
        ],
        "additionalInfo": [
            { "consideration": "Monitor for GI bleeding in elderly patients.", "impactForGenericFilers": "Moderate" }
        ]
    },

    "GenericEntrants": {
        "genericEntrants": [
            {
                "anda": "ANDA 012345",
                "companyName": "GenPharma Inc.",
                "dosageDetails": "325mg IR Tablets",
                "approvalType": "Final Approval",
                "andaSubmissionDate": "2010-05-05",
                "tentativeApprovalDate": "2012-06-06",
                "finalApprovalDate": "2013-07-07",
                "ftfExclusivity": "No"
            }
        ],
        "genericsApprovedByEma": [
            {
                "companyName": "EuroGenerics Ltd.",
                "drugName": "Acetasal EU",
                "dosageDetails": "500mg Film Coated",
                "chmpOpinion": "Positive",
                "ecDecision": "Approved",
                "ecApprovalDate": "2015-09-20"
            }
        ]
    },

    "PhysicalChemicalProperties": {
        "innName": "Acetylsalicylic Acid",
        "synonyms": "2-Acetoxybenzoic acid; ASA; o-acetylsalicylic acid; Polopiryn",
        "iupacName": "2-acetyloxybenzoic acid",
        "molecularWeight": "180.16 g/mol",
        "molecularFormula": "C9H8O4",
        "bcsClass": "BCS Class I",
        "monoisotopicMass": "180.04 g/mol",
        "structure": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Aspirin-skeletal.svg/400px-Aspirin-skeletal.svg.png",
        "stereochemistry": "Achiral",
        "solubility": "Soluble in ethanol (1 in 5), ether (1 in 17), and water (1 in 300).",
        "pka": "3.5",
        "logp": "1.19",
        "logd": "0.90",
        "individualSolvent": [
            { "solvent": "Ethanol", "solubility": "200" },
            { "solvent": "Water", "solubility": "3.3" }
        ]
    },

    "DrugSubstance": {
        "availableDmfVendors": [
            { "dmf": "DMF-001", "regulatoryBody": "US FDA", "status": "Active", "type": "Type II", "submissionDate": "2010-01-01", "holder": "Bayer AG", "apiForm": "Free Acid" }
        ],
        "manufacturingRoutes": [
            { "step": "Acetylation of salicylic acid using acetic anhydride in a batch reactor." },
            { "step": "Recrystallization from water to obtain high-purity crystals." },
            { "step": "Drying under vacuum to remove residual solvents." }
        ],
        "dsImpurities": [
            { "nameOfImpurities": "Salicylic Acid", "specifiedUnspecifiedImpurities": "Specified", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Salicylic_acid.svg/200px-Salicylic_acid.svg.png" }
        ],
        "genotoxicImpurities": [
            { "genotoxicImpurities": "None identified", "classOfImpurity": "N/A" }
        ],
        "stability": "Stable for 36 months under ICH Zone II conditions.",
        "nitrosaminesAssessment": "No nitrosamine risk identified.",
        "otherInformation": "No special handling required.",
        "regulatoryStartingMaterials": "Salicylic acid, Acetic anhydride.",
        "drugSubstanceSpecifications": "Meets BP/USP monograph requirements.",
        "stableAndCommerciallyUsedPolymorphicForm": "Form I (anhydrous crystalline)"
    },

    "DrugProductInformation": {
        "dosageFormAndStrength": [
            {
                "strength": "500 mg",
                "dosageForm": "Film-coated Tablet",
                "size": "12mm",
                "color": "White",
                "imprinting": "ASP-500",
                "weight": "550mg",
                "packaging": "Blister Pack",
                "ndcCode": "0001-0002-03",
                "images": "https://via.placeholder.com/600x400?text=Tablet+Visual+QC"
            }
        ],
        "supplyChain": [
            { "apiManufacturingAndAnalysis": "Analysis", "company": "QualityFirst Labs", "location": "UK", "reference": "REF-AN-001", "phaseOfProgram": "Phase III" },
            { "apiManufacturingAndAnalysis": "Manufacturing (Capsules)", "company": "CapsulePharma", "location": "India", "reference": "REF-MFC-002", "phaseOfProgram": "Commercial" },
            { "apiManufacturingAndAnalysis": "Manufacturing (Tablets)", "company": "TabletWorks Ltd.", "location": "USA", "reference": "REF-MFT-003", "phaseOfProgram": "Commercial" },
            { "apiManufacturingAndAnalysis": "Packaging", "company": "PackRight Inc.", "location": "Germany", "reference": "REF-PKG-004", "phaseOfProgram": "Commercial" },
            { "apiManufacturingAndAnalysis": "Labeling", "company": "PrintPharma", "location": "Germany", "reference": "REF-LB-99", "phaseOfProgram": "Commercial" },
            { "apiManufacturingAndAnalysis": "Distribution", "company": "Global Logistics", "location": "Singapore", "reference": "REF-DT-22" }
        ],
        "shelfLife": [
            { "currentExpirationDate": "2027-12-31", "strength": "500mg", "expiryDate": "2027-12-31" }
        ],
        "manufacturingProcess": [
            { "dsImpurities": "Salicylic Acid", "knownImpurities": "0.1%", "specifiedImpurities": "Yes", "unknownImpurities": "<0.05%" }
        ],
        "dissolutionStudies": [
            {
                "studyType": "Comparative",
                "uspApparatus": "Apparatus 2 (Paddle)",
                "rotationSpeed": "50 rpm",
                "dissolutionMedium": "0.1N HCl (pH 1.2)",
                "temperature": "37°C ± 0.5°C",
                "acceptanceCriteria": "NLT 80% (Q) in 30 minutes"
            }
        ],
        "pharmacokinetics": [
            {
                "absorption": "1.5h (Tmax)",
                "volumeOfDistribution": "0.15 L/kg",
                "metabolism": "Hepatic (esterase hydrolysis to salicylate)",
                "excretion": "Renal (urine)",
                "halfLife": "0.25h (aspirin); 2-3h (salicylate)",
                "steadyState": "N/A (short t½)",
                "foodInteractions": "Food slows absorption but does not reduce bioavailability.",
                "drugInteractions": "Warfarin (increased bleeding risk), other NSAIDs (GI effects), ACE inhibitors (reduced antihypertensive effect)."
            }
        ],
        "formulationChallenges": "High sensitivity to moisture; direct compression preferred.",
        "stabilityStudies": "Established 36 months stability at 25°C/60% RH.",
        "maximumDailyDose": "4g/day (analgesic); 100mg/day (antiplatelet)",
        "excipientsGrade": "USP/NF grade",
        "storageAndShippingConditions": "Store below 25°C in a dry place, protected from light and moisture.",
        "unmetClinicalNeed": "Need for safer chronic low-dose options for geriatric patients."
    },

    "LabelingInformation": {
        "labelingInformation": [
            { "image": "https://via.placeholder.com/600x400?text=Outer+Carton+Aspirin" },
            { "image": "https://via.placeholder.com/600x400?text=Bottle+Label+81mg" }
        ]
    },

    "BaBeStudies": {
        "baBeStudies": [
            {
                "studyType": "Fasting Study",
                "dosageForm": "Tablets",
                "dosageStrength": "500mg",
                "studyDesign": "Crossover",
                "studyCondition": "Fasted",
                "additionalDetails": "Standard BE study for generic submission.",
                "endPoint": "Cmax, AUC"
            }
        ],
        "biowaiverRequest": "Requested based on BCS Class I profile.",
        "dissolutionTestMethodAndSamplingTimes": "USP <711> Apparatus 2, 50 rpm, 900 mL 0.1N HCl. Times: 5, 15, 30, 45 min."
    },

    "Sources": "WHO Essential Medicines List; FDA Drug Database; EMA Product Information.",

    "Glossary": "ASA (Acetylsalicylic Acid); OTC (Over-the-Counter); BE (Bioequivalence).",

    "Appendices": {
        "appendices": [
            { "appendix": "Stability Report Summary" },
            { "appendix": "Analytical Validation Log" }
        ]
    }
}
