import React from 'react';
import { useData } from '../hooks';
import WellVisual from './WellVisual';

const RackVisualization = ({ markActive, active, testmethod }) => {
  const { barcodes } = useData();

  //Create RackVisualization
  let rackVisualRows = [];
  barcodes.map((barcode) => {
    let rowName = Math.ceil(barcode.id / 8) - 1;
    console.log(rowName);
    if (!rackVisualRows[rowName]) {
      rackVisualRows[rowName] = [];
    }
    rackVisualRows[rowName].push(
      <WellVisual
        key={barcode.id.toString()}
        barcode={barcode}
        active={active}
        markActive={markActive}
        showResults={true}
        testmethod={testmethod}
      />
    );
  });

  return (
    <div className="rackVisualization ">
      {rackVisualRows.map((row, index) => (
        <div key={index} className={'rackRow'}>
          {row}
        </div>
      ))}
    </div>
  );
};

export default RackVisualization;
