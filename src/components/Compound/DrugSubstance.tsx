import React from 'react';
import KeyValueTable from './KeyValueTable';
import ManufacturingSites from './ManufacturingSites';
import { formatKey } from '../../utils/formatKey';
import AppendixLink from '../AppendixLink';

interface DrugSubstanceProps {
  drugSubstance: any;
}

const PhysicalAndChemicalProperties: React.FC<{ data: any }> = ({ data }) => (
  <div className="mb-6 ml-6">
    <h2 id="section-2-1" className="text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4">
      2.1. Physical And Chemical Properties
    </h2>
    <KeyValueTable data={data} />
  </div>
);

const ProcessDevelopment: React.FC<{ data: any; manufacturingSites: any }> = ({ data, manufacturingSites }) => {
  // Exclude manufacturingSites and plain objects from the data, but keep arrays and primitives
  const filteredData = data ? Object.fromEntries(
    Object.entries(data).filter(([key, value]) => key !== 'manufacturingSites' && (typeof value !== 'object' || Array.isArray(value)))
  ) : {};

  return (
    <div className="mb-6 ml-6">
      <h2 id="section-2-2" className="text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4">
        2.2. Process Development
      </h2>
      <KeyValueTable data={filteredData} />
      {manufacturingSites && <ManufacturingSites manufacturingSites={manufacturingSites} />}
    </div>
  );
};

const AnalyticalDevelopment: React.FC<{ data: any }> = ({ data }) => (
  <div className="mb-6 ml-6">
    <h2 id="section-2-3" className="text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4">
      2.3. Analytical Development
    </h2>
    {Object.entries(data || {})
      .filter(([_, value]) => value && value.toString().toLowerCase() !== "n/a")
      .map(([key, value], idx) => (
        <div key={key} className="mb-4 ml-10">
          <h3 id={`section-2-3-${idx + 1}`} className="font-bold border-blue-400 border-b-2 pb-1">
            2.3.{idx + 1} {formatKey(key)}
          </h3>
          <p><AppendixLink text={String(value)} /></p>
        </div>
      ))}
  </div>
);

const DrugSubstance: React.FC<DrugSubstanceProps> = ({ drugSubstance }) => {
  return (
    <div className="mb-10">
      <h1 id="section-2" className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
        2. Drug Substance
      </h1>

      <PhysicalAndChemicalProperties data={drugSubstance?.physicalAndChemicalProperties} />
      <ProcessDevelopment data={drugSubstance?.processDevelopment} manufacturingSites={drugSubstance?.processDevelopment?.manufacturingSites} />
      <AnalyticalDevelopment data={drugSubstance?.analyticalDevelopment} />
    </div>
  );
};

export default DrugSubstance;