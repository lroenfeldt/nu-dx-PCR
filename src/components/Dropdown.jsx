import React from 'react';

export default function Dropdown({ title, elements, handleClick }) {
  return (
    <div className="dropdown">
      <button className="dropbtn">{title.toUpperCase()}</button>
      <div className="dropdown-content">
        {elements.map((element) => (
          <div onClick={() => handleClick(element)}>{element}</div>
        ))}
      </div>
    </div>
  );
}
