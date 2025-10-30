import React from 'react';
import { formatKey, normalizeValue } from '../../../../utils/utils';
import AppendixLink from '../Appendices/AppendixLink';

interface DynamicDrugProductProps {
  drugProduct: any;
}

const DynamicDrugProduct: React.FC<DynamicDrugProductProps> = ({ drugProduct }) => {
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
            <td className="border border-gray-400 px-2">{normalizeValue(v.type)}</td>
            <td className="border border-gray-400 px-2">{normalizeValue(v.strength)}</td>
            <td className="border border-gray-400 px-2">{normalizeValue(v.description)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderObjectData = (value: any) => (
    <div>
      {Object.entries(value).map(([k, v], i) => (
        <p key={i}>
          <strong>{formatKey(k)}:</strong> <AppendixLink text={normalizeValue(v)} />
        </p>
      ))}
    </div>
  );

  const renderArrayData = (value: any[]) => (
    <div>
      {value.map((v: any, i) => <p key={i}>{i + 1}. <AppendixLink text={normalizeValue(v)} /></p>)}
    </div>
  );

  const information = drugProduct?.information || drugProduct;
  let sectionCounter = 0;

  return (
    <div className="mb-10">
      <h1 id="section-4" className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
        4. Drug Product
      </h1>
      {Object.entries(information || {}).map(([key, value]) => {
        sectionCounter++;
        const sectionId = `section-4-${sectionCounter}`;

        if (key === "strengths" && Array.isArray(value)) {
          return (
            <div key={key} className="mb-6 ml-6">
              <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-2">
                4.{sectionCounter}. Strengths
              </h2>
              {renderStrengthsTable(value)}
            </div>
          );
        }

        if (key === "dosingTable") {
          const dosingValue = value as any;
          return (
            <div key={key} className="mb-6 ml-6">
              <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-2">
                4.{sectionCounter}. Dosing Table
              </h2>
              {dosingValue.description && <p className="mb-4">{dosingValue.description}</p>}
              {dosingValue.notes && dosingValue.notes.length > 0 && (
                <div className="mb-4">
                  <strong>Notes:</strong>
                  <ol className="list-decimal list-inside ml-4">
                    {dosingValue.notes.map((note: string, noteIdx: number) => (
                      <li key={noteIdx} className="mb-1">{note}</li>
                    ))}
                  </ol>
                </div>
              )}
              {dosingValue.regimenByRenalFunction && dosingValue.regimenByRenalFunction.length > 0 && (
                <div className="border-2 border-sky-400 rounded bg-white max-w-4xl">
                  <table className="w-full text-sm text-black">
                    <thead>
                      <tr className="border-b border-blue-100">
                        <th className="p-3 text-black font-semibold text-left">eGFR (mL/min)</th>
                        <th className="p-3 text-black font-semibold text-left">Dose</th>
                        <th className="p-3 text-black font-semibold text-left">Dosing Interval</th>
                        <th className="p-3 text-black font-semibold text-left">Infusion Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dosingValue.regimenByRenalFunction.map((regimen: any, idx: number) => (
                        <tr key={idx} className="border-b border-blue-100">
                          <td className="py-2 px-4">{regimen.eGFR_mL_per_min}</td>
                          <td className="py-2 px-4">{regimen.dose}</td>
                          <td className="py-2 px-4">{regimen.dosingInterval}</td>
                          <td className="py-2 px-4">{regimen.infusionTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        }

        if (key === "packagingAndStorageConditions") {
          const packagingValue = value as any;
          return (
            <div key={key} className="mb-6 ml-6">
              <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-2">
                4.{sectionCounter}. Packaging And Storage Conditions
              </h2>
              <div className="border-2 border-sky-400 rounded bg-white max-w-4xl">
                <table className="w-full text-sm text-black">
                  <thead>
                    <tr className="border-b border-blue-100">
                      <th className="w-1/4 p-3 text-black font-semibold text-left">Strength</th>
                      <th className="w-1/4 p-3 text-black font-semibold text-left">Description</th>
                      <th className="w-1/4 p-3 text-black font-semibold text-left">Packaging</th>
                      <th className="w-1/4 p-3 text-black font-semibold text-left">Storage Temperature</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(packagingValue).filter(([k]) => k !== 'description' && k !== 'packaging' && k !== 'ndc' && k !== 'type' && k !== 'storageTemperature').map(([strength, details]: [string, any], idx) => (
                      <tr key={idx} className="border-b border-blue-100">
                        <td className="py-2 px-4 font-semibold">{strength}</td>
                        <td className="py-2 px-4">{details.description || 'N/A'}</td>
                        <td className="py-2 px-4">{details.packaging || 'N/A'}</td>
                        <td className="py-2 px-4">{details.storageTemperature || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
            </div>
          );
        }

        return (
          <div key={key} className="mb-4 ml-6">
            <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-1">
              4.{sectionCounter}. {formatKey(key)}
            </h2>
            {Array.isArray(value) ? renderArrayData(value) : <p><AppendixLink text={normalizeValue(value)} /></p>}
          </div>
        );
      })}
    </div>
  );
};

export default DynamicDrugProduct;