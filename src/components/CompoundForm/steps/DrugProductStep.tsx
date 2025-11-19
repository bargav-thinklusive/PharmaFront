import React from 'react';
import type { DrugEntry } from '../../../utils/types';
import { getNestedValue, updateNested } from '../../../utils/utils';
import { TextareaField } from '../formFields';

const DrugProductStep: React.FC<{ formData: DrugEntry; setFormData: React.Dispatch<React.SetStateAction<DrugEntry>> }> = ({ formData, setFormData }) => {
  const fields = [
    { label: 'Dosage Forms', path: 'drugProduct.information.dosageForms' },
    { label: 'Strengths', path: 'drugProduct.information.strengths' },
    { label: 'Target Population', path: 'drugProduct.information.targetPopulation' },
    { label: 'Maximum Daily Dose', path: 'drugProduct.information.maximumDailyDose' },
    { label: 'Storage and Shipping Conditions', path: 'drugProduct.information.storageAndShippingConditions' },
    { label: 'Development Program Designation', path: 'drugProduct.information.developmentProgramDesignation' },
    { label: 'DP Formulation', path: 'drugProduct.information.dpFormulation' },
    { label: 'Unmet Clinical Need', path: 'drugProduct.information.unmetClinicalNeed' },
    { label: 'Manufacturing Process', path: 'drugProduct.information.manufacturingProcess' },
    { label: 'Excipients Grade', path: 'drugProduct.information.excipientsGrade' },
    { label: 'Impurities', path: 'drugProduct.information.impurities' },
    { label: 'Specification', path: 'drugProduct.information.specification' },
    { label: 'Test Methods', path: 'drugProduct.information.testMethods' },
    { label: 'Residual Solvents Risk Assessment', path: 'drugProduct.information.residualSolventsRiskAssessment' },
    { label: 'Nitrosamine Risk Assessment', path: 'drugProduct.information.nitrosamineRiskAssessment' },
    { label: 'Stability Studies', path: 'drugProduct.information.stabilityStudies' },
    { label: 'Dissolution Studies', path: 'drugProduct.information.dissolutionStudies' },
    { label: 'BA BE Studies', path: 'drugProduct.information.baBeStudies' },
    { label: 'Food Study Reports', path: 'drugProduct.information.foodStudyReports' },
    { label: 'Current Label', path: 'drugProduct.information.currentLabel' },
    { label: 'DP Embossing Debossing Info', path: 'drugProduct.information.dpEmbossingDebossingInfo' },
    { label: 'Current Expiration Dating', path: 'drugProduct.information.currentExpirationDating' },
    { label: 'Food Interactions', path: 'drugProduct.information.foodInteractions' },
    { label: 'Drug Drug Interactions', path: 'drugProduct.information.drugDrugInteractions' },
    { label: 'Packaging and Storage Conditions', path: 'drugProduct.information.packagingAndStorageConditions' },
    { label: 'Labeling', path: 'drugProduct.information.labeling' },
    { label: 'Development Program Designation Details', path: 'drugProduct.information.developmentProgramDesignationDetails' },
    { label: 'Dosing Table', path: 'drugProduct.information.dosingTable' },
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
            onChange={(value) => setFormData(prev => updateNested(prev, field.path, value))}
          />
        ))}
      </div>
    </fieldset>
  );
};

export default DrugProductStep;