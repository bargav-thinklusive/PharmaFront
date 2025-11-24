import React from 'react';
import type { DrugEntry } from '../../../utils/types';
import { getNestedValue, updateNested } from '../../../utils/utils';
import { TextareaField } from '../formFields';

const MarketInformationStep: React.FC<{ formData: DrugEntry; setFormData: React.Dispatch<React.SetStateAction<DrugEntry>>; fieldErrors: Record<string, string> }> = ({ formData, setFormData, fieldErrors }) => {
  const fields = [
    { label: 'Version', path: 'marketInformation.version', required: false },
    { label: 'Brand Name', path: 'marketInformation.brandName', required: true },
    { label: 'Indication', path: 'marketInformation.indication', required: true },
    { label: 'Approved For', path: 'marketInformation.approvedFor', required: false },
    { label: 'Approved Countries', path: 'marketInformation.approvedCountries', required: false },
    { label: 'Approved Date', path: 'marketInformation.approvedDate', required: false },
    { label: 'Generic Name', path: 'marketInformation.genericName', required: true },
    { label: 'Generic Approved Date', path: 'marketInformation.genericApprovedDate', required: false },
    { label: 'Potential Generic Availability', path: 'marketInformation.potentialGenericAvailability', required: false },
    { label: 'Special Status', path: 'marketInformation.specialStatus', required: false },
    { label: 'Patent Exclusivity Info', path: 'marketInformation.patentExclusivityInfo', required: false },
  ];

  
  return (
    <fieldset className="border border-gray-300 rounded-md p-4">
      <legend className="text-lg font-medium text-gray-900">Market Information</legend>
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

export default MarketInformationStep;