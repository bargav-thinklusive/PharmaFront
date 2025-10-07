import React from 'react';
import UniversalDataRenderer from './UniversalDataRenderer';

const UniversalTemplateDemo: React.FC = () => {
  // Sample data demonstrating different structures
  const sampleData = {
    // Section 1: Small object - displays as table
    marketInformation: {
      brandName: "Xalkori",
      genericName: "Crizotinib",
      therapeuticArea: "Oncology",
      approvalDate: "2011-08-26",
      manufacturer: "Pfizer"
    },

    // Section 2: Array - displays as list
    indications: [
      "ALK-positive non-small cell lung cancer",
      "ROS1-positive non-small cell lung cancer",
      "ALK-positive anaplastic large cell lymphoma"
    ],

    // Section 3: Large object with subsections
    drugSubstance: {
      physicalAndChemicalProperties: {
        molecularFormula: "C21H22Cl2FN5O",
        molecularWeight: "450.34 g/mol",
        appearance: "White to off-white powder",
        solubility: "Sparingly soluble in water",
        meltingPoint: "188-192°C"
      },
      processDevelopment: {
        syntheticRoute: "Multi-step synthesis involving key intermediates",
        criticalProcessParameters: [
          "Temperature control during coupling reactions",
          "pH maintenance in crystallization",
          "Solvent selection for purification"
        ],
        manufacturingSites: {
          primarySite: "Pfizer Global Supply, Groton, CT, USA",
          secondarySite: "Pfizer Manufacturing Deutschland GmbH, Freiburg, Germany",
          qualityStandards: "FDA approved, GMP certified"
        }
      },
      analyticalDevelopment: {
        specifications: {
          purity: ">99.5%",
          impurities: "<0.1% each",
          residualSolvents: "<0.5%",
          heavyMetals: "<10 ppm"
        },
        methods: [
          "HPLC for purity analysis",
          "NMR for structure confirmation",
          "Mass spectrometry for molecular weight"
        ]
      }
    },

    // Section 4: Mixed data with links and appendices
    references: {
      clinicalTrials: [
        "NCT00932451 - Phase 3 trial",
        "NCT01154140 - Phase 2 trial",
        "https://clinicaltrials.gov/ct2/show/NCT00932893"
      ],
      regulatoryDocuments: {
        fdaLabel: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2011/202570s000lbl.pdf",
        emaAssessment: "https://www.ema.europa.eu/en/documents/assessment-report/xalkori-epar-public-assessment-report_en.pdf",
        prescribingInformation: "Appendix A: Full prescribing information available"
      },
      publications: [
        "Shaw AT, et al. Crizotinib in ALK-rearranged non-small-cell lung cancer. N Engl J Med. 2013",
        "Camidge DR, et al. Activity and safety of crizotinib in patients with ALK-positive non-small-cell lung cancer. J Clin Oncol. 2012"
      ]
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Universal Data Template Demo
        </h1>

        <div className="space-y-8">
          {/* Market Information - Small object, displays as table */}
          <UniversalDataRenderer
            data={sampleData.marketInformation}
            title="Market Information"
            sectionId="section-1"
            maxTableSize={10}
          />

          {/* Indications - Array, displays as list */}
          <UniversalDataRenderer
            data={sampleData.indications}
            title="Indications"
            sectionId="section-2"
          />

          {/* Drug Substance - Large object with subsections */}
          <UniversalDataRenderer
            data={sampleData.drugSubstance}
            title="Drug Substance"
            sectionId="section-3"
            maxTableSize={5} // Smaller threshold to force subsections
          />

          {/* References - Mixed data with links */}
          <UniversalDataRenderer
            data={sampleData.references}
            title="References"
            sectionId="section-4"
          />
        </div>
      </div>
    </div>
  );
};

export default UniversalTemplateDemo;