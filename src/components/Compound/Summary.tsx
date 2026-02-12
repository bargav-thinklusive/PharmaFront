import React from 'react'
import { normalizeValue } from '../../utils/utils';

interface SummaryProps {
  drug: any;
  sectionId: number;
}

const Summary: React.FC<SummaryProps> = ({ drug, sectionId }) => {
  const renderValue = (value: any) => {
    if (typeof value === 'string') {
      return normalizeValue(value);
    } else if (value && typeof value === 'object') {
      const entries = Object.entries(value).filter(([_, val]) => val !== null && val !== undefined && val !== "" && val !== "[object Object]");
      if (entries.length > 0) {
        return (
          <div>
            {entries.map(([key, val], idx) => (
              <div key={idx} className="mb-1">
                <span className="font-medium">{key}:</span> {typeof val === 'string' ? normalizeValue(val) : JSON.stringify(val)}
              </div>
            ))}
          </div>
        );
      }
      // If all values are empty or [object Object], just return the keys
      const keys = Object.keys(value).filter(key => key && typeof key === 'string' && key.trim());
      if (keys.length > 0) {
        return keys.join('; ');
      }
      return "N/A";
    }
    return normalizeValue(value);
  };

  const getSynonymsString = (value: any) => {
    if (typeof value === 'string') {
      return normalizeValue(value);
    } else if (value && typeof value === 'object') {
      const entries = Object.entries(value).filter(([_, val]) => val !== null && val !== undefined && val !== "" && val !== "[object Object]");
      if (entries.length > 0) {
        return entries.map(([key, val]) => `${key}: ${typeof val === 'string' ? normalizeValue(val) : JSON.stringify(val)}`).join('; ');
      }
      // If all values are empty or [object Object], just return the keys
      const keys = Object.keys(value).filter(key => key && typeof key === 'string' && key.trim());
      if (keys.length > 0) {
        return keys.join('; ');
      }
      return "";
    }
    return normalizeValue(value);
  };
  return (
    <div className='w-full bg-white/90'>
      <div className='max-w-3xl pt-6'>
        <div className='text-xs text-black mb-2'>COMPOUND SUMMARY</div>
        <h1
          id={`section-${sectionId}`}
          className='text-3xl font-bold text-black mb-4 cursor-pointer pl-1 py-1 text-left'
        >
          {sectionId}. Title and Summary
        </h1>
        <div className={`text-xl font-semibold text-black mb-2 ${(drug.MarketInformation?.drugName || drug.drugName) && normalizeValue(drug.MarketInformation?.drugName || drug.drugName) === "No data available" ? "text-gray-500 italic" : ""}`}>
          {drug.MarketInformation?.drugName || drug.drugName ? normalizeValue(drug.MarketInformation?.drugName || drug.drugName) : "N/A"}
        </div>
      </div>

      <div className='border-2 border-sky-400 rounded bg-white max-w-3xl'>
        <table className='w-full text-sm text-black border-collapse'>
          <tbody>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold border-r border-sky-200'>CID</td>
              <td className="p-3">
                <span className={`text-base font-semibold text-black ${drug.cid && normalizeValue(drug.cid) === "No data available" ? "text-gray-500 italic" : ""}`}>{drug.cid ? normalizeValue(drug.cid) : "N/A"}</span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold border-r border-sky-200'>Version</td>
              <td className="p-3">
                <span className={`text-base text-black ${(drug.MarketInformation?.version || drug.version) && normalizeValue(drug.MarketInformation?.version || drug.version) === "No data available" ? "text-gray-500 italic" : ""}`}>{drug.MarketInformation?.version || drug.version ? normalizeValue(drug.MarketInformation?.version || drug.version) : "N/A"}</span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold border-r border-sky-200'>Structure</td>
              <td className='p-3'>

                {drug.PhysicalChemicalProperties?.chemicalStructure ? (
                  <img
                    src={drug.PhysicalChemicalProperties.chemicalStructure}
                    alt={drug.MarketInformation?.drugName || drug.MarketInformation?.brandName || drug.drugName || "structure"}
                    className="w-52 h-52 object-contain border my-2 cursor-pointer hover:shadow-lg"
                  />
                ) : "N/A"}
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold border-r border-sky-200'>Chemical Formula</td>
              <td className="p-3">
                <span className={`text-base text-black ${drug.PhysicalChemicalProperties?.molecularFormula && renderValue(drug.PhysicalChemicalProperties.molecularFormula) === "No data available" ? "text-gray-500 italic" : ""}`}>
                  {drug.PhysicalChemicalProperties?.molecularFormula ? renderValue(drug.PhysicalChemicalProperties.molecularFormula) : "N/A"}
                </span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold border-r border-sky-200'>Synonyms</td>
              <td className="p-3">
                <span className="text-base text-black">
                  {[
                    drug.MarketInformation?.drugName ? getSynonymsString(drug.MarketInformation.drugName) : "",
                    drug.drugName ? getSynonymsString(drug.drugName) : "",
                    drug.PhysicalChemicalProperties?.synonyms ? getSynonymsString(drug.PhysicalChemicalProperties.synonyms) : "",
                    drug.PhysicalChemicalProperties?.innName ? getSynonymsString(drug.PhysicalChemicalProperties.innName) : "",
                    drug.PhysicalChemicalProperties?.iupacName ? getSynonymsString(drug.PhysicalChemicalProperties.iupacName) : ""
                  ].filter(val => val && val !== "[object Object]").join(", ") || "N/A"}
                </span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold border-r border-sky-200'>Molecular Weight</td>
              <td className="p-3">
                <span className={`text-base text-black ${drug.PhysicalChemicalProperties?.molecularWeight && renderValue(drug.PhysicalChemicalProperties.molecularWeight) === "No data available" ? "text-gray-500 italic" : ""}`}>
                  {drug.PhysicalChemicalProperties?.molecularWeight ? renderValue(drug.PhysicalChemicalProperties.molecularWeight) : "N/A"}
                </span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold border-r border-sky-200'>Structure Name</td>
              <td className="p-3">
                <span className={`text-base text-black ${drug.PhysicalChemicalProperties?.structureName && renderValue(drug.PhysicalChemicalProperties.structureName) === "No data available" ? "text-gray-500 italic" : ""}`}>
                  {drug.PhysicalChemicalProperties?.structureName ? renderValue(drug.PhysicalChemicalProperties.structureName) : "N/A"}
                </span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold border-r border-sky-200'>Dates</td>
              <td className="p-3">
                <div className="flex gap-8">
                  <div>
                    <div className="text-xs font-semibold text-black">Approved:</div>
                    <div className={`text-xs text-black ${drug.MarketInformation?.firstApprovedDate && normalizeValue(drug.MarketInformation.firstApprovedDate) === "No data available" ? "text-gray-500 italic" : ""}`}>
                      {drug.MarketInformation?.firstApprovedDate ? normalizeValue(drug.MarketInformation.firstApprovedDate) : "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-black">Generic Approved:</div>
                    <div className={`text-xs text-black ${drug.MarketInformation?.genericApprovedDate && normalizeValue(drug.MarketInformation.genericApprovedDate) === "No data available" ? "text-gray-500 italic" : ""}`}>
                      {drug.MarketInformation?.genericApprovedDate ? normalizeValue(drug.MarketInformation.genericApprovedDate) : "N/A"}
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Summary
