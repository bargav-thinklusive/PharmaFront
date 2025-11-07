import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';

import type { GridApi, GridReadyEvent } from 'ag-grid-community';
import { CellStyleModule, ClientSideRowModelModule, ModuleRegistry, NumberFilterModule, PaginationModule, RowAutoHeightModule, RowSelectionModule, TextFilterModule, ValidationModule, } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import '../../components/AgGridHeaderStyle/AgGridHeaderStyle.css';
import '../Results/ResultList.css';
import { ColumnsToolPanelModule, ExcelExportModule, ServerSideRowModelApiModule } from 'ag-grid-enterprise';
import Loader from '../Loader';
import useGet from '../../hooks/useGet';
import BookMarkService from '../../services/BookmarkService';
import { columns } from './columns';


// Register AG Grid modules
ModuleRegistry.registerModules([ColumnsToolPanelModule, ExcelExportModule, ClientSideRowModelModule, NumberFilterModule,
  TextFilterModule, ValidationModule, RowAutoHeightModule, CellStyleModule, ServerSideRowModelApiModule, PaginationModule, RowSelectionModule]);


const bookMarkService = new BookMarkService();
const pageSize = 20; // Number of rows per page
const Bookmark: React.FC = () => {

  const gridRef = useRef<AgGridReact<any>>(null);

  const { fetchData, data } = useGet()

  // Memoize row data to avoid re-creating array references on each render
  // Handle both direct drug data and nested bookmark.drug structure
  const rowData = useMemo(() => {
    const bookmarks = data?.data ?? [];
    return bookmarks.map((bookmark: any) => {
      // If bookmark has nested drug property, flatten it
      if (bookmark.drug) {
        return { ...bookmark.drug, _id: bookmark._id || bookmark.drug._id };
      }
      // Otherwise return as is (direct drug data)
      return bookmark;
    });
  }, [data]);

  const getBookmarks = async () => {
    await fetchData(bookMarkService.getBookmarks())
  }

  useEffect(() => {
    getBookmarks()
  }, [])


  const onGridReady = useCallback((params: GridReadyEvent): void => {
    const api: GridApi = params.api;
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
          <span className="font-bold text-blue-900 text-lg">{data?.data.length} results</span>
          <div className='flex justify-between items-center gap-2'>
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
              rowData={rowData}
              columnDefs={columns}
              getRowId={(params) =>
                String(
                  params.data?._id ?? (params.data?.cid ? `${params.data.cid}-${params.data?.version ?? ''}` : '')
                )
              }
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
    </div>
  );
};

export default Bookmark;

