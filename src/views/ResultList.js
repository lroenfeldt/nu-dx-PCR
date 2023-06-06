import React, { useState, useEffect, useCallback } from 'react';
//import { FiUpload, FiRefreshCw, FiUploadCloud, FiSave, FiExternalLink } from "react-icons/fi"

import { Toggle } from '../components';
import { Oval } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import { BsCloudCheckFill } from 'react-icons/bs';
import { useData, useTranslation } from '../hooks';
import { AiFillUsb } from 'react-icons/ai';
import { FaMicroscope, FaCloudUploadAlt, FaCheck } from 'react-icons/fa';
import { useResults, useSticky } from '../hooks';
import urls from '../config/settings';
const ResultList = () => {
  const navigate = useNavigate();
  const {
    USBPresent,
    setUSBPresent,
    settings,
    setTestid,
    resetBarcodes,
    offlineMode,
    setTestDone,
    submitFilter,
    setSubmitFilter,
    currentUser,
    results,
    setResults,
    reading,
    setReading,
    submitting,
    setSubmitting,
    setErrors,
    errors,
  } = useData();
  const { checkUSB, saveToUSB, submitAll, getResults, submitResult, saveAllToUSB } = useResults();
  const { t, locale } = useTranslation();

  const handleSubmitToggleChange = () => {
    getResults(!submitFilter);
    setSubmitFilter(!submitFilter);
  };

  const viewResult = (testid, done) => {
    resetBarcodes();
    setTestid(testid);
    setTestDone(done);
    navigate('/ViewResults');
  };

  //Create Table

  let tableRows = [];
  results
    .sort((a, b) => new Date(b.testStarted).getTime() - new Date(a.testStarted).getTime())
    .forEach((result) => {
      let buttonUSB;
      let buttonSubmit;
      let buttonView;

      //button for db submit
      if (result.isSubmitting) {
        buttonSubmit = (
          <div className="button" onClick={() => submitResult(result.testid, result.submitted)}>
            <div className="spinnerContainer">
              <Oval heigth="30" width="30" color="white" />
            </div>
          </div>
        );
      } else if (result.submittingSuccess) {
        buttonSubmit = (
          <div className="button" onClick={() => submitResult(result.testid, result.submitted)}>
            <FaCheck />
          </div>
        );
      } else if (offlineMode) {
        buttonSubmit = (
          <div className="button disabled">
            <FaCloudUploadAlt />
          </div>
        );
      } else if (!settings.account.testprocedures.find((testmethod) => testmethod.id === result.testmethod)) {
        buttonSubmit = (
          <div className="button disabled">
            <FaCloudUploadAlt />
          </div>
        );
      } else {
        buttonSubmit = (
          <div className="button" onClick={() => submitResult(result.testid, result.submitted)}>
            <FaCloudUploadAlt />
          </div>
        );
      }

      let cloudBadge;
      if (result.submitted) {
        cloudBadge = (
          <div className="cloudBadge">
            <BsCloudCheckFill />
          </div>
        );
      }

      if (settings.account.testprocedures.find((testmethod) => testmethod.id === result.testmethod)?.showResults) {
        //button for usb export
        if (result.isWriting) {
          buttonUSB = (
            <div className="button" onClick={() => saveToUSB(result.testid, result.submitted)}>
              <div className="spinnerContainer">
                <Oval heigth="30" width="30" color="white" />
              </div>
            </div>
          );
        } else if (result.writingSuccess) {
          buttonUSB = (
            <div className="button" onClick={() => saveToUSB(result.testid, result.submitted)}>
              <FaCheck />
            </div>
          );
        } else if (!USBPresent) {
          buttonUSB = (
            <div className="button disabled">
              <AiFillUsb />
            </div>
          );
        } else if (
          !settings.account.testprocedures.find((testmethod) => testmethod.id === result.testmethod) ||
          settings.account.testprocedures.find((testmethod) => testmethod.id === result.testmethod).showResults == false
        ) {
          buttonUSB = (
            <div className="button disabled">
              <AiFillUsb />
            </div>
          );
        } else {
          buttonUSB = (
            <div className="button" onClick={() => saveToUSB(result.testid, result.submitted)}>
              <AiFillUsb />
            </div>
          );
        }

        //button for view
        if (
          !settings.account.testprocedures.find((testmethod) => testmethod.id === result.testmethod) ||
          settings.account.testprocedures.find((testmethod) => testmethod.id === result.testmethod).showResults == false
        ) {
          buttonView = (
            <div className="button disabled">
              <FaMicroscope />
            </div>
          );
        } else {
          buttonView = (
            <div className="button" onClick={() => viewResult(result.testid, result.submitted)}>
              <FaMicroscope />
            </div>
          );
        }
      }

      //Testmethod name
      let testMethodName;
      if (!result.testmethod) {
        result.testmethod = urls.TESTMETHOD; //Covid backwards compatability
      }
      if (settings.account.testprocedures.find((testmethod) => testmethod.id === result.testmethod)) {
        testMethodName =
          settings.account.testprocedures.find((testmethod) => testmethod.id === result.testmethod)[
            'label' + locale.toUpperCase()
          ] || settings.account.testprocedures.find((testmethod) => testmethod.id === result.testmethod).name;
      } else {
        testMethodName = 'unsupported';
      }

      tableRows.push(
        <div className="result" key={result.testid}>
          <div className="testinfo">
            <h4>{result.testid}</h4>
            <h4>{testMethodName}</h4>
            <span className="date">
              {t('default.common.started')}: {result.testStarted.toLocaleString()}
            </span>
            <span className="date">
              {t('default.common.ended')}: {result.testFinished.toLocaleString()}
            </span>
          </div>
          <div className="buttons">
            {buttonView}
            {buttonSubmit}
            {buttonUSB}
            {cloudBadge}
          </div>
        </div>
      );
    });

  useEffect(() => {
    resetBarcodes();
    getResults(submitFilter);
  }, []);

  //Check if USB is Present
  useEffect(() => {
    checkUSB();
    const clearcheckUSB = setInterval(() => checkUSB(), 3000);
    return () => clearInterval(clearcheckUSB);
  }, []);
  useSticky({ top: 70, id: 'stickyHeader', stickyClass: 'ResultList' });
  return (
    <div className="ResultList">
      <div id="stickyHeader" className="titleArea">
        <h2>{t('default.resultList.title')}</h2>
        {(submitting || reading) && (
          <div className="spinnerContainer">
            <Oval heigth="50" width="50" color="var(--primary)" />
          </div>
        )}
        <label>
          <span>{t('default.resultList.onlyPending')}</span>
          <Toggle isOn={submitFilter} handleToggle={() => handleSubmitToggleChange()} />
        </label>
      </div>
      {tableRows}
      <div className="buttonArea">
        <button
          onClick={() => {
            navigate('/selectMethod');
          }}
        >
          {t('default.common.back')}
        </button>
        {submitFilter ? <button onClick={() => submitAll()}>{t('default.resultList.submitAll')}</button> : ''}
        <button className={!USBPresent ? 'disabled' : ''} onClick={() => saveAllToUSB()}>
          {t('default.resultList.exportAll')}
        </button>
      </div>
    </div>
  );
};

export default ResultList;
