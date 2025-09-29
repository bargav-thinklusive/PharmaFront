// // import React from 'react'

// // interface SummaryProps{
// //     drug:any;
// // }

// // const Summary :React.FC<SummaryProps>= ({drug}) => {
    
// //    return (
// //     <div className='w-full bg-white/90'>
// //       <div className='max-w-3xl mx-auto pt-6'>
// //         <div className='text-xs text-black mb-2'>COMPOUND SUMMARY</div>
// //         <h1 className='text-3xl font-bold text-black mb-0 cursor-pointer pl-1 py-1'>
// //           {drug.marketInformation.brandName || ""}
// //         </h1>
// //       </div>
// //       <div className='border-2 border-sky-400 rounded bg-white'>
// //         <table className='w-full text-sm text-black'>
// //           <tbody>
// //             <tr className='align-top border-b border-blue-100'>
// //               <td className='w-56 p-3 text-black font-semibold'>CID</td>
// //               <td className="p-3">
// //                 <span className="text-base font-semibold text-black">{drug.cid}</span>
// //               </td>
// //             </tr>
// //             <tr className='align-top border-b border-blue-100'>
// //               <td className='w-56 p-3 text-black font-semibold'>Structure</td>
// //               <td className='p-3'>
// //                 <img
// //                   src={drug.drugSubstance?.physicalAndChemicalProperties?.chemicalStructure}
// //                   alt={drug.marketInformation.brandName || "structure"}
// //                   className="w-32 h-32 object-contain border mx-0 my-2 cursor-pointer hover:shadow-lg"

// //                 />
// //               </td>
// //             </tr>
// //             <tr className='align-top border-b border-blue-100'>
// //               <td className='w-56 p-3 text-black font-semibold'>Chemical Formula</td>
// //               <td className="p-3">
// //                 <span className="text-base  text-black">{drug.drugSubstance?.physicalAndChemicalProperties?.elementalFormula}</span>
// //               </td>
// //             </tr>
// //             <tr className='align-top border-b border-blue-100'>
// //               <td className='w-56 p-3 text-black font-semibold'>Synonyms</td>
// //               <td className="p-3">
// //                 <span className="text-base  text-black">{drug.marketInformation.brandName},{drug.drugSubstance?.physicalAndChemicalProperties?.structureName}</span>
// //               </td>
// //             </tr>
// //             <tr className='align-top border-b border-blue-100'>
// //               <td className='w-56 p-3 text-black font-semibold'>Molecular Weight</td>
// //               <td className="p-3">
// //                 <span className="text-base text-black">{drug.drugSubstance?.physicalAndChemicalProperties?.molecularWeight}</span>
// //               </td>
// //             </tr>
// //             <tr className='align-top border-b border-blue-100'>
// //               <td className='w-56 p-3 text-black font-semibold'>IUPAC Name</td>
// //               <td className="p-3">
// //                 <span className="text-base  text-black">{drug.drugSubstance?.physicalAndChemicalProperties?.structureName}</span>
// //               </td>
// //             </tr>
// //             <tr className='align-top border-b border-blue-100'>
// //               <td className='w-56 p-3 text-black font-semibold'>Dates</td>
// //               <td className="p-3">
// //                 <div className="flex gap-8">
// //                   <div>
// //                     <div className="text-xs font-semibold stext-black">Approved :</div>
// //                     <div className="text-xs text-black">{drug.marketInformation?.approvedDate}</div>
// //                   </div>
// //                   <div>
// //                     <div className="text-xs font-semibold text-black">Generic Approved:</div>
// //                     <div className="text-xs text-black">{drug.marketInformation?.genericApprovedDate}</div>
// //                   </div>
// //                 </div>
// //               </td>
// //             </tr>
// //           </tbody>
// //         </table>

// //       </div>
// //     </div>
// //   )
// // }


// // export default Summary


// import React from 'react'

// interface SummaryProps {
//   drug: any;
//   index: number;
//   sectionId: number;
// }

// const Summary: React.FC<SummaryProps> = ({ drug, index, sectionId }) => {

//   return (
//     <div className='w-full bg-white/90'>
//       <div className='max-w-3xl pt-6'>
//         <div className='text-xs text-black mb-2'>COMPOUND SUMMARY</div>
//         <h1 id={`section-${sectionId}`} className='text-3xl font-bold text-black mb-4 cursor-pointer pl-1 py-1 text-left'>
//           {drug.marketInformation.brandName || ""}
//         </h1>
//       </div>

//       <div className='border-2 border-sky-400 rounded bg-white max-w-3xl'>
//         <table className='w-full text-sm text-black'>
//           <tbody>
//             <tr className='align-top border-b border-blue-100'>
//               <td className='w-56 p-3 text-black font-semibold'>CID</td>
//               <td className="p-3">
//                 <span className="text-base font-semibold text-black">{drug.cid}</span>
//               </td>
//             </tr>
//             <tr className='align-top border-b border-blue-100'>
//               <td className='w-56 p-3 text-black font-semibold'>Structure</td>
//               <td className='p-3'>
//                 <img
//                   src={drug.drugSubstance?.physicalAndChemicalProperties?.chemicalStructure}
//                   alt={drug.marketInformation.brandName || "structure"}
//                   className="w-32 h-32 object-contain border my-2 cursor-pointer hover:shadow-lg"
//                 />
//               </td>
//             </tr>
//             <tr className='align-top border-b border-blue-100'>
//               <td className='w-56 p-3 text-black font-semibold'>Chemical Formula</td>
//               <td className="p-3">
//                 <span className="text-base text-black">{drug.drugSubstance?.physicalAndChemicalProperties?.elementalFormula}</span>
//               </td>
//             </tr>
//             <tr className='align-top border-b border-blue-100'>
//               <td className='w-56 p-3 text-black font-semibold'>Synonyms</td>
//               <td className="p-3">
//                 <span className="text-base text-black">
//                   {drug.marketInformation.brandName},{drug.drugSubstance?.physicalAndChemicalProperties?.structureName}
//                 </span>
//               </td>
//             </tr>
//             <tr className='align-top border-b border-blue-100'>
//               <td className='w-56 p-3 text-black font-semibold'>Molecular Weight</td>
//               <td className="p-3">
//                 <span className="text-base text-black">{drug.drugSubstance?.physicalAndChemicalProperties?.molecularWeight}</span>
//               </td>
//             </tr>
//             <tr className='align-top border-b border-blue-100'>
//               <td className='w-56 p-3 text-black font-semibold'>Structure Name</td>
//               <td className="p-3">
//                 <span className="text-base text-black">{drug.drugSubstance?.physicalAndChemicalProperties?.structureName}</span>
//               </td>
//             </tr>
//             <tr className='align-top border-b border-blue-100'>
//               <td className='w-56 p-3 text-black font-semibold'>Dates</td>
//               <td className="p-3">
//                 <div className="flex gap-8">
//                   <div>
//                     <div className="text-xs font-semibold text-black">Approved :</div>
//                     <div className="text-xs text-black">{drug.marketInformation?.approvedDate}</div>
//                   </div>
//                   <div>
//                     <div className="text-xs font-semibold text-black">Generic Approved:</div>
//                     <div className="text-xs text-black">{drug.marketInformation?.genericApprovedDate}</div>
//                   </div>
//                 </div>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

// export default Summary



import React from 'react'

interface SummaryProps {
  drug: any;
  sectionId: number;
}

const Summary: React.FC<SummaryProps> = ({ drug, sectionId }) => {
  return (
    <div className='w-full bg-white/90'>
      <div className='max-w-3xl pt-6'>
        <div className='text-xs text-black mb-2'>COMPOUND SUMMARY</div>
        <h1 
          id={`section-${sectionId}`} 
          className='text-3xl font-bold text-black mb-4 cursor-pointer pl-1 py-1 text-left'
        >
          {drug.marketInformation?.brandName || "N/A"}
        </h1>
      </div>

      <div className='border-2 border-sky-400 rounded bg-white max-w-3xl'>
        <table className='w-full text-sm text-black'>
          <tbody>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold'>CID</td>
              <td className="p-3">
                <span className="text-base font-semibold text-black">{drug.cid || "N/A"}</span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold'>Structure</td>
              <td className='p-3'>
                {drug.drugSubstance?.physicalAndChemicalProperties?.chemicalStructure ? (
                  <img
                    src={drug.drugSubstance.physicalAndChemicalProperties.chemicalStructure}
                    alt={drug.marketInformation?.brandName || "structure"}
                    className="w-32 h-32 object-contain border my-2 cursor-pointer hover:shadow-lg"
                  />
                ) : "N/A"}
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold'>Chemical Formula</td>
              <td className="p-3">
                <span className="text-base text-black">
                  {drug.drugSubstance?.physicalAndChemicalProperties?.elementalFormula || "N/A"}
                </span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold'>Synonyms</td>
              <td className="p-3">
                <span className="text-base text-black">
                  {[
                    drug.marketInformation?.brandName,
                    drug.drugSubstance?.physicalAndChemicalProperties?.structureName
                  ].filter(Boolean).join(", ") || "N/A"}
                </span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold'>Molecular Weight</td>
              <td className="p-3">
                <span className="text-base text-black">
                  {drug.drugSubstance?.physicalAndChemicalProperties?.molecularWeight || "N/A"}
                </span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold'>Structure Name</td>
              <td className="p-3">
                <span className="text-base text-black">
                  {drug.drugSubstance?.physicalAndChemicalProperties?.structureName || "N/A"}
                </span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold'>Dates</td>
              <td className="p-3">
                <div className="flex gap-8">
                  <div>
                    <div className="text-xs font-semibold text-black">Approved:</div>
                    <div className="text-xs text-black">
                      {drug.marketInformation?.approvedDate || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-black">Generic Approved:</div>
                    <div className="text-xs text-black">
                      {drug.marketInformation?.genericApprovedDate || "N/A"}
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
