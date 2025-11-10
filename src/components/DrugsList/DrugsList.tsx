import type { GridApi, GridReadyEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react'
import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { columns } from './columns';
import { CellStyleModule, ClientSideRowModelModule, ModuleRegistry, NumberFilterModule, PaginationModule, RowAutoHeightModule, RowSelectionModule, TextFilterModule, ValidationModule, } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import '../../components/AgGridHeaderStyle/AgGridHeaderStyle.css';
import { ColumnsToolPanelModule, ExcelExportModule, ServerSideRowModelApiModule } from 'ag-grid-enterprise';
import Loader from '../Loader';
import { sampleRawData } from '../../sampleData/data';

// Register AG Grid modules
ModuleRegistry.registerModules([ColumnsToolPanelModule, ExcelExportModule, ClientSideRowModelModule, NumberFilterModule,
  TextFilterModule, ValidationModule, RowAutoHeightModule, CellStyleModule, ServerSideRowModelApiModule, PaginationModule, RowSelectionModule]);


const pageSize = 20; // Number of rows per page

const DrugsList = () => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const navigate = useNavigate();

  const onGridReady = useCallback((params: GridReadyEvent): void => {
    const api: GridApi = params.api;
    api.hideOverlay();
  }, []);

  const handleAddDrug = () => {
    navigate('/add-drug');
  };
  return (
    <div className=" bg-white/80 py-8">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-2xl font-bold text-gray-800">Drugs List</h2>
        <button
          onClick={handleAddDrug}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add New Drug
        </button>
      </div>

      <div className="test-container">
        <div
          className="ag-theme-quartz"
          style={{ height: "calc(100vh - 165px)" }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={sampleRawData}
            columnDefs={columns}
            onGridReady={onGridReady}
            sideBar={{
              toolPanels: ["columns"],
            }}
            pagination={true}
            paginationPageSize={pageSize}
            loadingOverlayComponent={() => <div><Loader /></div>}
            defaultColDef={{
              filter: true,
            }}
            rowSelection="single"
          />
        </div>
      </div>
    </div>
  )
}

export default DrugsList
