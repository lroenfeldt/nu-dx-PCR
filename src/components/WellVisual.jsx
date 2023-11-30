import React, { memo } from 'react';

import { TailSpin } from 'react-loader-spinner';
import { useData } from '../hooks';
import Checkmark from './Checkmark';

const WellVisual = ({ barcode, active, markActive, showResults = false, testmethod = null }) => {
  const { settings, isNinetySix, selectedMethod } = useData();

  let result = false;
  if (showResults) {
    if (testmethod.type && testmethod.type === 'SNP') {
      result = barcode.result === 'invalid' ? '-' : barcode.result;
    }

    if (testmethod.type && testmethod.type === 'Absolute') {
      testmethod.parameters.map((parameter) => {
        if (parameter.isPrimary) {
          result = barcode.parameters?.[parameter.target]
            ? barcode.parameters?.[parameter.target]?.ct
            : barcode.parameters?.[parameter.target.toLowerCase()]?.ct;
        }
      });
    }

    if (testmethod.id === '3d434132-3941-4ce3-819a-0304aea93ae0' && (barcode.result == 'positive' || barcode.result == 'suspicious1' || barcode.result == 'suspicious2')) {
      testmethod.parameters.map((parameter) => {
        if (parameter.isPrimary) {
          result = barcode.parameters?.[parameter.target]
            ? barcode.parameters?.[parameter.target]?.ct
            : barcode.parameters?.[parameter.target.toLowerCase()]?.ct;
        }
      })
    
      if (!result || result == 0 || result == '-' || result === undefined) {
        testmethod.parameters.map((parameter) => {
          if (parameter.id == '66d855b7-b390-4f6c-a909-ad4b3288a9d0') {
            result = barcode.parameters?.[parameter.target]
            ? barcode.parameters?.[parameter.target]?.ct
            : barcode.parameters?.[parameter.target.toLowerCase()]?.ct;
          }
        })
      }
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
            barcode.label.slice(0,3) == 'NTC' || barcode.label.slice(0,3) == 'TPC'
              ? null
              : barcode.result === 'invalid'
              ? 'orange'
              : testmethod.results.find((result) => result.name.includes(barcode.result))?.color,
        }}
        onClick={() => {
          markActive(barcode.id);
        }}
      >
        <div>
          <span>{barcode.label}</span>
          <br />

                <span
                  style={{ fontWeight: 'normal', fontSize: isNinetySix ? 12 : 16, wordBreak: 'break-word' }}
                >
                  {result ? (result !== '0' ? result : '-') : '-'}
                </span>

        </div>
        <div key={barcode.label.toString()} className="spinnerContainer">
          <TailSpin heigth="70" width="70" color="white" />
        </div>
        <Checkmark barcode={barcode} isNinetySix={isNinetySix} />
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
            ${(barcode.value.slice(0,3) === 'TPC' || barcode.value.slice(0,3) === 'NTC') && settings.account.autoControl ? 'blocked' : ''} 
            ${barcode.result ? 'res_' + barcode.result : ''}
        `}
        onClick={() => {
          markActive(barcode.id);
        }}
      >
        <span>{barcode.label}</span>
        <div className="spinnerContainer">
          {isNinetySix ? (
            <TailSpin heigth="40" width="40" color="white" />
          ) : (
            <TailSpin heigth="70" width="70" color="white" />
          )}
        </div>
      </div>
    );
  }
};

export default WellVisual;
