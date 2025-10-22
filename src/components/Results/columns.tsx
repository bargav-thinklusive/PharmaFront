import { capitalizeFirstLetter } from "../../utils/utils";
import BookmarkCellRenderer from "./BookmarkCellRenderer";
import BrandNameCellRenderer from "./BrandNameCellRenderer";


const valueFormatter = (params: { value?: string | number | null }): string => {
  if (params.value == null) return "-"; // handle null/undefined

  if (typeof params.value === "string") {
    if (params.value.includes("@")) return params.value;
    return capitalizeFirstLetter(params.value);
  }

  // For numbers or other types
  return String(params.value);
};



export const columns: any = [
  {
    headerName: "Bookmark",
    headerClass: "table-header",
    field: "bookmark",
    cellRenderer: BookmarkCellRenderer,
    width: 80,
    minWidth: 80,
    hide: false,
  },
  {
    headerName: "CID",
    headerClass: "table-header",
    field: "cid",
    sortable: true,
    filter: true,
    width: 100,
    minWidth: 80,
    valueFormatter: valueFormatter,

  },
  {
    headerName: "Brand Name",
    headerClass: "table-header",
    field: "marketInformation.brandName",
    sortable: true,
    filter: true,
    autoHeight: true,
    cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' },
    cellRenderer: BrandNameCellRenderer,
    minWidth: 150,
  },
  {
    headerName: "Generic Name",
    headerClass: "table-header",
    field: "marketInformation.genericName",
    sortable: true,
    filter: true,
    autoHeight: true,
    cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' },
    valueFormatter: valueFormatter,
    minWidth: 150,
  },
  {
    headerName: "Chemical Name",
    headerClass: "table-header",
    field: "drugSubstance.physicalAndChemicalProperties.chemicalName",
    sortable: true,
    filter: true,
    autoHeight: true,
    cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' },
    valueFormatter: valueFormatter,
    minWidth: 150,
  },
  {
    headerName: "Structure Name",
    headerClass: "table-header",
    field: "drugSubstance.physicalAndChemicalProperties.structureName",
    wrapText: true,
    autoHeight: true,
    filter: true,
    width: 300,
    minWidth: 200,
    cellStyle: { lineHeight: '2' },
    valueFormatter: valueFormatter,

  },
  {
    headerName: "Element Formula",
    headerClass: "table-header",
    field: "drugSubstance.physicalAndChemicalProperties.elementalFormula",
    sortable: true,
    filter: true,
    autoHeight: true,
    cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' },
    valueFormatter: valueFormatter,
    minWidth: 120,
  },
  {
    headerName: "Molecular Weight",
    headerClass: "table-header",
    field: "drugSubstance.physicalAndChemicalProperties.molecularWeight",
    sortable: true,
    filter: true,
    autoHeight: true,
    cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' },
    valueFormatter: valueFormatter,
    minWidth: 120,
  },
  {
    headerName: "Approved Date",
    headerClass: "table-header",
    field: "marketInformation.approvedDate",
    sortable: true,
    filter: true,
    valueFormatter: valueFormatter,
    minWidth: 120,
  },
  {
    headerName: "Approved Company",
    headerClass: "table-header",
    field: "marketInformation.approvedFor",
    sortable: true,
    filter: true,
    valueFormatter: valueFormatter,
    minWidth: 150,
  }
]