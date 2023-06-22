import React from 'react';
import './style.css';
const RadioButton = ({ checked, label, onChange, value, name }) => {
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
