import React from 'react';
import type { DrugEntry } from '../../../utils/types';
import { getNestedValue, updateNested } from '../../../utils/utils';
import { TextareaField, FileUploadField } from '../formFields';

const AppendicesReferencesStep: React.FC<{
  formData: DrugEntry;
  setFormData: React.Dispatch<React.SetStateAction<DrugEntry>>;
  addReference: () => void;
  updateReference: (index: number, field: 'title' | 'url', value: string) => void;
  removeReference: (index: number) => void;
}> = ({ formData, setFormData, addReference, updateReference, removeReference }) => {
  const appendixFields = [
    { label: 'Appendix 1', path: 'appendices.appendix1' },
    { label: 'Appendix 2', path: 'appendices.appendix2' },
    { label: 'Appendix 3', path: 'appendices.appendix3' },
    { label: 'Appendix 4', path: 'appendices.appendix4' },
    { label: 'Appendix 5', path: 'appendices.appendix5', type: 'file', multiple: true },
    { label: 'Appendix 6', path: 'appendices.appendix6' },
  ];

  return (
    <div className="space-y-6">
      <fieldset className="border border-gray-300 rounded-md p-4">
        <legend className="text-lg font-medium text-gray-900">Appendices</legend>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {appendixFields.map(field => (
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
                onChange={(value) => { console.log('appendix5 onChange called with', value); setFormData(prev => updateNested(prev, field.path, value as any)) }}
              />
            )
          ))}
        </div>
      </fieldset>

      <fieldset className="border border-gray-300 rounded-md p-4">
        <legend className="text-lg font-medium text-gray-900">References</legend>
        <div className="mt-4 space-y-4">
          {(formData.references || []).map((ref: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-md p-3 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-700">Reference {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeReference(index)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextareaField
                  label="Title"
                  value={ref.title}
                  onChange={(value) => updateReference(index, 'title', value)}
                />
                <TextareaField
                  label="URL"
                  value={ref.url}
                  onChange={(value) => updateReference(index, 'url', value)}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addReference}
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            + Add Reference
          </button>
        </div>
      </fieldset>
    </div>
  );
};

export default AppendicesReferencesStep;