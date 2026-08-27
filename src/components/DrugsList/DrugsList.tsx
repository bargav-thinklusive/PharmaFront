import type { GridApi, GridReadyEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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
import { FiBookmark, FiDownload, FiChevronDown } from 'react-icons/fi';
import Loader from '../Loader';
import { sampleRawData } from '../../sampleData/data';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchDrugs, setSelectedList } from '../../store/slices/drugsSlice';
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
  const dispatch = useAppDispatch();
  const { listType } = useParams<{ listType?: string }>();
  const location = useLocation();

  const drugsData = useAppSelector((state) => state.drugs.drugsData);
  const selectedList = useAppSelector((state) => state.drugs.selectedList);

  const path = location.pathname.toLowerCase();
  const effectiveList: 'fda' | 'cmcintel' = (listType === 'cmcintel' || path.endsWith('/cmcintel'))
    ? 'cmcintel'
    : (listType === 'fda' || path.endsWith('/fda'))
      ? 'fda'
      : selectedList;

  // Synchronize URL route with Redux state
  useEffect(() => {
    if (listType === 'cmcintel' || path.endsWith('/cmcintel')) {
      if (selectedList !== 'cmcintel') {
        dispatch(setSelectedList('cmcintel'));
      }
    } else if (listType === 'fda' || path.endsWith('/fda')) {
      if (selectedList !== 'fda') {
        dispatch(setSelectedList('fda'));
      }
    }
  }, [listType, path, selectedList, dispatch]);

  const refetchDrugs = useCallback(() => {
    dispatch(fetchDrugs());
  }, [dispatch]);
  const { fetchData } = useGet();
  const bookMarkService = new BookMarkService();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);

  // Export to Excel handler
  const onClickExport = useCallback(() => {
    if (gridRef.current) gridRef.current.api.exportDataAsExcel();
  }, []);

  // Fetch bookmarks when cmcintel list is active
  const getBookmarks = async () => {
    try {
      const response = await fetchData(bookMarkService.getBookmarks());
      if (response?.data) setBookmarks(response.data);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    }
  };

  useEffect(() => {
    if (effectiveList === 'cmcintel') {
      refetchDrugs();
    }
  }, [effectiveList, refetchDrugs]);

  useEffect(() => {
    if (showBookmarksOnly && bookmarks.length === 0) {
      getBookmarks();
    }
  }, [showBookmarksOnly, bookmarks.length]);

  const onGridReady = useCallback((params: GridReadyEvent): void => {
    const api: GridApi = params.api;
    api.hideOverlay();
  }, []);

  // Compute bookmarks for drugsData when cmcintel is active
  const cmcintelRowDataWithBookmarks = useMemo(() => {
    if (effectiveList !== 'cmcintel') return [];
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
  }, [effectiveList, drugsData, bookmarks]);

  const bookmarkedCount = useMemo(() => {
    return cmcintelRowDataWithBookmarks.filter((item: any) => item.isBookmarked).length;
  }, [cmcintelRowDataWithBookmarks]);

  const displayRowData = useMemo(() => {
    if (effectiveList !== 'cmcintel') return sampleRawData;
    if (showBookmarksOnly) {
      return cmcintelRowDataWithBookmarks.filter((item: any) => item.isBookmarked);
    }
    return cmcintelRowDataWithBookmarks;
  }, [effectiveList, cmcintelRowDataWithBookmarks, showBookmarksOnly]);

  const activeColumnDefs = effectiveList === 'cmcintel' ? cmcintelColumns : fdaColumns;

  return (
    <div className="bg-page min-h-screen py-8 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 pt-4">

        {/* ── Page Header & Top Right Action Buttons ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[28px] font-bold text-gray-900 leading-tight">
              {showBookmarksOnly ? (
                <>
                  My <span className="text-[#0E8A67]">Bookmarked</span> Compounds
                </>
              ) : effectiveList === 'cmcintel' ? (
                'cmcintel Library List'
              ) : (
                'FDA Approved List'
              )}
            </h2>
            <p className="text-[13.5px] text-gray-500 mt-1 font-medium">
              Showing {displayRowData.length} {displayRowData.length === 1 ? 'compound' : 'compounds'} {showBookmarksOnly ? 'bookmarked' : ''}
            </p>
          </div>
          
          {/* Top Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBookmarksOnly((prev) => !prev)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-[13.5px] transition-all shadow-sm cursor-pointer border ${
                showBookmarksOnly
                  ? "bg-[#0E8A67] text-white border-[#0E8A67] shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              title={showBookmarksOnly ? "Show All Compounds" : "Show Bookmarks Only"}
            >
              <FiBookmark className={`w-4 h-4 ${showBookmarksOnly ? "fill-white text-white" : "text-gray-500"}`} />
              <span>{showBookmarksOnly ? "Showing Bookmarks" : "Bookmarks"}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                showBookmarksOnly ? "bg-white/25 text-white" : "bg-emerald-50 text-[#0E8A67] border border-emerald-200"
              }`}>
                {bookmarkedCount}
              </span>
            </button>

            <button
              onClick={onClickExport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E8A67] hover:bg-[#0A7557] text-white text-[13.5px] font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer border-0"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export</span>
              <FiChevronDown className="w-3.5 h-3.5 text-white/80" />
            </button>
          </div>
        </div>

        {/* ── Bookmarks Empty State Notice ── */}
        {showBookmarksOnly && displayRowData.length === 0 && (
          <div className="bg-emerald-50 border border-emerald-200 text-[#0E8A67] px-6 py-6 rounded-2xl mb-4 text-center animate-fade-in">
            <FiBookmark className="w-8 h-8 mx-auto mb-2 opacity-60" />
            <h4 className="text-base font-bold">No Bookmarked Compounds Yet</h4>
            <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto">
              Click the bookmark star icon in the "Bookmark" column of any compound row to add it to your bookmarks table.
            </p>
            <button
              onClick={() => setShowBookmarksOnly(false)}
              className="mt-3 px-4 py-2 bg-[#0E8A67] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0A7557] transition-colors cursor-pointer border-0"
            >
              View All Compounds
            </button>
          </div>
        )}

        {/* ── Table Container ── */}
        <div className="test-container bg-white rounded-2xl shadow-sm border border-border-main overflow-hidden flex flex-col">
          <div
            className="ag-theme-quartz w-full"
            style={{ height: "calc(100vh - 230px)", minHeight: "450px" }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={displayRowData}
              columnDefs={activeColumnDefs}
              context={{ refreshBookmarks: getBookmarks }}
              getRowId={(params) => {
                if (params.data?._id) return String(params.data._id);
                if (params.data?.cid != null && params.data?.cid !== '') {
                  return `${params.data.cid}-${params.data?.version ?? '1.0'}`;
                }
                if (params.data?.drugName && params.data?.approvalDate) {
                  return `${params.data.drugName}-${params.data.approvalDate}-${params.data.submission || ''}`;
                }
                if (params.data?.drugName) return String(params.data.drugName);
                if (params.data?.ProductOverview?.drugName) return String(params.data.ProductOverview.drugName);
                return String(Math.random());
              }}
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
