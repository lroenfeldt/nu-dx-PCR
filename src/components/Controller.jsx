import React, { useEffect, useState } from 'react';
import { ImArrowRight2, ImArrowLeft2 } from 'react-icons/im';
const ScrollController = ({ onClick, disabled }) => {
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState('next');

  return (
    <div className="controller">
      <div
        className="prev"
        onClick={() => {
          onClick(false);
          setDirection('prev');
        }}
      >
        <ImArrowLeft2 />
      </div>
      <div
        className={'next '}
        style={{ opacity: !disabled ? 1 : 0.5 }}
        onClick={() => {
          !disabled && setDirection('next');
          !disabled && onClick(true);
        }}
      >
        <ImArrowRight2 />
      </div>
    </div>
  );
};

export default ScrollController;
