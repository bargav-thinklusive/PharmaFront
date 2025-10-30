import React from 'react';
import { normalizeValue } from '../../../../utils/utils';

interface DynamicReferencesProps {
  references: any[];
}

const DynamicReferences: React.FC<DynamicReferencesProps> = ({ references }) => {
  if (!references || !Array.isArray(references) || references.length === 0) return null;

  return (
    <div className="mb-10">
      <h1 id="section-6" className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
        6. References
      </h1>
      {references.map((ref: any, refIndex: number) => (
        <div key={refIndex} className="mb-2">
          <h2 className={`font-semibold ${normalizeValue(ref.title) === "No data available" ? "text-gray-500 italic" : ""}`}>
            {refIndex + 1}. {normalizeValue(ref.title)}
          </h2>
          <a
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-blue-600 underline hover:text-blue-800 break-words ${normalizeValue(ref.url) === "No data available" ? "text-gray-500 italic no-underline" : ""}`}
          >
            {normalizeValue(ref.url)}
          </a>
        </div>
      ))}
    </div>
  );
};

export default DynamicReferences;