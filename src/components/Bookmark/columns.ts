import { capitalizeFirstLetter } from "../../utils/utils";
import BrandNameCellRenderer from "../Results/BrandNameCellRenderer";


const valueFormatter = (params: { value?: any }): string => {
  if (params.value == null) return "-"; // handle null/undefined

  if (typeof params.value === "string") {
    if (params.value.includes("@")) return params.value;
    return capitalizeFirstLetter(params.value);
  }

  if (typeof params.value === "object") {
    // Handle nested objects like chemicalName: {Cefepime: "", Enmetazobactam: ""}
    // or molecularWeight: {Cefepime: "480.6 g/mol", Enmetazobactam: "314.32 g/mol"}
    const entries = Object.entries(params.value).filter(([_, val]) => val && typeof val === 'string' && val.trim());
    if (entries.length > 0) {
      return entries.map(([key, val]) => `${key}: ${val}`).join('; ');
    }
    return "-";
  }

  // For numbers or other types
  return String(params.value);
};



export const columns: any = [
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
    headerName: "Brand Name",
    headerClass: "table-header",
    field: "marketInformation.brandName",
    sortable: true,
    filter: true,
    autoHeight: true,
    cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' },
    cellRenderer: BrandNameCellRenderer,
  },
  {
    headerName: "Generic Name",
    headerClass: "table-header",
    field: "marketInformation.genericName",
    sortable: true,
    filter: true,
    autoHeight: true,
    cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' },
    valueFormatter: valueFormatter
  },
  {
    headerName: "Chemical Name",
    headerClass: "table-header",
    field: "drugSubstance.physicalAndChemicalProperties.chemicalName",
    sortable: true,
    filter: true,
    autoHeight: true,
    cellStyle: { lineHeight: '1.5', whiteSpace: 'pre-line' },
    valueFormatter: valueFormatter
  },
  {
    headerName: "Structure Name",
    headerClass: "table-header",
    field: "drugSubstance.physicalAndChemicalProperties.structureName",
    wrapText: true,
    autoHeight: true,
    filter: true,
    width: 350,
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
    headerName: "Approved Date",
    headerClass: "table-header",
    field: "marketInformation.approvedDate",
    sortable: true,
    filter: true,
    valueFormatter: valueFormatter
  },
  {
    headerName: "Approved Company",
    headerClass: "table-header",
    field: "marketInformation.approvedFor",
    sortable: true,
    filter: true,
    valueFormatter: valueFormatter
  }
]