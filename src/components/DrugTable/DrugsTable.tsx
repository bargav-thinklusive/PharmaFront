import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchDrugs } from '../../store/slices/drugsSlice';
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
  FiX,
  FiFilter,
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
  const { ccategory, searchtext } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const gridRef = useRef<AgGridReact<any>>(null);
  const dispatch = useAppDispatch();
  const drugsData = useAppSelector((state) => state.drugs.drugsData);
  const drugsLoading = useAppSelector((state) => state.drugs.drugsLoading);

  const refetchDrugs = useCallback(() => {
    dispatch(fetchDrugs());
  }, [dispatch]);
  const { fetchData } = useGet();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);

  const companyFilter = searchParams.get('company') || '';
  const regionFilter = searchParams.get('region') || '';
  const therapeuticAreaFilter = searchParams.get('therapeuticArea') || '';
  const bcsClassFilter = searchParams.get('bcsClass') || '';
  const dosageFormFilter = searchParams.get('dosageForm') || '';
  const activeCategory = ccategory || 'all';

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
      arr.findIndex((i) => {
        if (item._id && i._id) return String(i._id) === String(item._id);
        if (item.cid != null && item.cid !== "" && i.cid != null && i.cid !== "") {
          return String(i.cid) === String(item.cid);
        }
        const itemName = item?.ProductOverview?.drugName || item?.drugName || item?.brandName;
        const iName = i?.ProductOverview?.drugName || i?.drugName || i?.brandName;
        if (itemName && iName) return itemName === iName;
        return i === item;
      }) === idx
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

  const displayQuery = searchtext && searchtext !== 'all' ? decodeURIComponent(searchtext) : '';

  const results = useMemo(() => {
    return uniqueCategoryArr.filter((item: any) => {
      // 1. Text & Category filter
      if (displayQuery.trim()) {
        const query = displayQuery.trim();
        let matchesCategory = false;

        if (activeCategory === 'all') {
          matchesCategory = getAllSearchableStrings(item).some(
            (str) => typeof str === 'string' && fuzzyMatch(str, query)
          );
        } else if (activeCategory === 'drugName') {
          const text = item?.ProductOverview?.drugName || item?.ProductOverview?.brandName || item?.drugName || '';
          matchesCategory = fuzzyMatch(text, query);
        } else if (activeCategory === 'apiName') {
          const text = item?.ProductOverview?.apiName || item?.apiName || '';
          matchesCategory = fuzzyMatch(text, query);
        } else if (activeCategory === 'iupacName') {
          const text = item?.PhysicalChemicalProperties?.iupacName || '';
          matchesCategory = fuzzyMatch(text, query);
        } else if (activeCategory === 'innName') {
          const text = item?.PhysicalChemicalProperties?.innName || '';
          matchesCategory = fuzzyMatch(text, query);
        } else if (activeCategory === 'cid') {
          const text = item?.cid ? String(item.cid) : '';
          matchesCategory = fuzzyMatch(text, query);
        }

        if (!matchesCategory) return false;
      }

      // 2. Company filter
      if (companyFilter.trim()) {
        const itemCompany = item?.ProductOverview?.companyName || item?.company || item?.companyName || '';
        if (!itemCompany.toLowerCase().includes(companyFilter.trim().toLowerCase())) {
          return false;
        }
      }

      // 3. Region filter
      if (regionFilter.trim()) {
        const itemRegion =
          item?.ProductOverview?.firstApprovedRegion ||
          item?.RegulatoryInsights?.regionalApproval ||
          item?.region ||
          item?.firstApprovedRegion || '';
        if (!itemRegion.toLowerCase().includes(regionFilter.trim().toLowerCase())) {
          return false;
        }
      }

      // 4. Therapeutic Area filter
      if (therapeuticAreaFilter.trim()) {
        const itemTA = item?.ProductOverview?.therapeuticArea || item?.therapeuticArea || '';
        if (!itemTA.toLowerCase().includes(therapeuticAreaFilter.trim().toLowerCase())) {
          return false;
        }
      }

      // 5. BCS Class filter
      if (bcsClassFilter.trim()) {
        const itemBCS = item?.PhysicalChemicalProperties?.bcsClass || item?.bcsClass || '';
        if (!itemBCS.toLowerCase().includes(bcsClassFilter.trim().toLowerCase())) {
          return false;
        }
      }

      // 6. Dosage Form filter
      if (dosageFormFilter.trim()) {
        const itemDF = item?.ProductOverview?.dosageForms || item?.dosageForms || '';
        if (!itemDF.toLowerCase().includes(dosageFormFilter.trim().toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [displayQuery, activeCategory, companyFilter, regionFilter, therapeuticAreaFilter, bcsClassFilter, dosageFormFilter, uniqueCategoryArr]);

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

  const bookmarkedCount = useMemo(() => {
    return resultsWithBookmarks.filter((item: any) => item.isBookmarked).length;
  }, [resultsWithBookmarks]);

  const displayRows = useMemo(() => {
    if (!showBookmarksOnly) {
      return resultsWithBookmarks;
    }
    return resultsWithBookmarks.filter((item: any) => item.isBookmarked);
  }, [resultsWithBookmarks, showBookmarksOnly]);

  // Column definitions matching the screenshot
  const columnDefs = useMemo<ColDef[]>(() => [
    { headerName: 'Bookmark', field: 'bookmark', cellRenderer: BookmarkCellRenderer, width: 110, sortable: false, filter: true, suppressColumnsToolPanel: true },
    { headerName: 'CID', field: 'cid', width: 100, sortable: true, filter: true, valueFormatter },
    { headerName: 'Drug Name', field: 'ProductOverview.drugName', cellRenderer: BrandNameCellRenderer, width: 160, sortable: true, filter: true, autoHeight: true, cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' } },
    { headerName: 'API Name', field: 'ProductOverview.apiName', width: 150, sortable: true, filter: true, autoHeight: true, cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' }, valueFormatter },
    { headerName: 'IUPAC Name', field: 'PhysicalChemicalProperties.iupacName', width: 160, sortable: true, filter: true, autoHeight: true, cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' }, valueFormatter },
    { headerName: 'Company', field: 'ProductOverview.companyName', width: 160, sortable: true, filter: true, autoHeight: true, valueFormatter: (params: any) => params.value || params.data?.company || params.data?.companyName || '-' },
    { headerName: 'Region', field: 'ProductOverview.firstApprovedRegion', width: 150, sortable: true, filter: true, autoHeight: true, valueFormatter: (params: any) => params.value || params.data?.RegulatoryInsights?.regionalApproval || params.data?.region || params.data?.firstApprovedRegion || '-' },
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


  const removeCompanyFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('company');
    setSearchParams(params);
  };

  const removeRegionFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('region');
    setSearchParams(params);
  };

  const removeTherapeuticAreaFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('therapeuticArea');
    setSearchParams(params);
  };

  const removeBcsClassFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('bcsClass');
    setSearchParams(params);
  };

  const removeDosageFormFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('dosageForm');
    setSearchParams(params);
  };

  const removeCategoryFilter = () => {
    const searchPart = searchtext ? encodeURIComponent(searchtext) : 'all';
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    navigate(`/all/${searchPart}${queryString}`);
  };

  const removeQueryFilter = () => {
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    navigate(`/${activeCategory}/all${queryString}`);
  };

  const removeAllFilters = () => {
    navigate('/all/all');
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
              {showBookmarksOnly ? (
                <>
                  My <span className="text-[#0E8A67]">Bookmarked</span> Compounds
                </>
              ) : displayQuery ? (
                <>
                  Results for <span className="text-[#0E8A67]">"{displayQuery}"</span>
                </>
              ) : (
                'Drug Database'
              )}
            </h2>
            <p className="text-[13.5px] text-gray-500 mt-1 font-medium">
              Showing {displayRows.length} {displayRows.length === 1 ? 'compound' : 'compounds'} {showBookmarksOnly ? 'bookmarked' : 'found'}
            </p>
          </div>

          {/* Top-Bar Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBookmarksOnly((prev) => !prev)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-[13.5px] transition-all shadow-sm cursor-pointer border ${showBookmarksOnly
                ? "bg-[#0E8A67] text-white border-[#0E8A67] shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              title={showBookmarksOnly ? "Show All Compounds" : "Show Bookmarks Only"}
            >
              <FiBookmark className={`w-4 h-4 ${showBookmarksOnly ? "fill-white text-white" : "text-gray-500"}`} />
              <span>{showBookmarksOnly ? "Showing Bookmarks" : "Bookmarks"}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${showBookmarksOnly ? "bg-white/25 text-white" : "bg-emerald-50 text-[#0E8A67] border border-emerald-200"
                }`}>
                {bookmarkedCount}
              </span>
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

        {/* ── Active Filter Badges ── */}
        {(displayQuery || companyFilter || regionFilter || therapeuticAreaFilter || bcsClassFilter || dosageFormFilter || (activeCategory && activeCategory !== 'all')) && (
          <div className="flex flex-wrap items-center gap-2 mb-4 bg-white p-3.5 rounded-2xl border border-border-main shadow-xs">
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5 mr-1">
              <FiFilter className="w-3.5 h-3.5 text-primary" /> Active Filters:
            </span>

            {displayQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs border border-primary/20">
                Keyword: "{displayQuery}"
                <button onClick={removeQueryFilter} className="hover:text-red-600 cursor-pointer ml-0.5">
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {activeCategory && activeCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
                Category: {activeCategory}
                <button onClick={removeCategoryFilter} className="hover:text-red-600 cursor-pointer ml-0.5">
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {companyFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
                Company: {companyFilter}
                <button onClick={removeCompanyFilter} className="hover:text-red-600 cursor-pointer ml-0.5">
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {regionFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                Region: {regionFilter}
                <button onClick={removeRegionFilter} className="hover:text-red-600 cursor-pointer ml-0.5">
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {therapeuticAreaFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 font-bold text-xs border border-purple-200">
                Therapeutic Area: {therapeuticAreaFilter}
                <button onClick={removeTherapeuticAreaFilter} className="hover:text-red-600 cursor-pointer ml-0.5">
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {bcsClassFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 font-bold text-xs border border-indigo-200">
                BCS Class: {bcsClassFilter}
                <button onClick={removeBcsClassFilter} className="hover:text-red-600 cursor-pointer ml-0.5">
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {dosageFormFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 font-bold text-xs border border-rose-200">
                Dosage Form: {dosageFormFilter}
                <button onClick={removeDosageFormFilter} className="hover:text-red-600 cursor-pointer ml-0.5">
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            <button
              onClick={removeAllFilters}
              className="text-xs font-semibold text-gray-400 hover:text-red-600 underline ml-auto cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* ── Bookmarks Empty State Notice ── */}
        {showBookmarksOnly && displayRows.length === 0 && (
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

        {/* ── Table Container Card ── */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-border-main overflow-hidden flex flex-col">
          <div
            className="ag-theme-quartz w-full"
            style={{ height: 'calc(100vh - 240px)', minHeight: '450px' }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={displayRows}
              columnDefs={columnDefs}
              context={{ refreshBookmarks: getBookmarks }}
              getRowId={(params) => {
                if (params.data?._id) return String(params.data._id);
                if (params.data?.cid != null && params.data?.cid !== '') {
                  return `${params.data.cid}-${params.data?.version ?? '1.0'}`;
                }
                if (params.data?.ProductOverview?.drugName) return String(params.data.ProductOverview.drugName);
                if (params.data?.drugName) return String(params.data.drugName);
                return String(Math.random());
              }}
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
