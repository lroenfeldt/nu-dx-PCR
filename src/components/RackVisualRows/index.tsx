import { useMemo } from 'react';
import { useData } from '../../hooks';
import WellVisual from '../WellVisual';

interface Barcode {
  id: number;
}

const RackVisualRows = (props: {
  active: boolean;
  markActive: boolean;
  showResults: boolean;
  testmethod: null | undefined;
}) => {
  const { active, markActive, showResults, testmethod } = props;
  const { isNinetySix, barcodes }: any = useData();
  let rackVisualRows: any = [];

  const length = isNinetySix ? 12 : 8;
  barcodes.forEach((barcode: Barcode) => {
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
      rackVisualRows.map((row: number, index: number) => {
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
