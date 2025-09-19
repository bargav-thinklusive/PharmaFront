// import type { FC } from 'react';
// import { useNavigate } from 'react-router-dom';

// const mockData = {
//   title: 'Dolo visano',
//   cid: '5492506',
//   structureImg: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=5492506&t=l',
//   formula: 'C24H36ClN3O9P',
//   synonyms: [
//     'Dolo visano',
//     '76404-04-1',
//     'Morphinan-6-ol, 7,8-didehydro-4,5-epoxy-3-methoxy-17-methyl-, (5alpha,6alpha)-, phosphate (1:1) (salt), mixt. with 4-(dimethylamino)-1,2-dihydro-1,5-dimethyl-2-phenyl-3H-pyrazol-3-one, 2-(diphenylmethoxy)-N,N-dimethylethanamine hydrochloride, 2-methyl-2-propyl-1,3-propanediol dicarbamate and 3-pyridinecarboxylic acid',
//   ],
//   weight: '1261.8 g/mol',
//   weightNote: 'Computed by PubChem 2.2 (PubChem release 2025.04.14)',
//   components: [
//     { cid: '6009', name: 'Aminopyrine', img: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=6009&t=s' },
//     { cid: '5284371', name: 'Codeine', img: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=5284371&t=s' },
//     { cid: '4064', name: 'Meprobamate', img: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=4064&t=s' },
//     { cid: '3100', name: 'Diphenhydramine', img: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=3100&t=s' },
//     { cid: '938', name: 'Nicotinic Acid', img: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=938&t=s' },
//   ],
//   dates: { create: '2005-08-09', modify: '2025-09-07' },
// };


// interface CompoundSummaryProps {
//   record?: any;
//   activeId?: string;
// }

// const CompoundSummary: FC<CompoundSummaryProps> = ({ record,  }) => {
//   const navigate = useNavigate();

//   // Use record if provided, otherwise fallback to mockData
//   const data = record
//     ? {
//         title: record.RecordTitle || mockData.title,
//         cid: record.RecordNumber || mockData.cid,
//         structureImg: record.StructureImg || mockData.structureImg,
//         formula: record.MolecularFormula || mockData.formula,
//         synonyms: record.Synonyms || mockData.synonyms,
//         weight: record.MolecularWeight || mockData.weight,
//         weightNote: record.WeightNote || mockData.weightNote,
//         components: record.ComponentCompounds || mockData.components,
//         dates: record.Dates || mockData.dates,
//       }
//     : mockData;

//   const handleNavigateHome = () => {
//     navigate('/');
//   };

//   return (
//     <div className="w-full bg-white/90">
//       <div className="max-w-3xl mx-auto pt-6">
//         <div className="text-xs text-black mb-2">COMPOUND SUMMARY</div>
//         <div className={`border-b-4 border-blue-300 flex items-center mb-2`}>
//           <h1
//             className="text-3xl font-bold text-black mb-0 cursor-pointer pl-1 py-1"
//             onClick={handleNavigateHome}
//             title="Go to Home"
//           >
//             {data.title}
//           </h1>
//         </div>
//         <div className="border-2 border-sky-400 rounded bg-white">
//           <table className="w-full text-sm text-black">
//             <tbody>
//               <tr className="align-top border-b border-blue-100">
//                 <td className="w-56 p-3 text-black font-semibold">ChemBank CID</td>
//                 <td className="p-3">
//                   <span className="text-base font-semibold text-black">{data.cid}</span>
//                 </td>
//               </tr>
//               <tr className="align-top border-b border-blue-100">
//                 <td className="w-56 p-3 text-black font-semibold">Structure</td>
//                 <td className="p-3">
//                   <img
//                     src={data.structureImg}
//                     alt="structure"
//                     className="w-32 h-32 object-contain border mx-0 my-2 cursor-pointer hover:shadow-lg"
//                     onClick={handleNavigateHome}
//                     title="Go to Home"
//                   />
//                 </td>
//               </tr>
//               <tr className="align-top border-b border-blue-100">
//                 <td className="w-56 p-3 text-black font-semibold">Molecular Formula</td>
//                 <td className="p-3">
//                   <span className="underline cursor-pointer text-black">{data.formula}</span>
//                 </td>
//               </tr>
//               <tr className="align-top border-b border-blue-100">
//                 <td className="w-56 p-3 text-black font-semibold">Synonyms</td>
//                 <td className="p-3">
//                   <div className="text-black text-sm whitespace-pre-line">{Array.isArray(data.synonyms) ? data.synonyms.join('\n') : data.synonyms}</div>
//                 </td>
//               </tr>
//               <tr className="align-top border-b border-blue-100">
//                 <td className="w-56 p-3 text-black font-semibold">Molecular Weight</td>
//                 <td className="p-3">
//                   <span className="text-black">{data.weight}</span>
//                   <div className="text-xs text-black italic">{data.weightNote}</div>
//                 </td>
//               </tr>
//               <tr className="align-top border-b border-blue-100">
//                 <td className="w-56 p-3 text-black font-semibold">Component Compounds</td>
//                 <td className="p-3">
//                   <table className="w-full">
//                     <tbody>
//                       {Array.isArray(data.components) && data.components.map((c: any) => (
//                         <tr key={c.cid} className="align-top">
//                           <td className="w-12 p-1"><img src={c.img} alt={c.name} className="w-8 h-8 object-contain" /></td>
//                           <td className="p-1">
//                             <a href={`https://pubchem.ncbi.nlm.nih.gov/compound/${c.cid}`} target="_blank" rel="noopener noreferrer" className="underline font-semibold text-black">CID {c.cid}</a> <span className="text-xs text-black">({c.name})</span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                   <button className="text-xs text-black mt-1 hover:underline">View More...</button>
//                 </td>
//               </tr>
//               <tr className="align-top">
//                 <td className="w-56 p-3 text-black font-semibold">Dates</td>
//                 <td className="p-3">
//                   <div className="flex gap-8">
//                     <div>
//                       <div className="text-xs text-black">Create:</div>
//                       <div className="text-xs text-black">{data.dates?.create}</div>
//                     </div>
//                     <div>
//                       <div className="text-xs text-black">Modify:</div>
//                       <div className="text-xs text-black">{data.dates?.modify}</div>
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompoundSummary;



import React from 'react'

interface CompoundSummaryProps {
  item?: any;
  cid: string | undefined;
}

const CompoundSummary: React.FC<CompoundSummaryProps> = ({ item, cid }) => {


  return (
    <div className='w-full bg-white/90'>
      <div className='max-w-3xl mx-auto pt-6'>
        <div className='text-xs text-black mb-2'>COMPOUND SUMMARY</div>
        <h1 className='text-3xl font-bold text-black mb-0 cursor-pointer pl-1 py-1'>
          {item.MarketInformation.BrandName || ""}
        </h1>
      </div>
      <div className='border-2 border-sky-400 rounded bg-white'>
        <table className='w-full text-sm text-black'>
          <tbody>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold'>CID</td>
              <td className="p-3">
                <span className="text-base font-semibold text-black">{cid}</span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold'>Structure</td>
              <td className='p-3'>
                <img
                  src={item.DrugSubstance?.PhysicalAndChemicalProperties?.ChemicalStructure}
                  alt={item.MarketInformation.BrandName || "structure"}
                  className="w-32 h-32 object-contain border mx-0 my-2 cursor-pointer hover:shadow-lg"

                />
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold'>Chemical Formula</td>
              <td className="p-3">
                <span className="text-base  text-black">{item.DrugSubstance?.PhysicalAndChemicalProperties?.ElementalFormula}</span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold'>Synonyms</td>
              <td className="p-3">
                <span className="text-base  text-black">{item.MarketInformation.BrandName},{item.DrugSubstance?.PhysicalAndChemicalProperties?.IUPACName}</span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold'>Molecular Weight</td>
              <td className="p-3">
                <span className="text-base text-black">{item.DrugSubstance?.PhysicalAndChemicalProperties?.MolecularWeight}</span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold'>IUPAC Name</td>
              <td className="p-3">
                <span className="text-base  text-black">{item.DrugSubstance?.PhysicalAndChemicalProperties?.IUPACName}</span>
              </td>
            </tr>
            <tr className='align-top border-b border-blue-100'>
              <td className='w-56 p-3 text-black font-semibold'>Dates</td>
              <td className="p-3">
                <div className="flex gap-8">
                  <div>
                    <div className="text-xs font-semibold stext-black">Approved :</div>
                    <div className="text-xs text-black">{item.MarketInformation?.ApprovedDate}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-black">Generic Approved:</div>
                    <div className="text-xs text-black">{item.MarketInformation?.GenericApprovedDate}</div>
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

export default CompoundSummary
