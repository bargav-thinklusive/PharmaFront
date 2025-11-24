import React from 'react';
import type { DrugEntry } from '../../../utils/types';
import { getNestedValue, updateNested } from '../../../utils/utils';
import { TextareaField, FileUploadField } from '../formFields';

const PhysicalChemicalPropertiesStep: React.FC<{ formData: DrugEntry; setFormData: React.Dispatch<React.SetStateAction<DrugEntry>>; fieldErrors: Record<string, string> }> = ({ formData, setFormData, fieldErrors }) => {
  const fields = [
    { label: 'Chemical Name', path: 'drugSubstance.physicalAndChemicalProperties.chemicalName', required: true },
    { label: 'Chemical Structure', path: 'drugSubstance.physicalAndChemicalProperties.chemicalStructure', type: 'file', multiple: true, required: false },
    { label: 'Potency Classification', path: 'drugSubstance.physicalAndChemicalProperties.potencyClassification', required: false },
    { label: 'Elemental Formula', path: 'drugSubstance.physicalAndChemicalProperties.elementalFormula', required: true },
    { label: 'BCS Class', path: 'drugSubstance.physicalAndChemicalProperties.bcsClass', required: false },
    { label: 'Molecular Weight', path: 'drugSubstance.physicalAndChemicalProperties.molecularWeight', required: true },
    { label: 'Average Isotopic Mass', path: 'drugSubstance.physicalAndChemicalProperties.averageIsotopicMass', required: false },
    { label: 'Structure Name', path: 'drugSubstance.physicalAndChemicalProperties.structureName', required: false },
    { label: 'Solubility', path: 'drugSubstance.physicalAndChemicalProperties.solubility', required: false },
    { label: 'pKa', path: 'drugSubstance.physicalAndChemicalProperties.pka', required: false },
    { label: 'logP', path: 'drugSubstance.physicalAndChemicalProperties.logp', required: false },
  ];

  return (
    <fieldset className="border border-gray-300 rounded-md p-4">
      <legend className="text-lg font-medium text-gray-900">Drug Substance - Physical and Chemical Properties</legend>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {fields.map(field => (
          field.type === 'file' ? (
            <FileUploadField
              key={field.label}
              label={field.label}
              value={getNestedValue(formData, field.path) as any}
              onChange={(value) => setFormData((prev: any) => updateNested(prev, field.path, value as any))}
              multiple={field.multiple}
            />
          ) : (
            <TextareaField
              key={field.label}
              label={field.label}
              value={getNestedValue(formData, field.path)}
              onChange={(value) => setFormData((prev: any) => updateNested(prev, field.path, value))}
              required={field.required}
              error={fieldErrors[field.path]}
            />
          )
        ))}
      </div>
    </fieldset>
  );
};

export default PhysicalChemicalPropertiesStep;