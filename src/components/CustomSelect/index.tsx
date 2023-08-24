import { ChangeEvent, useState } from 'react';
import './css/styles.css';
import { ICustomSelect } from '../../types/interfaces/interfaces';

const CustomSelect: React.FC<ICustomSelect> = ({ options, defaultValue, onChange }) => {
  const [selectedOption, setSelectedOption] = useState<string>(defaultValue || options[0]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="custom-select-container">
      <select className="custom-select" value={selectedOption} onChange={handleChange}>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomSelect;
