import './style.css';

interface RadioButtonProps {
  checked?: boolean;
  label: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  value?: string | number | readonly string[];
  name: string;
}

const RadioButton = ({ checked, label, onChange, value, name }: RadioButtonProps) => {
  return (
    <div className="radioButton-container">
      <label>
        <input type="radio" value={value} checked={checked} name={name} onChange={onChange} />
        <span>{label}</span>
      </label>
    </div>
  );
};

export default RadioButton;
