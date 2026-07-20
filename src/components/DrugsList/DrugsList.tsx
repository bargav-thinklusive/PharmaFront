import type { GridApi, GridReadyEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { columns as fdaColumns, cmcintelColumns } from './columns';
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  RowAutoHeightModule,
  RowSelectionModule,
  TextFilterModule,
  ValidationModule,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import '../../components/AgGridHeaderStyle/AgGridHeaderStyle.css';
import '../DrugTable/DrugsTable.css';
import { ColumnsToolPanelModule, ExcelExportModule, ServerSideRowModelApiModule } from 'ag-grid-enterprise';
import Loader from '../Loader';
import { sampleRawData } from '../../sampleData/data';
import { useUser } from '../../context/UserContext';
import useGet from '../../hooks/useGet';
import BookMarkService from '../../services/BookmarkService';


// Register AG Grid modules
ModuleRegistry.registerModules([
  ColumnsToolPanelModule,
  ExcelExportModule,
  ClientSideRowModelModule,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  RowAutoHeightModule,
  CellStyleModule,
  ServerSideRowModelApiModule,
  PaginationModule,
  RowSelectionModule
]);

const pageSize = 20; // Number of rows per page

const DrugsList = () => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const { drugsData, drugsLoading, refetchDrugs, selectedList } = useUser();
  const { fetchData } = useGet();
  const bookMarkService = new BookMarkService();
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // Fetch bookmarks when cmcintel list is active
  const getBookmarks = async () => {
    const response = await fetchData(bookMarkService.getBookmarks());
    if (response?.data) setBookmarks(response.data);
  };

  useEffect(() => {
    if (selectedList === 'cmcintel') {
      getBookmarks();
    }
  }, [selectedList]);

  // Trigger refetch of CMCIntel library list if empty
  useEffect(() => {
    if (selectedList === 'cmcintel' && drugsData.length === 0 && !drugsLoading && refetchDrugs) {
      refetchDrugs();
    }
  }, [selectedList, drugsData.length, drugsLoading, refetchDrugs]);

  const onGridReady = useCallback((params: GridReadyEvent): void => {
    const api: GridApi = params.api;
    api.hideOverlay();
  }, []);

  // Compute bookmarks for drugsData when cmcintel is active
  const cmcintelRowDataWithBookmarks = useMemo(() => {
    if (selectedList !== 'cmcintel') return [];
    return drugsData.map((item: any) => {
      const itemCid = item?.cid;
      const itemVersion = item?.version;
      const itemId = item?._id;
      const isBookmarked = bookmarks.some((bookmark: any) => {
        const bDrugId = bookmark?.drugId || bookmark?.drug?._id || bookmark?._id;
        const bCid = bookmark?.cid || bookmark?.drug?.cid;
        const bVersion = bookmark?.version ?? bookmark?.drug?.version;
        return (
          (itemId && bDrugId && String(bDrugId) === String(itemId)) ||
          (itemCid && bCid && String(bCid) === String(itemCid) && Number(bVersion) === Number(itemVersion))
        );
      });
      return { ...item, isBookmarked };
    });
  }, [selectedList, drugsData, bookmarks]);

  const activeRowData = selectedList === 'cmcintel' ? cmcintelRowDataWithBookmarks : sampleRawData;
  const activeColumnDefs = selectedList === 'cmcintel' ? cmcintelColumns : fdaColumns;

  return (
    <div className="bg-page min-h-screen py-8 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 pt-8">

        <div className="test-container">
          <div
            className="ag-theme-quartz"
            style={{ height: "calc(100vh - 165px)" }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={activeRowData}
              columnDefs={activeColumnDefs}
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
              headerHeight={56}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrugsList;
