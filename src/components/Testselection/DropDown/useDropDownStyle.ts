import { useData } from "../../../hooks";

const useDropDownStyle = () => {
  const { isActive } = useData();

  const dropDown: React.CSSProperties = {
    position: "relative",
    width: "232px",
    height: "59.5px",
    border: "3.5px solid #0d77d9",
    borderRadius: "16px",
    cursor: "pointer",
    borderBottomLeftRadius: isActive ? "0px" : "16px",
    borderBottomRightRadius: isActive ? "0px" : "16px",
  };

  const valuesStyle: React.CSSProperties = {
    padding: "12px 24px",
    cursor: "pointer",
    color: "#0d77d9",
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "24px",
  };

  const option: React.CSSProperties = {
    position: "absolute",
    top: "52.5px",
    left: "-3.3px",
    width: "232px",
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
    borderBottomLeftRadius: "16px",
    borderBottomRightRadius: "16px",
    overflow: "hidden",
    display: isActive ? "block" : "none",
    zIndex: 1,
    border: "3.5px solid #0d77d9",
    cursor: "pointer",
  };

  const child: React.CSSProperties = {
    borderTop: "3.5px solid #0d77d9",
  };

  return { dropDown, option, valuesStyle, child };
};

export default useDropDownStyle;
