import React, { useState, useEffect } from 'react';

import { useData } from '../hooks';
import urls from '../config/settings';
import { Oval } from 'react-loader-spinner';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { extractBarcodes, parseResultsDB, parseResultsExport } from '../utils/parseResults';
import { useResults, useTranslation } from '../hooks';

const TestDone = () => {
  const {
    reset,
    demo,
    testid,
    errors,
    setErrors,
    settings,
    offlineMode,
    setOfflineMode,
    barcodes,
    setBarcodes,
    testDone,
    setTestDone,
    resultsSubmitted,
    setSubmitted,
    currentUser,
    test,
    setDeviceStatus,
    selectedMethod,
    USBPresent,
    setUSBPresent,
  } = useData();

  const userId = currentUser ? currentUser?.id : '';
  const navigate = useNavigate();
  const { checkUSB, saveToUSB, submitAll, getResults, submitResult, saveAllToUSB } = useResults();
  const { t, locale } = useTranslation();
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

  const hideError = (index) => {
    setErrors((prevErrors) => prevErrors.filter((error, errIndex) => errIndex !== index));
  };

  const activateofflineMode = (errIndex) => {
    setOfflineMode(true);
    hideError(errIndex);
  };

  const displayErrors = () => {
    return (
      <div className="errorContainer">
        {errors.map((error, i) => {
          if (error.type === 'submit') {
            return (
              <div key={i} className="errorMessage">
                <p>{error.message}</p>
                <button onClick={() => submitResult(testid)}>{t('common.retry')}</button>
                <button onClick={() => activateofflineMode(i)}>{t('common.offlineMode')}</button>
              </div>
            );
          }
          if (error.type === 'invalid') {
            return (
              <div key={i} className="errorMessage">
                <p>{error.message}</p>
                <button onClick={() => hideError(i)}>{t('common.close')}</button>
              </div>
            );
          }
          return '';
        })}
      </div>
    );
  };

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
          {testmethod.showResults ? (
            <button onClick={() => navigate('/ViewResults')}>{t('results.viewResults')}</button>
          ) : (
            ''
          )}
          {testmethod.showResults ? buttonUSB : ''}
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
          {testmethod.showResults ? buttonUSB : ''}
          {testmethod.showResults ? (
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
          <Oval heigth="100" width="100" color="var(--primary)" />
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
