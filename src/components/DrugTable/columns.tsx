import { capitalizeFirstLetter, unixToDate } from "../../utils/utils";
import BookmarkCellRenderer from "./BookmarkCellRenderer";
import BrandNameCellRenderer from "./BrandNameCellRenderer";


const valueFormatter = (params: { value?: any; colDef?: any }): string => {
  if (params.value == null) return "-";

  const field = params.colDef?.field || "";

  // Handle Date fields explicitly or by value detection
  if (field.toLowerCase().includes('date') || (typeof params.value === 'number' && params.value > 100000000)) {
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



export const columns: any = [
  {
    headerName: "Bookmark",
    headerClass: "table-header",
    field: "bookmark",
    cellRenderer: BookmarkCellRenderer,
    width: 100,
  },
  {
    headerName: "CID",
    headerClass: "table-header",
    field: "cid",
    sortable: true,
    filter: true,
    width: 100,
    valueFormatter: valueFormatter,

  },
  {
    headerName: "Version",
    headerClass: "table-header",
    field: "version",
    sortable: true,
    filter: true,
    width: 80,
    valueFormatter: valueFormatter,

  },
  {
    headerName: "Drug Name",
    headerClass: "table-header",
    field: "marketInformation.drugName",
    sortable: true,
    filter: true,
    autoHeight: true,
    cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' },
    cellRenderer: BrandNameCellRenderer,
  },
  {
    headerName: "API Name",
    headerClass: "table-header",
    field: "marketInformation.apiName",
    sortable: true,
    filter: true,
    autoHeight: true,
    cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' },
    valueFormatter: valueFormatter
  },
  {
    headerName: "IUPAC Name",
    headerClass: "table-header",
    field: "drugSubstance.physicalAndChemicalProperties.iupacName",
    sortable: true,
    filter: true,
    autoHeight: true,
    cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' },
    valueFormatter: valueFormatter
  },
  {
    headerName: "INN Name",
    headerClass: "table-header",
    field: "drugSubstance.physicalAndChemicalProperties.innName",
    wrapText: true,
    autoHeight: true,
    filter: true,
    width: 350,
    cellStyle: { lineHeight: '2' },
    valueFormatter: valueFormatter,

  },
  {
    headerName: "Molecular Formula",
    headerClass: "table-header",
    field: "drugSubstance.physicalAndChemicalProperties.molecularFormula",
    sortable: true,
    filter: true,
    autoHeight: true,
    cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' },
    valueFormatter: valueFormatter
  },
  {
    headerName: "Molecular Weight",
    headerClass: "table-header",
    field: "drugSubstance.physicalAndChemicalProperties.molecularWeight",
    sortable: true,
    filter: true,
    autoHeight: true,
    cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' },
    valueFormatter: valueFormatter
  },
  {
    headerName: "Approval Date",
    headerClass: "table-header",
    field: "marketInformation.firstApprovedDate",
    sortable: true,
    filter: true,
    valueFormatter: valueFormatter
  },
  {
    headerName: "Company Name",
    headerClass: "table-header",
    field: "marketInformation.companyName",
    sortable: true,
    filter: true,
    valueFormatter: valueFormatter
  }
]