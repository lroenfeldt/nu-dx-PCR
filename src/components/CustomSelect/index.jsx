import React, { useState } from 'react';
import './css/styles.css';
const CustomSelect = ({ options, defaultValue, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue || options[0]);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    if (onChange) {
      onChange(event.target.value);
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
