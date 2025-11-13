import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { FaRegBookmark } from "react-icons/fa";
import Loader from '../Loader';
import useGet from '../../hooks/useGet';
import BookMarkService from '../../services/BookmarkService';

  const bookMarkService = new BookMarkService();
// Register AG Grid modules
ModuleRegistry.registerModules([ColumnsToolPanelModule, ExcelExportModule, ClientSideRowModelModule, NumberFilterModule,
  TextFilterModule, ValidationModule,  RowAutoHeightModule,CellStyleModule,ServerSideRowModelApiModule,PaginationModule,RowSelectionModule]);



const pageSize = 20; // Number of rows per page
const ResultList: React.FC = () => {
  const navigate = useNavigate();
  const { searchtext } = useParams();
  const gridRef = useRef<AgGridReact<any>>(null);
  const { drugsData } = useUser();
  const { fetchData } = useGet();
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // Use API data only
  const categoryArr: any[] = drugsData;

  const getBookmarks = async () => {
    const response = await fetchData(bookMarkService.getBookmarks());
    if (response?.data) {
      setBookmarks(response.data);
    }
  };

  useEffect(() => {
    getBookmarks();
  }, []);


  // Remove duplicates by cid and version
  const uniqueCategoryArr = Array.isArray(categoryArr)
    ? categoryArr.filter((item, idx, arr) =>
      arr.findIndex((i) => i.cid === item.cid && i.version === item.version) === idx
    )
    : [];

  // Helper to extract all searchable fields from a record
  function getAllSearchableStrings(item: any): string[] {
    const arr: string[] = [];
    if (item?.marketInformation?.brandName) arr.push(item.marketInformation.brandName);
    if (item?.marketInformation?.genericName) arr.push(item.marketInformation.genericName);

    // Handle nested chemicalName object
    const chemicalName = item?.drugSubstance?.physicalAndChemicalProperties?.chemicalName;
    if (chemicalName) {
      if (typeof chemicalName === 'string') {
        arr.push(chemicalName);
      } else if (typeof chemicalName === 'object') {
        Object.values(chemicalName).forEach((val: any) => {
          if (typeof val === 'string' && val.trim()) arr.push(val);
        });
      }
    }

    // Handle nested structureName object
    const structureName = item?.drugSubstance?.physicalAndChemicalProperties?.structureName;
    if (structureName) {
      if (typeof structureName === 'string') {
        arr.push(structureName);
      } else if (typeof structureName === 'object') {
        Object.values(structureName).forEach((val: any) => {
          if (typeof val === 'string' && val.trim()) arr.push(val);
        });
        // Also add concatenated values for searching the full structure text
        const concatenated = Object.values(structureName).filter((val: any) => typeof val === 'string' && val.trim()).join(' ');
        if (concatenated) arr.push(concatenated);
      }
    }

    if (item?.cid) arr.push(item.cid);
    return arr;
  }

  // Robust filter: match searchtext against any searchable field (memoized)
  const results = useMemo(() => {
    if (searchtext && searchtext.trim()) {
      const search = (searchtext || '').toLowerCase();
      return uniqueCategoryArr.filter((item: any) =>
        getAllSearchableStrings(item).some(
          (str) => typeof str === 'string' && str.toLowerCase().includes(search)
        )
      );
    }
    return uniqueCategoryArr.slice(0, 10);
  }, [searchtext, uniqueCategoryArr]);

  // Add isBookmarked flag to each result (support multiple bookmark shapes) - memoized
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


  const onGridReady = useCallback((params: GridReadyEvent): void => {
    const api: GridApi = params.api;
    api.hideOverlay();
  }, []);

  const onClickExport = useCallback(() => {
    if (gridRef.current) {
      gridRef.current.api.exportDataAsExcel();
    }
  }, []);

const handleSearchHistory = () => {
  navigate(`/bookmark`);
}

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center bg-white/80 py-8">
      <div className="w-full max-w-5xl ">

        {/* Filters, sort, etc. can be added here */}
        <div className="flex justify-between items-center gap-8 border-b pb-2 mb-4">
          <span className="font-bold text-blue-900 text-lg">{results.length} results</span>
          <div className='flex justify-between items-center gap-2'>
            <button onClick={handleSearchHistory}><FaRegBookmark size={25} /></button>
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
              rowData={resultsWithBookmarks}
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

export default ResultList;
