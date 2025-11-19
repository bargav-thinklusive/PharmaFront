import React from 'react';
import type { DrugEntry } from '../../../utils/types';
import { getNestedValue, updateNested } from '../../../utils/utils';
import { TextareaField } from '../formFields';

const MarketInformationStep: React.FC<{ formData: DrugEntry; setFormData: React.Dispatch<React.SetStateAction<DrugEntry>> }> = ({ formData, setFormData }) => {
  const fields = [
    { label: 'Version', path: 'marketInformation.version' },
    { label: 'Brand Name', path: 'marketInformation.brandName' },
    { label: 'Indication', path: 'marketInformation.indication' },
    { label: 'Approved For', path: 'marketInformation.approvedFor' },
    { label: 'Approved Countries', path: 'marketInformation.approvedCountries' },
    { label: 'Approved Date', path: 'marketInformation.approvedDate' },
    { label: 'Generic Name', path: 'marketInformation.genericName' },
    { label: 'Generic Approved Date', path: 'marketInformation.genericApprovedDate' },
    { label: 'Potential Generic Availability', path: 'marketInformation.potentialGenericAvailability' },
    { label: 'Special Status', path: 'marketInformation.specialStatus' },
    { label: 'Patent Exclusivity Info', path: 'marketInformation.patentExclusivityInfo' },
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
            onChange={(value) => setFormData(prev => updateNested(prev, field.path, value))}
          />
        ))}
      </div>
    </fieldset>
  );
};

export default MarketInformationStep;