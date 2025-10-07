import React from 'react';
import KeyValueTable from './KeyValueTable';
import ManufacturingSites from './ManufacturingSites';
import { formatKey } from '../../utils/utils';
import AppendixLink from './AppendixLink';

interface DrugSubstanceProps {
  drugSubstance: any;
}

// Reference data for Drug Substance sections
const drugSubstanceReferences = {
  "3.1": { key: "REF-3.1", link: "https://example.com/physical-chemical-properties" },
  "3.2": { key: "REF-3.2", link: "https://example.com/process-development" },
  "3.3": { key: "REF-3.3", link: "https://example.com/analytical-development" }
};

const PhysicalAndChemicalProperties: React.FC<{ data: any }> = ({ data }) => (
  <div className="mb-6 ml-6">
    <h2 id="section-3-1" className="text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4">
      3.1. Physical And Chemical Properties
    </h2>
    <KeyValueTable data={data} />
    
    {/* Reference for section 3.1 */}
    <div className="mt-3 p-2 bg-gray-50 border-l-4 border-blue-400">
      <p className="text-sm text-gray-600">
        <strong>Reference:</strong> {drugSubstanceReferences["3.1"].key} - 
        <a 
          href={drugSubstanceReferences["3.1"].link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800 ml-1"
        >
          {drugSubstanceReferences["3.1"].link}
        </a>
      </p>
    </div>
  </div>
);

const ProcessDevelopment: React.FC<{ data: any; manufacturingSites: any }> = ({ data, manufacturingSites }) => {
  // Exclude manufacturingSites and plain objects from the data, but keep arrays and primitives
  const filteredData = data ? Object.fromEntries(
    Object.entries(data).filter(([key, value]) => key !== 'manufacturingSites' && (typeof value !== 'object' || Array.isArray(value)))
  ) : {};

  return (
    <div className="mb-6 ml-6">
      <h2 id="section-3-2" className="text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4">
        3.2. Process Development
      </h2>
      <KeyValueTable data={filteredData} />
      {manufacturingSites && <ManufacturingSites manufacturingSites={manufacturingSites} />}
      
      {/* Reference for section 3.2 */}
      <div className="mt-3 p-2 bg-gray-50 border-l-4 border-blue-400">
        <p className="text-sm text-gray-600">
          <strong>Reference:</strong> {drugSubstanceReferences["3.2"].key} - 
          <a 
            href={drugSubstanceReferences["3.2"].link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 ml-1"
          >
            {drugSubstanceReferences["3.2"].link}
          </a>
        </p>
      </div>
    </div>
  );
};

const AnalyticalDevelopment: React.FC<{ data: any }> = ({ data }) => (
  <div className="mb-6 ml-6">
    <h2 id="section-3-3" className="text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4">
      3.3. Analytical Development
    </h2>
    {(() => {
      const entries = Object.entries(data || {});
      
      if (entries.length === 0) {
        return (
          <div className="ml-10 p-4 text-gray-500 italic">
            No data available
          </div>
        );
      }
      
      return entries.map(([key, value], idx) => {
        const displayValue = (!value || value.toString().toLowerCase() === "n/a") 
          ? "No data available" 
          : String(value);
        
        return (
          <div key={key} className="mb-4 ml-10">
            <h3 id={`section-3-3-${idx + 1}`} className="font-bold border-blue-400 border-b-2 pb-1">
              3.3.{idx + 1} {formatKey(key)}
            </h3>
            <p><AppendixLink text={displayValue} /></p>
          </div>
        );
      });
    })()}
    
    {/* Reference for section 3.3 */}
    <div className="mt-3 p-2 bg-gray-50 border-l-4 border-blue-400">
      <p className="text-sm text-gray-600">
        <strong>Reference:</strong> {drugSubstanceReferences["3.3"].key} - 
        <a 
          href={drugSubstanceReferences["3.3"].link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800 ml-1"
        >
          {drugSubstanceReferences["3.3"].link}
        </a>
      </p>
    </div>
  </div>
);

const DrugSubstance: React.FC<DrugSubstanceProps> = ({ drugSubstance }) => {
  return (
    <div className="mb-10">
      <h1 id="section-3" className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
        3. Drug Substance
      </h1>

      <PhysicalAndChemicalProperties data={drugSubstance?.physicalAndChemicalProperties} />
      <ProcessDevelopment data={drugSubstance?.processDevelopment} manufacturingSites={drugSubstance?.processDevelopment?.manufacturingSites} />
      <AnalyticalDevelopment data={drugSubstance?.analyticalDevelopment} />
    </div>
  );
};

export default DrugSubstance;