import React from 'react';
import type { DrugEntry } from '../../../utils/types';
import { getNestedValue, updateNested } from '../../../utils/utils';
import { TextareaField } from '../formFields';

const DrugProductStep: React.FC<{ formData: DrugEntry; setFormData: React.Dispatch<React.SetStateAction<DrugEntry>>; fieldErrors: Record<string, string> }> = ({ formData, setFormData, fieldErrors }) => {
  const fields = [
    { label: 'Dosage Forms', path: 'drugProduct.information.dosageForms', required: true },
    { label: 'Strengths', path: 'drugProduct.information.strengths', required: true },
    { label: 'Target Population', path: 'drugProduct.information.targetPopulation', required: false },
    { label: 'Maximum Daily Dose', path: 'drugProduct.information.maximumDailyDose', required: false },
    { label: 'Storage and Shipping Conditions', path: 'drugProduct.information.storageAndShippingConditions', required: false },
    { label: 'Development Program Designation', path: 'drugProduct.information.developmentProgramDesignation', required: false },
    { label: 'DP Formulation', path: 'drugProduct.information.dpFormulation', required: false },
    { label: 'Unmet Clinical Need', path: 'drugProduct.information.unmetClinicalNeed', required: false },
    { label: 'Manufacturing Process', path: 'drugProduct.information.manufacturingProcess', required: false },
    { label: 'Excipients Grade', path: 'drugProduct.information.excipientsGrade', required: false },
    { label: 'Impurities', path: 'drugProduct.information.impurities', required: false },
    { label: 'Specification', path: 'drugProduct.information.specification', required: false },
    { label: 'Test Methods', path: 'drugProduct.information.testMethods', required: false },
    { label: 'Residual Solvents Risk Assessment', path: 'drugProduct.information.residualSolventsRiskAssessment', required: false },
    { label: 'Nitrosamine Risk Assessment', path: 'drugProduct.information.nitrosamineRiskAssessment', required: false },
    { label: 'Stability Studies', path: 'drugProduct.information.stabilityStudies', required: false },
    { label: 'Dissolution Studies', path: 'drugProduct.information.dissolutionStudies', required: false },
    { label: 'BA BE Studies', path: 'drugProduct.information.baBeStudies', required: false },
    { label: 'Food Study Reports', path: 'drugProduct.information.foodStudyReports', required: false },
    { label: 'Current Label', path: 'drugProduct.information.currentLabel', required: false },
    { label: 'DP Embossing Debossing Info', path: 'drugProduct.information.dpEmbossingDebossingInfo', required: false },
    { label: 'Current Expiration Dating', path: 'drugProduct.information.currentExpirationDating', required: false },
    { label: 'Food Interactions', path: 'drugProduct.information.foodInteractions', required: false },
    { label: 'Drug Drug Interactions', path: 'drugProduct.information.drugDrugInteractions', required: false },
    { label: 'Packaging and Storage Conditions', path: 'drugProduct.information.packagingAndStorageConditions', required: false },
    { label: 'Labeling', path: 'drugProduct.information.labeling', required: false },
    { label: 'Development Program Designation Details', path: 'drugProduct.information.developmentProgramDesignationDetails', required: false },
    { label: 'Dosing Table', path: 'drugProduct.information.dosingTable', required: false },
  ];

  return (
    <fieldset className="border border-gray-300 rounded-md p-4">
      <legend className="text-lg font-medium text-gray-900">Drug Product</legend>
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

export default DrugProductStep;