// import React from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { drugData } from '../../sampleData/data';


// const ResultList: React.FC = () => {
//   const { ccategory, searchtext } = useParams();
//   const navigate = useNavigate();


//   // Use drugData as the data source
//   let categoryArr: any[] = drugData;


//   // Remove duplicates by cid
//   const uniqueCategoryArr = Array.isArray(categoryArr)
//     ? categoryArr.filter((item, idx, arr) =>
//         arr.findIndex((i) => i.cid === item.cid) === idx
//       )
//     : [];

//   // Helper to extract all searchable fields from a record
//   function getAllSearchableStrings(item: any): string[] {
//     const arr: string[] = [];
//     if (item?.marketInformation?.brandName) arr.push(item.marketInformation.brandName);
//     if (item?.marketInformation?.genericName) arr.push(item.marketInformation.genericName);
//     if (item?.drugSubstance?.physicalAndChemicalProperties?.chemicalName) arr.push(item.drugSubstance.physicalAndChemicalProperties.chemicalName);
//     if (item?.drugSubstance?.physicalAndChemicalProperties?.structureName) arr.push(item.drugSubstance.physicalAndChemicalProperties.structureName);
//     if (item?.cid) arr.push(item.cid);
//     return arr;
//   }

//   // Robust filter: match searchtext against any searchable field
//   const results = uniqueCategoryArr.filter((item: any) => {
//     const search = (searchtext || '').toLowerCase();
//     return getAllSearchableStrings(item).some(str => str.toLowerCase().includes(search));
//   });


//   return (
//     <div className="w-full min-h-[60vh] flex flex-col items-center bg-white/80 py-8">
//       <div className="w-full max-w-5xl ">
//         {/* Filters, sort, etc. can be added here */}
//         <div className="flex items-center gap-8 border-b pb-2 mb-4">
//           <span className="font-bold text-blue-900 text-lg">{results.length} results</span>
//           <button className="ml-auto px-4 py-1 rounded bg-gray-100 border text-gray-700">Filters</button>
//           <select className="px-2 py-1 border rounded bg-white text-gray-700">
//             <option>Sort by Relevance</option>
//             <option>Sort by Date</option>
//           </select>
//         </div>

//         <div className="space-y-6 w-full md:w-2/3">
//           {results.map((compound: any) => {
//             const cid = compound.cid;
//             // Helper to get synonyms
//             // function getSynonyms(item: any) {
//             //   const names = [];
//             //   if (item?.marketInformation?.brandName) names.push(item.marketInformation.brandName);
//             //   if (item?.marketInformation?.genericName) names.push(item.marketInformation.genericName);
//             //   if (item?.drugSubstance?.physicalAndChemicalProperties?.chemicalName) names.push(item.drugSubstance.physicalAndChemicalProperties.chemicalName);
//             //   if (item?.drugSubstance?.physicalAndChemicalProperties?.structureName) names.push(item.drugSubstance.physicalAndChemicalProperties.structureName);
//             //   return names;
//             // }
//             const handleNaviageToParticularItem = (cid: string) => {
//               if (ccategory && cid) {
//                 navigate(`/${ccategory}/${searchtext}/${cid}`);
//               }
//             }
//             const brandName = compound.marketInformation?.brandName || '';
//             const genericName = compound.marketInformation?.genericName || '';
//             const chemicalName = compound.drugSubstance?.physicalAndChemicalProperties?.chemicalName || '';
//             const structureName = compound.drugSubstance?.physicalAndChemicalProperties?.structureName || '';
//             const elementalFormula = compound.drugSubstance?.physicalAndChemicalProperties?.elementalFormula || '';
//             const molecularWeight = compound.drugSubstance?.physicalAndChemicalProperties?.molecularWeight || '';
//             const approvedDate = compound.marketInformation?.approvedDate || '';
//             const chemicalStructure = compound.drugSubstance?.physicalAndChemicalProperties?.chemicalStructure || {};
//             //const synonyms = getSynonyms(compound);
//             //const synonymsText = synonyms.join('; ');

//             return (
//               <div
//                 key={cid}
//                 className="flex flex-col md:flex-row border p-4 rounded shadow mb-4 bg-white w-[1000px] overflow-x-auto"

//               >
//                 <div className="mr-6 flex flex-col items-start min-w-[220px] max-w-[400px]">
//                   <img
//                     src={chemicalStructure}
//                     alt={`Chemical structure of ${chemicalName || brandName || genericName || cid}`}
//                     className="h-48 w-full max-w-[380px] object-contain"

//                   />
//                 </div>
//                 <div className="flex flex-col space-y-2 text-left min-w-0 break-words w-full justify-start">
//                   {/* {synonymsText && (
//                     <p
//                       className="text-md text-blue-600 font-semibold cursor-pointer hover:underline"
//                       onClick={() => handleNaviageToParticularItem(cid)}
//                     >
//                       {synonymsText}
//                     </p>
//                   )} */}
//                   <p className="text-md text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => handleNaviageToParticularItem(cid)}><strong>{brandName}</strong> </p>
//                   <p className="text-gray-800"><strong>Drug CID:</strong> <span className="text-black">{cid}</span></p>
//                   <p className="text-gray-800"><strong>Brand Name:</strong> <span className="text-black">{brandName}</span></p>
//                   <p className="text-gray-800"><strong>Generic Name:</strong> <span className="text-black">{genericName}</span></p>
//                   <p className="text-gray-800"><strong>Chemical Name:</strong> <span className="text-black">{chemicalName}</span></p>
//                   <p className="text-gray-800"><strong>Elemental Formula:</strong> <span className="text-black">{elementalFormula}</span></p>
//                   <p className="text-gray-800"><strong>Molecular Weight:</strong> <span className="text-black">{molecularWeight} g/mol</span></p>
//                   <p className="text-gray-800"><strong>Structure Name:</strong> <span className="text-black">{structureName}</span></p>
//                   <p className="text-gray-800"><strong>Approved Date:</strong> <span className="text-black">{approvedDate}</span></p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultList;



import React, { useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { AgGridReact } from 'ag-grid-react';
import { columns } from './columns';
import type { GridApi, GridReadyEvent } from 'ag-grid-community';
import { CellStyleModule, ClientSideRowModelModule, ModuleRegistry, NumberFilterModule, RowAutoHeightModule, TextFilterModule, ValidationModule, } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import '../../components/AgGridHeaderStyle/AgGridHeaderStyle.css';
import './ResultList.css';
import { ColumnsToolPanelModule, ExcelExportModule } from 'ag-grid-enterprise';


// Register AG Grid modules
ModuleRegistry.registerModules([ColumnsToolPanelModule, ExcelExportModule, ClientSideRowModelModule, NumberFilterModule,
  TextFilterModule, ValidationModule,  RowAutoHeightModule,CellStyleModule,]);



const pageSize = 20; // Number of rows per page
const ResultList: React.FC = () => {
  const { searchtext } = useParams();
  const gridRef = useRef<AgGridReact<any>>(null);
  const { drugsData } = useUser();

  // Use API data only
  let categoryArr: any[] = drugsData;


  // Remove duplicates by cid
  const uniqueCategoryArr = Array.isArray(categoryArr)
    ? categoryArr.filter((item, idx, arr) =>
      arr.findIndex((i) => i.cid === item.cid) === idx
    )
    : [];

  // Helper to extract all searchable fields from a record
  function getAllSearchableStrings(item: any): string[] {
    const arr: string[] = [];
    if (item?.marketInformation?.brandName) arr.push(item.marketInformation.brandName);
    if (item?.marketInformation?.genericName) arr.push(item.marketInformation.genericName);
    if (item?.drugSubstance?.physicalAndChemicalProperties?.chemicalName) arr.push(item.drugSubstance.physicalAndChemicalProperties.chemicalName);
    if (item?.drugSubstance?.physicalAndChemicalProperties?.structureName) arr.push(item.drugSubstance.physicalAndChemicalProperties.structureName);
    if (item?.cid) arr.push(item.cid);
    return arr;
  }

  // Robust filter: match searchtext against any searchable field
  let results;
  if (searchtext && searchtext.trim()) {
    results = uniqueCategoryArr.filter((item: any) => {
      const search = (searchtext || '').toLowerCase();
      return getAllSearchableStrings(item).some(str => str.toLowerCase().includes(search));
    });
  } else {
    results = uniqueCategoryArr.slice(0, 10); // Show first 10 items if no search
  }


  const onGridReady = useCallback((params: GridReadyEvent): void => {
    const api: GridApi = params.api;
    api.resetRowHeights();
    api.hideOverlay();
  }, []);

  const onClickExport = useCallback(() => {
    if (gridRef.current) {
      gridRef.current.api.exportDataAsExcel();
    }
  }, []);


  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center bg-white/80 py-8">
      <div className="w-full max-w-5xl ">

        {/* Filters, sort, etc. can be added here */}
        <div className="flex justify-between items-center gap-8 border-b pb-2 mb-4">
          <span className="font-bold text-blue-900 text-lg">{results.length} results</span>
          <button onClick={onClickExport} className='bg-blue-500 text-white p-1 rounded'>Export </button>
        </div>

        <div className="test-container">
          <div
            className="ag-theme-quartz"
            style={{ height: "calc(100vh - 165px)" }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={results}
              columnDefs={columns}
              onGridReady={onGridReady}
              sideBar={{
                toolPanels: ["columns"],
              }}
              pagination={true}
              paginationPageSize={pageSize}
              reactiveCustomComponents={true}
              loadingOverlayComponent={() => <div>Loading...</div>}
              defaultColDef={{
                filter: true, 
              }}
              rowSelection="single"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultList;

//https://www.ag-grid.com/react-data-grid/modules/