import { JSX } from 'react/jsx-runtime';
import { useData } from '../hooks';
import WellVisual from './WellVisual';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

interface RackVisualizationProp {
  markActive: boolean;
  active: boolean;
  testmethod: any;
}

interface Barcode {
  id: number;
}

interface RackVisualRows {
  map(arg0: (row: number, index: number) => JSX.Element): ReactNode;
  [index: number]: JSX.Element[];
}

const RackVisualization = ({ markActive, active, testmethod }: RackVisualizationProp) => {
  const { barcodes }: any = useData();

  //Create RackVisualization
  let rackVisualRows: RackVisualRows = [];
  barcodes.map((barcode: Barcode) => {
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
      {rackVisualRows.map((row: number, index: number) => (
        <div key={index} className={'rackRow'}>
          {row}
        </div>
      ))}
    </div>
  );
};

export default RackVisualization;
