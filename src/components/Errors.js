import React, { useCallback } from 'react';
import { useData, useResults, useTranslation } from '../hooks';
import { useNavigate, useLocation } from 'react-router-dom';

const Errors = () => {
  const { setOfflineMode, reboot, errors, reset, testid, setTestid, setDeviceStatus, startTest, setErrors } = useData();
  const { checkUSB, saveToUSB, submitAll, getResults, submitResult, saveAllToUSB } = useResults();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const hideError = ({ type, index, remember }) => {
    if (type) setErrors((prevErrors) => prevErrors.filter((error) => error.type !== type));
    if (remember) setOfflineMode(true);
    if (index || index == 0) setErrors((prevErrors) => prevErrors.filter((error, errIndex) => errIndex != index));
  };
  const cancelTest = () => {
    setErrors((prevErrors) => prevErrors.filter((error) => error.type !== 'cancelTest'));
    navigate('/selectMethod');
    window.api.endLineGene();
    setDeviceStatus('IDLE');
  };
  const launchOffline = () => {
    setErrors(errors.filter((e) => e.type != 'offline'));
    navigate('/selectMethod');
    setOfflineMode(true);
  };
  const activateOffline = (errIndex) => {
    setOfflineMode(true);
    hideError({ index: errIndex });
  };
  const handleReadError = useCallback(
    (errIndex) => {
      reset();
      hideError({ index: errIndex });
      if (location.pathname === '/uploadResults') {
        navigate('/selectMethod');
      } else {
        navigate('/ResultList');
      }
    },
    [reset, hideError]
  );

  const ErrorsType1 = ['pairing', 'auth', 'init'];
  const ErrorsType2 = ['stillOffline', 'invalid', 'testFailed'];
  return (
    <div className="errorContainer">
      {errors.map((error, i) => {
        if (ErrorsType1.includes(error.type)) {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>

              <button
                onClick={() => {
                  window.location.reload();
                  hideError({ index: i });
                }}
              >
                {t('default.common.retry')}
              </button>

              <button onClick={() => reboot()}>{t('default.common.reboot')}</button>
            </div>
          );
        }
        if (error.type === 'lid') {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button onClick={() => reboot()}>{t('default.common.reboot')}</button>
              <button onClick={() => hideError({ index: i })}>{t('default.common.close')}</button>
            </div>
          );
        }

        if (error.type === 'offline') {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              {
                <button
                  onClick={() => {
                    window.location.reload();
                    hideError({ index: i });
                  }}
                >
                  {t('default.common.retry')}
                </button>
              }
              {<button onClick={() => launchOffline()}>{t('default.common.offlineMode')}</button>}
            </div>
          );
        }
        if (error.type === 'submit') {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button
                onClick={() => {
                  hideError({ index: i });
                  setTimeout(() => {
                    submitResult(testid);
                  }, 3000);
                }}
              >
                {t('default.common.retry')}
              </button>
              <button onClick={() => activateOffline(i)}>{t('default.common.offline')}</button>
              <button
                onClick={() => {
                  hideError({ index: i });
                  navigate('/selectMethod');
                }}
              >
                {t('default.common.close')}
              </button>
            </div>
          );
        }
        if (ErrorsType2.includes(error.type)) {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button onClick={() => hideError({ index: i })}>{t('default.common.close')}</button>
            </div>
          );
        }
        if (error.type === 'moveResults') {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button
                onClick={() => {
                  hideError({ index: i });
                  setTimeout(() => {
                    if (!window.api.moveResultFile(testid)) {
                      console.log('result for test ' + testid + ' could not be moved');
                      window.api.logEvents(`Result for test ${testid} could not be moved`, 'logInfos.txt');
                      setErrors((prevErrors) =>
                        prevErrors
                          .filter((err) => err.type != 'moveResults')
                          .concat({
                            type: 'moveResults',
                            message: t('default.errors.failedToMoveResults'),
                          })
                      );
                    } else {
                      console.log('attempting to move result file');
                      window.api.logEvents(`attempting to move result file`, 'logInfos.txt');
                      setTimeout(() => {
                        navigate('/uploadResults');
                      }, 2000);
                    }
                  }, 1000);
                }}
              >
                {t('default.common.retry')}
              </button>
              <button
                onClick={() => {
                  reset();
                  navigate('/selectMethod');
                }}
              >
                {t('default.common.cancel')}
              </button>
            </div>
          );
        }
        if (error.type === 'cancelTest') {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button
                onClick={() => {
                  cancelTest();
                  reboot();
                }}
              >
                {t('default.common.testAbort') + ' & ' + t('default.common.reboot')}
              </button>
              <button onClick={() => hideError({ type: 'cancelTest' })}>{t('default.common.testResume')}</button>
            </div>
          );
        }
        if (error.type === 'startTest') {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button onClick={() => startTest()}>{t('default.common.retry')}</button>
              <button
                onClick={() => {
                  reset();
                  navigate('/selectMethod');
                }}
              >
                {t('default.common.cancel')}
              </button>
            </div>
          );
        }
        if (error.type === 'read') {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button onClick={() => handleReadError(i)}>{t('default.common.close')}</button>
            </div>
          );
        }
        if (error.type === 'dbCon') {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              {
                <button
                  onClick={() => {
                    window.location.reload();
                    hideError({ index: i });
                  }}
                >
                  {t('default.common.retry')}
                </button>
              }
              <button onClick={() => hideError({ index: i, remember: true })}>{t('default.common.offlineMode')}</button>
            </div>
          );
        }
        if (error.type === 'offlineNotAllow') {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button onClick={() => window.location.reload()}>{t('default.common.retry')}</button>
            </div>
          );
        }
        return '';
      })}
    </div>
  );
};

export default Errors;
