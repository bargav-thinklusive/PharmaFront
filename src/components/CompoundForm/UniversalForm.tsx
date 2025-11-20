import React, { useState, useReducer } from 'react';
import type { DrugEntry } from '../../utils/types';
import { processDrugData } from '../../utils/utils';
// Import step components
import MarketInformationStep from './steps/MarketInformationStep';
import PhysicalChemicalPropertiesStep from './steps/PhysicalChemicalPropertiesStep';
import ProcessDevelopmentStep from './steps/ProcessDevelopmentStep';
import AnalyticalDevelopmentStep from './steps/AnalyticalDevelopmentStep';
import DrugProductStep from './steps/DrugProductStep';
import AppendicesReferencesStep from './steps/AppendicesReferencesStep';
import usePost from '../../hooks/usePost';
import DrugService from '../../services/DrugService';
import { toast } from 'react-toastify';

const drugservice=new DrugService()

const initialFormData = {
  marketInformation: {
    version: '',
    brandName: '',
    indication: '',
    approvedFor: '',
    approvedCountries: '',
    approvedDate: '',
    genericName: '',
    genericApprovedDate: '',
    potentialGenericAvailability: '',
    specialStatus: '',
    patentExclusivityInfo: '',
  },
  drugSubstance: {
    physicalAndChemicalProperties: {
      chemicalName: '',
      chemicalStructure: null,
      potencyClassification: '',
      elementalFormula: '',
      bcsClass: '',
      molecularWeight: '',
      averageIsotopicMass: '',
      structureName: '',
      solubility: '',
      pka: '',
      logp: '',
    },
    processDevelopment: {
      availableDmfVendors: '',
      vendorReference: '',
      potencyClassification: '',
      manufacturingSites: '',
      manufacturingRoute: '',
      polymorphStudies: '',
      regulatoryStartingMaterials: '',
      rsmAndIntermediateSpecifications: '',
      drugSubstanceSpecifications: '',
      forcedDegradationStudies: '',
      impurityQualification: '',
      genotoxicImpuritiesAssessment: '',
      nitrosaminesAssessment: '',
      fateOfImpurities: '',
      cppsAndCqaStudies: '',
      otherInformation: '',
    },
    analyticalDevelopment: {
      rsmMethods: '',
      ipcTestMethods: '',
      finalApiMethods: '',
      residualSolventRiskAssessment: '',
      rsmSynthesis: '',
      dsImpurityMethods: '',
    },
    stabilityOfDrugSubstance: '',
    drugSubstanceSites: '',
    dsImpurities: '',
  },
  drugProduct: {
    information: {
      dosageForms: '',
      strengths: '',
      targetPopulation: '',
      maximumDailyDose: '',
      storageAndShippingConditions: '',
      developmentProgramDesignation: '',
      dpFormulation: '',
      unmetClinicalNeed: '',
      manufacturingProcess: '',
      excipientsGrade: '',
      impurities: '',
      specification: '',
      testMethods: '',
      residualSolventsRiskAssessment: '',
      nitrosamineRiskAssessment: '',
      stabilityStudies: '',
      dissolutionStudies: '',
      baBeStudies: '',
      foodStudyReports: '',
      currentLabel: '',
      dpEmbossingDebossingInfo: '',
      currentExpirationDating: '',
      foodInteractions: '',
      drugDrugInteractions: '',
      packagingAndStorageConditions: '',
      labeling: '',
      developmentProgramDesignationDetails: '',
      dosingTable: '',
    },
  },
  appendices: {
    appendix1: '',
    appendix2: '',
    appendix3: '',
    appendix4: '',
    appendix5: [],
    appendix6: '',
  },
  references: [],
};

const reducer = (state: DrugEntry, action: { type: string; value: DrugEntry }) => {
  if (action.type === 'update') {
    return action.value;
  }
  return state;
};

const UniversalForm: React.FC = () => {
  const {postData}=usePost()
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, dispatch] = useReducer(reducer, initialFormData);
  const setFormData = (updater: ((prev: DrugEntry) => DrugEntry) | DrugEntry) => {
    if (typeof updater === 'function') {
      const newState = updater(formData);
      dispatch({ type: 'update', value: newState });
    } else {
      dispatch({ type: 'update', value: updater });
    }
  };
  const steps = [
    { title: 'Market Information', component: 'market' },
    { title: 'Physical & Chemical Properties', component: 'physical' },
    { title: 'Process Development', component: 'process' },
    { title: 'Analytical Development', component: 'analytical' },
    { title: 'Drug Product', component: 'product' },
    { title: 'Appendices & References', component: 'appendices' }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };




  const validate = (): string | null => {
    const errors: string[] = [];
    if (!formData.marketInformation.brandName.trim()) errors.push('Brand Name is required');
    // if (!formData.marketInformation.indication.trim()) errors.push('Indication is required');
    if (!formData.drugSubstance.physicalAndChemicalProperties.chemicalName.trim()) errors.push('Chemical Name is required');
    // if (!formData.drugSubstance.physicalAndChemicalProperties.molecularWeight.trim()) errors.push('Molecular Weight is required');
    // Add more validations as needed
    return errors.length > 0 ? errors.join(', ') : null;
  };

  const addReference = () => {
    setFormData((prev: DrugEntry) => ({
      ...prev,
      references: [...(prev.references || []), { title: '', url: '' }]
    }));
  };

  const updateReference = (index: number, field: 'title' | 'url', value: string) => {
    setFormData((prev: DrugEntry) => ({
      ...prev,
      references: (prev.references || []).map((ref, i) =>
        i === index ? { ...ref, [field]: value } : ref
      )
    }));
  };

  const removeReference = (index: number) => {
    setFormData((prev: DrugEntry) => ({
      ...prev,
      references: (prev.references || []).filter((_, i) => i !== index)
    }));
  };



const handleSubmit = async (e: React.FormEvent) => {
  try {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    // Extract files FIRST before modifying anything
    const chemicalStructureFiles = formData.drugSubstance.physicalAndChemicalProperties.chemicalStructure;
    const appendix5Files = formData.appendices.appendix5;

    // Now create dataToSend and remove file references
    const dataToSend = { ...formData };
    (dataToSend as any).drugSubstance.physicalAndChemicalProperties.chemicalStructure = undefined;
    (dataToSend as any).appendices.appendix5 = undefined;
    
    const formDataToSend = new FormData();
    const payload = processDrugData(dataToSend);
    console.log('payload:', payload);
    formDataToSend.append('data', JSON.stringify(payload));

    // Use the extracted files
    if (chemicalStructureFiles) {
      if (Array.isArray(chemicalStructureFiles)) {
        chemicalStructureFiles.forEach((file, index) => {
          formDataToSend.append(`chemicalStructure_${index}`, file);
        });
      } else {
        formDataToSend.append('chemicalStructure', chemicalStructureFiles);
      }
    }

    if (appendix5Files && appendix5Files.length > 0) {
      appendix5Files.forEach((file, index) => {
        formDataToSend.append(`appendix5_${index}`, file);
      });
    }

    console.log('formDataToSend entries:', [...formDataToSend.entries()]);
    console.log('Calling postData with FormData', formDataToSend);
    await postData(drugservice.createDrug(), formDataToSend);
    console.log('postData completed successfully');
    toast.success('Drug entry submitted successfully!');
  } catch (err: any) {
    console.log(err);
    toast.error('Failed to submit drug entry. Please try again.');
  }
};

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <MarketInformationStep formData={formData} setFormData={setFormData} />;
      case 1:
        return <PhysicalChemicalPropertiesStep formData={formData} setFormData={setFormData} />;
      case 2:
        return <ProcessDevelopmentStep formData={formData} setFormData={setFormData} />;
      case 3:
        return <AnalyticalDevelopmentStep formData={formData} setFormData={setFormData} />;
      case 4:
        return <DrugProductStep formData={formData} setFormData={setFormData} />;
      case 5:
        return <AppendicesReferencesStep formData={formData} setFormData={setFormData} addReference={addReference} updateReference={updateReference} removeReference={removeReference} />;
      default:
        return <div>Step not implemented</div>;
    }
  };

  return (
    <div className="w-full p-6 bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Drug Entry</h2>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <span className={`ml-2 text-sm ${index <= currentStep ? 'text-blue-600' : 'text-gray-600'}`}>
                {step.title}
              </span>
              {index < steps.length - 1 && <div className="w-12 h-0.5 bg-gray-300 mx-4"></div>}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStepContent()}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-2 bg-gray-600 text-white font-medium rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {currentStep === steps.length - 1 ? (
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UniversalForm;