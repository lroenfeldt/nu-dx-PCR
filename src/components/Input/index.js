import React from 'react';

const Input = ({ type, value, name, onChange, placeholder, label }) => {
  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      <input type={type} value={value} name={name} onChange={onChange} placeholder={placeholder} id={name} />
    </div>
  );
};

export default Input;
