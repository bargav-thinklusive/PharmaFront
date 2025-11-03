import type { GridApi, GridReadyEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react'
import { useCallback, useRef } from 'react'
import { columns } from './columns';
import { CellStyleModule, ClientSideRowModelModule, ModuleRegistry, NumberFilterModule, PaginationModule, RowAutoHeightModule, RowSelectionModule, TextFilterModule, ValidationModule, } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import '../../components/AgGridHeaderStyle/AgGridHeaderStyle.css';
import { ColumnsToolPanelModule, ExcelExportModule, ServerSideRowModelApiModule } from 'ag-grid-enterprise';
import Loader from '../Loader';

// Register AG Grid modules
ModuleRegistry.registerModules([ColumnsToolPanelModule, ExcelExportModule, ClientSideRowModelModule, NumberFilterModule,
  TextFilterModule, ValidationModule, RowAutoHeightModule, CellStyleModule, ServerSideRowModelApiModule, PaginationModule, RowSelectionModule]);


const pageSize = 20; // Number of rows per page

const DrugsList = () => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const onGridReady = useCallback((params: GridReadyEvent): void => {
    const api: GridApi = params.api;
    api.hideOverlay();
  }, []);
  return (
    <div className=" bg-white/80 py-8">

      <div className="test-container">
        <div
          className="ag-theme-quartz"
          style={{ height: "calc(100vh - 165px)" }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={[]}
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
