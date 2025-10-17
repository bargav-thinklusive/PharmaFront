import { capitalizeFirstLetter } from "../../utils/utils";
import { useNavigate, useParams } from "react-router-dom";


const valueFormatter = (params: { value?: string | number | null }): string => {
  if (params.value == null) return "-"; // handle null/undefined

  if (typeof params.value === "string") {
    if (params.value.includes("@")) return params.value;
    return capitalizeFirstLetter(params.value);
  }

  // For numbers or other types
  return String(params.value);
};

const BrandNameCellRenderer = (params: any) => {
  const navigate = useNavigate();
  const { ccategory, searchtext } = useParams();

  const handleClick = () => {
    if (ccategory && params.data?.cid) {
      navigate(`/${ccategory}/${searchtext}/${params.data.cid}`);
    }
  };

  return (
    <span
      onClick={handleClick}
      style={{
        color: "#1677ff",
        textDecoration: "underline",
        cursor: "pointer",
      }}
    >
      {params.value || "-"}
    </span>
  );
};


const isMobile = window.innerWidth < 640;

export const columns: any = [
  {
    headerName: "CID",
    headerClass: "table-header",
    field: "cid",
    sortable: true,
    filter: true,
    valueFormatter: valueFormatter,
    width: isMobile ? 80 : undefined,
    hide: false,
  },
  {
    headerName: "Brand Name",
    headerClass: "table-header",
    field: "marketInformation.brandName",
    sortable: true,
    filter: true,
    cellRenderer: BrandNameCellRenderer,
    width: isMobile ? 120 : undefined,
    hide: false,
  },
  {
    headerName: "Generic Name",
    headerClass: "table-header",
    field: "marketInformation.genericName",
    sortable: true,
    filter: true,
    valueFormatter: valueFormatter,
    width: isMobile ? 120 : undefined,
    hide: isMobile, // Hide on mobile to save space
  },
  {
    headerName: "Chemical Name",
    headerClass: "table-header",
    field: "drugSubstance.physicalAndChemicalProperties.chemicalName",
    sortable: true,
    filter: true,
    valueFormatter: valueFormatter,
    width: isMobile ? 150 : undefined,
    hide: isMobile, // Hide on mobile to save space
  },
  {
    headerName: "Structure Name",
    headerClass: "table-header",
    field: "drugSubstance.physicalAndChemicalProperties.structureName",
    wrapText: true,
    autoHeight: true,
    filter: true,
    width: isMobile ? 200 : 350,
    cellStyle: { lineHeight: '2' },
    valueFormatter: valueFormatter,
    hide: isMobile, // Hide on mobile to save space
  },
  {
    headerName: "Element Formula",
    headerClass: "table-header",
    field: "drugSubstance.physicalAndChemicalProperties.elementalFormula",
    sortable: true,
    filter: true,
    valueFormatter: valueFormatter,
    width: isMobile ? 120 : undefined,
    hide: isMobile, // Hide on mobile to save space
  },
  {
    headerName: "Molecular Weight",
    headerClass: "table-header",
    field: "drugSubstance.physicalAndChemicalProperties.molecularWeight",
    sortable: true,
    filter: true,
    valueFormatter: valueFormatter,
    width: isMobile ? 100 : undefined,
    hide: false,
  },
  {
    headerName: "Approved Date",
    headerClass: "table-header",
    field: "marketInformation.approvedDate",
    sortable: true,
    filter: true,
    valueFormatter: valueFormatter,
    width: isMobile ? 120 : undefined,
    hide: isMobile, // Hide on mobile to save space
  },

]