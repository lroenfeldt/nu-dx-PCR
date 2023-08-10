import { ReactNode, useEffect } from 'react';
import { Toggle } from '../components';
import { Oval } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import { BsCloudCheckFill } from 'react-icons/bs';
import { useData, useTranslation } from '../hooks';
import { AiFillUsb } from 'react-icons/ai';
import { FaMicroscope, FaCloudUploadAlt, FaCheck } from 'react-icons/fa';
import { useResults, useSticky } from '../hooks';
import urls from '../config/settings';
import { Result } from '../types/interfaces/settings';
import { JSX } from 'react/jsx-runtime';
import { ISettings } from '../types/interfaces/useData';

const ResultList = () => {
  const navigate = useNavigate();
  const {
    USBPresent,
    settings,
    setTestid,
    resetBarcodes,
    offlineMode,
    setTestDone,
    submitFilter,
    setSubmitFilter,
    results,
    reading,
    submitting,
  } = useData();
  const { checkUSB, saveToUSB, submitAll, getResults, submitResult, saveAllToUSB }: any = useResults();
  const { t, locale } = useTranslation();

  const handleSubmitToggleChange = () => {
    getResults(!submitFilter);
    setSubmitFilter(!submitFilter);
  };

  const viewResult = (testid: string | null, done: boolean) => {
    resetBarcodes();
    setTestid(testid);
    setTestDone(done);
    navigate('/ViewResults');
  };

  //Create Table
  let tableRows: JSX.Element[] = [];
  results
    .sort(
      (a: { testStarted: Date }, b: { testStarted: Date }) =>
        new Date(b.testStarted).getTime() - new Date(a.testStarted).getTime()
    )
    .forEach(() => {
      let buttonUSB: JSX.Element;
      let buttonSubmit: JSX.Element;
      let buttonView: JSX.Element;

      //button for db submit
      if (results.isSubmitting) {
        buttonSubmit = (
          <div className="button" onClick={() => submitResult(results.testid, results.submitted)}>
            <div className="spinnerContainer">
              <Oval height="30" width="30" color="white" />
            </div>
          </div>
        );
      } else if (results.submittingSuccess) {
        buttonSubmit = (
          <div className="button" onClick={() => submitResult(results.testid, results.submitted)}>
            <FaCheck />
          </div>
        );
      } else if (offlineMode) {
        buttonSubmit = (
          <div className="button disabled">
            <FaCloudUploadAlt />
          </div>
        );
      } else if (!settings.account.testprocedures.find((testmethod) => testmethod.id === results.testmethod)) {
        buttonSubmit = (
          <div className="button disabled">
            <FaCloudUploadAlt />
          </div>
        );
      } else {
        buttonSubmit = (
          <div className="button" onClick={() => submitResult(results.testid, results.submitted)}>
            <FaCloudUploadAlt />
          </div>
        );
      }

      let cloudBadge: JSX.Element;
      if (results.submitted) {
        cloudBadge = (
          <div className="cloudBadge">
            <BsCloudCheckFill />
          </div>
        );
      }

      if (settings.account.testprocedures.find((testmethod) => testmethod.id === results.testmethod)?.showResults) {
        //button for usb export
        if (results.isWriting) {
          buttonUSB = (
            <div className="button" onClick={() => saveToUSB(results.testid, results.submitted)}>
              <div className="spinnerContainer">
                <Oval height="30" width="30" color="white" />
              </div>
            </div>
          );
        } else if (results.writingSuccess) {
          buttonUSB = (
            <div className="button" onClick={() => saveToUSB(results.testid, results.submitted)}>
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
          !settings.account.testprocedures.find((testmethod) => testmethod.id === results.testmethod) ||
          settings.account.testprocedures.find((testmethod) => testmethod.id === results.testmethod)?.showResults ==
            false
        ) {
          buttonUSB = (
            <div className="button disabled">
              <AiFillUsb />
            </div>
          );
        } else {
          buttonUSB = (
            <div className="button" onClick={() => saveToUSB(results.testid, results.submitted)}>
              <AiFillUsb />
            </div>
          );
        }

        //button for view
        if (
          !settings.account.testprocedures.find((testmethod) => testmethod.id === results.testmethod) ||
          settings.account.testprocedures.find((testmethod) => testmethod.id === results.testmethod)?.showResults ==
            false
        ) {
          buttonView = (
            <div className="button disabled">
              <FaMicroscope />
            </div>
          );
        } else {
          buttonView = (
            <div className="button" onClick={() => viewResult(results.testid, results.submitted)}>
              <FaMicroscope />
            </div>
          );
        }
      }

      //Testmethod name
      let testMethodName: string | any;
      testMethodName = '';
      if (!results.testmethod) {
        results.testmethod = urls.TESTMETHOD; //Covid backwards compatability
      }
      if (settings.account.testprocedures.find((testmethod) => testmethod.id === results.testmethod)) {
        testMethodName =
          settings.account.testprocedures.find((testmethod) => testmethod.id === results.testmethod)?.[
            'label' + locale.toUpperCase()
          ] || settings.account.testprocedures.find((testmethod) => testmethod.id === results.testmethod)?.name;
      } else {
        testMethodName = 'unsupported';
      }

      tableRows.push(
        results.map((result: Result, index: number) => (
          <div className="result" key={`${result.testid}-${index}`}>
            <div className="testinfo">
              <h4>{result.testid}</h4>
              <h4>{testMethodName}</h4>
              <span className="date">
                {t('common.started')}: {result.testStarted.toLocaleString()}
              </span>
              <span className="date">
                {t('common.ended')}: {result.testFinished.toLocaleString()}
              </span>
            </div>
            <div className="buttons">
              {buttonView}
              {buttonSubmit}
              {buttonUSB}
              {cloudBadge}
            </div>
          </div>
        ))
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
        <h2>{t('resultList.title')}</h2>
        {(submitting || reading) && (
          <div className="spinnerContainer">
            <Oval height="50" width="50" color="var(--primary)" />
          </div>
        )}
        <label>
          <span>{t('resultList.onlyPending')}</span>
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
          {t('common.back')}
        </button>
        {submitFilter ? <button onClick={() => submitAll()}>{t('resultList.submitAll')}</button> : ''}
        <button className={!USBPresent ? 'disabled' : ''} onClick={() => saveAllToUSB()}>
          {t('resultList.exportAll')}
        </button>
      </div>
    </div>
  );
};

export default ResultList;
