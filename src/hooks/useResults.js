import React, { useCallback } from 'react';
import { useData, useTranslation } from '../hooks';
import { extractBarcodes, parseResultsDB, parseResultsExport } from '../utils/parseResults';
import axios from 'axios';
import urls from '../config/settings';
import { useLocation } from 'react-router-dom';

/**
 * hook to handle all the results related functions
 * @param {object} props
 * @returns {object} results
 *
 */
const useResults = () => {
  const {
    setErrors,
    settings,
    setTestid,
    resetBarcodes,
    setTestDone,
    submitFilter,
    setSubmitFilter,
    currentUser,
    USBPresent,
    setUSBPresent,
    results,
    setResults,
    reading,
    setReading,
    submitting,
    setSubmitting,
    resultsSubmitted,
    setSubmitted,
    lotNumber,
  } = useData();

  const location = useLocation();
  const { t } = useTranslation();
  const userId = currentUser ? currentUser?.id : '';

  const setSubmittingSingle = (testid, isSubmitting) => {
    setResults((prevUnsubmittedResults) =>
      prevUnsubmittedResults.map((result) => {
        if (result.testid === testid) {
          let newResult = result;
          newResult.isSubmitting = isSubmitting;
          return newResult;
        } else {
          return result;
        }
      })
    );
  };

  const setWritingSuccess = (testid, isSuccess) => {
    setResults((prevUnsubmittedResults) =>
      prevUnsubmittedResults.map((result) => {
        if (result.testid === testid) {
          let newResult = result;
          newResult.writingSuccess = isSuccess;
          return newResult;
        } else {
          return result;
        }
      })
    );
  };

  const submitAll = () => {
    setSubmitting(true);
    const resultList = results.filter((result) => result.submitted === false);
    let promises = [];
    resultList.forEach((result) => {
      promises.push(submitResult(result.testid, result.submitted));
    });
    Promise.all(promises).then(() => {
      setSubmitting(false);
    });
  };

  const saveAllToUSB = () => {
    results.forEach((result) => {
      saveToUSB(result.testid, result.submitted);
    });
  };

  const checkUSB = async () => {
    try {
      setUSBPresent(await window.api.checkUSB());
    } catch (error) {
      console.log(error);
      window.api.logEvents(`checkUSB: ${JSON.stringify(error)}`, 'logErrors.txt');
    }
  };

  const setWriting = (testid, isWriting) => {
    setResults((prevUnsubmittedResults) =>
      prevUnsubmittedResults.map((result) => {
        if (result.testid === testid) {
          let newResult = result;
          newResult.isWriting = isWriting;
          return newResult;
        } else {
          return result;
        }
      })
    );
  };

  /**
   * Save a single result to the USB
   * @param {string} testid
   * @param {Boolean} done
   * @returns {Boolean} true if writing to USB was successful
   */
  const saveToUSB = async (testid, done) => {
    if (location.pathname == '/ResultList') setWriting(testid, true);

    //reset errors
    setErrors((prevErrors) => prevErrors.filter((error) => error.type !== 'read'));

    //init data
    let resultFile, testConfig, testmethod;

    //read result file
    try {
      console.log('fetching result files');
      window.api.logEvents(`fetching result files`, 'logErrors.txt');

      let fetchResult = await window.api.getResult(testid, done);
      const configFile = fetchResult.configFile;
      resultFile = fetchResult.resultFile;
      testConfig = JSON.parse(configFile);
      if (!testConfig.testmethod) {
        testConfig.testmethod = urls.TESTMETHOD;
      }
      testmethod = settings.account.testprocedures.find((method) => method.id === testConfig.testmethod);
    } catch (err) {
      console.log(err);
      window.api.logEvents(`saveToUSB: ${JSON.stringify(err)}`, 'logErrors.txt');
      setErrors((prevErrors) =>
        prevErrors
          .filter((error) => error.type !== 'read')
          .concat({
            type: 'read',
            message: t('errors.failedToReadTestData'),
          })
      );
      if (location.pathname == '/ResultList') setWriting(testid, false);
      return;
    }

    //Parse Results
    console.log('parse results');
    window.api.logEvents(`parse results`, 'logInfos.txt');
    let parsedResults;
    try {
      parsedResults = parseResultsExport(resultFile, testid, testConfig, testmethod, lotNumber);
    } catch (err) {
      console.log(err);
      window.api.logEvents(`saveToUSB: ${JSON.stringify(err)}`, 'logErrors.txt');
      setErrors((prevErrors) =>
        prevErrors
          .filter((error) => error.type !== 'submit')
          .concat({
            type: 'submit',
            message: t('errors.failedToReadResultData'),
          })
      );
      if (location.pathname == '/ResultList') setWriting(testid, false);
      return;
    }

    //Save To USB
    try {
      await window.api.saveToUSB(testid, parsedResults);
      if (location.pathname == '/ResultList') setWriting(testid, false);
      setWritingSuccess(testid, true);
      return true;
    } catch (error) {
      console.log(error);
      window.api.logEvents(`saveToUSB: ${JSON.stringify(error)}`, 'logErrors.txt');
      setErrors((prevErrors) =>
        prevErrors
          .filter((error) => error.type !== 'saveToUSB')
          .concat({
            type: 'read',
            message: t('errors.failedToSaveResultData'),
          })
      );
      if (location.pathname == '/ResultList') setWriting(testid, false);
    }
  };

  const setSubmittingSuccess = (testid, isSuccess) => {
    setResults((prevUnsubmittedResults) =>
      prevUnsubmittedResults.map((result) => {
        if (result.testid === testid) {
          let newResult = result;
          newResult.submittingSuccess = isSuccess;
          return newResult;
        } else {
          return result;
        }
      })
    );
  };

  const getResults = async (filter) => {
    setReading(true);
    try {
      let newResults = await window.api.getTests();
      if (!newResults) {
        newResults = [];
      }
      if (filter) {
        newResults = newResults.filter((result) => !result.submitted);
      }
      setResults(newResults);
    } catch (err) {
      console.log(err);
      window.api.logEvents(`getResults: ${JSON.stringify(err)}`, 'logErrors.txt');
    }
    setReading(false);
  };
  /**
   * Submit a single result to the server
   * @param {string} testid
   * @param {Boolean} done
   * @returns void
   */
  const submitResult = async (testid, done) => {
    //log, set loading state & reset errors
    console.log('attempting submit');
    window.api.logEvents(`attempting submit`, 'logInfos.txt');
    setSubmitting(true);
    setSubmittingSingle(testid, true);
    setErrors((prevErrors) => prevErrors.filter((error) => error.type !== 'submit'));

    //init data & fetch file
    let testConfig, resultFile, testStarted, testmethod, override, token;
    try {
      console.log('fetching result files');
      window.api.logEvents(`fetching result files`, 'logInfos.txt');
      let fetchResult = await window.api.getResult(testid, done);
      const configFile = fetchResult.configFile;
      resultFile = fetchResult.resultFile;
      testConfig = JSON.parse(configFile);
      testStarted = fetchResult.testStarted;
      override = fetchResult.override;
      token = settings.account.authToken;
      console.log('token: ', token);

      if (!testConfig.testmethod) {
        testConfig.testmethod = urls.TESTMETHOD;
      }
      testmethod = settings.account.testprocedures.find((method) => method.id === testConfig.testmethod);
    } catch (err) {
      console.log('failedToReadTestData: ' + err);
      window.api.logEvents(`submitResult: ${JSON.stringify(err)}`, 'logErrors.txt');
      setErrors((prevErrors) =>
        prevErrors
          .filter((error) => error.type !== 'read')
          .concat({
            type: 'read',
            message: t('errors.failedToReadTestData'),
          })
      );
      setSubmitting(false);
      setSubmittingSingle(testid, false);
      return false;
    }

    //define urls

    const resultUrl = settings.account.customSubmitResultsEndpoint //changed result url to always use current url set in account, not testconfig
      ? settings.account.customSubmitResultsEndpoint
      : urls.resultUrl;

    //Parse Results
    console.log('parse results');
    window.api.logEvents(`parse results`, 'logInfos.txt');
    let parsedResults;
    try {
      parsedResults = parseResultsDB(
        testid,
        resultFile,
        testmethod,
        testConfig,
        testStarted,
        userId,
        override,
        lotNumber,
        token
      );
    } catch (err) {
      console.log(`parseResultsDB failed: ${err}`);
      window.api.logEvents(`parseResultsDB failed: ${JSON.stringify(err)}`, 'logErrors.txt');
      setErrors((prevErrors) =>
        prevErrors
          .filter((error) => error.type !== 'submit')
          .concat({
            type: 'submit',
            message: t('errors.failedToReadResultData'),
          })
      );
      setSubmitting(false);
      setSubmittingSingle(testid, false);
      return false;
    }

    //Submit Results
    console.log('submit to db');
    window.api.logEvents(`submit to db`, 'logInfos.txt');
    try {
      let submitResponse = await axios.post(resultUrl, parsedResults);
      console.log(submitResponse);
      window.api.logEvents(`submit to db: ${JSON.stringify(submitResponse)}`, 'logInfos.txt');
      if (submitResponse.status !== 200) {
        throw new Error('Failed to submit results');
      }
    } catch (err) {
      console.log(`submitResponse: ${JSON.stringify(err)}`);
      window.api.logEvents(`submitResponse: ${JSON.stringify(err)}`, 'logErrors.txt');
      setErrors((prevErrors) =>
        prevErrors
          .filter((error) => error.type !== 'submit')
          .concat({
            type: 'submit',
            message: t('errors.failedToSubmitResults'),
          })
      );
      setSubmitting(false);
      setSubmittingSingle(testid, false);
      return false;
    }

    //Move Result Files if successfull
    console.log('move result file to done directory');
    window.api.logEvents(`move result file to done directory`, 'logInfos.txt');
    try {
      window.api.moveFiles(testid);
      setSubmittingSingle(testid, false);
      setSubmittingSuccess(testid, true);
      setSubmitted(true);
      setTestDone(true);
    } catch (err) {
      console.log(`move result file to done directory: ${JSON.stringify(err)}`);
      window.api.logEvents(`move result file to done directory: ${JSON.stringify(err)}`, 'logErrors.txt');
      setErrors((prevErrors) =>
        prevErrors
          .filter((error) => error.type !== 'submit')
          .concat({
            type: 'submit',
            message: t('errors.failedToMoveSubmittedFiles'),
          })
      );
      setSubmitting(false);
      setSubmittingSingle(testid, false);
    }
    getResults(submitFilter);
    setSubmitting(false);
  };

  return {
    checkUSB,
    saveToUSB,
    submitAll,
    getResults,
    submitResult,
    saveAllToUSB,
  };
};

export default useResults;
