import { IRadioButton } from "../../types/components/index";
import "./style.css";

const RadioButton = ({
  checked,
  label,
  onChange,
  value,
  name,
}: IRadioButton) => {
  return (
    <div className="radioButton-container">
      <label>
        <input
          type="radio"
          value={value}
          checked={checked}
          name={name}
          onChange={onChange}
        />
        <span>{label}</span>
      </label>
    </div>
  );
};

export default RadioButton;
