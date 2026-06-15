import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { GridApi, GridReadyEvent } from 'ag-grid-community';
import {
  CellStyleModule, ClientSideRowModelModule, ModuleRegistry, NumberFilterModule,
  PaginationModule, RowAutoHeightModule, RowSelectionModule, TextFilterModule, ValidationModule,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import '../../components/AgGridHeaderStyle/AgGridHeaderStyle.css';
import '../DrugTable/DrugsTable.css';
import { ColumnsToolPanelModule, ExcelExportModule, ServerSideRowModelApiModule } from 'ag-grid-enterprise';
import { FiBookmark, FiDownload, FiInfo } from 'react-icons/fi';
import Loader from '../Loader';
import useGet from '../../hooks/useGet';
import BookMarkService from '../../services/BookmarkService';
import { columns } from './columns';

ModuleRegistry.registerModules([
  ColumnsToolPanelModule, ExcelExportModule, ClientSideRowModelModule, NumberFilterModule,
  TextFilterModule, ValidationModule, RowAutoHeightModule, CellStyleModule,
  ServerSideRowModelApiModule, PaginationModule, RowSelectionModule,
]);

const bookMarkService = new BookMarkService();
const pageSize = 20;

const Bookmark: React.FC = () => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const { fetchData, data } = useGet();

  const rowData = useMemo(() => {
    const bookmarks = data?.data ?? [];
    return bookmarks.map((bookmark: any) => {
      if (bookmark.drug) {
        return { ...bookmark.drug, _id: bookmark._id || bookmark.drug._id };
      }
      return bookmark;
    });
  }, [data]);

  const getBookmarks = async () => {
    await fetchData(bookMarkService.getBookmarks());
  };

  useEffect(() => {
    getBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent): void => {
    const api: GridApi = params.api;
    api.hideOverlay();
  }, []);

  const onClickExport = useCallback(() => {
    if (gridRef.current) gridRef.current.api.exportDataAsExcel();
  }, []);

  const count = data?.data?.length ?? 0;

  return (
    <div className="min-h-screen bg-page font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Page header ── */}
        <div className="mb-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-body mb-3">
            <FiBookmark className="w-3.5 h-3.5" />
            <span>Drug Database</span>
            <span className="text-border-main">/</span>
            <span className="text-primary font-medium">Bookmarks</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-main font-display flex items-center gap-2">
                <FiBookmark className="w-6 h-6 text-primary" />
                My Bookmarks
              </h1>
              <p className="text-sm text-body mt-1">
                <span className="font-semibold text-main">{count}</span>{' '}
                saved {count === 1 ? 'compound' : 'compounds'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <button
                onClick={onClickExport}
                title="Export to Excel"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                <FiDownload className="w-4 h-4" />
                <span className="hidden sm:inline">Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Empty state ── */}
        {count === 0 && data !== undefined && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-border-main shadow-sm">
            <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mb-4">
              <FiBookmark className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-main font-display mb-2">No bookmarks yet</h3>
            <p className="text-body text-sm flex items-center gap-1.5">
              <FiInfo className="w-3.5 h-3.5" />
              Search for drugs and bookmark them to find them here.
            </p>
          </div>
        )}

        {/* ── Table card ── */}
        {(count > 0 || data === undefined) && (
          <div className="bg-white rounded-2xl shadow-sm border border-border-main overflow-hidden">
            <div
              className="ag-theme-quartz"
              style={{ height: 'calc(100vh - 260px)', minHeight: '400px' }}
            >
              <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columns}
                getRowId={(params) =>
                  String(
                    params.data?._id ??
                      (params.data?.cid ? `${params.data.cid}-${params.data?.version ?? ''}` : '')
                  )
                }
                onGridReady={onGridReady}
                sideBar={{ toolPanels: ['columns'] }}
                pagination={true}
                paginationPageSize={pageSize}
                loadingOverlayComponent={() => <div><Loader /></div>}
                defaultColDef={{ filter: true }}
                rowSelection="single"
                headerHeight={56}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Bookmark;
