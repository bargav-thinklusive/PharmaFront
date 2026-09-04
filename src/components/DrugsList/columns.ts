import type { ColDef } from "ag-grid-community";
import { valueFormatter } from "../../utils/utils";
import BookmarkCellRenderer from "../DrugTable/BookmarkCellRenderer";
import BrandNameCellRenderer from "../DrugTable/BrandNameCellRenderer";
import ActionMenuCellRenderer from "../DrugTable/ActionMenuCellRenderer";

const cellWrapStyle = {
  lineHeight: '1.5',
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
};

export const cmcintelColumns: ColDef[] = [
  { headerName: 'Bookmark', field: 'bookmark', cellRenderer: BookmarkCellRenderer, width: 100, sortable: false, filter: true, suppressColumnsToolPanel: true },
  { headerName: 'CID', field: 'cid', width: 90, sortable: true, filter: true, valueFormatter },
  { headerName: 'Drug Name', field: 'ProductOverview.drugName', cellRenderer: BrandNameCellRenderer, minWidth: 150, width: 170, wrapText: true, autoHeight: true, cellStyle: cellWrapStyle, sortable: true, filter: true },
  { headerName: 'API Name', field: 'ProductOverview.apiName', minWidth: 160, width: 180, wrapText: true, autoHeight: true, cellStyle: cellWrapStyle, sortable: true, filter: true, valueFormatter },
  { headerName: 'IUPAC Name', field: 'PhysicalChemicalProperties.iupacName', minWidth: 260, width: 300, wrapText: true, autoHeight: true, cellStyle: cellWrapStyle, sortable: true, filter: true, valueFormatter },
  { headerName: 'Company', field: 'ProductOverview.companyName', minWidth: 180, width: 200, wrapText: true, autoHeight: true, cellStyle: cellWrapStyle, sortable: true, filter: true, valueFormatter: (params: any) => params.value || params.data?.company || params.data?.companyName || '-' },
  { headerName: 'Region', field: 'ProductOverview.firstApprovedRegion', minWidth: 160, width: 180, wrapText: true, autoHeight: true, cellStyle: cellWrapStyle, sortable: true, filter: true, valueFormatter: (params: any) => params.value || params.data?.RegulatoryInsights?.regionalApproval || params.data?.region || params.data?.firstApprovedRegion || '-' },
  { headerName: 'Molecular Formula', field: 'PhysicalChemicalProperties.molecularFormula', minWidth: 180, width: 200, wrapText: true, autoHeight: true, cellStyle: cellWrapStyle, sortable: true, filter: true, valueFormatter },
  {
    headerName: 'Therapeutic Area',
    field: 'ProductOverview.therapeuticArea',
    minWidth: 200,
    width: 240,
    wrapText: true,
    autoHeight: true,
    cellStyle: cellWrapStyle,
    sortable: true,
    filter: true,
    valueFormatter: (params: any) => params.value || params.data?.ProductOverview?.therapeuticArea || params.data?.therapeuticArea || '-'
  },

  // More columns hidden by default
  { headerName: 'Molecular Weight', field: 'PhysicalChemicalProperties.molecularWeight', width: 140, sortable: true, filter: true, hide: true, valueFormatter },
  { headerName: 'CAS Number', field: 'PhysicalChemicalProperties.casNumber', width: 140, sortable: true, filter: true, hide: true, valueFormatter },
  { headerName: 'Chemical Name', field: 'PhysicalChemicalProperties.chemicalName', minWidth: 200, width: 240, wrapText: true, autoHeight: true, cellStyle: cellWrapStyle, sortable: true, filter: true, hide: true, valueFormatter },
  { headerName: 'Therapeutic Class', field: 'ProductOverview.therapeuticClass', minWidth: 180, width: 220, wrapText: true, autoHeight: true, cellStyle: cellWrapStyle, sortable: true, filter: true, hide: true, valueFormatter },
  { headerName: 'Description', field: 'ExecutiveSummary', minWidth: 300, width: 400, wrapText: true, autoHeight: true, cellStyle: cellWrapStyle, sortable: true, filter: true, hide: true, valueFormatter },
  { headerName: 'Created Date', field: 'createdAt', width: 150, sortable: true, filter: true, hide: true, valueFormatter },
  { headerName: 'Updated Date', field: 'updatedAt', width: 150, sortable: true, filter: true, hide: true, valueFormatter },

  // Actions column pinned to the right
  {
    headerName: 'Actions',
    field: 'actions',
    cellRenderer: ActionMenuCellRenderer,
    width: 100,
    pinned: 'right',
    sortable: false,
    filter: false,
    resizable: false,
    suppressHeaderMenuButton: true,
    suppressColumnsToolPanel: true
  }
];

export const columns: any = [

  {
    headerName: "Approval Date",
    headerClass: "table-header",
    field: "approvalDate",
    sortable: true,
    filter: true,
    width:100,
    valueFormatter: valueFormatter,

  },
  {
    headerName: "Drug Name",
    headerClass: "table-header",
    field: "drugName",
    sortable: true,
    filter: true,
    width:500,
    valueFormatter: valueFormatter,

  },

  {
    headerName: "Submission",
    headerClass: "table-header",
    field: "submission",
    sortable: true,
    filter: true,
    width:100,
    valueFormatter: valueFormatter
  },
  {
    headerName: "Active Ingriedients",
    headerClass: "table-header",
    field: "activeIngredients",
    sortable: true,
    filter: true,
    width:400,
    valueFormatter: valueFormatter
  },
  {
    headerName: "Company",
    headerClass: "table-header",
    field: "company",
    wrapText: true,
    autoHeight: true,
    filter: true,
    valueFormatter: valueFormatter,

  },
  {
    headerName: "SUbmission Classification",
    headerClass: "table-header",
    field: "submissionClassification",
    sortable: true,
    filter: true,
    valueFormatter: valueFormatter
  },
  {
    headerName: "Submission Status",
    headerClass: "table-header",
    field: "submissionStatus",
    sortable: true,
    filter: true,
    valueFormatter: valueFormatter
  },
];