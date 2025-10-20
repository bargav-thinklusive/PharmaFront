import React, { useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { AgGridReact } from 'ag-grid-react';
import { columns } from './columns';
import type { GridApi, GridReadyEvent } from 'ag-grid-community';
import { CellStyleModule, ClientSideRowModelModule, ModuleRegistry, NumberFilterModule, PaginationModule, RowAutoHeightModule, RowSelectionModule, TextFilterModule, ValidationModule, } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import '../../components/AgGridHeaderStyle/AgGridHeaderStyle.css';
import './ResultList.css';
import { ColumnsToolPanelModule, ExcelExportModule, ServerSideRowModelApiModule } from 'ag-grid-enterprise';
import { drugData } from '../../sampleData/data';
import { BiBell } from 'react-icons/bi';
import { MdHistory } from 'react-icons/md';


// Register AG Grid modules
ModuleRegistry.registerModules([ColumnsToolPanelModule, ExcelExportModule, ClientSideRowModelModule, NumberFilterModule,
  TextFilterModule, ValidationModule,  RowAutoHeightModule,CellStyleModule,PaginationModule,RowSelectionModule,ServerSideRowModelApiModule]);



const pageSize = 20; // Number of rows per page
const ResultList: React.FC = () => {
  const { searchtext } = useParams();
  const gridRef = useRef<AgGridReact<any>>(null);
  const { drugsData } = useUser();

  // Use API data only
  let categoryArr: any[] = drugData;


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
      return getAllSearchableStrings(item).some(str =>
  String(str || "").toLowerCase().includes(search)
);

    });
  } else {
    results = uniqueCategoryArr.slice(0, 10); // Show first 10 items if no search
  }


  const onGridReady = useCallback((params: GridReadyEvent): void => {
    const api: GridApi = params.api;
    //api.resetRowHeights();
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
          <div className='flex justify-between items-center gap-2'>
            <button><BiBell size={25} /></button>
            <button><MdHistory size={25} /></button>
            <button onClick={onClickExport} className='bg-blue-500 text-white p-1 rounded'>Export </button>
          </div>
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