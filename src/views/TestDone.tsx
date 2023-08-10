import { useState, useEffect } from 'react';
import { useData } from '../hooks';
import { Oval } from 'react-loader-spinner';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useResults, useTranslation } from '../hooks';

const TestDone = () => {
  const { reset, testid, settings, offlineMode, testDone, resultsSubmitted, setDeviceStatus, selectedMethod } =
    useData();

  const [USBPresent, setUSBPresent] = useState(false);
  const navigate = useNavigate();
  const { checkUSB, saveToUSB, submitResult }: any = useResults();
  const { t } = useTranslation();
  const testmethod = settings.account.testprocedures.find((testmethod) => testmethod.id === selectedMethod);

  let buttonUSB;
  if (USBPresent) {
    buttonUSB = <button onClick={() => saveToUSB(testid, testDone)}>{t('results.saveToUSB')}</button>;
  } else {
    buttonUSB = (
      <button className="disabled" onClick={() => saveToUSB()}>
        {t('results.saveToUSB')}
      </button>
    );
  }

  //End Linegene and submit if online
  useEffect(() => {
    if (!resultsSubmitted) {
      if (!offlineMode && settings.account.submitResults) {
        //displayResults(testid)
        submitResult(testid);
      }
    }
  }, [offlineMode, resultsSubmitted, settings.account.submitResults, testid]);

  //Check if USB is Present
  useEffect(() => {
    setDeviceStatus('IDLE');
    checkUSB();
    const clearcheckUSB = setInterval(() => checkUSB(), 3000);
    return () => clearInterval(clearcheckUSB);
  }, []);

  //Output
  if (offlineMode) {
    return (
      <div className="TestDone">
        <div className="spinnerContainer">
          <FaCheckCircle />
        </div>
        <h2>{t('results.title')}</h2>
        <p>{t('results.instructions')}</p>
        <div className="buttonArea">
          {testmethod?.showResults ? (
            <button onClick={() => navigate('/ViewResults')}>{t('results.viewResults')}</button>
          ) : (
            ''
          )}
          {testmethod?.showResults ? buttonUSB : ''}
          <button
            onClick={() => {
              reset();
              navigate('/selectMethod');
            }}
          >
            {t('results.newTest')}
          </button>
        </div>
      </div>
    );
  } else if (resultsSubmitted || !settings.account.submitResults) {
    return (
      <div className="TestDone">
        <div className="spinnerContainer">
          <FaCheckCircle />
        </div>
        <h2>{!settings.account.submitResults ? t('results.success') : t('results.resultsSent')}</h2>
        <p>{t('results.startNewTest')}</p>
        <div className="buttonArea">
          {testmethod?.showResults ? buttonUSB : ''}
          {testmethod?.showResults ? (
            <button onClick={() => navigate('/ViewResults')}>{t('results.viewResults')}</button>
          ) : (
            ''
          )}
          <button
            onClick={() => {
              reset();
              navigate('/selectMethod');
            }}
          >
            {t('results.newTest')}
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="TestDone">
        <div className="spinnerContainer">
          <Oval height="100" width="100" color="var(--primary)" />
        </div>
        <h2>{t('results.waitingForResults')}</h2>
        <p>{t('results.wait')}</p>
        <div className="buttonArea discouraged">
          <button
            onClick={() => {
              reset();
              navigate('/selectMethod');
            }}
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    );
  }
};

export default TestDone;
