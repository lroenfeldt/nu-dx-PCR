import React from 'react';
import { IoClose, IoCheckmarkSharp } from 'react-icons/io5';

import { useData } from '../hooks';
const Checkmark = ({ barcode, isNinetySix = false, style }) => {

  if (barcode?.label === 'NTC' && barcode?.result == 'negative') {
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

  if (barcode?.label === 'NTC' && barcode?.result != 'negative') {
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

  if (barcode?.label.slice(0,3) === 'TPC' && barcode?.result === 'positive') {
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
  
  if (barcode?.label.slice(0,3) === 'TPC' && barcode?.result != 'positive') {
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
