import { useCallback } from 'react';
import { useData, useResults, useTranslation } from '../hooks';
import { useNavigate, useLocation } from 'react-router-dom';

interface HideErrorProps {
  type?: string;
  index: number;
  remember?: boolean;
}

interface ErrorObject {
  filter: any;
  type: string;
  index: number;
}

interface Error {
  message: string;
  type: string;
}

interface HideErrorProps {
  index: number;
}

interface MoveResultProps {
  testId: string;
}

const Errors = () => {
  const { setOfflineMode, reboot, errors, reset, testid, setDeviceStatus, startTest, setErrors }: any = useData();
  const { submitResult }: any = useResults();
  const { t }: any = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const hideError = useCallback(
    ({ type, index, remember }: HideErrorProps) => {
      if (type)
        setErrors((prevErrors: ErrorObject[]) => prevErrors.filter((error: ErrorObject) => error.type !== type));
      if (remember) setOfflineMode(true);
      if (index || index === 0)
        setErrors((prevErrors: ErrorObject[]) => prevErrors.filter((error) => error.index !== index));
    },
    [setErrors, setOfflineMode]
  );

  const cancelTest = () => {
    setErrors((prevErrors: ErrorObject[]) => prevErrors.filter((error: ErrorObject) => error.type !== 'cancelTest'));
    navigate('/selectMethod');
    window.api.endLineGene();
    setDeviceStatus('IDLE');
  };

  const launchOffline = () => {
    setErrors(errors.filter((e: ErrorObject) => e.type !== 'offline'));
    navigate('/selectMethod');
    setOfflineMode(true);
  };

  const activateOffline = (errIndex: number) => {
    setOfflineMode(true);
    hideError({ index: errIndex });
  };

  const handleReadError = useCallback(
    (errIndex: number) => {
      reset();
      hideError({ index: errIndex });
      if (location.pathname === '/uploadResults') {
        navigate('/selectMethod');
      } else {
        navigate('/ResultList');
      }
    },
    [reset, hideError, location.pathname, navigate]
  );

  const ErrorsType1 = ['pairing', 'auth', 'init'];
  const ErrorsType2 = ['stillOffline', 'invalid', 'testFailed'];

  return (
    <div className="errorContainer">
      {errors.map((error: Error, i: number) => {
        if (ErrorsType1.includes(error.type)) {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>

              <button
                onClick={() => {
                  if (error.type === 'pairing') {
                    window.location.href = '/';
                  } else {
                    window.location.reload();
                    hideError({ index: i });
                  }
                }}
              >
                {t('common.retry')}
              </button>

              <button onClick={() => reboot()}>{t('common.reboot')}</button>
            </div>
          );
        }
        if (error.type === 'lid') {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button onClick={() => reboot()}>{t('common.reboot')}</button>
              <button onClick={() => hideError({ index: i })}>{t('common.close')}</button>
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
                  {t('common.retry')}
                </button>
              }
              {<button onClick={() => launchOffline()}>{t('common.offlineMode')}</button>}
            </div>
          );
        }
        if (error.type === 'submit') {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button
                onClick={() => {
                  hideError({ index: i } as HideErrorProps);
                  setTimeout(() => {
                    submitResult(testid);
                  }, 3000);
                }}
              >
                {t('common.retry')}
              </button>
              <button onClick={() => activateOffline(i)}>{t('common.offline')}</button>
              <button
                onClick={() => {
                  hideError({ index: i });
                  navigate('/selectMethod');
                }}
              >
                {t('common.close')}
              </button>
            </div>
          );
        }
        if (ErrorsType2.includes(error.type)) {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button onClick={() => hideError({ index: i })}>{t('common.close')}</button>
            </div>
          );
        }
        if (error.type === 'moveResults') {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button
                onClick={() => {
                  hideError({ index: i } as HideErrorProps);
                  setTimeout(() => {
                    if (!window.api.moveResultFile(testid as MoveResultProps)) {
                      console.log('result for test ' + testid + ' could not be moved');
                      window.api.logEvents(`Result for test ${testid} could not be moved`, 'logInfos.txt');
                      setErrors((prevErrors: ErrorObject) =>
                        prevErrors
                          .filter((err: ErrorObject) => err.type !== 'moveResults')
                          .concat({
                            type: 'moveResults',
                            message: t('errors.failedToMoveResults'),
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
                {t('common.retry')}
              </button>
              <button
                onClick={() => {
                  reset();
                  navigate('/selectMethod');
                }}
              >
                {t('common.cancel')}
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
                {t('common.testAbort') + ' & ' + t('common.reboot')}
              </button>
              <button onClick={() => hideError({ type: 'cancelTest', index: 0 })}>{t('common.testResume')}</button>
            </div>
          );
        }
        if (error.type === 'startTest') {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button onClick={() => startTest()}>{t('common.retry')}</button>
              <button
                onClick={() => {
                  reset();
                  navigate('/selectMethod');
                }}
              >
                {t('common.cancel')}
              </button>
            </div>
          );
        }
        if (error.type === 'read') {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button onClick={() => handleReadError(i)}>{t('common.close')}</button>
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
                  {t('common.retry')}
                </button>
              }
              <button onClick={() => hideError({ index: i, remember: true })}>{t('common.offlineMode')}</button>
            </div>
          );
        }
        if (error.type === 'offlineNotAllow') {
          return (
            <div key={i} className="errorMessage">
              <p>{error.message}</p>
              <button onClick={() => window.location.reload()}>{t('common.retry')}</button>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default Errors;
