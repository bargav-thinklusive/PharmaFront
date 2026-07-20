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

  // Results count

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
    { headerName: 'Bookmark', field: 'bookmark', cellRenderer: BookmarkCellRenderer, width: 110, sortable: false, filter: true, suppressColumnsToolPanel: true },
    { headerName: 'CID', field: 'cid', width: 100, sortable: true, filter: true, valueFormatter },
    { headerName: 'Drug Name', field: 'ProductOverview.drugName', cellRenderer: BrandNameCellRenderer, width: 160, sortable: true, filter: true, autoHeight: true, cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' } },
    { headerName: 'API Name', field: 'ProductOverview.apiName', width: 150, sortable: true, filter: true, autoHeight: true, cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' }, valueFormatter },
    { headerName: 'IUPAC Name', field: 'PhysicalChemicalProperties.iupacName', width: 160, sortable: true, filter: true, autoHeight: true, cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' }, valueFormatter },
    { headerName: 'Molecular Formula', field: 'PhysicalChemicalProperties.molecularFormula', minWidth: 220, flex: 1, sortable: true, filter: true, autoHeight: true, cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' }, valueFormatter },
    { headerName: 'Molecular Weight', field: 'PhysicalChemicalProperties.molecularWeight', minWidth: 200, flex: 1, sortable: true, filter: true, autoHeight: true, cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' }, valueFormatter },
    
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
      suppressHeaderMenuButton: true,
      suppressColumnsToolPanel: true
    }
  ], []);

  const onGridReady = useCallback((params: GridReadyEvent): void => {
    params.api.hideOverlay();
  }, []);

  const onClickExport = useCallback(() => {
    if (gridRef.current) gridRef.current.api.exportDataAsExcel();
  }, []);

  const handleSearchHistory = () => navigate('/bookmark');

  const displayQuery = searchtext ? decodeURIComponent(searchtext) : '';

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
              Showing {results.length} {results.length === 1 ? 'compound' : 'compounds'} found
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
              paginationPageSize={20}
              sideBar={{ toolPanels: ['columns'] }}
              loadingOverlayComponent={() => <div><Loader /></div>}
              defaultColDef={{ filter: true }}
              rowSelection="single"
              headerHeight={56}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default DrugsTable;
