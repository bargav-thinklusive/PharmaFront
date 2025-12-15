import React, { useState } from 'react';
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

const drugservice = new DrugService()

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
    appendix4: [],
    appendix5: '',
    appendix6: '',
  },
  references: [],
};


const UniversalForm: React.FC = () => {
  const { postData, loading } = usePost();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<DrugEntry>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const setFormDataWithValidation = (updater: ((prev: DrugEntry) => DrugEntry) | DrugEntry, path?: string) => {
    if (typeof updater === 'function') {
      setFormData(prev => {
        const newState = updater(prev);

        // If a specific path was provided, clear its error when user starts typing
        if (path && fieldErrors[path]) {
          setFieldErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[path];
            return newErrors;
          });
        }

        return newState;
      });
    } else {
      setFormData(updater);
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

  const validateCurrentStep = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 0: // Market Information
        if (!formData.marketInformation.brandName.trim()) {
          errors['marketInformation.brandName'] = 'Brand Name is required';
        }
        if (!formData.marketInformation.indication.trim()) {
          errors['marketInformation.indication'] = 'Indication is required';
        }
        if (!formData.marketInformation.genericName.trim()) {
          errors['marketInformation.genericName'] = 'Generic Name is required';
        }
        break;

      case 1: // Physical & Chemical Properties
        if (!formData.drugSubstance.physicalAndChemicalProperties.chemicalName.trim()) {
          errors['drugSubstance.physicalAndChemicalProperties.chemicalName'] = 'Chemical Name is required';
        }
        if (!formData.drugSubstance.physicalAndChemicalProperties.molecularWeight.trim()) {
          errors['drugSubstance.physicalAndChemicalProperties.molecularWeight'] = 'Molecular Weight is required';
        }
        if (!formData.drugSubstance.physicalAndChemicalProperties.elementalFormula.trim()) {
          errors['drugSubstance.physicalAndChemicalProperties.elementalFormula'] = 'Elemental Formula is required';
        }
        break;

      case 2: // Process Development
        if (!formData.drugSubstance.processDevelopment.manufacturingSites.trim()) {
          errors['drugSubstance.processDevelopment.manufacturingSites'] = 'Manufacturing Sites is required';
        }
        if (!formData.drugSubstance.processDevelopment.manufacturingRoute.trim()) {
          errors['drugSubstance.processDevelopment.manufacturingRoute'] = 'Manufacturing Route is required';
        }
        break;

      case 3: // Analytical Development
        if (!formData.drugSubstance.analyticalDevelopment.finalApiMethods.trim()) {
          errors['drugSubstance.analyticalDevelopment.finalApiMethods'] = 'Final API Methods is required';
        }
        break;

      case 4: // Drug Product
        if (!formData.drugProduct.information.dosageForms.trim()) {
          errors['drugProduct.information.dosageForms'] = 'Dosage Forms is required';
        }
        if (!formData.drugProduct.information.strengths.trim()) {
          errors['drugProduct.information.strengths'] = 'Strengths is required';
        }
        break;

      case 5: // Appendices & References
        const hasAtLeastOneAppendix = formData.appendices.appendix1.trim() ||
          formData.appendices.appendix2.trim() ||
          formData.appendices.appendix3.trim() ||
          formData.appendices.appendix5.trim() ||
          formData.appendices.appendix6.trim();
        if (!hasAtLeastOneAppendix) {
          errors['appendices'] = 'At least one appendix section must be filled';
        }
        break;
    }

    return errors;
  };

  const nextStep = () => {
    const stepValidationErrors = validateCurrentStep();
    if (Object.keys(stepValidationErrors).length > 0) {
      setFieldErrors(stepValidationErrors);
      toast.error('Please fix the highlighted errors before proceeding');
      return;
    }

    // Clear errors and move to next step
    setFieldErrors({});
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

    // Market Information validations
    if (!formData.marketInformation.brandName.trim()) errors.push('Brand Name is required');
    if (!formData.marketInformation.indication.trim()) errors.push('Indication is required');
    if (!formData.marketInformation.genericName.trim()) errors.push('Generic Name is required');

    // Physical & Chemical Properties validations
    if (!formData.drugSubstance.physicalAndChemicalProperties.chemicalName.trim()) errors.push('Chemical Name is required');
    if (!formData.drugSubstance.physicalAndChemicalProperties.molecularWeight.trim()) errors.push('Molecular Weight is required');
    if (!formData.drugSubstance.physicalAndChemicalProperties.elementalFormula.trim()) errors.push('Elemental Formula is required');

    // Process Development validations
    if (!formData.drugSubstance.processDevelopment.manufacturingSites.trim()) errors.push('Manufacturing Sites is required');
    if (!formData.drugSubstance.processDevelopment.manufacturingRoute.trim()) errors.push('Manufacturing Route is required');

    // Analytical Development validations
    if (!formData.drugSubstance.analyticalDevelopment.finalApiMethods.trim()) errors.push('Final API Methods is required');

    // Drug Product validations
    if (!formData.drugProduct.information.dosageForms.trim()) errors.push('Dosage Forms is required');
    if (!formData.drugProduct.information.strengths.trim()) errors.push('Strengths is required');

    // Appendices validation
    const hasAtLeastOneAppendix = formData.appendices.appendix1.trim() ||
      formData.appendices.appendix2.trim() ||
      formData.appendices.appendix3.trim() ||
      formData.appendices.appendix5.trim() ||
      formData.appendices.appendix6.trim();
    if (!hasAtLeastOneAppendix) errors.push('At least one appendix section must be filled');

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
      const appendix4Files = formData.appendices.appendix4;

      // Now create dataToSend and remove file references
      const dataToSend = { ...formData };
      (dataToSend as any).drugSubstance.physicalAndChemicalProperties.chemicalStructure = undefined;
      (dataToSend as any).appendices.appendix4 = undefined;

      const formDataToSend = new FormData();
      const payload = processDrugData(dataToSend);
      formDataToSend.append('data', JSON.stringify(payload));

      // Use the extracted files
      if (chemicalStructureFiles) {
        if (Array.isArray(chemicalStructureFiles)) {
          chemicalStructureFiles.forEach((file) => {
            formDataToSend.append('chemicalStructure', file);
          });
        } else {
          formDataToSend.append('chemicalStructure', chemicalStructureFiles);
        }
      }

      if (appendix4Files && appendix4Files.length > 0) {
        appendix4Files.forEach((file) => {
          formDataToSend.append('appendix4', file);
        });
      }
      // Log FormData contents
      console.log('=== FormData Contents ===');
      const filesByKey: Record<string, File[]> = {};
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          if (!filesByKey[key]) filesByKey[key] = [];
          filesByKey[key].push(value);
        }
      }
      console.log('chemicalStructure:', filesByKey['chemicalStructure'] || []);
      console.log('appendix4:', filesByKey['appendix4'] || []);
      await postData(drugservice.createDrug(), formDataToSend);
      console.log('postData completed successfully');
      toast.success('Drug entry submitted successfully!');
    } catch (err: any) {
      console.log(err);
      toast.error('Failed to submit drug entry. Please try again.');
    }
  };

  const renderStepContent = () => {
    const stepProps = {
      formData,
      setFormData: setFormDataWithValidation,
      fieldErrors
    };

    switch (currentStep) {
      case 0:
        return <MarketInformationStep {...stepProps} />;
      case 1:
        return <PhysicalChemicalPropertiesStep {...stepProps} />;
      case 2:
        return <ProcessDevelopmentStep {...stepProps} />;
      case 3:
        return <AnalyticalDevelopmentStep {...stepProps} />;
      case 4:
        return <DrugProductStep {...stepProps} />;
      case 5:
        return <AppendicesReferencesStep {...stepProps} addReference={addReference} updateReference={updateReference} removeReference={removeReference} />;
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
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