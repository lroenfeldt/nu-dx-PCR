import React from 'react';
import { useData } from '../../hooks';
import { hexToRGB } from '../../utils/helper';
import { SlPencil } from 'react-icons/sl';

const AlteredResult = ({ activeBarcode, testmethod, style }) => {
  const { settings } = useData();

  if (activeBarcode?.alteredResult)
    return (
      <div
        className="alteredResult"
        style={{
          top: settings.account.ChangeResults ? 0 : 15,
          backgroundColor:
            activeBarcode?.result == 'invalid'
              ? 'orange'
              : hexToRGB(testmethod.results.find((result) => result.name.includes(activeBarcode?.result))?.color, 0.9),
          ...style,
        }}
      >
        <SlPencil color="#fff" size={10} />
      </div>
    );
  return null;
};

export default AlteredResult;
