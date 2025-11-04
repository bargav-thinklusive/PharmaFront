import { capitalizeFirstLetter } from "../../utils/utils";

const valueFormatter = (params: { value?: any }): string => {
  if (params.value == null) return "-"; // handle null/undefined

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
    headerName: "Approval Date",
    headerClass: "table-header",
    field: "Approval Date",
    sortable: true,
    filter: true,
    width:100,
    valueFormatter: valueFormatter,

  },
  {
    headerName: "Drug Name",
    headerClass: "table-header",
    field: "Drug Name",
    sortable: true,
    filter: true,
    width:500,
    valueFormatter: valueFormatter,

  },

  {
    headerName: "Submission",
    headerClass: "table-header",
    field: "Submission",
    sortable: true,
    filter: true,
    width:100,
    valueFormatter: valueFormatter
  },
  {
    headerName: "Active Ingriedients",
    headerClass: "table-header",
    field: "Active Ingredients",
    sortable: true,
    filter: true,
    width:400,
    valueFormatter: valueFormatter
  },
  {
    headerName: "Company",
    headerClass: "table-header",
    field: "Company",
    wrapText: true,
    autoHeight: true,
    filter: true,
    valueFormatter: valueFormatter,

  },
  {
    headerName: "SUbmission Classification",
    headerClass: "table-header",
    field: "Submission Classification *",
    sortable: true,
    filter: true,
    valueFormatter: valueFormatter
  },
  {
    headerName: "Submission Status",
    headerClass: "table-header",
    field: "Submission Status",
    sortable: true,
    filter: true,
    valueFormatter: valueFormatter
  },
]