import React from 'react';
import type { DrugEntry } from '../../../utils/types';
import { getNestedValue, updateNested } from '../../../utils/utils';
import { TextareaField } from '../formFields';

const AnalyticalDevelopmentStep: React.FC<{ formData: DrugEntry; setFormData: React.Dispatch<React.SetStateAction<DrugEntry>> }> = ({ formData, setFormData }) => {
  const fields = [
    { label: 'RSM Methods', path: 'drugSubstance.analyticalDevelopment.rsmMethods' },
    { label: 'IPC Test Methods', path: 'drugSubstance.analyticalDevelopment.ipcTestMethods' },
    { label: 'Final API Methods', path: 'drugSubstance.analyticalDevelopment.finalApiMethods' },
    { label: 'Residual Solvent Risk Assessment', path: 'drugSubstance.analyticalDevelopment.residualSolventRiskAssessment' },
    { label: 'RSM Synthesis', path: 'drugSubstance.analyticalDevelopment.rsmSynthesis' },
    { label: 'Stability of Drug Substance', path: 'drugSubstance.stabilityOfDrugSubstance' },
    { label: 'Drug Substance Sites', path: 'drugSubstance.drugSubstanceSites' },
    { label: 'DS Impurities', path: 'drugSubstance.dsImpurities' },
    { label: 'DS Impurity Methods', path: 'drugSubstance.analyticalDevelopment.dsImpurityMethods' },
  ];

  return (
    <fieldset className="border border-gray-300 rounded-md p-4">
      <legend className="text-lg font-medium text-gray-900">Drug Substance - Analytical Development</legend>
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

export default AnalyticalDevelopmentStep;