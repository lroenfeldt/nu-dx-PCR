import React, { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import { Oval } from 'react-loader-spinner';
import { RiAlertFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { useData, useTranslation } from '../hooks';
const TestReady = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    demo,
    testid,
    errors,
    barcodes,
    settings,
    testDone,
    setTestid,
    setErrors,
    setStatus,
    setTestDone,
    isNinetySix,
    selectedMethod,
    setDeviceStatus,
  } = useData();

  //Check for demo & set testid
  useEffect(() => {
    setTestid(settings.isDev ? 'demo' : uuidv4());
    setTestDone(false);
  }, []);

  const setupToBackend = useCallback(() => {
    setLoading(true);
    setErrors((prevErrors) => prevErrors.filter((error) => error.type !== 'startTest'));
    setMessage(t('testReady.startTest'));

    const testmethod = settings.account.testprocedures.find((procedure) => procedure.id === selectedMethod);

    let wellsSetup = '';
    barcodes.forEach((barcode) => {
      if (barcode.value.length >= 1) {
        wellsSetup += `<Well Name="${barcode.posName}" SampleId="${barcode.value}"><Tasks>`;
        for (let i = 0; i < testmethod.parameters.length; i++) {
          wellsSetup += `<Task DetectorId="${i + 1}" Type="Unknown" />`;
        }
        wellsSetup += '</Tasks></Well>\n';
      }
    });

    let xml_output = testmethod.protocol.replace('%%testname%%', testid).replace('%%wells%%', wellsSetup);

    if (isNinetySix) {
      xml_output = xml_output.replace('cy5', 'Cy5');
    }

    console.log('staring test');
    window.api.logEvents('starting test', 'logInfos.txt');
    console.log(selectedMethod);
    const testStarted = window.api.startLineGene(testid, xml_output, settings, barcodes, selectedMethod);
    if (testStarted === false) {
      console.log('could not start test');
      window.api.logEvents('could not start test', 'logInfos.txt');
      setErrors((prevErrors) =>
        prevErrors.push({
          type: 'startTest',
          message: t('errors.failtedToStartTest'),
        })
      );
      setDeviceStatus('IDLE');
    } else {
      console.log('test start successful:' + testStarted);
      window.api.logEvents(`test start successful: ${testStarted}`, 'logInfos.txt');
      navigate('/testRunning');
      setStatus('RUNNING');
      setDeviceStatus('RUNNING');
    }
  }, [testid]);

  const startTest = useCallback(() => {
    if (demo) {
      console.log('Starting Demo Run');
      window.api.logEvents('starting demo run', 'logInfos.txt');
      navigate('/testRunning');
      setDeviceStatus('RUNNING');
    } else {
      setupToBackend();
    }
  }, [testid]);

  if (loading) {
    return (
      <div className="TestReady">
        <div className="spinnerContainer">
          <Oval heigth="100" width="100" color="var(--primary)" />
        </div>
        <h3>{message}</h3>
      </div>
    );
  } else {
    return (
      <div className="TestReady">
        <div className="spinnerContainer" style={{ color: 'orange' }}>
          <RiAlertFill />
        </div>
        <h3>{isNinetySix ? t('testReady.ninetySixsInstructions') : t('testReady.instructions')}</h3>
        <div className="buttonArea">
          <button
            onClick={() => {
              navigate('/enterBarcodes');
              setStatus('IDLE');
              setDeviceStatus('IDLE');
            }}
          >
            {t('testReady.noGoBack')}
          </button>
          <button onClick={() => startTest()}>{t('testReady.yesStartTest')}</button>
        </div>
      </div>
    );
  }
};

export default TestReady;
