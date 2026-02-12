import { useNavigate, useParams } from "react-router-dom";

const BrandNameCellRenderer = (params: any) => {
  const navigate = useNavigate();
  const { ccategory, searchtext } = useParams();

  const handleClick = () => {
    // Handle both direct drug data and nested bookmark.drug structure
    const drugData = params.data?.drug || params.data;

    if (drugData?.cid) {
      // Use route params if available, otherwise use defaults
      const category = ccategory || 'all';
      const search = searchtext || drugData?.marketInformation?.drugName || drugData?.drugName || drugData?.cid || '';
      navigate(`/${category}/${encodeURIComponent(search)}/${drugData.cid}/${drugData.version}`);
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

export default BrandNameCellRenderer;