import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
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
import './DrugsTable.css';
import { ColumnsToolPanelModule, ExcelExportModule, ServerSideRowModelApiModule } from 'ag-grid-enterprise';
import {
  FiBookmark,
  FiDownload,
  FiDatabase,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from 'react-icons/fi';
import Loader from '../Loader';
import useGet from '../../hooks/useGet';
import BookMarkService from '../../services/BookmarkService';
import BookmarkCellRenderer from './BookmarkCellRenderer';
import BrandNameCellRenderer from './BrandNameCellRenderer';
import ActionMenuCellRenderer from './ActionMenuCellRenderer';
import { capitalizeFirstLetter, unixToDate } from '../../utils/utils';

const bookMarkService = new BookMarkService();

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

const valueFormatter = (params: { value?: any; colDef?: any }): string => {
  if (params.value == null) return "-";

  const field = params.colDef?.field || "";

  if (field.toLowerCase().includes('date') || field === 'createdAt' || field === 'updatedAt' || (typeof params.value === 'number' && params.value > 100000000)) {
    return unixToDate(params.value);
  }

  if (typeof params.value === "string") {
    if (params.value.includes("@")) return params.value;
    return capitalizeFirstLetter(params.value);
  }

  if (typeof params.value === "object") {
    const entries = Object.entries(params.value).filter(([_, val]) => val && typeof val === 'string' && val.trim());
    if (entries.length > 0) {
      return entries.map(([key, val]) => `${key}: ${val}`).join('; ');
    }
    return "-";
  }

  return String(params.value);
};

const DrugsTable: React.FC = () => {
  const navigate = useNavigate();
  const { searchtext } = useParams();
  const gridRef = useRef<AgGridReact<any>>(null);
  const { drugsData, drugsLoading, refetchDrugs } = useUser();
  const { fetchData } = useGet();
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  const categoryArr: any[] = drugsData;

  const getBookmarks = async () => {
    const response = await fetchData(bookMarkService.getBookmarks());
    if (response?.data) setBookmarks(response.data);
  };

  useEffect(() => {
    getBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Proactively fetch list of drugs directly if context is empty and not loading
  useEffect(() => {
    if (drugsData.length === 0 && !drugsLoading && refetchDrugs) {
      refetchDrugs();
    }
  }, [drugsData.length, drugsLoading, refetchDrugs]);

  const uniqueCategoryArr = Array.isArray(categoryArr)
    ? categoryArr.filter((item, idx, arr) =>
        arr.findIndex((i) => i._id === item._id || i.cid === item.cid) === idx
      )
    : [];

  function getAllSearchableStrings(item: any): string[] {
    const arr: string[] = [];
    const drugName = item?.ProductOverview?.drugName || item?.ProductOverview?.brandName || item?.drugName;
    if (drugName) arr.push(drugName);
    const apiName = item?.ProductOverview?.apiName || item?.apiName;
    if (apiName) arr.push(apiName);
    const iupacName = item?.PhysicalChemicalProperties?.iupacName;
    if (iupacName) arr.push(iupacName);
    const innName = item?.PhysicalChemicalProperties?.innName;
    if (innName) arr.push(innName);
    if (item?.cid) arr.push(String(item.cid));
    return arr;
  }

  const fuzzyMatch = (text: string, query: string): boolean => {
    const n = text.toLowerCase();
    const q = query.toLowerCase().trim();
    if (!q) return false;
    if (n.includes(q)) return true; // exact match or exact substring match
    
    // Fuzzy match: all chars of query appear in order inside name
    let qi = 0;
    for (let i = 0; i < n.length && qi < q.length; i++) {
      if (n[i] === q[qi]) qi++;
    }
    return qi === q.length;
  };

  const results = useMemo(() => {
    if (searchtext && searchtext.trim()) {
      const search = (searchtext || '').toLowerCase();
      return uniqueCategoryArr.filter((item: any) =>
        getAllSearchableStrings(item).some(
          (str) => typeof str === 'string' && fuzzyMatch(str, search)
        )
      );
    }
    return uniqueCategoryArr.slice(0, 10);
  }, [searchtext, uniqueCategoryArr]);

  // Compute clean initial pagination indicators from results count
  const initialTotal = results.length;
  const initialStart = initialTotal === 0 ? 0 : 1;
  const initialEnd = Math.min(20, initialTotal);

  // Results ref to prevent stale closures in AG Grid callbacks
  const resultsRef = useRef(results);
  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  // Custom pagination states initialized dynamically to prevent NaN layouts
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(Math.ceil(initialTotal / 20) || 1);
  const [totalRows, setTotalRows] = useState(initialTotal);
  const [rangeStart, setRangeStart] = useState(initialStart);
  const [rangeEnd, setRangeEnd] = useState(initialEnd);

  // Synchronize dynamic pagination counts when results load asynchronously
  useEffect(() => {
    const total = results.length;
    setTotalRows(total);
    setTotalPages(Math.ceil(total / pageSize) || 1);
    
    // Always compute range values based on results and page states as a source of truth
    // unless grid is active and filtered (which we sync via event handlers)
    const isFiltered = gridRef.current && gridRef.current.api && gridRef.current.api.getFilterModel() && Object.keys(gridRef.current.api.getFilterModel()).length > 0;
    
    if (!isFiltered) {
      const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
      const end = Math.min(currentPage * pageSize, total);
      setRangeStart(start);
      setRangeEnd(end);
    }
  }, [results, pageSize, currentPage]);

  const resultsWithBookmarks = useMemo(() => {
    return results.map((item: any) => {
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
  }, [results, bookmarks]);

  // Column definitions matching the screenshot
  const columnDefs = useMemo<ColDef[]>(() => [
    { headerName: 'Bookmark', field: 'bookmark', cellRenderer: BookmarkCellRenderer, width: 110, sortable: false, filter: true, suppressToolPanel: true },
    { headerName: 'CID', field: 'cid', width: 100, sortable: true, filter: true, valueFormatter },
    { headerName: 'Drug Name', field: 'ProductOverview.drugName', cellRenderer: BrandNameCellRenderer, width: 160, sortable: true, filter: true, autoHeight: true, cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' } },
    { headerName: 'API Name', field: 'ProductOverview.apiName', width: 150, sortable: true, filter: true, autoHeight: true, cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' }, valueFormatter },
    { headerName: 'IUPAC Name', field: 'PhysicalChemicalProperties.iupacName', width: 160, sortable: true, filter: true, autoHeight: true, cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' }, valueFormatter },
    { headerName: 'Molecular Formula', field: 'PhysicalChemicalProperties.molecularFormula', width: 160, sortable: true, filter: true, autoHeight: true, cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' }, valueFormatter },
    { headerName: 'Molecular Weight', field: 'PhysicalChemicalProperties.molecularWeight', width: 165, sortable: true, filter: true, autoHeight: true, cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' }, valueFormatter },
    
    // More columns hidden by default
    { headerName: 'CAS Number', field: 'PhysicalChemicalProperties.casNumber', width: 140, sortable: true, filter: true, hide: true, valueFormatter },
    { headerName: 'Chemical Name', field: 'PhysicalChemicalProperties.chemicalName', width: 160, sortable: true, filter: true, hide: true, valueFormatter },
    { headerName: 'Therapeutic Class', field: 'ProductOverview.therapeuticClass', width: 180, sortable: true, filter: true, hide: true, valueFormatter },
    { headerName: 'Description', field: 'ExecutiveSummary', width: 400, sortable: true, filter: true, hide: true, autoHeight: true, cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' }, valueFormatter },
    { headerName: 'Created Date', field: 'createdAt', width: 150, sortable: true, filter: true, hide: true, valueFormatter },
    { headerName: 'Updated Date', field: 'updatedAt', width: 150, sortable: true, filter: true, hide: true, valueFormatter },
    
    // Actions column pinned to the right
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: ActionMenuCellRenderer,
      width: 110,
      pinned: 'right',
      sortable: false,
      filter: false,
      resizable: false,
      suppressMenu: true,
      suppressColumnsToolPanel: true
    }
  ], []);

  // Sync pagination indicators with AG Grid internal state
  const onPaginationChanged = useCallback((params?: any) => {
    const api = params?.api || (gridRef.current && gridRef.current.api);
    if (api) {
      const curPage = api.paginationGetCurrentPage() ?? 0;
      const totalP = api.paginationGetTotalPages() ?? 1;
      const currentSize = api.paginationGetPageSize() ?? 20;
      
      // Get displayed row count. If it is 0 but we have results, it's loading; fallback to results.length!
      const isFiltered = api.getFilterModel() && Object.keys(api.getFilterModel()).length > 0;
      const total = isFiltered ? (api.getDisplayedRowCount() ?? 0) : resultsRef.current.length;

      setCurrentPage(curPage + 1);
      setTotalPages(isFiltered ? totalP : Math.ceil(total / currentSize));
      setPageSize(currentSize);
      setTotalRows(total);
      
      const start = total === 0 ? 0 : curPage * currentSize + 1;
      const end = Math.min((curPage + 1) * currentSize, total);
      setRangeStart(isNaN(start) ? 0 : start);
      setRangeEnd(isNaN(end) ? 0 : end);
    }
  }, []);

  const onFilterChanged = useCallback(() => {
    onPaginationChanged();
  }, [onPaginationChanged]);

  const onGridReady = useCallback((params: GridReadyEvent): void => {
    params.api.hideOverlay();
    // Sync initial state
    setTimeout(() => {
      onPaginationChanged();
    }, 100);
  }, [onPaginationChanged]);

  const onClickExport = useCallback(() => {
    if (gridRef.current) gridRef.current.api.exportDataAsExcel();
  }, []);

  const handleSearchHistory = () => navigate('/bookmark');

  const displayQuery = searchtext ? decodeURIComponent(searchtext) : '';

  // Custom paginator handlers
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setGridOption('paginationPageSize', newSize);
    }
  };

  const handleGoToFirstPage = () => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.paginationGoToFirstPage();
    }
  };

  const handleGoToPreviousPage = () => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.paginationGoToPreviousPage();
    }
  };

  const handleGoToNextPage = () => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.paginationGoToNextPage();
    }
  };

  const handleGoToLastPage = () => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.paginationGoToLastPage();
    }
  };

  return (
    <div className="min-h-screen bg-page font-sans">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ── Breadcrumbs ── */}
        <div className="flex items-center gap-2 text-xs text-body mb-3 select-none">
          <FiDatabase className="w-3.5 h-3.5" />
          <span>Drug Database</span>
          {displayQuery && (
            <>
              <span className="text-border-main">/</span>
              <span className="text-[#0E8A67] font-semibold">"{displayQuery}"</span>
            </>
          )}
        </div>

        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[28px] font-bold text-gray-900 leading-tight">
              {displayQuery ? (
                <>
                  Results for <span className="text-[#0E8A67]">"{displayQuery}"</span>
                </>
              ) : (
                'Drug Database'
              )}
            </h2>
            <p className="text-[13.5px] text-gray-500 mt-1 font-medium">
              Showing {rangeStart} to {rangeEnd} of {totalRows} {totalRows === 1 ? 'compound' : 'compounds'} found
            </p>
          </div>
          
          {/* Top-Bar Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSearchHistory}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 text-[13.5px] font-semibold hover:bg-gray-50 transition-all shadow-sm cursor-pointer"
            >
              <FiBookmark className="w-4 h-4 text-gray-500" />
              <span>Saved Views</span>
              <FiChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button
              onClick={onClickExport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E8A67] hover:bg-[#0A7557] text-white text-[13.5px] font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export</span>
              <FiChevronDown className="w-3.5 h-3.5 text-white/80" />
            </button>
          </div>
        </div>

        {/* ── Table Container Card ── */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-border-main overflow-hidden flex flex-col">
          <div
            className="ag-theme-quartz w-full"
            style={{ height: 'calc(100vh - 240px)', minHeight: '450px' }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={resultsWithBookmarks}
              columnDefs={columnDefs}
              getRowId={(params) =>
                String(
                  params.data?._id ??
                    (params.data?.cid ? `${params.data.cid}-${params.data?.version ?? ''}` : '')
                )
              }
              onGridReady={onGridReady}
              pagination={true}
              suppressPaginationPanel={true}
              paginationPageSize={pageSize}
              onPaginationChanged={onPaginationChanged}
              onModelUpdated={onPaginationChanged}
              onFilterChanged={onFilterChanged}
              sideBar={{ toolPanels: ['columns'] }}
              loadingOverlayComponent={() => <div><Loader /></div>}
              defaultColDef={{ filter: true }}
              rowSelection="single"
              headerHeight={56}
            />
          </div>

          {/* Custom Pagination Footer Row */}
          <div className="flex items-center justify-between border-t border-[#E2E8F0] px-6 py-4 bg-white select-none flex-wrap gap-4">
            {/* Left: rows per page */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">Rows per page:</span>
              <div className="relative flex items-center">
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-1.5 text-sm text-gray-700 font-semibold focus:outline-none focus:ring-1 focus:ring-[#0E8A67] focus:border-[#0E8A67] cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <FiChevronDown className="absolute right-2.5 text-gray-500 pointer-events-none w-4 h-4" />
              </div>
            </div>

            {/* Right: navigation pages */}
            <div className="flex items-center gap-6 flex-wrap">
              <span className="text-sm text-gray-600 font-medium">
                {rangeStart} to {rangeEnd} of {totalRows}
              </span>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleGoToFirstPage}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
                >
                  <FiChevronsLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handleGoToPreviousPage}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>

                <div className="w-8 h-8 rounded-lg bg-[#E6F3EF] border border-[#B3DDD0] text-[#0E8A67] font-semibold text-sm flex items-center justify-center">
                  {currentPage}
                </div>

                <button
                  onClick={handleGoToNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleGoToLastPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
                >
                  <FiChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DrugsTable;
