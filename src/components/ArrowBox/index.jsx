import React from 'react';
import './css/style.css';
function ArrowBox({ children, direction, style }) {
  return (
    <div className={`container ${direction}`} style={{ ...style }}>
      <div className="content">{children}</div>
    </div>
  );
}

export default ArrowBox;
