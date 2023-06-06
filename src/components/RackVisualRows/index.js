import React, { useMemo, memo } from 'react';
import { useData } from '../../hooks';
import WellVisual from '../WellVisual';

const RackVisualRows = (props) => {
  const { active, markActive, showResults, testmethod } = props;
  const { settings, isNinetySix, barcodes } = useData();
  let rackVisualRows = [];

  const length = isNinetySix ? 12 : 8;
  barcodes.forEach((barcode) => {
    let rowName = Math.ceil(barcode?.id / length) - 1;
    if (!rackVisualRows[rowName]) {
      rackVisualRows[rowName] = [];
    }
    rackVisualRows[rowName].push(
      <WellVisual
        key={barcode.id}
        barcode={barcode}
        active={active}
        markActive={markActive}
        showResults={showResults}
        testmethod={testmethod}
      />
    );
  });

  const rackVisualization = useMemo(
    () =>
      rackVisualRows.map((row, index) => {
        return (
          <div key={index} className={'rackRow'}>
            {row}
          </div>
        );
      }),
    [rackVisualRows, active]
  );

  return (
    <div className={`rackVisualization ${isNinetySix ? ' ninetySix' : ''} ${showResults ? ' results' : ''}`}>
      {rackVisualization}
    </div>
  );
};

export default RackVisualRows;
