import React from 'react';
import { formatKey } from '../../utils/formatKey';

interface DrugProductProps {
  drugProduct: any;
}

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
          <strong>{formatKey(k)}:</strong> {String(v)}
        </p>
      ))}
    </div>
  );

  const renderArrayData = (value: any[]) => (
    <div>
      {value.map((v: any, i) => <p key={i}>{i + 1}. {v}</p>)}
    </div>
  );

  const renderSection = (key: string, value: any, sectionCounter: number) => {
    const sectionId = `section-3-${sectionCounter}`;

    if (key === "strengths" && Array.isArray(value)) {
      return (
        <div key={key} className="mb-6 ml-6">
          <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-2">
            3.{sectionCounter}. Strengths
          </h2>
          {renderStrengthsTable(value)}
        </div>
      );
    }

    if (key === "packagingAndStorageConditions" && typeof value === "object") {
      return (
        <div key={key} className="mb-6 ml-6">
          <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-2">
            3.{sectionCounter}. Packaging And Storage Conditions
          </h2>
          {renderPackagingTable(value)}
        </div>
      );
    }

    if (typeof value === "object" && !Array.isArray(value)) {
      return (
        <div key={key} className="mb-6 ml-6">
          <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-2">
            3.{sectionCounter}. {formatKey(key)}
          </h2>
          {renderObjectData(value)}
        </div>
      );
    }

    return (
      <div key={key} className="mb-4 ml-6">
        <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-1">
          3.{sectionCounter}. {formatKey(key)}
        </h2>
        {Array.isArray(value) ? renderArrayData(value) : <p>{String(value)}</p>}
      </div>
    );
  };

  return (
    <div className="mb-10">
      <h1 id="section-3" className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
        3. Drug Product
      </h1>
      {(() => {
        let sectionCounter = 0;
        return Object.entries(drugProduct?.information || {})
          .filter(([_, value]) => value && value.toString().toLowerCase() !== "n/a")
          .map(([key, value]) => {
            sectionCounter++;
            return renderSection(key, value, sectionCounter);
          });
      })()}
    </div>
  );
};

export default DrugProduct;