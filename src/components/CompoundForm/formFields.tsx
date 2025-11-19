import React from 'react';

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
  onChange: (value: string) => void;
  onFileChange?: (file: File | null) => void;
  accept?: string;
}> = ({ label, onChange, onFileChange, accept = "image/*" }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="space-y-2">
      <input
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          if (onFileChange) {
            onFileChange(file);
          }
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result as string;
              onChange(result);
            };
            reader.readAsDataURL(file);
          }
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  </div>
);