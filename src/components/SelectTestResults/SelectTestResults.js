import React, { useCallback, useEffect } from 'react';
import { useData, useTranslation } from '../../hooks';
import { VscChromeClose } from 'react-icons/vsc';
import './css/SelectTestResults.css';
import Block from '../Block';
const SelectTestResults = ({ onSelect, onClose }) => {
  const {
    testid,
    barcodes,
    settings,
    newResults,
    setBarcodes,
    resetBarcodes,
    selectedMethod,
    selectedPosition,
    setSelectedPosition,
  } = useData();

  const { t, locale } = useTranslation();
  const testmethod = settings.account.testprocedures.find((procedure) => procedure.id == selectedMethod);
  useEffect(() => {
    var modal = document.getElementById('modal');
    window.onclick = function (event) {
      if (event.target == modal && onClose != null) {
        onClose();
      }
    };
  }, []);
  const handleChooseResult = useCallback(
    async (result) => {
      onSelect();
      const barcode = barcodes.find((barcode) => barcode.posName == selectedPosition);
      if (barcode.result == result.name) return;

      const newResult = {
        [selectedPosition]: result.name,
      };
      setBarcodes((prev) => {
        return prev.map((barcode) => {
          if (barcode.posName == selectedPosition) {
            console.log(barcode.oldResult);
            return {
              ...barcode,
              result: result.name,
              alteredResult: true,
            };
          }
          return barcode;
        });
      });

      setSelectedPosition(null);
      await window.api.editResults(testid, newResult);
    },
    [onSelect, selectedPosition, testmethod.id]
  );
  const handleResetResult = useCallback(async () => {
    onSelect();
    const newResult = {
      [selectedPosition]: null,
    };
    setBarcodes((prev) => {
      return prev.map((barcode) => {
        if (barcode.posName == selectedPosition) {
          return {
            ...barcode,
            result: barcode.oldResult != '' ? barcode.oldResult : 'invalid',
            alteredResult: false,
          };
        }
        return barcode;
      });
    });
    setSelectedPosition(null);
    await window.api.editResults(testid, newResult);
  }, [onSelect, selectedPosition, testmethod.id]);

  return (
    <>
      <div id="modal" className="overlay" onClick={onClose}></div>
      <div className="overlay-body">
        <div className="overlay-header">
          <h2>{t('common.selectResult')}</h2>

          <div className="closebtn" onClick={onClose}>
            <VscChromeClose color="#fff" size={30} />
          </div>
        </div>
        <div className="overlay-content">
          {testmethod?.results.map((result, index) => {
            return (
              <button
                className={result.name}
                style={{
                  color: '#fff',
                  background: result.color,
                  borderRadius: 15,
                }}
                key={result.id}
                onClick={() => handleChooseResult(result)}
              >
                {result['label' + locale?.toUpperCase()] || result.name.toUpperCase()}
              </button>
            );
          })}
          <button
            style={{
              color: '#fff',
              background: 'orange',
              borderRadius: 15,
            }}
            onClick={() => handleChooseResult({ name: 'invalid' })}
          >
            Invalid
          </button>
          <button
            style={{
              color: '#fff',
              background: 'grey',
              borderRadius: 15,
            }}
            onClick={() => handleResetResult()}
          >
            {t('common.resetResult')}
          </button>
        </div>
      </div>
    </>
  );
};
export default SelectTestResults;
