import { colors } from "../../assets/theme";
import { Arrow } from "../Icons";

const divStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  width: "232px",
  border: `4px solid ${colors.primary.main}`,
  borderRadius: "16px",
  backgroundColor: "#fff",
};

const selectStyle: React.CSSProperties = {
  height: "100%",
  width: "100%",
  border: "none",
  borderRadius: "16px",
  outline: "none",
  appearance: "none",
  padding: "12px 24px",
  color: colors.primary.main,
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 600,
  fontSize: "24px",
  cursor: "pointer",
};

const iconStyle: React.CSSProperties = {
  position: "absolute",
  right: 15,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const DropDown = () => {
  return (
    <div style={divStyle}>
      <select style={selectStyle}>
        <option value="test-name">Test name</option>
        <option value="runtime">Runtime</option>
        <option value="producer">Producer</option>
      </select>
      {/* <div style={iconStyle}>
        <Arrow />
      </div> */}
    </div>
  );
};

export default DropDown;
