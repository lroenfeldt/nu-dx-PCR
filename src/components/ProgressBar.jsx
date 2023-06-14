import React from 'react';

const ProgressBar = ({ startTime, remTime }) => {
  let progress = 100 - (100 / startTime) * remTime;

  return (
    <div className="progress-outer">
      <div className="progress-inner" style={{ width: `${progress}%` }} />
    </div>
  );
};

export default ProgressBar;
