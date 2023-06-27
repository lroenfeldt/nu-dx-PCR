import React from 'react';
import './css/style.css';
function ArrowBox({ children, direction, style }) {
  return (
    <div className={`arrow_box ${direction}`}>
      <div className="content" style={{ ...style }}>
        {children}
      </div>
    </div>
  );
}

export default ArrowBox;
