import { useNavigate, useParams } from "react-router-dom";

const BrandNameCellRenderer = (params: any) => {
  const navigate = useNavigate();
  const { ccategory, searchtext } = useParams();

  const handleClick = () => {
    if (ccategory && params.data?.cid) {
      navigate(`/${ccategory}/${searchtext}/${params.data.cid}/${params.data.version}`);
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