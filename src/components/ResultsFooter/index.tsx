import React from 'react';
import Block from '../Block';
import Button from '../Button';
import Checkmark from '../Checkmark';
import AlteredResult from '../AlteredResult';
import ChangeResults from '../ChangeResults';
import { VscGraphLine } from 'react-icons/vsc';
import { useLocation } from 'react-router-dom';
import { ISettings, ITestProcedure } from '../../types/interfaces/settings';
import { IBarcode } from '../../types/interfaces/interfaces';

interface ResultsFooterProps {
  activeBarcode: IBarcode; 
  testmethod: ITestProcedure;   
  settings: ISettings;      
  barcodes: IBarcode[];    
  locale?: string;
  navigate: (path: string) => void;
}

const ResultsFooter: React.FC<ResultsFooterProps> = ({
  activeBarcode,
  testmethod,
  settings,
  barcodes,
  locale = 'en',
  navigate,
}) => {
  const location = useLocation();
  return (
    <div className={`resultContainer`}>
      <Block white height={40} width={170} radius={5} center align={'center'} shadow>
        <h4>{activeBarcode.value} </h4>
      </Block>
      {testmethod.showResults && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            bottom: 'auto',
            left: 'auto',
            right: 'auto',
            overflow: 'visible',
          }}
        >
          <Button
            style={{
              width: 125,
              padding: 14,
              fontSize: 16,
              ...(barcodes.filter((barcode) => barcode.id == activeBarcode.id)[0]?.result?.length > 9 && {
                minWidth: 12 * barcodes.filter((barcode) => barcode.id == activeBarcode.id)[0]?.result?.length,
              }),
              transition: '.3s',
              borderRadius: !settings.account.changeResults ? 30 : '30px 0px 0px 30px',
              position: 'relative',
              backgroundColor:
                barcodes.filter((barcode) => barcode.id == activeBarcode.id)[0]?.result == 'invalid'
                  ? 'orange'
                  : testmethod.results.find((result) =>
                      result.name.includes(barcodes.filter((barcode) => barcode.id == activeBarcode.id)[0]?.result)
                    )?.color,
              color: '#fff',
              borderWidth: 0,
              cursor: !settings.account.changeResults ? 'auto' : 'pointer',
              justifyContent: 'center',
            }}
          >
            {barcodes.filter((barcode) => barcode.id == activeBarcode.id)[0]?.result == 'invalid'
              ? 'invalid'
              : testmethod.results.find(
                  (result) =>
                    result.name.includes(barcodes.filter((barcode) => barcode.id == activeBarcode.id)[0]?.result) ||
                    result.name == barcodes.filter((barcode) => barcode.id == activeBarcode.id)[0]?.result
                )?.['label' + locale?.toUpperCase()] ||
                barcodes.filter((barcode) => barcode.id == activeBarcode.id)[0]?.result}

            <AlteredResult
              activeBarcode={barcodes.filter((barcode) => barcode.id == activeBarcode.id)[0]}
              testmethod={testmethod}
            />
            <Checkmark
              barcode={barcodes.filter((barcode) => barcode.id == activeBarcode.id)[0]}
              style={{
                right: 0,
                fontSize: 20,
                maxWidth: 50,
              }}
            />
          </Button>
          <ChangeResults activeBarcode={activeBarcode} testmethod={testmethod} />
        </div>
      )}
      <Block justify="space-between" gap={20}>
        {testmethod.parameters.map((parameter) => {
          if (parameter.isPrimary && parameter.showCT) {
            const {target} :{target:any} = parameter;
            return (
              <div key={parameter.target.toString()} className="resultBadge ct">
                CT:{' '}
                {activeBarcode.parameters?.[target]
                  ? activeBarcode.parameters?.[target]?.ct
                  : activeBarcode.parameters?.[target.toLowerCase()]?.ct}
              </div>
            );
          }
        })}

        {testmethod.showCurves && !location.pathname.includes('viewCurves') && (
          <Button className="btn-viewCurve" onClick={() => navigate(`/viewCurves/${activeBarcode.id}`)}>
            <VscGraphLine size={45} />
          </Button>
        )}
      </Block>
    </div>
  );
};

export default ResultsFooter;
