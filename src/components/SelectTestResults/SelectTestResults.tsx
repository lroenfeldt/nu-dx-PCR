import { useCallback, useEffect } from 'react';
import { useData, useTranslation } from '../../hooks';
import { VscChromeClose } from 'react-icons/vsc';
import './css/SelectTestResults.css';
import { IBarcode, ISelectTestResults } from '../../types/interfaces/interfaces';
import { Result, Testprocedure } from '../../types/interfaces/settings';

const SelectTestResults = ({ onSelect, onClose }: ISelectTestResults) => {
  const { testid, selectedMethod, setSelectedPosition, setBarcodes, settings, selectedPosition } = useData();
  const { barcodes }: { barcodes: IBarcode[] } = useData();

  const { t, locale } = useTranslation();
  const testmethod: Testprocedure | undefined = settings.account.testprocedures.find(
    (procedure) => procedure.id == selectedMethod
  );
  useEffect(() => {
    var modal = document.getElementById('modal');
    window.onclick = function (event) {
      if (event.target == modal && onClose != null) {
        onClose();
      }
    };
  }, []);
  const handleChooseResult = useCallback(
    async (result: Result) => {
      onSelect();
      const barcode: IBarcode | undefined = barcodes.find((barcode: IBarcode) => barcode.posName == selectedPosition);
      if (!barcode) {
        console.log('Barcode not found');
        return;
      }
      if (barcode.result == result.name) return;
      const newResult = {
        [selectedPosition as string]: result.name,
      };
      setBarcodes((prev: IBarcode) => {
        return prev.map((barcode: IBarcode) => {
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
    [onSelect, selectedPosition, testmethod!.id]
  );
  const handleResetResult = useCallback(async () => {
    onSelect();
    const newResult = {
      [selectedPosition as string]: null,
    };
    setBarcodes((prev: IBarcode) => {
      return prev.map((barcode: IBarcode) => {
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
  }, [onSelect, selectedPosition, testmethod!.id]);
  // TypeScript is warning that `testmethod` could potentially be `undefined`,
  // and therefore doesn't have an `id` property.
  // possible to check with if condition
  // if (testmethod) {
  // [onSelect, selectedPosition, testmethod.id]
  // }
  // or
  // give info to TS that testmethod wont be undefined with the ! operator

  return (
    <>
      <div id="modal" className={'overlay '} onClick={onClose}></div>
      <div className={`animate overlay-body  `}>
        <div className="overlay-header">
          <h2>{t('common.selectResult')}</h2>

          <div className="closebtn" onClick={onClose}>
            <VscChromeClose color="#fff" size={30} />
          </div>
        </div>
        <div className="overlay-content">
          {testmethod?.results.map((result: Result, index: number) => {
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
            onClick={() =>
              handleChooseResult({
                name: 'invalid',
                procedure: '',
                id: 0,
                result: '',
                color: '',
                conditions: '',
                labelEN: null,
                labelFR: null,
                labelDE: null,
                test_type_id: '',
                tooltipDE: null,
                tooltipEN: null,
                tooltipFR: null,
                countInStatistic: null,
                isSubmitting: false,
                writingSuccess: false,
                submittingSuccess: false,
                isWriting: false,
                testid: '',
                resultType: {
                  conditions: '',
                  name: '',
                },
              })
            }
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
