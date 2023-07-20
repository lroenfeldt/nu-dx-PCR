import './Switch.css';

interface SwitchProps {
  label: string;
  onClick: () => void;
  checked: boolean;
}

const Switch = ({ label, onClick, checked = false }: SwitchProps) => {
  return (
    <label className="switch">
      <input type="checkbox" onChange={onClick} checked={checked} />
      <span className="slider">{label}</span>
    </label>
  );
};

export default Switch;
