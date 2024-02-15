import { ISwitch } from "../../types/components/index";
import "./Switch.css";

const Switch = ({ label, onClick, checked = false }: ISwitch) => {
  return (
    <label className="switch">
      <input type="checkbox" onChange={onClick} checked={checked} />
      <span className="slider">{label}</span>
    </label>
  );
};

export default Switch;
