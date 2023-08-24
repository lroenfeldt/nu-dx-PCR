import { TailSpin } from 'react-loader-spinner';
import { useData } from '../hooks';
import Checkmark from './Checkmark';
import { ITestedParameter, IWellVisual } from '../types/interfaces/interfaces';

const WellVisual = ({ barcode, active, markActive, showResults = false, testmethod = null }: IWellVisual) => {
  const { settings, isNinetySix } = useData();

  let result: string | undefined = undefined;
  if (showResults) {
    if (testmethod?.type && testmethod.type === 'Absolute') {
      testmethod.parameters?.map((parameter) => {
        if (parameter.isPrimary) {
          const targetParameter = barcode.parameters?.[+parameter.target];
          // conveting target into a number to index an array
          if (typeof targetParameter === 'object') {
            result = targetParameter.ct;
          } else if (typeof targetParameter === 'string') {
            const lowerCaseParameter = barcode.parameters?.[+parameter.target.toLowerCase()];
            if (typeof lowerCaseParameter === 'object') {
              result = lowerCaseParameter.ct;
            }
          }
        }
      });
    }
   
    return (
      <div
        key={barcode.id.toString()}
        className={`wellVisualization 
          ${isNinetySix ? 'ninetySix' : ''}
          ${showResults ? 'results' : ''}
            ${active === barcode.id ? 'active' : ''} 
            ${barcode.checking ? 'checking' : ''} 
            ${!barcode.result ? 'blocked' : ''}
		        `}
        style={{
          backgroundColor:
            barcode.label == 'NTC' || barcode.label == 'TPC'
              ? undefined // changed from null to undefined
              : barcode.result === 'invalid'
              ? 'orange'
              : testmethod?.results?.find((result) => result.name.includes(barcode.result))?.color,
        }}
        onClick={() => {
          markActive(barcode.id);
        }}
      >
        <div>
          <span>{barcode.label}</span>
          <br />
          {testmethod?.parameters?.map((testparameter: ITestedParameter) => {
            if (barcode.parameters?.[testparameter.target.toUpperCase()] && testparameter.isPrimary == true) {
              console.log('testparameter.target.toUpperCase()', testparameter.target.toUpperCase());
              return (
                <span
                  key={testparameter.target.toString()}
                  style={{ fontWeight: 'normal', fontSize: isNinetySix ? 12 : 16, wordBreak: 'break-word' }}
                >
                  {result ? (result !== '0' ? result : '-') : '-'}
                </span>
              );
            }
          })}
        </div>
        <div key={barcode.label.toString()} className="spinnerContainer">
          <TailSpin height="70" width="70" color="white" />
        </div>
        <Checkmark barcode={barcode} style={undefined} isNinetySix={isNinetySix} />
      </div>
    );
  } else {
    return (
      <div
        key={barcode.id.toString()}
        className={`wellVisualization
            ${isNinetySix ? 'ninetySix' : ''}
            ${active === barcode.id ? 'active' : ''} 
            ${barcode.valid ? 'valid' : ''} 
            ${barcode.checking ? 'checking' : ''} 
            ${!barcode.checking && barcode.value.length >= 1 && !barcode.valid ? 'invalid' : ''} 
            ${barcode.blocked ? 'blocked' : ''}
            ${(barcode.value === 'TPC' || barcode.value === 'NTC') && settings.account.autoControl ? 'blocked' : ''} 
            ${barcode.result ? 'res_' + barcode.result : ''}
        `}
        onClick={() => {
          markActive(barcode.id);
        }}
      >
        <span>{barcode.label}</span>
        <div className="spinnerContainer">
          {isNinetySix ? (
            <TailSpin height="40" width="40" color="white" />
          ) : (
            <TailSpin height="70" width="70" color="white" />
          )}
        </div>
      </div>
    );
  }
};

export default WellVisual;
