import React from 'react';
import { UniversalTemplate, type SectionConfig } from './index';

// Example data structure showing different data types
const exampleData = {
  summary: {
    title: "Example Document",
    description: "This is a comprehensive example showing how the Universal Template handles different data types.",
    lastUpdated: "2024-01-08",
    version: "1.0.0"
  },
  
  basicInformation: {
    name: "Sample Product",
    category: "Pharmaceutical",
    status: "Active",
    website: "https://example.com",
    references: "See Appendix 1 for more details"
  },
  
  technicalSpecs: {
    physicalProperties: {
      molecularWeight: "250.3 g/mol",
      meltingPoint: "125-127°C",
      solubility: "Soluble in water",
      appearance: "White crystalline powder"
    },
    chemicalProperties: {
      formula: "C12H15NO3",
      stability: "Stable under normal conditions",
      incompatibilities: ["Strong oxidizing agents", "Strong acids"]
    },
    testResults: [
      {
        testName: "Purity Test",
        method: "HPLC",
        result: "99.5%",
        specification: "≥99.0%",
        status: "Pass"
      },
      {
        testName: "Water Content",
        method: "Karl Fischer",
        result: "0.2%",
        specification: "≤0.5%",
        status: "Pass"
      },
      {
        testName: "Heavy Metals",
        method: "ICP-MS",
        result: "<10 ppm",
        specification: "≤20 ppm",
        status: "Pass"
      }
    ]
  },
  
  manufacturingData: {
    sites: [
      {
        name: "Primary Manufacturing Site",
        location: "New York, USA",
        capacity: "1000 kg/year",
        certifications: ["FDA", "GMP", "ISO 9001"]
      },
      {
        name: "Secondary Site",
        location: "Berlin, Germany",
        capacity: "500 kg/year",
        certifications: ["EMA", "GMP"]
      }
    ],
    qualityControl: {
      inProcessTesting: "Real-time monitoring",
      finalTesting: "Complete analytical suite",
      releaseApproval: "QA Manager approval required"
    }
  },
  
  regulatoryInfo: {
    approvals: ["FDA", "EMA", "Health Canada"],
    filingStatus: "Approved",
    nextReview: "2025-12-31",
    documents: [
      "Drug Master File",
      "Certificate of Analysis",
      "Stability Data"
    ]
  },
  
  appendices: {
    appendix1: {
      name: "Analytical Methods",
      description: "Detailed analytical procedures",
      methods: [
        "HPLC Method for Purity",
        "Karl Fischer for Water Content",
        "ICP-MS for Heavy Metals"
      ]
    },
    appendix2: {
      name: "Stability Studies",
      description: "Long-term and accelerated stability data",
      studies: {
        longTerm: "25°C/60% RH for 36 months",
        accelerated: "40°C/75% RH for 6 months",
        stress: "Various stress conditions"
      }
    }
  }
};

// Define the section structure
const sectionConfig: SectionConfig[] = [
  {
    id: 1,
    key: 'summary',
    title: 'Document Summary',
    hasSubsections: false
  },
  {
    id: 2,
    key: 'basicInformation',
    title: 'Basic Information',
    hasSubsections: false
  },
  {
    id: 3,
    key: 'technicalSpecs',
    title: 'Technical Specifications',
    hasSubsections: true,
    subsections: [
      { 
        key: 'physicalProperties', 
        title: 'Physical Properties' 
      },
      { 
        key: 'chemicalProperties', 
        title: 'Chemical Properties' 
      },
      { 
        key: 'testResults', 
        title: 'Test Results' 
      }
    ]
  },
  {
    id: 4,
    key: 'manufacturingData',
    title: 'Manufacturing Information',
    hasSubsections: true,
    subsections: [
      { 
        key: 'sites', 
        title: 'Manufacturing Sites' 
      },
      { 
        key: 'qualityControl', 
        title: 'Quality Control' 
      }
    ]
  },
  {
    id: 5,
    key: 'regulatoryInfo',
    title: 'Regulatory Information',
    hasSubsections: false
  },
  {
    id: 6,
    key: 'appendices',
    title: 'Appendices',
    hasSubsections: true,
    subsections: [
      { 
        key: 'appendix1', 
        title: 'Analytical Methods',
        hasSubSubsections: true,
        subSubsections: [
          { key: 'methods', title: 'Methods List' }
        ]
      },
      { 
        key: 'appendix2', 
        title: 'Stability Studies',
        hasSubSubsections: true,
        subSubsections: [
          { key: 'studies', title: 'Study Conditions' }
        ]
      }
    ]
  }
];

const UniversalTemplateExample: React.FC = () => {
  const handleNavigate = (sectionId: string) => {
    console.log('Navigated to section:', sectionId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Universal Template Example
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            This example demonstrates the Universal Template's ability to handle various data types:
            simple key-value pairs, complex nested objects, arrays rendered as lists or tables, 
            URLs, appendix references, and hierarchical section navigation.
          </p>
        </div>

        <UniversalTemplate
          data={exampleData}
          sections={sectionConfig}
          title="Sample Product Documentation"
          showTableOfContents={true}
          onNavigate={handleNavigate}
          className="bg-white rounded-lg shadow-lg p-6"
        />
      </div>
    </div>
  );
};

export default UniversalTemplateExample;
