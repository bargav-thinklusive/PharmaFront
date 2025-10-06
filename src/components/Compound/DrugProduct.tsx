import React from 'react';
import { formatKey } from '../../utils/utils';
import AppendixLink from './AppendixLink';

interface DrugProductProps {
  drugProduct: any;
}

// Reference data for subsections
const subsectionReferences: { [key: string]: { key: string; link: string } } = {
  strengths: { key: "REF-4.1", link: "https://example.com/drug-product-strengths" },
  packagingAndStorageConditions: { key: "REF-4.2", link: "https://example.com/packaging-storage" },
  dosageForm: { key: "REF-4.3", link: "https://example.com/dosage-form" },
  routeOfAdministration: { key: "REF-4.4", link: "https://example.com/route-administration" },
  indication: { key: "REF-4.5", link: "https://example.com/indication" },
  contraindications: { key: "REF-4.6", link: "https://example.com/contraindications" },
  warnings: { key: "REF-4.7", link: "https://example.com/warnings" },
  precautions: { key: "REF-4.8", link: "https://example.com/precautions" },
  adverseReactions: { key: "REF-4.9", link: "https://example.com/adverse-reactions" },
  drugInteractions: { key: "REF-4.10", link: "https://example.com/drug-interactions" },
  default: { key: "REF-4", link: "https://example.com/drug-product-general" }
};

const DrugProduct: React.FC<DrugProductProps> = ({ drugProduct }) => {
  const renderStrengthsTable = (strengths: any[]) => (
    <table className="table-auto border-collapse border-b border-blue-400 mb-4">
      <thead>
        <tr>
          <th className="border border-gray-400 px-2">Index</th>
          <th className="border border-gray-400 px-2">Type</th>
          <th className="border border-gray-400 px-2">Strength</th>
          <th className="border border-gray-400 px-2">Description</th>
        </tr>
      </thead>
      <tbody>
        {strengths.map((v: any, i: number) => (
          <tr key={i}>
            <td className="border border-gray-400 px-2">{i + 1}</td>
            <td className="border border-gray-400 px-2">{v.type}</td>
            <td className="border border-gray-400 px-2">{v.strength}</td>
            <td className="border border-gray-400 px-2">{v.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderPackagingTable = (packagingData: any) => {
    const { storageTemperature, ...rest } = packagingData;
    return (
      <>
        <table className="table-auto border-collapse border border-gray-400 mb-4">
          <thead>
            <tr>
              <th className="border border-gray-400 px-2">Strength</th>
              <th className="border border-gray-400 px-2">Description</th>
              <th className="border border-gray-400 px-2">Packaging</th>
              <th className="border border-gray-400 px-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(rest).map(([strengthKey, obj]: any, i) => (
              <tr key={i}>
                <td className="border border-gray-400 px-2">{strengthKey}</td>
                <td className="border border-gray-400 px-2">{obj.description}</td>
                <td className="border border-gray-400 px-2">{obj.packaging}</td>
                <td className="border border-gray-400 px-2">{obj.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {storageTemperature && (
          <p>
            <strong>Storage Temperature:</strong> {storageTemperature}
          </p>
        )}
      </>
    );
  };

  const renderObjectData = (value: any) => (
    <div>
      {Object.entries(value).map(([k, v], i) => (
        <p key={i}>
          <strong>{formatKey(k)}:</strong> <AppendixLink text={String(v)} />
        </p>
      ))}
    </div>
  );

  const renderArrayData = (value: any[]) => (
    <div>
      {value.map((v: any, i) => <p key={i}>{i + 1}. <AppendixLink text={v} /></p>)}
    </div>
  );

  const renderReference = (key: string, sectionCounter: number) => {
    // Don't show references for sections 4.11 and 4.12
    if (sectionCounter === 11 || sectionCounter === 12) {
      return null;
    }
    
    const reference = subsectionReferences[key] || subsectionReferences.default;
    return (
      <div className="mt-3 p-2 bg-gray-50 border-l-4 border-blue-400">
        <p className="text-sm text-gray-600">
          <strong>Reference:</strong> {reference.key} - 
          <a 
            href={reference.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 ml-1"
          >
            {reference.link}
          </a>
        </p>
      </div>
    );
  };

  const renderSection = (key: string, value: any, sectionCounter: number) => {
    const sectionId = `section-4-${sectionCounter}`;

    if (key === "strengths" && Array.isArray(value)) {
      return (
        <div key={key} className="mb-6 ml-6">
          <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-2">
            4.{sectionCounter}. Strengths
          </h2>
          {renderStrengthsTable(value)}
          {renderReference(key, sectionCounter)}
        </div>
      );
    }

    if (key === "packagingAndStorageConditions" && typeof value === "object") {
      return (
        <div key={key} className="mb-6 ml-6">
          <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-2">
            4.{sectionCounter}. Packaging And Storage Conditions
          </h2>
          {renderPackagingTable(value)}
          {renderReference(key, sectionCounter)}
        </div>
      );
    }

    if (typeof value === "object" && !Array.isArray(value)) {
      return (
        <div key={key} className="mb-6 ml-6">
          <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-2">
            4.{sectionCounter}. {formatKey(key)}
          </h2>
          {renderObjectData(value)}
          {renderReference(key, sectionCounter)}
        </div>
      );
    }

    return (
      <div key={key} className="mb-4 ml-6">
        <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-1">
          4.{sectionCounter}. {formatKey(key)}
        </h2>
        {Array.isArray(value) ? renderArrayData(value) : <p><AppendixLink text={String(value)} /></p>}
        {renderReference(key, sectionCounter)}
      </div>
    );
  };

  return (
    <div className="mb-10">
      <h1 id="section-4" className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
        4. Drug Product
      </h1>
      {(() => {
        let sectionCounter = 0;
        const entries = Object.entries(drugProduct?.information || {});
        
        if (entries.length === 0) {
          return (
            <div className="ml-6 p-4 text-gray-500 italic">
              No data available
            </div>
          );
        }
        
        return entries.map(([key, value]) => {
          sectionCounter++;
          // Replace empty or n/a values with "No data available"
          const displayValue = (!value || value.toString().toLowerCase() === "n/a") 
            ? "No data available" 
            : value;
          return renderSection(key, displayValue, sectionCounter);
        });
      })()}
    </div>
  );
};

export default DrugProduct;