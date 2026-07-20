import type { ColDef } from "ag-grid-community";
import { valueFormatter } from "../../utils/utils";
import BookmarkCellRenderer from "../DrugTable/BookmarkCellRenderer";
import BrandNameCellRenderer from "../DrugTable/BrandNameCellRenderer";
import ActionMenuCellRenderer from "../DrugTable/ActionMenuCellRenderer";

export const cmcintelColumns: ColDef[] = [
  { headerName: 'Bookmark', field: 'bookmark', cellRenderer: BookmarkCellRenderer, width: 110, sortable: false, filter: true, suppressColumnsToolPanel: true },
  { headerName: 'CID', field: 'cid', width: 100, sortable: true, filter: true, valueFormatter },
  { headerName: 'Drug Name', field: 'ProductOverview.drugName', cellRenderer: BrandNameCellRenderer, width: 160, sortable: true, filter: true },
  { headerName: 'API Name', field: 'ProductOverview.apiName', width: 150, sortable: true, filter: true, valueFormatter },
  { headerName: 'IUPAC Name', field: 'PhysicalChemicalProperties.iupacName', width: 160, sortable: true, filter: true, valueFormatter },
  { headerName: 'Molecular Formula', field: 'PhysicalChemicalProperties.molecularFormula', minWidth: 220, flex: 1, sortable: true, filter: true, valueFormatter },
  { headerName: 'Molecular Weight', field: 'PhysicalChemicalProperties.molecularWeight', minWidth: 200, flex: 1, sortable: true, filter: true, valueFormatter },
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