import React from 'react';
import type { DrugEntry } from '../../../utils/types';
import { getNestedValue, updateNested } from '../../../utils/utils';
import { TextareaField } from '../formFields';

const ProcessDevelopmentStep: React.FC<{ formData: DrugEntry; setFormData: React.Dispatch<React.SetStateAction<DrugEntry>> }> = ({ formData, setFormData }) => {
  const fields = [
    { label: 'Available DMF Vendors', path: 'drugSubstance.processDevelopment.availableDmfVendors' },
    { label: 'Vendor Reference', path: 'drugSubstance.processDevelopment.vendorReference' },
    { label: 'Potency Classification', path: 'drugSubstance.processDevelopment.potencyClassification' },
    { label: 'Manufacturing Sites', path: 'drugSubstance.processDevelopment.manufacturingSites' },
    { label: 'Manufacturing Route', path: 'drugSubstance.processDevelopment.manufacturingRoute' },
    { label: 'Polymorph Studies', path: 'drugSubstance.processDevelopment.polymorphStudies' },
    { label: 'Regulatory Starting Materials', path: 'drugSubstance.processDevelopment.regulatoryStartingMaterials' },
    { label: 'RSM and Intermediate Specifications', path: 'drugSubstance.processDevelopment.rsmAndIntermediateSpecifications' },
    { label: 'Drug Substance Specifications', path: 'drugSubstance.processDevelopment.drugSubstanceSpecifications' },
    { label: 'Forced Degradation Studies', path: 'drugSubstance.processDevelopment.forcedDegradationStudies' },
    { label: 'Impurities Qualification', path: 'drugSubstance.processDevelopment.impurityQualification' },
    { label: 'Genotoxic Impurities Assessment', path: 'drugSubstance.processDevelopment.genotoxicImpuritiesAssessment' },
    { label: 'Nitrosamines Assessment', path: 'drugSubstance.processDevelopment.nitrosaminesAssessment' },
    { label: 'Fate of Impurities', path: 'drugSubstance.processDevelopment.fateOfImpurities' },
    { label: 'CPPs and CQA Studies', path: 'drugSubstance.processDevelopment.cppsAndCqaStudies' },
    { label: 'Other Information', path: 'drugSubstance.processDevelopment.otherInformation' },
  ];

  return (
    <fieldset className="border border-gray-300 rounded-md p-4">
      <legend className="text-lg font-medium text-gray-900">Drug Substance - Process Development</legend>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {fields.map(field => (
          <TextareaField
            key={field.label}
            label={field.label}
            value={getNestedValue(formData, field.path)}
            onChange={(value) => setFormData(prev => updateNested(prev, field.path, value))}
          />
        ))}
      </div>
    </fieldset>
  );
};

export default ProcessDevelopmentStep;