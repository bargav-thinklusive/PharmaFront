import { capitalizeFirstLetter } from "../../utils/utils";
import { useNavigate, useParams } from "react-router-dom";


const valueFormatter = (params: { value?: string | null }): string => {
  if (params.value && params.value.includes("@")) {
    return params.value;
  }

  if (typeof params.value === "string") {
    return capitalizeFirstLetter(params.value) || "-";
  } else {
    return params.value || "-";
  }
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


export const columns: any = [
  {
    headerName: "CID",
    headerClass: "table-header",
    field: "cid",
    sortable: true,
    filter: true,
    valueFormatter: valueFormatter,

  },
  {
    headerName: "Brand Name",
    headerClass: "table-header",
    field: "marketInformation.brandName",
    sortable: true,
    filter: true,
    cellRenderer: BrandNameCellRenderer,
  },
  {
    headerName: "Generic Name",
    headerClass: "table-header",
    field: "marketInformation.genericName",
    sortable: true,
    filter: true,
    valueFormatter: valueFormatter
  },
  {
    headerName: "Chemical Name",
    headerClass: "table-header",
    field: "drugSubstance.physicalAndChemicalProperties.chemicalName",
    sortable: true,
    filter: true,
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
    valueFormatter: valueFormatter
  },
  {
    headerName: "Molecular Weight",
    headerClass: "table-header",
    field: "drugSubstance.physicalAndChemicalProperties.molecularWeight",
    sortable: true,
    filter: true,
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

]