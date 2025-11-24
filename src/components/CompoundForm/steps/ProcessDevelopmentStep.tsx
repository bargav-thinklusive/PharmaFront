import React from 'react';
import type { DrugEntry } from '../../../utils/types';
import { getNestedValue, updateNested } from '../../../utils/utils';
import { TextareaField } from '../formFields';

const ProcessDevelopmentStep: React.FC<{ formData: DrugEntry; setFormData: React.Dispatch<React.SetStateAction<DrugEntry>>; fieldErrors: Record<string, string> }> = ({ formData, setFormData, fieldErrors }) => {
  const fields = [
    { label: 'Available DMF Vendors', path: 'drugSubstance.processDevelopment.availableDmfVendors', required: false },
    { label: 'Vendor Reference', path: 'drugSubstance.processDevelopment.vendorReference', required: false },
    { label: 'Potency Classification', path: 'drugSubstance.processDevelopment.potencyClassification', required: false },
    { label: 'Manufacturing Sites', path: 'drugSubstance.processDevelopment.manufacturingSites', required: true },
    { label: 'Manufacturing Route', path: 'drugSubstance.processDevelopment.manufacturingRoute', required: true },
    { label: 'Polymorph Studies', path: 'drugSubstance.processDevelopment.polymorphStudies', required: false },
    { label: 'Regulatory Starting Materials', path: 'drugSubstance.processDevelopment.regulatoryStartingMaterials', required: false },
    { label: 'RSM and Intermediate Specifications', path: 'drugSubstance.processDevelopment.rsmAndIntermediateSpecifications', required: false },
    { label: 'Drug Substance Specifications', path: 'drugSubstance.processDevelopment.drugSubstanceSpecifications', required: false },
    { label: 'Forced Degradation Studies', path: 'drugSubstance.processDevelopment.forcedDegradationStudies', required: false },
    { label: 'Impurities Qualification', path: 'drugSubstance.processDevelopment.impurityQualification', required: false },
    { label: 'Genotoxic Impurities Assessment', path: 'drugSubstance.processDevelopment.genotoxicImpuritiesAssessment', required: false },
    { label: 'Nitrosamines Assessment', path: 'drugSubstance.processDevelopment.nitrosaminesAssessment', required: false },
    { label: 'Fate of Impurities', path: 'drugSubstance.processDevelopment.fateOfImpurities', required: false },
    { label: 'CPPs and CQA Studies', path: 'drugSubstance.processDevelopment.cppsAndCqaStudies', required: false },
    { label: 'Other Information', path: 'drugSubstance.processDevelopment.otherInformation', required: false },
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
            onChange={(value) => setFormData((prev: any) => updateNested(prev, field.path, value))}
            required={field.required}
            error={fieldErrors[field.path]}
          />
        ))}
      </div>
    </fieldset>
  );
};

export default ProcessDevelopmentStep;