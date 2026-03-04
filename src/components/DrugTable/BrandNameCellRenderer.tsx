import { useNavigate, useParams } from "react-router-dom";

const BrandNameCellRenderer = (params: any) => {
  const navigate = useNavigate();
  const { ccategory, searchtext } = useParams();

  const handleClick = () => {
    // Handle both direct drug data and nested bookmark.drug structure
    const drugData = params.data?.drug || params.data;

    if (drugData?.cid) {
      const category = ccategory || 'all';
      // Drug name — check all three API data shapes
      const drugName =
        drugData?.ProductOverview?.drugName ||
        drugData?.ProductOverview?.brandName ||
        drugData?.drugName ||
        drugData?.cid;
      const search = searchtext || drugName || drugData.cid;
      // Version lives inside ProductOverview
      const version = drugData?.ProductOverview?.version ?? 1;
      navigate(`/${category}/${encodeURIComponent(search)}/${drugData.cid}/${version}`);
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
