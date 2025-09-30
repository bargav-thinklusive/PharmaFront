import React from 'react';

interface ReferencesProps {
  references: any[];
}

const References: React.FC<ReferencesProps> = ({ references }) => {
  return (
    <div className="mb-10">
      <h1 id="section-5" className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
        5. References
      </h1>
      {(references || []).map((ref: any, refIndex: number) => (
        <div key={refIndex} className="mb-2">
          <h2 id={`section-5-${refIndex + 1}`} className="font-semibold">
            {refIndex + 1}. {ref.title}
          </h2>
          <a
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 break-words"
          >
            {ref.url}
          </a>
        </div>
      ))}
    </div>
  );
};

export default References;