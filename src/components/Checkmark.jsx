import React from 'react';
import { IoClose, IoCheckmarkSharp } from 'react-icons/io5';

import { useData } from '../hooks';
const Checkmark = ({ barcode, isNinetySix = false, style }) => {
  if (barcode?.result == 'invalid' && barcode?.label === 'NTC') {
    return (
      <div
        className={`checkmark`}
        style={{
          backgroundColor: 'var(--green)',
          ...style,
        }}
      >
        <IoCheckmarkSharp
          style={{
            fontSize: 'smaller',
          }}
        />
      </div>
    );
  }
  if (barcode?.result != 'invalid' && barcode?.label === 'NTC') {
    return (
      <div
        className={`checkmark`}
        style={{
          backgroundColor: 'var(--red)',
          ...style,
        }}
      >
        <IoClose />
      </div>
    );
  }
  if (barcode?.result === 'positive' && barcode?.label === 'TPC') {
    return (
      <div
        className={`checkmark`}
        style={{
          backgroundColor: 'var(--green)',
          ...style,
        }}
      >
        <IoCheckmarkSharp
          style={{
            fontSize: 'smaller',
          }}
        />
      </div>
    );
  }
  if (barcode?.result != 'positive' && barcode?.label === 'TPC') {
    return (
      <div
        className={`checkmark`}
        style={{
          backgroundColor: 'var(--red)',
          ...style,
        }}
      >
        <IoClose />
      </div>
    );
  }
  return null;
};

export default Checkmark;
