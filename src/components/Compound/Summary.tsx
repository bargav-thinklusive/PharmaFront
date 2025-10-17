import React from 'react'
import { normalizeValue } from '../../utils/utils';

interface SummaryProps {
  drug: any;
  sectionId: number;
}

const Summary: React.FC<SummaryProps> = ({ drug, sectionId }) => {
  return (
    <div className='w-full bg-white/90 px-4 sm:px-0'>
      <div className='max-w-3xl pt-6'>
        <div className='text-xs text-black mb-2'>COMPOUND SUMMARY</div>
        <h1
          id={`section-${sectionId}`}
          className='text-2xl sm:text-3xl font-bold text-black mb-4 cursor-pointer pl-1 py-1 text-left'
        >
          {sectionId}. Title and Summary
        </h1>
        <div className={`text-lg sm:text-xl font-semibold text-black mb-2 ${drug.marketInformation?.brandName && normalizeValue(drug.marketInformation.brandName) === "No data available" ? "text-gray-500 italic" : ""}`}>
          {drug.marketInformation?.brandName ? normalizeValue(drug.marketInformation.brandName) : "N/A"}
        </div>
      </div>

      <div className='border-2 border-sky-400 rounded bg-white max-w-3xl overflow-x-auto'>
        <table className='w-full text-sm text-black min-w-[600px]'>
          <tbody>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-32 sm:w-56 p-3 text-black font-semibold'>CID</td>
              <td className="p-3">
                <span className={`text-sm sm:text-base font-semibold text-black ${drug.cid && normalizeValue(drug.cid) === "No data available" ? "text-gray-500 italic" : ""}`}>{drug.cid ? normalizeValue(drug.cid) : "N/A"}</span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-32 sm:w-56 p-3 text-black font-semibold'>Structure</td>
              <td className='p-3'>
                {drug.drugSubstance?.physicalAndChemicalProperties?.chemicalStructure ? (
                  <img
                    src={drug.drugSubstance.physicalAndChemicalProperties.chemicalStructure}
                    alt={drug.marketInformation?.brandName || "structure"}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-contain border my-2 cursor-pointer hover:shadow-lg"
                  />
                ) : "N/A"}
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-32 sm:w-56 p-3 text-black font-semibold'>Chemical Formula</td>
              <td className="p-3">
                <span className={`text-sm sm:text-base text-black ${drug.drugSubstance?.physicalAndChemicalProperties?.elementalFormula && normalizeValue(drug.drugSubstance.physicalAndChemicalProperties.elementalFormula) === "No data available" ? "text-gray-500 italic" : ""}`}>
                  {drug.drugSubstance?.physicalAndChemicalProperties?.elementalFormula ? normalizeValue(drug.drugSubstance.physicalAndChemicalProperties.elementalFormula) : "N/A"}
                </span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-32 sm:w-56 p-3 text-black font-semibold'>Synonyms</td>
              <td className="p-3">
                <span className="text-sm sm:text-base text-black">
                  {[
                    drug.marketInformation?.brandName ? normalizeValue(drug.marketInformation.brandName) : "",
                    drug.drugSubstance?.physicalAndChemicalProperties?.structureName ? normalizeValue(drug.drugSubstance.physicalAndChemicalProperties.structureName) : ""
                  ].filter(Boolean).join(", ") || "N/A"}
                </span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-32 sm:w-56 p-3 text-black font-semibold'>Molecular Weight</td>
              <td className="p-3">
                <span className={`text-sm sm:text-base text-black ${drug.drugSubstance?.physicalAndChemicalProperties?.molecularWeight && normalizeValue(drug.drugSubstance.physicalAndChemicalProperties.molecularWeight) === "No data available" ? "text-gray-500 italic" : ""}`}>
                  {drug.drugSubstance?.physicalAndChemicalProperties?.molecularWeight ? normalizeValue(drug.drugSubstance.physicalAndChemicalProperties.molecularWeight) : "N/A"}
                </span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-32 sm:w-56 p-3 text-black font-semibold'>Structure Name</td>
              <td className="p-3">
                <span className={`text-sm sm:text-base text-black ${drug.drugSubstance?.physicalAndChemicalProperties?.structureName && normalizeValue(drug.drugSubstance.physicalAndChemicalProperties.structureName) === "No data available" ? "text-gray-500 italic" : ""}`}>
                  {drug.drugSubstance?.physicalAndChemicalProperties?.structureName ? normalizeValue(drug.drugSubstance.physicalAndChemicalProperties.structureName) : "N/A"}
                </span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-32 sm:w-56 p-3 text-black font-semibold'>Dates</td>
              <td className="p-3">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                  <div>
                    <div className="text-xs font-semibold text-black">Approved:</div>
                    <div className={`text-xs text-black ${drug.marketInformation?.approvedDate && normalizeValue(drug.marketInformation.approvedDate) === "No data available" ? "text-gray-500 italic" : ""}`}>
                      {drug.marketInformation?.approvedDate ? normalizeValue(drug.marketInformation.approvedDate) : "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-black">Generic Approved:</div>
                    <div className={`text-xs text-black ${drug.marketInformation?.genericApprovedDate && normalizeValue(drug.marketInformation.genericApprovedDate) === "No data available" ? "text-gray-500 italic" : ""}`}>
                      {drug.marketInformation?.genericApprovedDate ? normalizeValue(drug.marketInformation.genericApprovedDate) : "N/A"}
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
