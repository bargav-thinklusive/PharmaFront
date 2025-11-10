import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DrugService from '../../services/DrugService';
import AxiosService from '../../services/shared/AxiosService';

// Simplified flexible interface using any type for maximum flexibility
interface DrugFormData {
  [key: string]: any;
}

const AddDrugForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DrugFormData>({
    
    marketInformation: {
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
      references: '',
    },
    drugSubstance: {
      physicalAndChemicalProperties: {
        chemicalName: '',
        chemicalStructure: '',
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
        stabilityOfDrugSubstance: '',
        drugSubstanceSites: '',
        dsImpurities: '',
        dsImpurityMethods: '',
      },
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
        excipientsgGrade: '',
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
        references: '',
      },
    },
    appendices: {
      appendix1: '',
      appendix2: '',
      appendix3: '',
      appendix4: '',
      appendix5: '',
      appendix6: '',
    },
    references: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');

    // Handle both formData and dynamicFields
    if (keys.length > 1) {
      setFormData(prev => {
        let current: any = prev;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        // Store as string to accept any datatype input
        current[keys[keys.length - 1]] = value;
        return { ...prev };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const drugService = new DrugService();
      const response = await AxiosService.post(drugService.createDrug(), formData);
      console.log('Drug created successfully:', response.data);
      // Show success message or redirect
      alert('Drug created successfully!');
      navigate('/drugslist'); // Redirect back to drugs list
    } catch (err: any) {
      console.error('Error creating drug:', err);
      const errorMessage = err.response?.data?.message || 'Failed to create drug. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/drugslist');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Drug</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cid" className="block text-sm font-medium text-gray-700 mb-1">
                  CID
                </label>
                <textarea
                  id="cid"
                  name="cid"
                  value={formData.cid}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Market Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="marketInformation.brandName" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Name
                </label>
                <textarea
                  id="marketInformation.brandName"
                  name="marketInformation.brandName"
                  value={formData.marketInformation?.brandName || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="marketInformation.approvedFor" className="block text-sm font-medium text-gray-700 mb-1">
                  Approved For
                </label>
                <textarea
                  id="marketInformation.approvedFor"
                  name="marketInformation.approvedFor"
                  value={formData.marketInformation?.approvedFor || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="marketInformation.approvedDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Approved Date
                </label>
                <textarea
                  id="marketInformation.approvedDate"
                  name="marketInformation.approvedDate"
                  value={formData.marketInformation?.approvedDate || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="marketInformation.genericName" className="block text-sm font-medium text-gray-700 mb-1">
                  Generic Name
                </label>
                <textarea
                  id="marketInformation.genericName"
                  name="marketInformation.genericName"
                  value={formData.marketInformation?.genericName || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="marketInformation.indication" className="block text-sm font-medium text-gray-700 mb-1">
                  Indication
                </label>
                <textarea
                  id="marketInformation.indication"
                  name="marketInformation.indication"
                  value={formData.marketInformation?.indication || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="marketInformation.approvedCountries" className="block text-sm font-medium text-gray-700 mb-1">
                  Approved Countries
                </label>
                <textarea
                  id="marketInformation.approvedCountries"
                  name="marketInformation.approvedCountries"
                  value={formData.marketInformation?.approvedCountries || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="marketInformation.genericApprovedDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Generic Approved Date
                </label>
                <textarea
                  id="marketInformation.genericApprovedDate"
                  name="marketInformation.genericApprovedDate"
                  value={formData.marketInformation?.genericApprovedDate || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="marketInformation.potentialGenericAvailability" className="block text-sm font-medium text-gray-700 mb-1">
                  Potential Generic Availability
                </label>
                <textarea
                  id="marketInformation.potentialGenericAvailability"
                  name="marketInformation.potentialGenericAvailability"
                  value={formData.marketInformation?.potentialGenericAvailability || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="marketInformation.specialStatus" className="block text-sm font-medium text-gray-700 mb-1">
                  Special Status
                </label>
                <textarea
                  id="marketInformation.specialStatus"
                  name="marketInformation.specialStatus"
                  value={formData.marketInformation?.specialStatus || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="marketInformation.patentExclusivityInfo" className="block text-sm font-medium text-gray-700 mb-1">
                  Patent Exclusivity Info
                </label>
                <textarea
                  id="marketInformation.patentExclusivityInfo"
                  name="marketInformation.patentExclusivityInfo"
                  value={formData.marketInformation?.patentExclusivityInfo || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="marketInformation.references" className="block text-sm font-medium text-gray-700 mb-1">
                  References
                </label>
                <textarea
                  id="marketInformation.references"
                  name="marketInformation.references"
                  value={formData.marketInformation?.references || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Drug Substance - Physical and Chemical Properties */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Drug Substance - Physical & Chemical Properties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="drugSubstance.physicalAndChemicalProperties.chemicalName" className="block text-sm font-medium text-gray-700 mb-1">
                  Chemical Name
                </label>
                <textarea
                  id="drugSubstance.physicalAndChemicalProperties.chemicalName"
                  name="drugSubstance.physicalAndChemicalProperties.chemicalName"
                  value={formData.drugSubstance?.physicalAndChemicalProperties?.chemicalName || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.physicalAndChemicalProperties.elementalFormula" className="block text-sm font-medium text-gray-700 mb-1">
                  Elemental Formula
                </label>
                <textarea
                  id="drugSubstance.physicalAndChemicalProperties.elementalFormula"
                  name="drugSubstance.physicalAndChemicalProperties.elementalFormula"
                  value={formData.drugSubstance?.physicalAndChemicalProperties?.elementalFormula || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.physicalAndChemicalProperties.molecularWeight" className="block text-sm font-medium text-gray-700 mb-1">
                  Molecular Weight
                </label>
                <textarea
                  id="drugSubstance.physicalAndChemicalProperties.molecularWeight"
                  name="drugSubstance.physicalAndChemicalProperties.molecularWeight"
                  value={formData.drugSubstance?.physicalAndChemicalProperties?.molecularWeight || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.physicalAndChemicalProperties.bcsClass" className="block text-sm font-medium text-gray-700 mb-1">
                  BCS Class
                </label>
                <textarea
                  id="drugSubstance.physicalAndChemicalProperties.bcsClass"
                  name="drugSubstance.physicalAndChemicalProperties.bcsClass"
                  value={formData.drugSubstance?.physicalAndChemicalProperties?.bcsClass || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Drug Substance - Process Development */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Drug Substance - Process Development</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="drugSubstance.processDevelopment.availableDmfVendors" className="block text-sm font-medium text-gray-700 mb-1">
                  Available DMF Vendors
                </label>
                <textarea
                  id="drugSubstance.processDevelopment.availableDmfVendors"
                  name="drugSubstance.processDevelopment.availableDmfVendors"
                  value={formData.drugSubstance?.processDevelopment?.availableDmfVendors || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.processDevelopment.vendorReference" className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor Reference
                </label>
                <textarea
                  id="drugSubstance.processDevelopment.vendorReference"
                  name="drugSubstance.processDevelopment.vendorReference"
                  value={formData.drugSubstance?.processDevelopment?.vendorReference || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.processDevelopment.potencyClassification" className="block text-sm font-medium text-gray-700 mb-1">
                  Potency Classification
                </label>
                <textarea
                  id="drugSubstance.processDevelopment.potencyClassification"
                  name="drugSubstance.processDevelopment.potencyClassification"
                  value={formData.drugSubstance?.processDevelopment?.potencyClassification || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.processDevelopment.manufacturingSites" className="block text-sm font-medium text-gray-700 mb-1">
                  Manufacturing Sites
                </label>
                <textarea
                  id="drugSubstance.processDevelopment.manufacturingSites"
                  name="drugSubstance.processDevelopment.manufacturingSites"
                  value={formData.drugSubstance?.processDevelopment?.manufacturingSites || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.processDevelopment.manufacturingRoute" className="block text-sm font-medium text-gray-700 mb-1">
                  Manufacturing Route
                </label>
                <textarea
                  id="drugSubstance.processDevelopment.manufacturingRoute"
                  name="drugSubstance.processDevelopment.manufacturingRoute"
                  value={formData.drugSubstance?.processDevelopment?.manufacturingRoute || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.processDevelopment.polymorphStudies" className="block text-sm font-medium text-gray-700 mb-1">
                  Polymorph Studies
                </label>
                <textarea
                  id="drugSubstance.processDevelopment.polymorphStudies"
                  name="drugSubstance.processDevelopment.polymorphStudies"
                  value={formData.drugSubstance?.processDevelopment?.polymorphStudies || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.processDevelopment.regulatoryStartingMaterials" className="block text-sm font-medium text-gray-700 mb-1">
                  Regulatory Starting Materials
                </label>
                <textarea
                  id="drugSubstance.processDevelopment.regulatoryStartingMaterials"
                  name="drugSubstance.processDevelopment.regulatoryStartingMaterials"
                  value={formData.drugSubstance?.processDevelopment?.regulatoryStartingMaterials || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.processDevelopment.rsmAndIntermediateSpecifications" className="block text-sm font-medium text-gray-700 mb-1">
                  RSM and Intermediate Specifications
                </label>
                <textarea
                  id="drugSubstance.processDevelopment.rsmAndIntermediateSpecifications"
                  name="drugSubstance.processDevelopment.rsmAndIntermediateSpecifications"
                  value={formData.drugSubstance?.processDevelopment?.rsmAndIntermediateSpecifications || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.processDevelopment.drugSubstanceSpecifications" className="block text-sm font-medium text-gray-700 mb-1">
                  Drug Substance Specifications
                </label>
                <textarea
                  id="drugSubstance.processDevelopment.drugSubstanceSpecifications"
                  name="drugSubstance.processDevelopment.drugSubstanceSpecifications"
                  value={formData.drugSubstance?.processDevelopment?.drugSubstanceSpecifications || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.processDevelopment.forcedDegradationStudies" className="block text-sm font-medium text-gray-700 mb-1">
                  Forced Degradation Studies
                </label>
                <textarea
                  id="drugSubstance.processDevelopment.forcedDegradationStudies"
                  name="drugSubstance.processDevelopment.forcedDegradationStudies"
                  value={formData.drugSubstance?.processDevelopment?.forcedDegradationStudies || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.processDevelopment.impurityQualification" className="block text-sm font-medium text-gray-700 mb-1">
                  Impurity Qualification
                </label>
                <textarea
                  id="drugSubstance.processDevelopment.impurityQualification"
                  name="drugSubstance.processDevelopment.impurityQualification"
                  value={formData.drugSubstance?.processDevelopment?.impurityQualification || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.processDevelopment.genotoxicImpuritiesAssessment" className="block text-sm font-medium text-gray-700 mb-1">
                  Genotoxic Impurities Assessment
                </label>
                <textarea
                  id="drugSubstance.processDevelopment.genotoxicImpuritiesAssessment"
                  name="drugSubstance.processDevelopment.genotoxicImpuritiesAssessment"
                  value={formData.drugSubstance?.processDevelopment?.genotoxicImpuritiesAssessment || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.processDevelopment.nitrosaminesAssessment" className="block text-sm font-medium text-gray-700 mb-1">
                  Nitrosamines Assessment
                </label>
                <textarea
                  id="drugSubstance.processDevelopment.nitrosaminesAssessment"
                  name="drugSubstance.processDevelopment.nitrosaminesAssessment"
                  value={formData.drugSubstance?.processDevelopment?.nitrosaminesAssessment || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.processDevelopment.fateOfImpurities" className="block text-sm font-medium text-gray-700 mb-1">
                  Fate of Impurities
                </label>
                <textarea
                  id="drugSubstance.processDevelopment.fateOfImpurities"
                  name="drugSubstance.processDevelopment.fateOfImpurities"
                  value={formData.drugSubstance?.processDevelopment?.fateOfImpurities || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.processDevelopment.cppsAndCqaStudies" className="block text-sm font-medium text-gray-700 mb-1">
                  CPPS and CQA Studies
                </label>
                <textarea
                  id="drugSubstance.processDevelopment.cppsAndCqaStudies"
                  name="drugSubstance.processDevelopment.cppsAndCqaStudies"
                  value={formData.drugSubstance?.processDevelopment?.cppsAndCqaStudies || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="drugSubstance.processDevelopment.otherInformation" className="block text-sm font-medium text-gray-700 mb-1">
                  Other Information
                </label>
                <textarea
                  id="drugSubstance.processDevelopment.otherInformation"
                  name="drugSubstance.processDevelopment.otherInformation"
                  value={formData.drugSubstance?.processDevelopment?.otherInformation || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Drug Substance - Analytical Development */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Drug Substance - Analytical Development</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="drugSubstance.analyticalDevelopment.rsmMethods" className="block text-sm font-medium text-gray-700 mb-1">
                  RSM Methods
                </label>
                <textarea
                  id="drugSubstance.analyticalDevelopment.rsmMethods"
                  name="drugSubstance.analyticalDevelopment.rsmMethods"
                  value={formData.drugSubstance?.analyticalDevelopment?.rsmMethods || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.analyticalDevelopment.ipcTestMethods" className="block text-sm font-medium text-gray-700 mb-1">
                  IPC Test Methods
                </label>
                <textarea
                  id="drugSubstance.analyticalDevelopment.ipcTestMethods"
                  name="drugSubstance.analyticalDevelopment.ipcTestMethods"
                  value={formData.drugSubstance?.analyticalDevelopment?.ipcTestMethods || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.analyticalDevelopment.finalApiMethods" className="block text-sm font-medium text-gray-700 mb-1">
                  Final API Methods
                </label>
                <textarea
                  id="drugSubstance.analyticalDevelopment.finalApiMethods"
                  name="drugSubstance.analyticalDevelopment.finalApiMethods"
                  value={formData.drugSubstance?.analyticalDevelopment?.finalApiMethods || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.analyticalDevelopment.residualSolventRiskAssessment" className="block text-sm font-medium text-gray-700 mb-1">
                  Residual Solvent Risk Assessment
                </label>
                <textarea
                  id="drugSubstance.analyticalDevelopment.residualSolventRiskAssessment"
                  name="drugSubstance.analyticalDevelopment.residualSolventRiskAssessment"
                  value={formData.drugSubstance?.analyticalDevelopment?.residualSolventRiskAssessment || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.analyticalDevelopment.rsmSynthesis" className="block text-sm font-medium text-gray-700 mb-1">
                  RSM Synthesis
                </label>
                <textarea
                  id="drugSubstance.analyticalDevelopment.rsmSynthesis"
                  name="drugSubstance.analyticalDevelopment.rsmSynthesis"
                  value={formData.drugSubstance?.analyticalDevelopment?.rsmSynthesis || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.analyticalDevelopment.stabilityOfDrugSubstance" className="block text-sm font-medium text-gray-700 mb-1">
                  Stability of Drug Substance
                </label>
                <textarea
                  id="drugSubstance.analyticalDevelopment.stabilityOfDrugSubstance"
                  name="drugSubstance.analyticalDevelopment.stabilityOfDrugSubstance"
                  value={formData.drugSubstance?.analyticalDevelopment?.stabilityOfDrugSubstance || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.analyticalDevelopment.drugSubstanceSites" className="block text-sm font-medium text-gray-700 mb-1">
                  Drug Substance Sites
                </label>
                <textarea
                  id="drugSubstance.analyticalDevelopment.drugSubstanceSites"
                  name="drugSubstance.analyticalDevelopment.drugSubstanceSites"
                  value={formData.drugSubstance?.analyticalDevelopment?.drugSubstanceSites || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.analyticalDevelopment.dsImpurities" className="block text-sm font-medium text-gray-700 mb-1">
                  DS Impurities
                </label>
                <textarea
                  id="drugSubstance.analyticalDevelopment.dsImpurities"
                  name="drugSubstance.analyticalDevelopment.dsImpurities"
                  value={formData.drugSubstance?.analyticalDevelopment?.dsImpurities || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugSubstance.analyticalDevelopment.dsImpurityMethods" className="block text-sm font-medium text-gray-700 mb-1">
                  DS Impurity Methods
                </label>
                <textarea
                  id="drugSubstance.analyticalDevelopment.dsImpurityMethods"
                  name="drugSubstance.analyticalDevelopment.dsImpurityMethods"
                  value={formData.drugSubstance?.analyticalDevelopment?.dsImpurityMethods || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Drug Product Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Drug Product Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="drugProduct.information.dosageForms" className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage Forms
                </label>
                <textarea
                  id="drugProduct.information.dosageForms"
                  name="drugProduct.information.dosageForms"
                  value={formData.drugProduct?.information?.dosageForms || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.targetPopulation" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Population
                </label>
                <textarea
                  id="drugProduct.information.targetPopulation"
                  name="drugProduct.information.targetPopulation"
                  value={formData.drugProduct?.information?.targetPopulation || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.maximumDailyDose" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Daily Dose
                </label>
                <textarea
                  id="drugProduct.information.maximumDailyDose"
                  name="drugProduct.information.maximumDailyDose"
                  value={formData.drugProduct?.information?.maximumDailyDose || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.storageAndShippingConditions" className="block text-sm font-medium text-gray-700 mb-1">
                  Storage Conditions
                </label>
                <textarea
                  id="drugProduct.information.storageAndShippingConditions"
                  name="drugProduct.information.storageAndShippingConditions"
                  value={formData.drugProduct?.information?.storageAndShippingConditions || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.developmentProgramDesignation" className="block text-sm font-medium text-gray-700 mb-1">
                  Development Program Designation
                </label>
                <textarea
                  id="drugProduct.information.developmentProgramDesignation"
                  name="drugProduct.information.developmentProgramDesignation"
                  value={formData.drugProduct?.information?.developmentProgramDesignation || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.dpFormulation" className="block text-sm font-medium text-gray-700 mb-1">
                  DP Formulation
                </label>
                <textarea
                  id="drugProduct.information.dpFormulation"
                  name="drugProduct.information.dpFormulation"
                  value={formData.drugProduct?.information?.dpFormulation || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.unmetClinicalNeed" className="block text-sm font-medium text-gray-700 mb-1">
                  Unmet Clinical Need
                </label>
                <textarea
                  id="drugProduct.information.unmetClinicalNeed"
                  name="drugProduct.information.unmetClinicalNeed"
                  value={formData.drugProduct?.information?.unmetClinicalNeed || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.manufacturingProcess" className="block text-sm font-medium text-gray-700 mb-1">
                  Manufacturing Process
                </label>
                <textarea
                  id="drugProduct.information.manufacturingProcess"
                  name="drugProduct.information.manufacturingProcess"
                  value={formData.drugProduct?.information?.manufacturingProcess || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.excipientsgGrade" className="block text-sm font-medium text-gray-700 mb-1">
                  Excipients Grade
                </label>
                <textarea
                  id="drugProduct.information.excipientsgGrade"
                  name="drugProduct.information.excipientsgGrade"
                  value={formData.drugProduct?.information?.excipientsgGrade || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.impurities" className="block text-sm font-medium text-gray-700 mb-1">
                  Impurities
                </label>
                <textarea
                  id="drugProduct.information.impurities"
                  name="drugProduct.information.impurities"
                  value={formData.drugProduct?.information?.impurities || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.specification" className="block text-sm font-medium text-gray-700 mb-1">
                  Specification
                </label>
                <textarea
                  id="drugProduct.information.specification"
                  name="drugProduct.information.specification"
                  value={formData.drugProduct?.information?.specification || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.testMethods" className="block text-sm font-medium text-gray-700 mb-1">
                  Test Methods
                </label>
                <textarea
                  id="drugProduct.information.testMethods"
                  name="drugProduct.information.testMethods"
                  value={formData.drugProduct?.information?.testMethods || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.residualSolventsRiskAssessment" className="block text-sm font-medium text-gray-700 mb-1">
                  Residual Solvents Risk Assessment
                </label>
                <textarea
                  id="drugProduct.information.residualSolventsRiskAssessment"
                  name="drugProduct.information.residualSolventsRiskAssessment"
                  value={formData.drugProduct?.information?.residualSolventsRiskAssessment || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.nitrosamineRiskAssessment" className="block text-sm font-medium text-gray-700 mb-1">
                  Nitrosamine Risk Assessment
                </label>
                <textarea
                  id="drugProduct.information.nitrosamineRiskAssessment"
                  name="drugProduct.information.nitrosamineRiskAssessment"
                  value={formData.drugProduct?.information?.nitrosamineRiskAssessment || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.stabilityStudies" className="block text-sm font-medium text-gray-700 mb-1">
                  Stability Studies
                </label>
                <textarea
                  id="drugProduct.information.stabilityStudies"
                  name="drugProduct.information.stabilityStudies"
                  value={formData.drugProduct?.information?.stabilityStudies || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.dissolutionStudies" className="block text-sm font-medium text-gray-700 mb-1">
                  Dissolution Studies
                </label>
                <textarea
                  id="drugProduct.information.dissolutionStudies"
                  name="drugProduct.information.dissolutionStudies"
                  value={formData.drugProduct?.information?.dissolutionStudies || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.baBeStudies" className="block text-sm font-medium text-gray-700 mb-1">
                  BA/BE Studies
                </label>
                <textarea
                  id="drugProduct.information.baBeStudies"
                  name="drugProduct.information.baBeStudies"
                  value={formData.drugProduct?.information?.baBeStudies || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.foodStudyReports" className="block text-sm font-medium text-gray-700 mb-1">
                  Food Study Reports
                </label>
                <textarea
                  id="drugProduct.information.foodStudyReports"
                  name="drugProduct.information.foodStudyReports"
                  value={formData.drugProduct?.information?.foodStudyReports || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.currentLabel" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Label
                </label>
                <textarea
                  id="drugProduct.information.currentLabel"
                  name="drugProduct.information.currentLabel"
                  value={formData.drugProduct?.information?.currentLabel || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.dpEmbossingDebossingInfo" className="block text-sm font-medium text-gray-700 mb-1">
                  DP Embossing/Debossing Info
                </label>
                <textarea
                  id="drugProduct.information.dpEmbossingDebossingInfo"
                  name="drugProduct.information.dpEmbossingDebossingInfo"
                  value={formData.drugProduct?.information?.dpEmbossingDebossingInfo || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.currentExpirationDating" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Expiration Dating
                </label>
                <textarea
                  id="drugProduct.information.currentExpirationDating"
                  name="drugProduct.information.currentExpirationDating"
                  value={formData.drugProduct?.information?.currentExpirationDating || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.foodInteractions" className="block text-sm font-medium text-gray-700 mb-1">
                  Food Interactions
                </label>
                <textarea
                  id="drugProduct.information.foodInteractions"
                  name="drugProduct.information.foodInteractions"
                  value={formData.drugProduct?.information?.foodInteractions || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.drugDrugInteractions" className="block text-sm font-medium text-gray-700 mb-1">
                  Drug-Drug Interactions
                </label>
                <textarea
                  id="drugProduct.information.drugDrugInteractions"
                  name="drugProduct.information.drugDrugInteractions"
                  value={formData.drugProduct?.information?.drugDrugInteractions || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.packagingAndStorageConditions" className="block text-sm font-medium text-gray-700 mb-1">
                  Packaging and Storage Conditions
                </label>
                <textarea
                  id="drugProduct.information.packagingAndStorageConditions"
                  name="drugProduct.information.packagingAndStorageConditions"
                  value={formData.drugProduct?.information?.packagingAndStorageConditions || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.labeling" className="block text-sm font-medium text-gray-700 mb-1">
                  Labeling
                </label>
                <textarea
                  id="drugProduct.information.labeling"
                  name="drugProduct.information.labeling"
                  value={formData.drugProduct?.information?.labeling || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="drugProduct.information.developmentProgramDesignationDetails" className="block text-sm font-medium text-gray-700 mb-1">
                  Development Program Designation Details
                </label>
                <textarea
                  id="drugProduct.information.developmentProgramDesignationDetails"
                  name="drugProduct.information.developmentProgramDesignationDetails"
                  value={formData.drugProduct?.information?.developmentProgramDesignationDetails || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="drugProduct.information.references" className="block text-sm font-medium text-gray-700 mb-1">
                  References
                </label>
                <textarea
                  id="drugProduct.information.references"
                  name="drugProduct.information.references"
                  value={formData.drugProduct?.information?.references || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Appendices */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Appendices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="appendices.appendix1" className="block text-sm font-medium text-gray-700 mb-1">
                  Appendix 1
                </label>
                <textarea
                  id="appendices.appendix1"
                  name="appendices.appendix1"
                  value={formData.appendices?.appendix1 || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="appendices.appendix2" className="block text-sm font-medium text-gray-700 mb-1">
                  Appendix 2
                </label>
                <textarea
                  id="appendices.appendix2"
                  name="appendices.appendix2"
                  value={formData.appendices?.appendix2 || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="appendices.appendix3" className="block text-sm font-medium text-gray-700 mb-1">
                  Appendix 3
                </label>
                <textarea
                  id="appendices.appendix3"
                  name="appendices.appendix3"
                  value={formData.appendices?.appendix3 || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="appendices.appendix4" className="block text-sm font-medium text-gray-700 mb-1">
                  Appendix 4
                </label>
                <textarea
                  id="appendices.appendix4"
                  name="appendices.appendix4"
                  value={formData.appendices?.appendix4 || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="appendices.appendix5" className="block text-sm font-medium text-gray-700 mb-1">
                  Appendix 5
                </label>
                <textarea
                  id="appendices.appendix5"
                  name="appendices.appendix5"
                  value={formData.appendices?.appendix5 || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="appendices.appendix6" className="block text-sm font-medium text-gray-700 mb-1">
                  Appendix 6
                </label>
                <textarea
                  id="appendices.appendix6"
                  name="appendices.appendix6"
                  value={formData.appendices?.appendix6 || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* References */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">References</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="references" className="block text-sm font-medium text-gray-700 mb-1">
                  References
                </label>
                <textarea
                  id="references"
                  name="references"
                  value={Array.isArray(formData.references) ? formData.references.join('\n') : formData.references || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      references: value.split('\n').filter(ref => ref.trim() !== '')
                    }));
                  }}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder='Enter each reference on a new line, e.g.,&#10;FDA Label&#10;EMA Guidelines&#10;Clinical Study Report'
                />
              </div>
            </div>
          </div>

          {/* JSON Preview Section */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Preview (JSON)</h3>
            <p className="text-sm text-gray-600 mb-4">
              This shows how your data will be structured when submitted. You can copy this JSON and modify it if needed.
            </p>
            <div className="bg-gray-100 p-3 rounded-md max-h-60 overflow-y-auto">
              <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
            >
              {loading ? 'Creating Drug...' : 'Create Drug'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 text-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDrugForm;