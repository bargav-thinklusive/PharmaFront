import React from 'react';
import AppendixLink from '../sections/Appendices/AppendixLink';
import { normalizeValue } from '../../../utils/utils';

const renderValue = (value: any): React.ReactNode => {
  if (typeof value === 'string') {
    // Special handling for chemical structure images
    if (value.includes('.png') || value.includes('.jpg') || value.includes('.jpeg') || value.includes('.gif')) {
      return (
        <img
          src={value}
          alt="Chemical Structure"
          className="w-32 h-32 object-contain border my-2 cursor-pointer hover:shadow-lg"
        />
      );
    }
    return <AppendixLink text={normalizeValue(value)} />;
  } else if (value && typeof value === 'object') {
    return (
      <div>
        {Object.entries(value).map(([key, val], idx) => (
          <div key={idx} className="mb-4">
            <h4 className="font-semibold text-blue-600 mb-2">{key}</h4>
            {typeof val === 'object' && val !== null ? (
              <div className="ml-4">
                {Object.entries(val).map(([subKey, subVal], subIdx) => (
                  <div key={subIdx} className="mb-2">
                    <strong className="text-gray-700">{subKey}:</strong> {typeof subVal === 'string' ? <AppendixLink text={normalizeValue(subVal)} /> : renderValue(subVal)}
                  </div>
                ))}
              </div>
            ) : (
              <AppendixLink text={normalizeValue(val)} />
            )}
          </div>
        ))}
      </div>
    );
  }
  return <AppendixLink text={normalizeValue(value)} />;
};

export default renderValue;