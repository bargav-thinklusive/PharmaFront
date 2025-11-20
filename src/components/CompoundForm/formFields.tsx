import React, { useState } from 'react';

// Reusable form field components
export const TextareaField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}> = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      placeholder={placeholder}
    />
  </div>
);

export const FileUploadField: React.FC<{
  label: string;
  value?: File | File[];
  onChange: (value: File | File[] | null) => void;
  accept?: string;
  multiple?: boolean;
}> = ({ label, value, onChange, accept = "image/*", multiple = false }) => {
  const [inputKey, setInputKey] = useState(0);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="space-y-2">
        <input
          key={inputKey}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            const files = e.target.files;
            if (!files) return;
            if (multiple) {
              const fileArray: File[] = Array.from(files);
              const current = (value as File[]) || [];
              onChange([...current, ...fileArray]);
            } else {
              const file = files[0];
              onChange(file);
            }
            setInputKey(prev => prev + 1);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      {multiple && Array.isArray(value) && value.length > 0 && (
        <div className="mt-2 space-y-1">
          {value.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span className="text-sm">{file.name}</span>
              <button
                type="button"
                onClick={() => {
                  const newValue = value.filter((_, i) => i !== index);
                  onChange(newValue);
                }}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      {!multiple && value && !Array.isArray(value) && (
        <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
          <span className="text-sm">{value.name}</span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  </div>
  );
};