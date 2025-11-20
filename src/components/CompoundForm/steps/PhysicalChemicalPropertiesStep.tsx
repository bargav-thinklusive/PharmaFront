import React from 'react';
import type { DrugEntry } from '../../../utils/types';
import { getNestedValue, updateNested } from '../../../utils/utils';
import { TextareaField, FileUploadField } from '../formFields';

const PhysicalChemicalPropertiesStep: React.FC<{ formData: DrugEntry; setFormData: React.Dispatch<React.SetStateAction<DrugEntry>> }> = ({ formData, setFormData }) => {
  const fields = [
    { label: 'Chemical Name', path: 'drugSubstance.physicalAndChemicalProperties.chemicalName' },
    { label: 'Chemical Structure', path: 'drugSubstance.physicalAndChemicalProperties.chemicalStructure', type: 'file', multiple: true },
    { label: 'Potency Classification', path: 'drugSubstance.physicalAndChemicalProperties.potencyClassification' },
    { label: 'Elemental Formula', path: 'drugSubstance.physicalAndChemicalProperties.elementalFormula' },
    { label: 'BCS Class', path: 'drugSubstance.physicalAndChemicalProperties.bcsClass' },
    { label: 'Molecular Weight', path: 'drugSubstance.physicalAndChemicalProperties.molecularWeight' },
    { label: 'Average Isotopic Mass', path: 'drugSubstance.physicalAndChemicalProperties.averageIsotopicMass' },
    { label: 'Structure Name', path: 'drugSubstance.physicalAndChemicalProperties.structureName' },
    { label: 'Solubility', path: 'drugSubstance.physicalAndChemicalProperties.solubility' },
    { label: 'pKa', path: 'drugSubstance.physicalAndChemicalProperties.pka' },
    { label: 'logP', path: 'drugSubstance.physicalAndChemicalProperties.logp' },
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
              onChange={(value) => setFormData(prev => updateNested(prev, field.path, value as any))}
              multiple={field.multiple}
            />
          ) : (
            <TextareaField
              key={field.label}
              label={field.label}
              value={getNestedValue(formData, field.path)}
              onChange={(value) => setFormData(prev => updateNested(prev, field.path, value))}
            />
          )
        ))}
      </div>
    </fieldset>
  );
};

export default PhysicalChemicalPropertiesStep;