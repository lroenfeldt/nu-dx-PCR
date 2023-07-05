import { Block, Errors, Keyboard, Controller, WellVisual, RackVisualRows, ActivateKeyboard } from '../components';
import React, { useState, useRef, useEffect, useMemo, memo, useCallback } from 'react';
import axios from 'axios';
import urls from '../config/settings';
import { useNavigate } from 'react-router-dom';
import { useData, useTranslation } from '../hooks';
import { IoMdCloseCircle } from 'react-icons/io';
const BarcodeInput = () => {
  const {
    demo,
    reset,
    errors,
    reboot,
    loading,
    barcodes,
    settings,
    toggleLid,
    setErrors,
    setLoading,
    offlineMode,
    setBarcodes,
    isNinetySix,
  } = useData();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const textInput = useRef(null);
  const [active, setActive] = useState(isNinetySix ? -11 : 0);
  const [barcodesValid, setBarcodesValid] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const checkBarcodeUrl = settings.account.customCheckBarcodesEndpoint
    ? settings.account.customCheckBarcodesEndpoint
    : urls.checkBarcodeUrl;
  const [keyboardActive, setKeyboardActive] = useState(false);
  const [barcodeCheckTimeout, setBarcodeCheckTimeout] = useState(null);
  const [clear, setClear] = useState(false);
  const markActive = (id) => {
    setActive(id);
    textInput.current.focus();
  };
  const numberRegex = /^[0-9]+$/;
  const nextWell = (next) => {
    let nextWell = active;
    const blockedBarcodes = barcodes
      .filter((barcode) => barcode.blocked === true)
      .map((blockedBarcode) => blockedBarcode.id);
    setDisabled(false);
    const wellCount = settings.device.wellCount;
    if (active <= wellCount && wellCount == 96) {
      for (let j = -13; j <= wellCount; j++) {
        if (next === true) {
          if (nextWell === 96 && blockedBarcodes.includes(1)) return setDisabled(true);
          if (j === nextWell && blockedBarcodes.includes(nextWell + 12)) {
            if (nextWell + 24 === 97) return setDisabled(true);
            if (blockedBarcodes.includes(nextWell + 24)) return markActive(nextWell + 36);
            return markActive(nextWell + 24);
          }
          if (j === nextWell && j >= 85 && blockedBarcodes.includes(nextWell - 83))
            return markActive(nextWell - 83 + 12);
          if (j === nextWell && j === 96 && !blockedBarcodes.includes(1)) return markActive(1);
          if (j === nextWell && j >= 85) return markActive(j - 83);
          if (j === nextWell && j < 85) return markActive(j + 12);
        } else {
          if (j === nextWell && blockedBarcodes.includes(nextWell - 12) && blockedBarcodes.includes(nextWell - 24))
            return markActive(96);
          if (j === nextWell && j > 12 && j <= 24 && nextWell - 12 === 1 && blockedBarcodes.includes(nextWell - 12))
            return markActive(96);
          if (j === nextWell && blockedBarcodes.includes(nextWell + 12)) return markActive(nextWell + 24);
          if (j === nextWell && j > 12 && j <= 24 && blockedBarcodes.includes(nextWell - 12))
            return markActive(j - 12 + 83);
          if (j === nextWell && j <= 1) return markActive(96);
          if (j === nextWell && j <= 12) return markActive(j + 83);
          if (j === nextWell && j > 12) return markActive(j - 12);
        }
      }
    } else if (wellCount == 16) {
      do nextWell++;
      while (barcodes.find((barcode) => barcode.id === nextWell)?.blocked);
      markActive(nextWell);
    }
    if (active === wellCount) {
      checkBarcode(wellCount);
    }
  };

  const updateBarcode = useCallback(
    (e) => {
      e.preventDefault();
      clearTimeout(barcodeCheckTimeout);

      setBarcodesValid(false);
      setBarcodes((prevBarcodes) => prevBarcodes.map((barcode) => ({ ...barcode, checking: false })));
      let newBarcode = getBarcode(active);
      newBarcode = {
        ...newBarcode,
        value: e.target.value,
        checking: true,
        valid: false,
        error: null,
      };
      setBarcodes((prevBarcodes) => prevBarcodes.map((barcode) => (barcode.id === active ? newBarcode : barcode)));

      setBarcodeCheckTimeout(
        setTimeout(() => {
          checkBarcode(newBarcode);
          setBarcodeCheckTimeout(null);
        }, 500)
      );
    },
    [active, barcodes, barcodeCheckTimeout, setBarcodes, setBarcodeCheckTimeout]
  );
  const onKeyPress = useCallback(
    (value) => {
      clearTimeout(barcodeCheckTimeout);

      setBarcodesValid(false);
      setBarcodes((prevBarcodes) => prevBarcodes.map((barcode) => ({ ...barcode, checking: false })));
      let newBarcode = getBarcode(active);
      newBarcode = {
        ...newBarcode,
        value: value,
        checking: true,
        valid: false,
        error: null,
      };
      setBarcodes((prevBarcodes) => prevBarcodes.map((barcode) => (barcode.id === active ? newBarcode : barcode)));

      setBarcodeCheckTimeout(
        setTimeout(() => {
          checkBarcode(newBarcode);
          setBarcodeCheckTimeout(null);
        }, 500)
      );
    },
    [active, barcodes, barcodeCheckTimeout, setBarcodes, setBarcodeCheckTimeout]
  );
  const checkAll = useCallback(
    async (barcodes) => {
      for (let i = 0; i < barcodes.length; i++) {
        await checkBarcode(barcodes[i]);
      }
    },
    [offlineMode]
  );

  const retest = async (barcode) => {
    setLoading(true);
    setBarcodes((prevBarcodes) =>
      prevBarcodes.map((prevBarcode) =>
        barcode.id === prevBarcode.id
          ? {
              ...barcode,
              checking: true,
            }
          : prevBarcode
      )
    );

    let retestNumber = 0;
    let newBarcodeValue;
    let newErrors = errors.filter((error) => error.type !== 'dbCon');

    let hit = true;
    let dbError = false;

    while (hit === true && dbError === false) {
      retestNumber++;
      newBarcodeValue = barcode.value + '-R' + retestNumber;
      try {
        let response = await axios.get(`${checkBarcodeUrl}/${newBarcodeValue}`);
        let result = response.data;
        if (result === null) {
          hit = false;
        }
        setLoading(false);
      } catch (err) {
        setLoading(true);
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
          window.api.logEvents(
            `status: ${err.response.status} headers: ${err.response.headers} data: ${JSON.stringify(
              err.response.data
            )}`,
            'LogErrors.txt'
          );
          dbError = true;
          newErrors.push({
            type: 'dbCon',
            message: t('errors.checkTestSampleFail'),
          });
        } else if (err.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(err.request);
          window.api.logEvents(`request: ${JSON.stringify(err.request)}`, 'LogErrors.txt');
          dbError = true;
          newErrors.push({
            type: 'dbCon',
            message: t('errors.dbConnectionError'),
          });
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log(settings);
          console.log('Error', err.message);
          window.api.logEvents(`Error: ${err.message}`, 'LogErrors.txt');
          dbError = true;
          newErrors.push({
            type: 'dbCon',
            message: t('errors.dbConnectionError'),
          });
        }
      }
    }

    let newBarcode = {
      ...barcode,
      value: newBarcodeValue,
      valid: true,
      checking: false,
      error: t('errors.testSample'),
      askRetest: false,
    };

    setBarcodes((prevBarcodes) =>
      prevBarcodes.map((prevBarcode) => (newBarcode.id === prevBarcode.id ? newBarcode : prevBarcode))
    );
  };

  let cancelToken;
  /**
   * check if the barcode meets the standards established for the barcode
   * @param {object} newBarcode
   * @returns
   */
  const checkBarcode = async (newBarcode) => {
    newBarcode = {
      ...newBarcode,
      checking: true,
      valid: false,
      error: null,
      label: newBarcode.posName,
    };

    setBarcodes((prevBarcodes) => prevBarcodes.map((barcode) => (barcode.id === newBarcode.id ? newBarcode : barcode)));

    let isValid = true;
    let validationErr = null;

    //Check for control placeholders
    const controlPlaceholders = ['Placeholder_NTC', 'Placeholder_TPC', 'SC2NTC', 'SC2TPC', 'TPC', 'NTC'];
    if (controlPlaceholders.includes(newBarcode.value)) {
      newBarcode = {
        ...newBarcode,
        checking: false,
        valid: true,
        error: t('errors.controlSampleDetected'),
      };

      if (newBarcode.value === 'SC2NTC' || newBarcode.value === 'Placeholder_NTC' || newBarcode.value === 'NTC') {
        newBarcode.label = 'NTC';
      }

      if (newBarcode.value === 'SC2TPC' || newBarcode.value === 'Placeholder_TPC' || newBarcode.value === 'TPC') {
        newBarcode.label = 'TPC';
      }

      setBarcodes((prevBarcodes) =>
        prevBarcodes.map((barcode) => (barcode.id === newBarcode.id ? newBarcode : barcode))
      );
      return;
    }

    //check empty
    if (!newBarcode.value.length >= 1) {
      isValid = false;
    }

    //Check for special Barcodes
    if (newBarcode.value.substr(0, 1) === 'R' || newBarcode.value.indexOf('-R') !== -1) {
      isValid = true;
    } else {
      //check characters
      for (const char of newBarcode.value) {
        if (!settings.account.allowedCharacters.includes(char)) {
          isValid = false;
          validationErr = t('errors.invalidcharacters') + settings.account.allowedCharacters;
        }
      }

      //check length
      if (!(newBarcode.value.length >= settings.account.minBarcodeLength)) {
        isValid = false;
        validationErr = t('errors.minBarcodeLength', {
          minLength: settings.account.minBarcodeLength,
        });
      }
      if (newBarcode.value.length > settings.account.maxBarcodeLength) {
        isValid = false;
        validationErr = t('errors.maxBarcodeLength', {
          maxLength: settings.account?.maxBarcodeLength,
        });
      }
    }

    //Check duplicates
    barcodes.forEach((barcode, index) => {
      if (barcode.value === newBarcode.value && barcode.posName !== newBarcode.posName) {
        isValid = false;
        validationErr = t('errors.barcodeAlreadyUsed', {
          position: barcode.posName,
        });
      }
    });

    //Check against db
    if (
      isValid &&
      newBarcode.value.indexOf('-R') === -1 &&
      settings.account.checkBarcodesDB &&
      settings.account.verifyBarcodes
    ) {
      if (offlineMode) {
        validationErr = t('errors.offlineModeMode');
        newBarcode = {
          ...newBarcode,
          checking: false,
          valid: isValid,
          error: validationErr,
        };

        setBarcodes((prevBarcodes) =>
          prevBarcodes.map((barcode) => (barcode.id === newBarcode.id ? newBarcode : barcode))
        );
      } else {
        setLoading(true);

        let askRetest = false;
        let newErrors = errors.filter((error) => error.type !== 'dbCon');

        cancelToken = axios.CancelToken.source();

        try {
          let response = await axios.get(`${checkBarcodeUrl}/${newBarcode.value}`, {
            cancelToken: cancelToken.token,
          });

          let result = response.data;
          if (result === null) {
            isValid = false;
            validationErr = t('errors.barcodeNotFound');
          } else if (result.status <= 3) {
            isValid = false;
            askRetest = settings.account.allowRetest && settings.account.verifyBarcodes;
            validationErr = t('errors.barcodeAlreadyInUse');
          } else if (settings.account.checkOrder && result.orderKey !== settings.account.orderKey) {
            isValid = false;
            validationErr = t('errors.barcodeNotInOrder');
          }

          setLoading(false);
        } catch (err) {
          setLoading(false);
          if (axios.isCancel(err)) {
            console.log('Request canceled', err.message);
          } else {
            if (err.code == 'ERR_NETWORK') {
              console.log(err.request);
              window.api.logEvents(`request: ${JSON.stringify(err.request)}`, 'LogErrors.txt');
              newErrors.push({
                type: 'dbCon',
                message: t('errors.dbConnectionError'),
              });
              validationErr = t('errors.notVerifiedDbError');
            }
            if (err.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(err);
              console.log(err.response.data);
              console.log(err.response.status);
              console.log(err.response.headers);
              window.api.logEvents(
                `status: ${err.response.status} headers: ${err.response.headers} data: ${JSON.stringify(
                  err.response.data
                )}`,
                'LogErrors.txt'
              );
              isValid = false;
              if (err.message === t('errors.noSamplesImported')) {
                validationErr = t('errors.useAnotherBarcode');
              } else {
                validationErr = t('errors.barcodeVerificationFailed', {
                  message: err.message,
                });
              }
            } else if (err.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(err.request);
              window.api.logEvents(`request: ${JSON.stringify(err.request)}`, 'LogErrors.txt');
              newErrors.push({
                type: 'dbCon',
                message: t('errors.dbConnectionError'),
              });
              validationErr = t('errors.notVerifiedDbError');
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', err.message);
              window.api.logEvents(`Error: ${err.message}`, 'LogErrors.txt');
              newErrors.push({
                type: 'dbCon',
                message: t('errors.dbConnectionError'),
              });
              validationErr = t('errors.notVerifiedDbError');
            }
          }
        } finally {
          setErrors(newErrors);

          newBarcode = {
            ...newBarcode,
            checking: false,
            valid: isValid,
            error: validationErr,
            askRetest: askRetest,
          };

          setBarcodes((prevBarcodes) =>
            prevBarcodes.map((barcode) => (barcode.id === newBarcode.id ? newBarcode : barcode))
          );
        }
      }
    } else {
      newBarcode = {
        ...newBarcode,
        checking: false,
        valid: isValid,
        error: validationErr,
      };

      setBarcodes((prevBarcodes) =>
        prevBarcodes.map((barcode) => (barcode.id === newBarcode.id ? newBarcode : barcode))
      );
    }
  };

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    nextWell(true);
  };

  const getBarcode = useCallback(
    (id) => {
      let result = {
        blocked: false,
        checking: false,
        error: null,
        id: 0,
        label: '',
        posName: '',
        valid: false,
        value: '',
      };
      if (id == null || id === '') {
        return result;
      }
      barcodes.map((barcode) => {
        if (barcode.id === id) {
          result = barcode;
        }
      });
      return result;
    },
    [barcodes]
  );

  const checkAllValid = () => {
    let result = true;
    if (!barcodes.filter((barcode) => barcode.value).length >= 1) {
      result = false;
    }
    barcodes.forEach((b) => {
      if (b.value.length >= 1 && (!b.valid || b.checking)) {
        result = false;
      }
    });
    setBarcodesValid(result);
    return result;
  };

  //open lid and select first active well on startup
  useEffect(() => {
    toggleLid();
    nextWell(true);
  }, []);

  useEffect(() => {
    getBarcode(active).askRetest = settings.account.allowRetest && settings.account.verifyBarcodes;
  }, [settings.account.allowRetest, settings.account.verifyBarcodes]);
  //check valid attribure of all barcodes to toggle button for next step
  useEffect(() => {
    checkAllValid();
  }, [barcodes]);

  //re check all barcodes on disabling offlineMode mode
  useEffect(() => {
    if (!offlineMode) {
      checkAll(barcodes.filter((barcode) => barcode.value.length > 0));
    }
  }, [offlineMode]);
  const handleReset = useCallback(() => {
    setClear(true);
    setBarcodes(
      barcodes.map((barcode) => {
        if (barcode?.id === active) {
          return {
            ...barcode,
            checking: false,
            valid: false,
            error: null,
            value: '',
          };
        } else {
          return {
            ...barcode,
          };
        }
      })
    );
    textInput.current.focus();
  }, [barcodes, active]);

  return (
    <>
      <div className={`BarcodeInput ${isNinetySix ? ' ninetySix' : ''}`}>
        {!isNinetySix && <h3>{t('barcodeInput.instructions')}</h3>}
        <RackVisualRows active={active} markActive={markActive} />

        <div className={`inputContainer ${isNinetySix ? ' ninetySix' : ''}`}>
          {isNinetySix && <h3>{t('barcodeInput.instructions')}</h3>}
          {getBarcode(active).error && !getBarcode(active).checking && getBarcode(active)?.value.length >= 1 ? (
            <div className={`barcodeValidationMsg ${isNinetySix ? ' ninetySix' : ''}`}>
              <span>{getBarcode(active).error}</span>
            </div>
          ) : (
            ''
          )}
          <form action="" onSubmit={(e) => handleBarcodeSubmit(e)}>
            {isNinetySix && (
              <Block column gap={10} shadow radius={10} padding={12} marginBottom={keyboardActive ? -180 : null}>
                <div className="inputBlock">
                  <ActivateKeyboard
                    onClick={() => {
                      setKeyboardActive(!keyboardActive);

                      textInput.current.focus();
                    }}
                  />
                  <input
                    ref={textInput}
                    autoFocus
                    type="text"
                    value={getBarcode(active).value || ''}
                    onChange={(e) => updateBarcode(e)}
                    style={{
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }}
                  />
                  {getBarcode(active).value != '' && (
                    <div className="icon" onClick={() => handleReset()}>
                      <IoMdCloseCircle size={30} />
                    </div>
                  )}
                </div>
                <Controller onClick={nextWell} disabled={disabled} />
              </Block>
            )}
            {!isNinetySix && (
              <div className="inputBlock">
                <ActivateKeyboard
                  onClick={() => {
                    setKeyboardActive(!keyboardActive);
                    textInput.current.focus();
                  }}
                />

                <input
                  ref={textInput}
                  autoFocus
                  type="text"
                  value={getBarcode(active).value}
                  onChange={(e) => updateBarcode(e)}
                  style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                />
                {getBarcode(active).value != '' && (
                  <div className="icon" onClick={() => handleReset()}>
                    <IoMdCloseCircle size={30} />
                  </div>
                )}
              </div>
            )}
            <Keyboard
              clear={clear}
              setClear={setClear}
              onChange={(e) => onKeyPress(e)}
              visible={keyboardActive}
              setVisible={setKeyboardActive}
              inputValue={getBarcode(active).value}
              isNumeric={numberRegex.test(settings.account.allowedCharacters)}
            />
            {getBarcode(active).askRetest && getBarcode(active).value != '' ? (
              <button onClick={() => retest(getBarcode(active))}>{t('common.retest')}</button>
            ) : (
              ''
            )}
            {!isNinetySix && <button type="submit">{t('common.continue')}</button>}
          </form>
        </div>
      </div>
      <div className="buttonArea">
        <button
          onClick={() => {
            isNinetySix && toggleLid();
            reset();
            navigate('/selectMethod');
          }}
        >
          {t('common.cancel')}
        </button>
        <button onClick={() => navigate('/testReady')} className={`${!barcodesValid ? 'disabled' : ''}`}>
          {t('common.testStart')}
        </button>
      </div>
    </>
  );
};

export default BarcodeInput;
